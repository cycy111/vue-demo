<template>
  <div :class="'kpi-' + dataKey">
    <h2>{{ title }}</h2>
    <div class="para">
      <!-- <el-input v-if="textareaPosition==='top'" type="textarea" :rows="2" placeholder="请手动输入KPI指标情况" v-model="textareaModelValue"></el-input> -->
      <el-table
        border
        show-header
        size="mini"
        :data="tableData"
        style="width: 100%;margin:10px 0px;"
        :header-cell-style="{ background: '#F5F7FA' }"
      >
        <el-table-column
          v-show="labelFormat(item, dataKey)[1]"
          :prop="item"
          :label="labelFormat(item, dataKey)[0]"
          v-for="(item, index) in Object.keys(tableData[0] ? tableData[0] : {})"
          :key="index"
        >
        </el-table-column>
      </el-table>
      <!-- 图表组件 -->
      <div>&nbsp;</div>
      <h-echart v-if="isChart" :echartsData="tableData[0].echart"></h-echart>
      <!-- <el-input v-if="textareaPosition==='bottom'" type="textarea" :rows="2" placeholder="本月小结（填写样板：本月入库多于出库，导致库存积压，周转率低下，望各单位及时领用。)" v-model="textareaModelValue"></el-input> -->
      <el-input
        v-if="edit"
        type="textarea"
        :rows="2"
        placeholder="请输入..."
        v-model="textareaModelValue"
      ></el-input>
      <p class="summer" v-if="!edit">小结：{{ textareaModelValue }}</p>
      <p></p>
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
export default {
  name: 'MonthlyReportTable',
  components: {
    HEchart
  },
  props: {
    title: {
      type: String,
      default: '一、KPI指标情况'
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
        if (this.dataKey === 'sAmountInfo') {
          return [
            {
              deptCode: '',
              years: '',
              months: '',
              kcQty: '',
              kcAmount: '',
              productType: null,
              productName: '',
              belongDept: '',
              belongPerson: '',
              idleDays: '',
              location: null,
              area: null,
              warehouse: null,
              productUnit: null,
              amountType: null,
              itemName: '仓库金额排名靠前的主要物资',
              echart: []
            },
            {
              deptCode: '',
              years: '',
              months: '',
              kcQty: '',
              kcAmount: '',
              productType: null,
              productName: '',
              belongDept: '',
              belongPerson: '',
              idleDays: '',
              location: null,
              area: null,
              warehouse: null,
              productUnit: null,
              amountType: null,
              itemName: '仓库金额排名靠前的主要物资',
              echart: []
            },
            {
              deptCode: '',
              years: '',
              months: '',
              kcQty: '',
              kcAmount: '',
              productType: null,
              productName: '',
              belongDept: '',
              belongPerson: '',
              idleDays: '',
              location: null,
              area: null,
              warehouse: null,
              productUnit: null,
              amountType: null,
              itemName: '仓库金额排名靠前的主要物资',
              echart: []
            },
            {
              deptCode: '',
              years: '',
              months: '',
              kcQty: '',
              kcAmount: '',
              productType: null,
              productName: '',
              belongDept: '',
              belongPerson: '',
              idleDays: '',
              location: null,
              area: null,
              warehouse: null,
              productUnit: null,
              amountType: null,
              itemName: '仓库金额排名靠前的主要物资',
              echart: []
            }
          ];
        } else if (
          this.dataKey === 'dullInfoBySixMonths' ||
          this.dataKey === 'dullInfoByTwoYears'
        ) {
          return [
            {
              deptCode: '',
              years: '',
              months: '',
              kcQty: '',
              kcAmount: '',
              productType: null,
              productName: '',
              belongDept: '',
              belongPerson: '',
              idleDays: '',
              location: null,
              area: null,
              warehouse: null,
              productUnit: null,
              amountType: null,
              itemName: '超6个月呆滞金额前10物资',
              echart: []
            },
            {
              deptCode: '',
              years: '',
              months: '',
              kcQty: '',
              kcAmount: '',
              productType: null,
              productName: '',
              belongDept: '',
              belongPerson: '',
              idleDays: '',
              location: null,
              area: null,
              warehouse: null,
              productUnit: null,
              amountType: null,
              itemName: '超6个月呆滞金额前10物资',
              echart: []
            },
            {
              deptCode: '',
              years: '',
              months: '',
              kcQty: '',
              kcAmount: '',
              productType: null,
              productName: '',
              belongDept: '',
              belongPerson: '',
              idleDays: '',
              location: null,
              area: null,
              warehouse: null,
              productUnit: null,
              amountType: null,
              itemName: '超6个月呆滞金额前10物资',
              echart: []
            },
            {
              deptCode: '',
              years: '',
              months: '',
              kcQty: '',
              kcAmount: '',
              productType: null,
              productName: '',
              belongDept: '',
              belongPerson: '',
              idleDays: '',
              location: null,
              area: null,
              warehouse: null,
              productUnit: null,
              amountType: null,
              itemName: '超6个月呆滞金额前10物资',
              echart: []
            }
          ];
        } else if (this.dataKey === 'dullInfoByTwoYears') {
          console.log(this.dataKey);
        }
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
      getHTitleData: {}
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
    labelFormat(val, objkey) {
      //kpi指标情况
      if ('kpiData' === objkey) {
        switch (val) {
          case 'indexName':
            return ['指标名称', 1];
          case 'kValue':
            return ['指标值', 1];
          case 'kResult':
            return ['考核结果', 1];
          case 'pcValue':
            return ['上月完成值', 1];
          case 'ncValue':
            return ['本月完成值', 1];
          default:
            return ['', 0];
        }
      }

      //仓库金额排名靠前的主要物资 sAmountInfo
      if ('sAmountInfo' === objkey) {
        switch (val) {
          case 'productName':
            return ['物资名称', 1];
          case 'kcQty':
            return ['数量（件/米）', 1];
          case 'kcAmount':
            return ['库存值（万元）', 1];
          case 'productUnit':
            return ['单位', 1];
          case 'belongDept':
            return ['主要归属部门', 1];
          case 'belongPerson':
            return ['主要部门负责人', 1];
          default:
            return ['', 0];
        }
      }

      //仓库总体单据情况 orderInfo
      if ('orderInfo' === objkey) {
        switch (val) {
          case 'billtType':
            return ['单据类型', 1];
          case 'qty':
            return ['单数', 1];
          case 'planQty':
            return ['预约数', 1];
          case 'countType':
            return ['单据类别', 1];
          case 'itemValue':
            return ['单数', 1];
          default:
            return ['', 0];
        }
      }
      //超6个月呆滞金额前10物资
      if ('dullInfoBySixMonths' === objkey) {
        switch (val) {
          case 'productName':
            return ['物资名称', 1];
          case 'kcQty':
            return ['数量', 1];
          case 'kcAmount':
            return ['库存值（万元）', 1];
          case 'productUnit':
            return ['单位', 1];
          case 'belongDept':
            return ['主要归属部门', 1];
          case 'belongPerson':
            return ['主要部门负责人', 1];
          default:
            return ['', 0];
        }
      }
      //超2年呆滞数量前10物资
      if ('dullInfoByTwoYears' === objkey) {
        switch (val) {
          case 'productName':
            return ['物资名称', 1];
          case 'kcQty':
            return ['数量', 1];
          case 'kcAmount':
            return ['库存值（万元）', 1];
          case 'productUnit':
            return ['单位', 1];
          case 'belongDept':
            return ['主要归属部门', 1];
          case 'belongPerson':
            return ['主要部门负责人', 1];
          default:
            return ['', 0];
        }
      }
      //1 show //0 hide
      //所有组件要隐藏的字段
      let arrTemp = ['itemName', 'echart', 'id', 'years', 'months'];
      if (arrTemp.indexOf(val) !== -1) {
        return ['', 0];
      } else {
        return [val, 1];
      }
    },
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
  mounted() {},
  created() {
    this.Bus.$on('getHTitleData', e => {
      this.getHTitleData = e;
    });
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
  margin-bottom: 4em;
}
</style>
