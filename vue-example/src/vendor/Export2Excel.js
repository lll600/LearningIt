/* eslint-disable */
require('script-loader!file-saver');
require('script-loader!@/vendor/Blob');
import XLSX from 'xlsx'

function generateArray(table) {
    var out = [];
    var rows = table.querySelectorAll('tr');
    var ranges = [];
    for (var R = 0; R < rows.length; ++R) {
        var outRow = [];
        var row = rows[R];
        var columns = row.querySelectorAll('td');
        for (var C = 0; C < columns.length; ++C) {
            var cell = columns[C];
            var colspan = cell.getAttribute('colspan');
            var rowspan = cell.getAttribute('rowspan');
            var cellValue = cell.innerText;
            if (cellValue !== "" && cellValue == +cellValue) cellValue = +cellValue;

            //Skip ranges
            ranges.forEach(function (range) {
                if (R >= range.s.r && R <= range.e.r && outRow.length >= range.s.c && outRow.length <= range.e.c) {
                    for (var i = 0; i <= range.e.c - range.s.c; ++i) outRow.push(null);
                }
            });

            //Handle Row Span
            if (rowspan || colspan) {
                rowspan = rowspan || 1;
                colspan = colspan || 1;
                ranges.push({s: {r: R, c: outRow.length}, e: {r: R + rowspan - 1, c: outRow.length + colspan - 1}});
            }
            ;

            //Handle Value
            outRow.push(cellValue !== "" ? cellValue : null);

            //Handle Colspan
            if (colspan) for (var k = 0; k < colspan - 1; ++k) outRow.push(null);
        }
        out.push(outRow);
    }
    return [out, ranges];
};

function datenum(v, date1904) {
    if (date1904) v += 1462;
    var epoch = Date.parse(v);
    return (epoch - new Date(Date.UTC(1899, 11, 30))) / (24 * 60 * 60 * 1000);
}

function sheet_from_array_of_arrays(data, opts) {
    var ws = {};
    var range = {s: {c: 10000000, r: 10000000}, e: {c: 0, r: 0}};
    for (var R = 0; R != data.length; ++R) {
        for (var C = 0; C != data[R].length; ++C) {
            if (range.s.r > R) range.s.r = R;
            if (range.s.c > C) range.s.c = C;
            if (range.e.r < R) range.e.r = R;
            if (range.e.c < C) range.e.c = C;
            var cell = {v: data[R][C]};
            if (cell.v == null) continue;
            var cell_ref = XLSX.utils.encode_cell({c: C, r: R});

            if (typeof cell.v === 'number') cell.t = 'n';
            else if (typeof cell.v === 'boolean') cell.t = 'b';
            else if (cell.v instanceof Date) {
                cell.t = 'n';
                cell.z = XLSX.SSF._table[14];
                cell.v = datenum(cell.v);
            }
            else cell.t = 's';

            ws[cell_ref] = cell;
        }
    }
    if (range.s.c < 10000000) ws['!ref'] = XLSX.utils.encode_range(range);
    return ws;
}

function Workbook() {
    if (!(this instanceof Workbook)) return new Workbook();
    this.SheetNames = [];
    this.Sheets = {};
}

function s2ab(s) {
    var buf = new ArrayBuffer(s.length);
    var view = new Uint8Array(buf);
    for (var i = 0; i != s.length; ++i) view[i] = s.charCodeAt(i) & 0xFF;
    return buf;
}

export function export_table_to_excel(id) {
    var theTable = document.getElementById(id);
    var oo = generateArray(theTable);
    var ranges = oo[1];

    /* original data */
    var data = oo[0];
    var ws_name = "SheetJS";

    var wb = new Workbook(), ws = sheet_from_array_of_arrays(data);

    /* add ranges to worksheet */
    // ws['!cols'] = ['apple', 'banan'];
    ws['!merges'] = ranges;

    /* add worksheet to workbook */
    wb.SheetNames.push(ws_name);
    wb.Sheets[ws_name] = ws;

    var wbout = XLSX.write(wb, {bookType: 'xlsx', bookSST: false, type: 'binary'});

    saveAs(new Blob([s2ab(wbout)], {type: "application/octet-stream"}), "test.xlsx")
}

