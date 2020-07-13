<template>
  <div :class="'kpi-' + dataKey">
    <h2>{{ title }}</h2>
    <div class="para">
      <el-table
        border
        ref="rybd"
        @cell-dblclick="cellDblclick"
        show-header
        :data="copyTableData"
        size="mini"
        :header-cell-style="{ background: '#F5F7FA' }"
      >
        <el-table-column prop="billType" label="单据类别"></el-table-column>
        <el-table-column prop="allQty" label="总单数"></el-table-column>
        <el-table-column prop="planQty" label="预约数"></el-table-column>
        <el-table-column prop="ontimeRate" label="准时率"></el-table-column>
        <el-table-column prop="planRate" label="预约比例"></el-table-column>
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
    </div>
  </div>
</template>

<script>
import { Message } from 'element-ui';
import { UpdatePlanDesc } from '@/api/yuebao/report';
export default {
  name: 'MonthlyPlanInfoTable',
  props: {
    title: {
      type: String,
      default: '预约状况'
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
      //row.edit = false;
      let data = this.copyTableData.slice(0);
      UpdatePlanDesc(data).then(res => {
        if (res.data.resultCode === 1) {
          Message({
            message: '保存成功',
            type: 'success',
            duration: 2 * 1000
          });
          return (this.copyTableData = res.data.data.planInfo);
        } else {
          Message({
            message: res.data.message,
            type: 'error',
            duration: 2 * 1000
          });
        }
      });
    },
    cellDblclick(row) {
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
