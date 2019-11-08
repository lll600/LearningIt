<template>
  <div class="container">
    <div class="box-header-container">
      <div class="box-header">
      <div class="box-car">
          停车场
          <el-select v-model="value" placeholder="请选择" size="small">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
      </div>
      <div class="box-out">
        出场时间从
        <el-date-picker
          size="small"
          v-model="fromValue"
          type="date"
          placeholder="选择日期"
          :picker-options="pickerOptions0"
          >
        </el-date-picker>
        到
        <el-date-picker
          size="small"
          v-model="toValue"
          type="date"
          placeholder="选择日期"
          :disabled="isTest"
          :picker-options="pickerOptions"
          >

        </el-date-picker>
        范围内
      </div>
    </div>
    <div class="box-button">
      <el-button type="primary" size="mini">查询</el-button>
      <el-button type="primary" icon="el-icon-download" size="mini" @click="exportExcel">导出</el-button>
    </div>
    </div>
    
    <div class="box-content">
      <el-table
        :data="tableData"
        :span-method="arraySpanMethod"
        :header-cell-style="{background:'#0e85C5',color:'#fff',height:'40px'}"
        :row-style="{background:'#EFF7FF'}"
        :height="(windowH - 120) +'px'"
        size="mini"
        style="width: 100%;">
        <el-table-column
           v-for="item in headData"
           :key="item.id"
           :label="item.value"
           :prop="item.key"
        >
            <el-table-column 
                v-for="child in item.children" 
                :key="child.id" 
                :label="child.value"
                :prop="child.key">
            
            </el-table-column>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
