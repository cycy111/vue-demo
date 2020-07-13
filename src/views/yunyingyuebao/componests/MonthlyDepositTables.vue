<template>
  <div :class="'kpi-' + dataKey">
    <h2>{{ title }}</h2>
    <div class="para">
      <el-table
        class="onlyHeaderTable"
        border
        show-header
        :data="tableData"
        size="mini"
        :header-cell-style="{ background: '#F5F7FA' }"
      >
        <el-table-column prop="" label=""></el-table-column>
        <el-table-column
          prop="months"
          :label="val + '月'"
          v-for="(val, index) in monthArr"
          :key="index"
        >
        </el-table-column>
      </el-table>
      <el-table
        class="onlyHeaderTable"
        border
        show-header
        :data="tableData"
        size="mini"
        :header-cell-style="{ background: '#F5F7FA' }"
      >
        <el-table-column prop="" label="物资类别"></el-table-column>
        <el-table-column
          prop="months"
          :label="val"
          v-for="(val, index) in headerArr"
          :key="index"
        >
        </el-table-column>
      </el-table>
      <el-table
        border
        :show-header="false"
        size="mini"
        :data="tableData"
        :header-cell-style="{ background: '#F5F7FA' }"
      >
        <el-table-column
          prop="productType"
          label="productType"
        ></el-table-column>
        <el-table-column
          v-show="ind === 0"
          v-for="(item, ind) in tableData"
          :key="ind"
        >
          <el-table-column v-for="(val, i) in item.amountDt" :key="i">
            <template slot-scope="scope">
              <span>{{
                parseFloat(
                  new Big(Number(scope.row.amountDt[i].amount))
                    .div(10000)
                    .toFixed(2)
                )
              }}</span>
            </template>
          </el-table-column>
        </el-table-column>
      </el-table>
      <!-- 图表组件 -->
      <div>&nbsp;</div>
      <h-echart
        :class="deposit"
        v-if="true"
        :echartsData="echartDataArr"
      ></h-echart>
      <el-input
        v-if="textareaPosition === 'bottom' && edit"
        type="textarea"
        :rows="2"
        placeholder="请输入..."
        v-model="textareaModelValue"
      ></el-input>
      <p class="summer" v-if="!(textareaPosition === 'bottom' && edit)">
        小结：{{ textareaModelValue }}
      </p>
      <div class="contaienr-text-right" v-if="edit">
        <el-button type="success" size="small" @click="saveTable"
          >保存</el-button
        >
      </div>
    </div>
  </div>
</template>