export function export_json_to_excel({header, data, filename='excel-list', autoWidth=true}={}) {
    /* original data */
    data=[...data]
    // data.unshift(th);
    data.unshift(["车型", "区域", "扣留车辆数", "费用合计", "停放天数", "支付标准", "保管费用", "交警支队拖车", "支付标准", "停车场自有拖车", "支付标准", "拖车费用", "代驾数", "支付标准", "代驾费用"]);
    data.unshift(['','','','','停车保管费','停车保管费','停车保管费','拖车数','拖车数','拖车数','拖车数','拖车数','代驾费用','代驾费用','代驾费用',]);
    var ws_name = "SheetJS";
    var wb = new Workbook(), ws = sheet_from_array_of_arrays(data);

    if(autoWidth){
        /*设置worksheet每列的最大宽度*/
        const colWidth = data.map(row => row.map(val => {
            /*先判断是否为null/undefined*/
            if (val == null) {
                return {'wch': 10};
            }
            /*再判断是否为中文*/
            else if (val.toString().charCodeAt(0) > 255) {
                return {'wch': val.toString().length * 2};
            } else {
                return {'wch': val.toString().length};
            }
        }))
        /*以第一行为初始值*/
        let result = colWidth[0];
        for (let i = 1; i < colWidth.length; i++) {
            for (let j = 0; j < colWidth[i].length; j++) {
                if (result[j]['wch'] < colWidth[i][j]['wch']) {
                    result[j]['wch'] = colWidth[i][j]['wch'];
                }
            }
        }
         ws['!cols'] = result;
    }

    /* add worksheet to workbook */
    ws["!merges"] = [
        {  //合并第二行第10列第11列
            s: {//s为开始
              c: 4,//开始列
              r: 0//开始取值范围
            },
            e: {//e结束
              c: 6,//结束列
              r: 0//结束范围
            }
          },
          {  //合并第二行第10列第11列
            s: {//s为开始
              c: 7,//开始列
              r: 0//开始取值范围
            },
            e: {//e结束
              c: 11,//结束列
              r: 0//结束范围
            }
          },
          {  //合并第二行第10列第11列
            s: {//s为开始
              c: 12,//开始列
              r: 0//开始取值范围
            },
            e: {//e结束
              c: 14,//结束列
              r: 0//结束范围
            }
          },
        {  //合并第二行第10列第11列
          s: {//s为开始
            c: 9,//开始列
            r: 3//开始取值范围
          },
          e: {//e结束
            c: 10,//结束列
            r: 3//结束范围
          }
        }, {  //合并第三行第10列第11列
            s: {//s为开始
                c: 9,//开始列
                r: 4//开始取值范围
            },
            e: {//e结束
                c: 10,//结束列
                r: 4//结束范围
            }
        }, {  //合并第三行第10列第11列
            s: {//s为开始
                c: 9,//开始列
                r: 5//开始取值范围
            },
            e: {//e结束
                c: 10,//结束列
                r: 5//结束范围
            }
        }, {  //合并第三行第10列第11列
            s: {//s为开始
                c: 9,//开始列
                r: 6//开始取值范围
            },
            e: {//e结束
                c: 10,//结束列
                r: 6//结束范围
            }
        }, {  //合并第三行第10列第11列
            s: {//s为开始
                c: 9,//开始列
                r: 7//开始取值范围
            },
            e: {//e结束
                c: 10,//结束列
                r: 7//结束范围
            }
        }, {  //合并第三行第10列第11列
            s: {//s为开始
                c: 9,//开始列
                r: 10//开始取值范围
            },
            e: {//e结束
                c: 10,//结束列
                r: 10//结束范围
            }
        }, {  //合并第三行第10列第11列
            s: {//s为开始
                c: 9,//开始列
                r: 11//开始取值范围
            },
            e: {//e结束
                c: 10,//结束列
                r: 11//结束范围
            }
        }, {  //合并第三行第10列第11列
            s: {//s为开始
                c: 9,//开始列
                r: 12//开始取值范围
            },
            e: {//e结束
                c: 10,//结束列
                r: 12//结束范围
            }
        }, {  //合并第三行第10列第11列
            s: {//s为开始
                c: 9,//开始列
                r: 13//开始取值范围
            },
            e: {//e结束
                c: 10,//结束列
                r: 13//结束范围
            }
        }, {  //合并第三行第10列第11列
            s: {//s为开始
                c: 9,//开始列
                r: 14//开始取值范围
            },
            e: {//e结束
                c: 10,//结束列
                r: 14//结束范围
            }
        }, {  //合并第三行第10列第11列
            s: {//s为开始
                c: 9,//开始列
                r: 15//开始取值范围
            },
            e: {//e结束
                c: 10,//结束列
                r: 15//结束范围
            }
        }, {  //合并A4A5单元格
          s: {//s为开始
            c: 0,//开始列
            r: 4//开始取值范围
          },
          e: {//e结束
            c: 0,//结束列
            r: 5//结束范围
          }
        },{  //合并A4A5单元格
            s: {//s为开始
              c: 0,//开始列
              r: 6//开始取值范围
            },
            e: {//e结束
              c: 0,//结束列
              r: 7//结束范围
            }
          },{  //合并A4A5单元格
            s: {//s为开始
              c: 0,//开始列
              r: 8//开始取值范围
            },
            e: {//e结束
              c: 0,//结束列
              r: 9//结束范围
            }
          },{  //合并A4A5单元格
            s: {//s为开始
              c: 0,//开始列
              r: 10//开始取值范围
            },
            e: {//e结束
              c: 0,//结束列
              r: 11//结束范围
            }
          },{  //合并A4A5单元格
            s: {//s为开始
              c: 0,//开始列
              r: 12//开始取值范围
            },
            e: {//e结束
              c: 0,//结束列
              r: 13//结束范围
            }
          },{  //合并A4A5单元格
            s: {//s为开始
              c: 0,//开始列
              r: 14//开始取值范围
            },
            e: {//e结束
              c: 0,//结束列
              r: 15//结束范围
            }
          },
          {  //合并A4A5单元格
            s: {//s为开始
              c: 5,//开始列
              r: 4//开始取值范围
            },
            e: {//e结束
              c: 5,//结束列
              r: 5//结束范围
            }
          },{  //合并A4A5单元格
              s: {//s为开始
                c: 5,//开始列
                r: 6//开始取值范围
              },
              e: {//e结束
                c: 5,//结束列
                r: 7//结束范围
              }
            },{  //合并A4A5单元格
              s: {//s为开始
                c: 5,//开始列
                r: 8//开始取值范围
              },
              e: {//e结束
                c: 5,//结束列
                r: 9//结束范围
              }
            },{  //合并A4A5单元格
              s: {//s为开始
                c: 5,//开始列
                r: 10//开始取值范围
              },
              e: {//e结束
                c: 5,//结束列
                r: 11//结束范围
              }
            },{  //合并A4A5单元格
              s: {//s为开始
                c: 5,//开始列
                r: 12//开始取值范围
              },
              e: {//e结束
                c: 5,//结束列
                r: 13//结束范围
              }
            },{  //合并A4A5单元格
              s: {//s为开始
                c: 5,//开始列
                r: 14//开始取值范围
              },
              e: {//e结束
                c: 5,//结束列
                r: 15//结束范围
              }
            },
            {  //合并A4A5单元格
                s: {//s为开始
                  c: 10,//开始列
                  r: 8//开始取值范围
                },
                e: {//e结束
                  c: 10,//结束列
                  r: 9//结束范围
                }
              },
              {  //合并A4A5单元格
                s: {//s为开始
                  c: 12,//开始列
                  r: 3//开始取值范围
                },
                e: {//e结束
                  c: 14,//结束列
                  r: 3//结束范围
                }
              },{  //合并A4A5单元格
                s: {//s为开始
                  c: 12,//开始列
                  r: 5//开始取值范围
                },
                e: {//e结束
                  c: 14,//结束列
                  r: 5//结束范围
                }
              },{  //合并A4A5单元格
                s: {//s为开始
                  c: 12,//开始列
                  r: 7//开始取值范围
                },
                e: {//e结束
                  c: 14,//结束列
                  r: 7//结束范围
                }
              },
    ]
      console.log(ws)
    wb.SheetNames.push(ws_name);
    wb.Sheets[ws_name] = ws;

    var wbout = XLSX.write(wb, {bookType: 'xlsx', bookSST: false, type: 'binary'});
    saveAs(new Blob([s2ab(wbout)], {type: "application/octet-stream"}), filename + ".xlsx");
}