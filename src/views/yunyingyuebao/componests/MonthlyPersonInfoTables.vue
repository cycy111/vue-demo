<template>
  <div :class="'kpi-' + dataKey">
    <h2>{{ title }}</h2>
    <div class="para">
      <!-- <el-input v-if="textareaPosition==='top'" type="textarea" :rows="2" placeholder="请手动输入KPI指标情况" v-model="textareaModelValue"></el-input> -->
      <el-table
        border
        ref="rybd"
        @cell-dblclick="cellDblclick"
        show-header
        :data="copyTableData"
        size="mini"
        :header-cell-style="{ background: '#F5F7FA' }"
      >
        <el-table-column prop="project" label="项目">
          <template slot-scope="scope">
            <!-- <el-input v-show="scope.row.edit&&edit" size="small" v-model="scope.row.item" ></el-input> -->
            <span>{{ scope.row.item }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="num" label="人数">
          <template slot-scope="scope">
            <el-input
              v-show="scope.row.edit && edit"
              size="small"
              v-model="scope.row.qty"
            ></el-input>
            <span v-show="!(scope.row.edit && edit)">{{ scope.row.qty }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="remark" label="原因说明">
          <template slot-scope="scope">
            <el-input
              v-show="scope.row.edit && edit"
              size="small"
              v-model="scope.row.remark"
              style="width:80%"
            ></el-input>
            <span v-show="!(scope.row.edit && edit)">{{
              scope.row.remark
            }}</span>
            <!-- <el-button v-show="scope.row.edit" plain size="mini" type="success" @click="saveTable(scope.row)">保存</el-button> -->
          </template>
        </el-table-column>
      </el-table>
      <div class="contaienr-text-right" v-if="edit">
        <button
          class="el-button el-button--success el-button--mini"
          plain
          size="mini"
          type="success"
          @click="saveTable()"
        >
          保存
        </button>
      </div>
      <!-- 图表组件 -->
      <h-echart
        v-if="isChart"
        :echartsData="copyTableData[0].echart"
      ></h-echart>
      <el-input
        v-if="textareaPosition === 'bottom'"
        type="textarea"
        :rows="2"
        placeholder="本月小结（填写样板：本月入库多于出库，导致库存积压，周转率低下，望各单位及时领用。)"
        v-model="textareaModelValue"
      ></el-input>
    </div>
  </div>
</template>
<script>
import HEchart from './EChart';
import { setTimeout } from 'timers';
import { Message } from 'element-ui';
import { updatePersionList } from '@/api/yuebao/report';
export default {
  name: 'MonthlyPersonInfoTables',
  components: {
    HEchart
  },
  props: {
    title: {
      type: String,
      default: '人员变动情况'
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
      copyTableData: [],
      getHTitleData: {}
    };
  },
  methods: {
    saveTable(row) {
      //row.edit = false;
      this.$nextTick(() => {
        updatePersionList({
          DeptCode: this.getHTitleData.deptCode,
          Years: this.getHTitleData.years,
          Months: this.getHTitleData.months,
          PQty: this.copyTableData[0].qty,
          PRemark: this.copyTableData[0].remark, //,"上月人数说明",
          LeaveQty: this.copyTableData[1].qty,
          LeaveRemark: this.copyTableData[1].remark, //"离职人数说明",
          InQty: this.copyTableData[2].qty,
          InRemark: this.copyTableData[2].remark, //"入职人数说明",
          Qty: this.copyTableData[3].qty,
          Remark: this.copyTableData[3].remark, //"本月人数说明",
          item: this.getHTitleData.deptCode
        }).then(res => {
          if (res.data.resultCode === 1) {
            return (this.copyTableData = res.data.data.personInfo);
          }
          Message({
            message: res.data.message,
            type: 'error',
            duration: 2 * 1000
          });
        });
      });
    },
    //  getSummaries1(param) {
    //   if (typeof param === "object") {
    //     var { columns, data } = JSON.parse(JSON.stringify(param));
    //   }
    //   var num = 0;
    //   if (data.length) {
    //     data.forEach((column, index) => {
    //       num = num+column.num;
    //     });
    //   }
    //   return ["合计", "", this.totalSize, "", this.totalprop + "%"];
    // },
    cellDblclick(row) {
      row.edit = true;
      let table = this.tableData.slice(0);
      this.copyTableData = [];
      this.$nextTick(() => {
        this.copyTableData = table;
      });
    }
  },
  // computed: {
  //   textareaModelValue: {
  //     // 动态计算currentValue的值
  //     get: function() {
  //       return this.textareaValue; // 将props中的value赋值给currentValue
  //     },
  //     set: function(val) {
  //       this.$emit("input", val, {
  //         dataKey: this.dataKey,
  //         keyCode: "textareaValue"
  //       }); // 通过$emit触发父组件
  //     }
  //   }
  // },
  created() {
    this.copyTableData = this.tableData.slice(0);
    this.copyTableData.map(item => {
      item.edit = false;
    });
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
}
</style>