export default {
  name: 'HelloWorld',
  data () {
    return {
      windowH:document.documentElement.clientHeight || document.body.clientHeight,
      value:'',
      options: [{
          value: '选项1',
          label: '高新区停车场1'
        }, {
          value: '选项2',
          label: '高新区停车场2'
        }, {
          value: '选项3',
          label: '高新区停车场3'
        }, {
          value: '选项4',
          label: '高新区停车场4'
        }, {
          value: '选项5',
          label: '高新区停车场5'
        }],
        fromValue:'',
        toValue:'',
        pickerOptions0:{
          disabledDate: time => {
            if (this.toValue) {
              return time.getTime() > new Date(this.toValue).getTime()-8.64e7
            } else {
              return time.getTime() > Date.now()
            }
          }
        },
        pickerOptions:{
          disabledDate: time => {
            if (this.fromValue) {
              return time.getTime() < new Date(this.fromValue).getTime()+8.64e7
            } else {
              return time.getTime() > Date.now()
            }
          }
        },
        tableData: [{
          typeName:'各项合计:', //车型
          area: null,         //区域
          stayCarNum: 0,      
          fareTotal: 0,
          stopDay:null,
          payPip:null,
          keepFare:0,
          policeTake:null,
          policePip:null,
          stopTake:null,
          stoppip:null,
          fareTake:null,
          replaceNum:null,
          replacePip:null,
          fareReplace:null,
        },{
          typeName:'自行车', //车型
           area: '市内',         //区域
            stayCarNum: 0,      
            fareTotal: 0,
            stopDay:0,
            payPip:1,
            keepFare:0,
            policeTake:0,
            policePip:20,
            stopTake:'/',
            stoppip:'/',
            fareTake:0,
            replaceNum:null,
            replacePip:null,
            fareReplace:null,
        },{
          typeName:'两轮摩托车两轮电动车', //车型
           area:'市内',         //区域
            stayCarNum: 0,      
            fareTotal: 0,
            stopDay:0,
            payPip:10,
            keepFare:0,
            policeTake:0,
            policePip:20,
            stopTake:'/',
            stoppip:'/',
            fareTake:0,
            replaceNum:null,
            replacePip:null,
            fareReplace:null,
        },{
          typeName:'两轮摩托车两轮电动车', //车型
          area: '高速',         //区域
          stayCarNum: 0,      
          fareTotal: 0,
          stopDay:0,
          payPip:10,
          keepFare:0,
          policeTake:0,
          policePip:20,
          stopTake:'/',
          stoppip:'/',
          fareTake:0,
          replaceNum:null,
          replacePip:null,
          fareReplace:null
        },
        {
          rowCount:2,
          typeName:'三轮摩托车三轮电动车三轮农用车', //车型
          area: '市内',         //区域
          stayCarNum: 0,      
          fareTotal: 0,
          stopDay:0,
          payPip:15,
          keepFare:0,
          policeTake:0,
          policePip:20,
          stopTake:'/',
          stoppip:'/',
          fareTake:0,
          replaceNum:null,
          replacePip:null,
          fareReplace:null
        },{
          typeName:'三轮摩托车三轮电动车三轮农用车', //车型
          area: '高速',         //区域
          stayCarNum: 0,      
          fareTotal: 0,
          stopDay:0,
          payPip:15,
          keepFare:0,
          policeTake:0,
          policePip:20,
          stopTake:'/',
          stoppip:'/',
          fareTake:0,
          replaceNum:null,
          replacePip:null,
          fareReplace:null
        },{
          typeName:'A类车型为2.5吨（含2.5吨）以下货车，19座（含19座）以下客车', //车型
          area: '市内',         //区域
          stayCarNum: 0,      
          fareTotal: 0,
          stopDay:0,
          payPip:20,
          keepFare:0,
          policeTake:0,
          policePip:20,
          stopTake:0,
          stoppip:20,
          fareTake:0,
          replaceNum:null,
          replacePip:null,
          fareReplace:null
        },{
          typeName:'A类车型为2.5吨（含2.5吨）以下货车，19座（含19座）以下客车', //车型
          area: '高速',         //区域
          stayCarNum: 0,      
          fareTotal: 0,
          stopDay:0,
          payPip:20,
          keepFare:0,
          policeTake:0,
          policePip:20,
          stopTake:0,
          stoppip:20,
          fareTake:0,
          replaceNum:null,
          replacePip:null,
          fareReplace:null
        },{
          typeName:'B类车型为2.5吨-7吨（含7吨）以下货车，20座-40座（含40座）以下客车', //车型
          area: '市内',         //区域
          stayCarNum: 0,      
          fareTotal: 0,
          stopDay:0,
          payPip:30,
          keepFare:0,
          policeTake:0,
          policePip:20,
          stopTake:'/',
          stoppip:'/',
          fareTake:0,
          replaceNum:null,
          replacePip:null,
          fareReplace:null
        },{
          typeName:'B类车型为2.5吨-7吨（含7吨）以下货车，20座-40座（含40座）以下客车', //车型
          area: '高速',         //区域
          stayCarNum: 0,      
          fareTotal: 0,
          stopDay:0,
          payPip:30,
          keepFare:0,
          policeTake:0,
          policePip:20,
          stopTake:'/',
          stoppip:'/',
          fareTake:0,
          replaceNum:null,
          replacePip:null,
          fareReplace:null
        },{
          typeName:'C类车型为7吨-15吨（含15吨）以下货车，40座以上客车', //车型
          area: '市内',         //区域
          stayCarNum: 0,      
          fareTotal: 0,
          stopDay:0,
          payPip:40,
          keepFare:0,
          policeTake:0,
          policePip:20,
          stopTake:'/',
          stoppip:'/',
          fareTake:0,
          replaceNum:null,
          replacePip:null,
          fareReplace:null
        },{
          typeName:'C类车型为7吨-15吨（含15吨）以下货车，40座以上客车', //车型
          area: '高速',         //区域
          stayCarNum: 0,      
          fareTotal: 0,
          stopDay:0,
          payPip:40,
          keepFare:0,
          policeTake:0,
          policePip:20,
          stopTake:'/',
          stoppip:'/',
          fareTake:0,
          replaceNum:null,
          replacePip:null,
          fareReplace:null
        },{
          typeName:'D类车型为15吨以上货车和集装箱货车', //车型
          area: '市内',         //区域
          stayCarNum: 0,      
          fareTotal: 0,
          stopDay:0,
          payPip:60,
          keepFare:0,
          policeTake:0,
          policePip:20,
          stopTake:'/',
          stoppip:'/',
          fareTake:0,
          replaceNum:null,
          replacePip:null,
          fareReplace:null
        },{
          typeName:'D类车型为15吨以上货车和集装箱货车', //车型
          area: '高速',         //区域
          stayCarNum: 0,      
          fareTotal: 0,
          stopDay:0,
          payPip:60,
          keepFare:0,
          policeTake:0,
          policePip:20,
          stopTake:'/',
          stoppip:'/',
          fareTake:0,
          replaceNum:null,
          replacePip:null,
          fareReplace:null
        }],
        headData:[
          {
            id:1,
            value:'车型',
            key:'typeName'
          },{
            id:2,
            value:'区域',
            key:'area'
          },{
            id:3,
            value:'扣留车辆数',
            key:'stayCarNum'
          },{
            id:4,
            value:'费用合计',
            key:'fareTotal'
          },{
            id:5,
            value:'停车保管费',
            children:[
              {
                id:1,
                value:'停放天数',
                key:'stopDay'
              },{
                id:2,
                value:'支付标准',
                key:'payPip'
              },{
                id:3,
                value:'保管费用',
                key:'keepFare'
              }
            ]
          },{
            id:6,
            value:'拖车数',
            children:[
              {
                id:1,
                value:'交警支队拖车',
                key:'stopTake'
              },{
                id:2,
                value:'支付标准',
                key:'policePip'
              },{
                id:3,
                value:'停车场自有拖车',
                key:'stopTake'
              },{
                id:4,
                value:'支付标准',
                key:'stoppip'
              },{
                id:5,
                value:'拖车费用',
                key:'fareTake'
              },
            ]
          },{
            id:7,
            value:'代驾费用',
            children:[
              {
                id:1,
                value:'代驾数',
                key:'replaceNum'
              },{
                id:2,
                value:'支付标准',
                key:'replacePip'
              },{
                id:3,
                value:'代驾费用',
                key:'fareReplace'
              }
            ]
          }
        ],
        spanArr:[],
        colArr:[]
    }
  },
  mounted(){
    window.onresize = function(){
      this.windowH = document.documentElement.clientHeight || document.body.clientHeight
    }
  },
  computed:{
    isTest:function(){
      if(this.fromValue == '' || this.fromValue == null){
        return true
      }else{
        return false
      }
    }
  },
  methods:{
    arraySpanMethod({ row, column, rowIndex, columnIndex }) {
      if(columnIndex == 0 || columnIndex == 5){
        if(rowIndex == 0 || rowIndex == 1){
          return {
            rowspan:1,
            colspan:1
          }
        }else if(rowIndex % 2 == 0){
          return {
            rowspan:2,
            colspan:1
          }
        }else{
          return{
            rowspan:0,
            colspan:0
          }
        }
      }else if(columnIndex == 9){
        if(rowIndex == 0){
          return{
            rowspan:1,
            colspan:1
          }
        }else if(rowIndex == 6 || rowIndex == 7){
          if(columnIndex == 10){
            return {
              rowspan:1,
              colspan:2
            }
          }else{
            return {
              rowspan:1,
              colspan:1
            }
          }
        }else{
          return {
            rowspan:1,
            colspan:2
          }
        }
      }else if(columnIndex == 11){
        if(rowIndex == 1 || rowIndex == 3 || rowIndex == 5){
          return{
            rowspan:1,
            colspan:3
          }
        }
      }
    },
    exportExcel(){
      import('@/vendor/Export2Excel.js').then(excel => { // 导入js模块
        const tHeader = ['车型', '区域', '扣留车辆数','费用合计','停放天数','支付标准','保管费用','交警支队拖车','支付标准','停车场自有拖车','支付标准','拖车费用','代驾数','支付标准','代驾费用']; // 导出excel 的标题
        const filterVal = ['typeName', 'area', 'stayCarNum','fareTotal','stopDay','payPip','keepFare','policeTake','policePip','stopTake','stoppip','fareTake','replaceNum','replacePip','fareReplace']; // 每个标题对应的字段

        const list = (this.tableData || []).map((item, key) => { // 通过 map 方法遍历，组装数据成上面的格式
            return {
                typeName:item.typeName,
                area: item.area,         //区域
                stayCarNum: item.stayCarNum,      
                fareTotal: item.fareTotal,
                stopDay:item.stopDay,
                payPip:item.payPip,
                keepFare:item.keepFare,
                policeTake:item.policeTake,
                policePip:item.policePip,
                stopTake:item.stayCarNum,
                stoppip:item.stoppip,
                fareTake:item.fareTake,
                replaceNum:item.replaceNum,
                replacePip:item.replacePip,
                fareReplace:item.fareReplace
            };
        });
        if (list) {
            const data = this.formatJson(filterVal, list); // 生成json数据
            excel.export_json_to_excel({ // 调用excel方法生成表格
                header: tHeader,
                data,
                filename: this.goodsName
            });
        } else {
            alert('暂无无数据');
        }
      })
    },
    formatJson (filterVal, jsonData) {
      console.log(filterVal,jsonData);
      
        return jsonData.map(v => filterVal.map(j => v[j]));
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
.container{
  display: -webkit-flex; /* Safari */
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
}
.box-header-container{
  height: 90px;
}
.box-header{
  display: flex;
  justify-content: flex-start;
  margin-bottom: 15px;
}
/* .box-content{
  flex: 1;
} */
.box-car{
  margin-right: 10px;
}
.box-button{
  margin-bottom: 10px;
}
.el-date-editor.el-input, .el-date-editor.el-input__inner{
  width: 150px;
}
.el-table td, .el-table th.is-leaf,.el-table--border, .el-table--group{
  border-color: #539ECE; 
}
.el-table--border::after, .el-table--group::after, .el-table::before{
  background-color: #539ECE;
}
.el-table--border th, .el-table__fixed-right-patch{
  border-bottom:1px solid #539ECE;
}
.el-table--border td, .el-table--border th, .el-table__body-wrapper .el-table--border.is-scrolling-left~.el-table__fixed{
  border-right:1px solid #539ECE;
}

.el-table tbody tr:hover>td { 
    background-color:#fff !important
}
</style>
