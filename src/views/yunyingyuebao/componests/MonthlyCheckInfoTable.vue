<template>
  <div :class="'kpi-' + dataKey">
    <h2>{{ title }}</h2>
    <div class="para">
      <el-table
        border
        ref="rybd"
        @cell-dblclick="rowclick"
        show-header
        :data="copyTableData"
        size="mini"
        :header-cell-style="{ background: '#F5F7FA' }"
      >
        <el-table-column prop="billType" label="单据类别"></el-table-column>
        <el-table-column prop="qty" label="次数"></el-table-column>
        <el-table-column prop="remark" label="说明">
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
          </template>
        </el-table-column>
      </el-table>
      <div class="contaienr-text-right">
        <button
          v-if="edit"
          class="el-button el-button--success el-button--mini"
          plain
          size="mini"
          type="success"
          @click="saveTable()"
        >
          保存
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { Message } from 'element-ui';
import { UpdateCheckDesc } from '@/api/yuebao/report';
export default {
  name: 'MonthlyCheckInfoTable',
  props: {
    title: {
      type: String,
      default: '盘点情况通报'
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
    saveTable() {
      let data = this.copyTableData.slice(0);
      var reqData = {
        deptCode: this.getHTitleData.deptCode,
        years: this.getHTitleData.years,
        months: this.getHTitleData.months,
        data: data
      };
      UpdateCheckDesc(reqData).then(res => {
        if (res.data.resultCode === 1) {
          return (this.copyTableData = res.data.data.cBillInfo);
        }
        Message({
          message: res.data.message,
          type: 'error',
          duration: 2 * 1000
        });
      });
    },
    rowclick(row) {
      if (!this.edit) {
        return;
      }
      row.edit = true;
      let table = this.tableData.slice(0);
      this.TableData = [];
      this.$nextTick(() => {
        this.copyTableData = table;
      });
    }
  },
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
</style>
