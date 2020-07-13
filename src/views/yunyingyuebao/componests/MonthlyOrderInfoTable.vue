<template>
  <div :class="'kpi-' + dataKey">
    <h2>{{ title }}</h2>
    <div class="para">
      <h3>1）入库单据情况（待入库的不统计）</h3>
      <el-table
        border
        show-header
        size="mini"
        :summary-method="getSummaries1"
        show-summary
        class="tables"
        ref="inputTables1"
        :data="inOrderList"
        style="width: 100%;margin:10px 0px;"
        :header-cell-style="{ background: '#F5F7FA' }"
      >
        <el-table-column prop="billtType" label="单据类别"></el-table-column>
        <el-table-column prop="qty" label="单数"></el-table-column>
        <el-table-column prop="billtType2" label="单据类别"></el-table-column>
        <el-table-column prop="qty2" label="单数"></el-table-column>
      </el-table>
      <!-- 图表组件 -->
      <div>&nbsp;</div>
      <h-echart v-if="isChart" :echartsData="inOrderEchartData"></h-echart>
      <div>&nbsp;</div>
    </div>
    <div class="para">
      <h3>2）出库单据情况（待出库的不统计）</h3>
      <el-table
        border
        show-header
        size="mini"
        :summary-method="getSummaries1"
        show-summary
        class="tables"
        ref="inputTables2"
        :data="outOrderList"
        style="width: 100%;margin:10px 0px;"
        :header-cell-style="{ background: '#F5F7FA' }"
      >
        <el-table-column prop="billtType" label="单据类别"></el-table-column>
        <el-table-column prop="qty" label="单数"></el-table-column>
        <el-table-column prop="billtType2" label="单据类别"></el-table-column>
        <el-table-column prop="qty2" label="单数"></el-table-column>
      </el-table>
      <!-- 图表组件 -->
      <div>&nbsp;</div>

      <h-echart v-if="isChart" :echartsData="outOrderEchartData"></h-echart>
    </div>
    <div class="para">
      <h3>3）其它单据情况</h3>
      <div>&nbsp;</div>
      <el-table
        border
        show-header
        size="mini"
        :summary-method="getSummaries1"
        show-summary
        class="tables"
        ref="inputTables3"
        :data="otherOrderList"
        style="width: 100%;margin:10px 0px;"
        :header-cell-style="{ background: '#F5F7FA' }"
      >
        <el-table-column prop="billtType" label="单据类别"></el-table-column>
        <el-table-column prop="qty" label="单数"></el-table-column>
        <el-table-column prop="billtType2" label="单据类别"></el-table-column>
        <el-table-column prop="qty2" label="单数"></el-table-column>
      </el-table>
      <!-- 图表组件 -->
      <div>&nbsp;</div>
      <el-input
        v-if="textareaPosition === 'top' && edit"
        type="textarea"
        :rows="2"
        placeholder="请输入..."
        v-model="textareaModelValue"
      ></el-input>
      <p class="summer" v-if="!(textareaPosition === 'top' && edit)">
        小结：{{ textareaModelValue }}
      </p>
      <div class="contaienr-text-right" v-if="edit">
        <el-button type="success" size="small" @click="saveTable"
          >保存</el-button
        >
      </div>
    </div>
    <!-- <el-input v-if="textareaPosition==='bottom'" type="textarea" :rows="2" placeholder="本月小结（填写样板：本月入库多于出库，导致库存积压，周转率低下，望各单位及时领用。)" v-model="textareaModelValue"></el-input> -->
  </div>
</template>