<script>
import HEchart from './EChart';
import { UpdateReportDes } from '@/api/yuebao/report';
import { Message } from 'element-ui';
import Big from 'big.js';
export default {
  name: 'MonthlyDepositTables',
  components: {
    HEchart
  },
  props: {
    title: {
      type: String,
      default: '本月出入库对比情况'
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
        return [
          {
            deptCode: null,
            years: '',
            pMonths: '',
            pYears: '',
            ppMonths: '',
            ppYears: '',
            months: '',
            productType: '',
            itemName: '本月出入库对比情况',
            itemValue: 'amountInfo',
            amountDt: [
              {
                amount: '',
                countType: '入库',
                reportDate: '2018-10'
              },
              {
                amount: ' ',
                countType: '出库',
                reportDate: '2018-10'
              },
              {
                amount: ' ',
                countType: '入库',
                reportDate: '2018-9'
              },
              {
                amount: ' ',
                countType: '出库',
                reportDate: '2018-9'
              },
              {
                amount: ' ',
                countType: '入库',
                reportDate: '2018-8'
              },
              {
                amount: ' ',
                countType: '出库',
                reportDate: '2018-8'
              }
            ],
            echart: null
          }
        ];
      }
    },
    edit: {
      type: Boolean,
      default: false
    },
    year: {
      type: String,
      default: ''
    },
    month: {
      type: String,
      default: ''
    },
    deptCode: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      hideTableBtn: false,
      getHTitleData: {},
      headerArr: [
        '入库金额（万元)',
        '出库金额（万元)',
        '入库金额（万元)',
        '出库金额（万元)',
        '入库金额（万元)',
        '出库金额（万元)'
      ],
      deposit: '',
      Big: Big
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
    },
    echartDataArr: {
      get() {
        var arr = [];
        // if (!this.tableData) {
        //   return [];
        // }
        // if(!this.getHTitleData.months){
        //   return [];
        // }
        var productTypes = [];
        var curMonthIn = [];
        var curMonthOut = [];
        var pMonthIn = [];
        var pMonthOut = [];
        var ppMonthIn = [];
        var ppMonthOut = [];
        //获取物资类别
        var curMonth = parseInt(this.month);
        for (let item of this.tableData) {
          productTypes.push(item.productType);
          for (let item1 of item.amountDt) {
            var amount = parseFloat(
              new Big(Number(item1.amount)).div(10000).toFixed(2)
            );
            if (item1.reportDate.split('-')[1] == curMonth) {
              if (item1.countType == '入库') {
                curMonthIn.push(amount);
              } else {
                curMonthOut.push(amount);
              }
            }
            if (
              item1.reportDate.split('-')[1] ==
              (curMonth - 1 > 0 ? curMonth - 1 : curMonth - 1 + 12)
            ) {
              if (item1.countType == '入库') {
                pMonthIn.push(amount);
              } else {
                pMonthOut.push(amount);
              }
            }
            if (
              item1.reportDate.split('-')[1] ==
              (curMonth - 2 > 0 ? curMonth - 2 : curMonth - 2 + 12)
            ) {
              if (item1.countType == '入库') {
                ppMonthIn.push(amount);
              } else {
                ppMonthOut.push(amount);
              }
            }
          }
        }
        if (!productTypes.length) {
          return [];
        }
        arr = [];
        for (let i = 0; i < productTypes.length; i++) {
          arr.push(0);
        }
        var formatter = param => {
          if (param && param.value != '0' && param.value != '0.000') {
            return param.value;
          } else {
            return '';
          }
        };
        return [
          {
            title: {
              text: curMonth + '月出入库金额对比',
              left: 'center'
            },
            legend: {
              data: ['入库金额', '出库金额'],
              top: 'bottom'
            },
            xAxis: {
              type: 'category',
              data: productTypes
            },
            yAxis: {
              type: 'value',
              name: '金额（万元）'
            },
            series: [
              {
                name: '入库金额',
                data: curMonthIn.length == 0 ? arr : curMonthIn,
                type: 'bar',
                label: {
                  normal: {
                    show: true,
                    textBorderColor: '#333',
                    textBorderWidth: 2,
                    formatter: formatter
                  }
                }
              },
              {
                name: '出库金额',
                data: curMonthOut.length == 0 ? arr : curMonthOut,
                type: 'bar',
                label: {
                  normal: {
                    show: true,
                    textBorderColor: '#333',
                    textBorderWidth: 2,
                    formatter: formatter
                  }
                }
              }
            ],
            grid: {
              left: 80
            }
          },
          {
            title: {
              text:
                (curMonth - 1 > 0 ? curMonth - 1 : curMonth - 1 + 12) +
                '月出入库金额对比',
              left: 'center'
            },
            legend: {
              data: ['入库金额', '出库金额'],
              top: 'bottom'
            },
            xAxis: {
              type: 'category',
              data: productTypes
            },
            yAxis: {
              type: 'value',
              name: '金额（万元）'
            },
            series: [
              {
                name: '入库金额',
                data: pMonthIn.length == 0 ? arr : pMonthIn,
                type: 'bar',
                label: {
                  normal: {
                    show: true,
                    textBorderColor: '#333',
                    textBorderWidth: 2,
                    formatter: formatter
                  }
                }
              },
              {
                name: '出库金额',
                data: pMonthOut.length == 0 ? arr : pMonthOut,
                type: 'bar',
                label: {
                  normal: {
                    show: true,
                    textBorderColor: '#333',
                    textBorderWidth: 2,
                    formatter: formatter
                  }
                }
              }
            ],
            grid: {
              left: 80
            }
          },
          {
            title: {
              text:
                (curMonth - 2 > 0 ? curMonth - 2 : curMonth - 2 + 12) +
                '月出入库金额对比',
              left: 'center'
            },
            legend: {
              data: ['入库金额', '出库金额'],
              top: 'bottom'
            },
            xAxis: {
              type: 'category',
              data: productTypes
            },
            yAxis: {
              type: 'value',
              name: '金额（万元）'
            },
            series: [
              {
                name: '入库金额',
                data: ppMonthIn.length == 0 ? arr : ppMonthIn,
                type: 'bar',
                label: {
                  normal: {
                    show: true,
                    textBorderColor: '#333',
                    textBorderWidth: 2,
                    formatter: formatter
                  }
                }
              },
              {
                name: '出库金额',
                data: ppMonthOut.length == 0 ? arr : ppMonthOut,
                type: 'bar',
                label: {
                  normal: {
                    show: true,
                    textBorderColor: '#333',
                    textBorderWidth: 2,
                    formatter: formatter
                  }
                }
              }
            ],
            grid: {
              left: 80
            }
          }
        ];
      }
    },
    monthArr: {
      get: function() {
        let arr = [];
        let curMonth = parseInt(this.month);
        arr.push(curMonth);
        arr.push(curMonth);
        let pMonth =
          curMonth - 1 > 0 ? curMonth - 1 : '上年' + (curMonth - 1 + 12);
        arr.push(pMonth);
        arr.push(pMonth);
        let ppMonth =
          curMonth - 2 > 0 ? curMonth - 2 : '上年' + (curMonth - 2 + 12);
        arr.push(ppMonth);
        arr.push(ppMonth);
        return arr;
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
    }
  },
  created() {
    this.Bus.$on('getHTitleData', e => {
      this.getHTitleData = e;
    });
    if (this.tableData && this.tableData.length > 2) {
      this.deposit = 'deposit';
    }
  }
};
</script>
<style lang="scss">
.kpi-one h2 {
  text-align: left;
}
.onlyHeaderTable {
  .el-table__body-wrapper {
    display: none;
  }
}

.para {
  padding: 0 2em;
}
.summer {
  color: red;
}
.el-table__body .cell {
  min-height: 1em;
}
.deposit ul.echartContainer li {
  width: 90%;
  margin-left: 0px;
}
.deposit .echartContainer {
  display: block;
}
</style>