<script>
import HEchart from './EChart';
import { UpdateReportDes } from '@/api/yuebao/report';
import { Message } from 'element-ui';
export default {
  name: 'MonthlyOrderInfoTable',
  components: {
    HEchart
  },
  props: {
    title: {
      type: String,
      default: '仓库总体单据情况'
    },
    textareaPosition: {
      type: String,
      default: 'none'
    },
    textareaValue: {
      type: String,
      default: ''
    },
    isChart: {
      type: Boolean,
      default: false
    },
    dataKey: {
      type: String,
      default: ''
    },
    tableData: {
      type: Array,
      default() {
        return [];
      }
    },
    edit: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      hideTableBtn: false,
      getHTitleData: {},
      inOrderList: [],
      outOrderList: [],
      otherOrderList: [],
      inOrderEchartData: [],
      outOrderEchartData: [],
      otherOrderEchartData: [],
      totalQty: 0
    };
  },
  computed: {
    textareaModelValue: {
      // 动态计算currentValue的值
      get: function() {
        return this.textareaValue; // 将props中的value赋值给currentValue
      },
      set: function(val) {
        this.$emit('input', val, {
          dataKey: this.dataKey,
          keyCode: 'textareaValue'
        }); // 通过$emit触发父组件
      }
    }
  },
  methods: {
    saveTable() {
      let data = [
        {
          deptCode: this.getHTitleData.deptCode,
          years: this.getHTitleData.years,
          months: this.getHTitleData.months,
          reportItemCode: this.dataKey,
          remark: this.textareaModelValue
        }
      ];
      UpdateReportDes(data)
        .then(function(res) {
          if (res.data.resultCode == '1') {
            Message({
              message: '保存成功',
              type: 'success',
              duration: 2 * 1000
            });
          } else {
            Message({
              type: 'error',
              message: `${res.data.message}`,
              duration: 10 * 1000
            });
          }
        })
        .catch(function(res) {
          let message = res.message;
          if (message == 'Network Error') {
            message = '请检查网络';
          }
          Message({
            type: 'error',
            message: `${message}`,
            duration: 10 * 1000
          });
        });
    },
    getSummaries1(param) {
      if (typeof param === 'object') {
        var { columns, data } = JSON.parse(JSON.stringify(param));
      }
      var num = 0;
      var num2 = 0;
      if (data.length) {
        data.forEach((column, index) => {
          num = num + parseFloat(column.qty || 0);
          num2 = num2 + parseFloat(column.qty2 || 0);
        });
      }
      return ['汇总', num + num2];
    },
    getOrderListData(orderType) {
      if (!this.tableData[0]) {
        return [];
      }
      let data = this.tableData[0][orderType].data;
      let result = [];
      let obj = {};
      var echartData = [];
      var orderTypes = [];
      var orderValues = [];
      for (let [index, item] of data.entries()) {
        orderTypes.push(item.billtType);
        orderValues.push(item.qty);
        if (index % 2 == 0) {
          obj = {
            billtType: item.billtType,
            qty: item.qty
          };
          if (index + 1 == data.length) {
            result.push(obj);
          }
        } else {
          obj.billtType2 = item.billtType;
          obj.qty2 = item.qty;
          result.push(obj);
        }
      }
      if (!result.length) {
        result.push({
          billtType: '',
          qty: '',
          billtType2: '',
          qty2: ''
        });
      }

      var echartOption = {
        title: {
          text: '',
          left: 'center'
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          }
        },
        grid: {
          left: '3%',
          right: '10%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: {
          type: 'value',
          name: '单数'
        },
        yAxis: {
          type: 'category',
          data: orderTypes,
          name: '单据类别'
        },
        series: [
          {
            type: 'bar',
            data: orderValues,
            label: {
              normal: {
                show: true,
                textBorderColor: '#333',
                textBorderWidth: 2,
                formatter: param => {
                  if (param && param.value != '0' && param.value != '0.000') {
                    return param.value;
                  } else {
                    return '';
                  }
                }
              }
            }
          }
        ]
      };
      if (orderType == 'inOrderlist') {
        echartOption.title.text = '入库单据';
        this.inOrderEchartData = orderValues.length > 0 ? [echartOption] : [];
      }
      if (orderType == 'outOrderlist') {
        echartOption.title.text = '出库单据';
        this.outOrderEchartData = orderValues.length > 0 ? [echartOption] : [];
      }
      if (orderType == 'otherOrderlist') {
        this.otherOrderEchartData =
          orderValues.length > 0 ? [echartOption] : [];
      }
      return result;
    }
  },
  mounted() {},
  created() {
    this.Bus.$on('getHTitleData', e => {
      this.getHTitleData = e;
    });
    this.inOrderList = this.getOrderListData('inOrderlist');
    this.outOrderList = this.getOrderListData('outOrderlist');
    this.otherOrderList = this.getOrderListData('otherOrderlist');
  }
};
</script>
<style lang="scss">
.kpi-one h2 {
  text-align: left;
}

.para {
  padding: 0 2em;
}
.summer {
  color: red;
}
</style>
