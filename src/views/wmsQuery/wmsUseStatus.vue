<template>
  <div class="app-container">
    <div class="el-container-custom">
      <el-form
        :inline="true"
        :model="searchForm"
        ref="searchFormRef"
        :rules="searchRules"
        size="small"
        class="search-form"
      >
        <el-form-item label="" prop="searchDate">
          <el-date-picker
            v-model="searchForm.searchDate"
            type="daterange"
            align="right"
            unlink-panels
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            value-format="yyyy-MM-dd"
            :picker-options="$util.pickerOptions"
          >
          </el-date-picker>
        </el-form-item>

        <el-form-item>
          <el-button
            type="default"
            size="small"
            @click="resetForm('searchFormRef')"
            >清空</el-button
          >
        </el-form-item>
        <el-form-item>
          <el-button type="primary" size="small" @click="searchFormMethod(1)"
            >查询</el-button
          >
        </el-form-item>
        <el-form-item>
          <el-button type="success" size="small" @click="downStorageSetList"
            >导出</el-button
          >
        </el-form-item>
      </el-form>
    </div>
    <el-table
      ref="multipleTable"
      border
      :max-height="tables.tableMaxHeight"
      :data="tables.tableData"
      tooltip-effect="dark"
      :cell-style="{ 'text-align': 'center' }"
      size="mini"
    >
      <el-table-column type="index" label="序号" width="45"></el-table-column>
      <el-table-column
        prop="deptCode"
        label="区域项目"
        width="120"
      ></el-table-column>
      <el-table-column
        prop="locCount"
        label="系统储位"
        width="150"
      ></el-table-column>
      <el-table-column
        prop="resCount"
        label="已用储位"
        width="250"
      ></el-table-column>
      <el-table-column
        prop="locRate"
        label="储位使用率"
        width="100"
      ></el-table-column>
      <el-table-column
        prop="dCheckCount"
        label="日盘次数"
        width="120"
      ></el-table-column>
      <el-table-column
        prop="lastCheckDay"
        label="日盘时间"
        width="200"
      ></el-table-column>
      <el-table-column
        prop="lastCheckMonth"
        label="月盘时间"
        width="200"
      ></el-table-column>
      <el-table-column
        prop="lastCheckRandom"
        label="抽盘时间"
        width="200"
      ></el-table-column>
      <el-table-column
        prop="inQty"
        label="入库单据数量"
        width="200"
      ></el-table-column>
      <el-table-column
        prop="outQty"
        label="出库单据数量"
        width="200"
      ></el-table-column>
      <el-table-column
        prop="lastResTime"
        label="入库记录"
        width="200"
      ></el-table-column>
      <el-table-column
        prop="lastOutTime"
        label="出库记录"
        width="200"
      ></el-table-column>
      <el-table-column
        prop="lastAcountTime"
        label="对账功能使用记录"
        width="200"
      ></el-table-column>
      <el-table-column
        prop="acountCount"
        label="对账功能使用次数"
        width="200"
      ></el-table-column>
    </el-table>
    <div class="pagination-box">
      <el-pagination
        background
        small
        @current-change="currentPageChange"
        :current-page="tables.postParams.currentPage"
        :page-sizes="tables.pageSizes"
        :page-size="tables.postParams.pageSize"
        layout="total,prev, pager, next"
        :total="tables.postParams.total"
        v-if="tables.postParams.total"
      ></el-pagination>
    </div>
  </div>
</template>
<style>
.search-form .el-form-item__content input {
  width: 140px;
}
</style>

<script>
import { Message, ColorPicker } from 'element-ui';
import messages from '@/utils/messages';
import { pickerOptions } from '@/utils/index';
import { tableToExcel } from '@/utils/cmn';
import Big from 'big.js';
import { getKpiInfo } from '@/api/yuebao/kpiBase';
import { findWmsList } from '@/api/wmsQuery/storageQuery';
import '@/styles/custom.scss';
export default {
  name: 'storageQuery',
  data() {
    return {
      useDepartmentData: [],
      currentPage: 1,
      tables: {
        tableMaxHeight: document.body.clientHeight - 230,
        tableData: [],
        useDepartment: [],
        pageSizes: [10, 20, 30, 40],
        rows: null,
        multipleSelection: [],
        postParams: {
          currentPage: 1,
          pageSize: 50,
          total: 0,
          orderDirection: '',
          orderProp: ''
        }
      },
      searchForm: {
        deptCode: '',
        productCode: '',
        productName: '',
        supName: '',
        docType: '',
        productType: '',
        searchDate: []
      },
      searchRules: {
        deptCode: [{ required: true, message: '请选择项目', trigger: 'change' }]
      }
    };
  },
  computed: {
    deptCode() {
      return this.$store.getters.deptCode;
    }
  },
  watch: {
    deptCode(newVal, oldVal) {
      //this.searchFormMethod(1);
    }
  },
  methods: {
    searchFormMethod(currentPage) {
      if (currentPage) {
        this.tables.postParams.currentPage = currentPage;
      }
      findWmsList({
        area: '东二',
        deptCode: this.deptCode,
        beginTime: this.searchForm.searchDate.length
          ? this.searchForm.searchDate[0]
          : '',
        endTime: this.searchForm.searchDate.length
          ? this.searchForm.searchDate[1]
          : '',
        pageSize: this.tables.postParams.pageSize,
        pageIndex: this.tables.postParams.currentPage
      })
        .then(res => {
          if (res.data.resultCode == 1) {
            //遍历数组
            if (res.data.data.length) {
              for (let item of res.data.data) {
                let locCount = new Big(item.locCount || 0);
                item.locCount = parseFloat(locCount.toFixed(2));
                let resCount = new Big(item.resCount || 0);
                item.resCount = parseFloat(resCount.toFixed(2));
                let locRate = new Big(item.locRate * 100 || 0);
                item.locRate = parseFloat(locRate.toFixed(2));
                let dCheckCount = new Big(item.dCheckCount || 0);
                item.dCheckCount = parseFloat(dCheckCount.toFixed(2));
                let inQty = new Big(item.inQty || 0);
                item.inQty = parseFloat(inQty.toFixed(2));
                let outQty = new Big(item.outQty || 0);
                item.outQty = parseFloat(outQty.toFixed(2));
                let acountCount = new Big(item.acountCount || 0);
                item.acountCount = parseFloat(acountCount.toFixed(2));
                item.deptCode = this.getDeptName(item.deptCode);
              }
            }
            this.tables.tableData = res.data.data;
            if (res.data.pageIndex == 1) {
              this.tables.postParams.total = res.data.counts;
            }
          } else {
            Message({
              message: res.data.message,
              type: 'error',
              duration: 2 * 1000
            });
          }
        })
        .catch(err => {
          Message({
            message: err,
            type: 'error',
            duration: 2 * 1000
          });
        });
    },
    downStorageSetList() {
      findWmsList({
        area: '东二',
        deptCode: this.deptCode,
        beginTime: this.searchForm.searchDate.length
          ? this.searchForm.searchDate[0]
          : '',
        endTime: this.searchForm.searchDate.length
          ? this.searchForm.searchDate[1]
          : '',
        pageSize: 10000,
        pageIndex: 1
      })
        .then(res => {
          if (res.data.resultCode == 1) {
            //遍历数组
            if (res.data.data.length) {
              for (let item of res.data.data) {
                let locCount = new Big(item.locCount || 0);
                item.locCount = parseFloat(locCount.toFixed(2));
                let resCount = new Big(item.resCount || 0);
                item.resCount = parseFloat(resCount.toFixed(2));
                let locRate = new Big(item.locRate * 100 || 0);
                item.locRate = parseFloat(locRate.toFixed(2));
                let dCheckCount = new Big(item.dCheckCount || 0);
                item.dCheckCount = parseFloat(dCheckCount.toFixed(2));
                let inQty = new Big(item.inQty || 0);
                item.inQty = parseFloat(inQty.toFixed(2));
                let outQty = new Big(item.outQty || 0);
                item.outQty = parseFloat(outQty.toFixed(2));
                let acountCount = new Big(item.acountCount || 0);
                item.acountCount = parseFloat(acountCount.toFixed(2));
                item.deptCode = this.getDeptName(item.deptCode);
              }
            }
            let data = res.data.data;
            let cols =
              '区域项目,系统储位,已用储位,储位使用率,日盘次数,\
          日盘时间,月盘时间,抽盘时间,入库单据数量,出库单据数量,入库记录,\
          出库记录,对账功能使用记录,对账功能使用次数';
            tableToExcel(data, cols);
          } else {
            Message({
              message: res.data.message,
              type: 'error',
              duration: 2 * 1000
            });
          }
        })
        .catch(err => {
          Message({
            message: err,
            type: 'error',
            duration: 2 * 1000
          });
        });
    },
    getDeptName(deptCode) {
      let depts = this.$store.getters.userDepartments;
      for (let item of depts) {
        if (item.value == deptCode) {
          return item.label;
        }
      }
    },
    resetForm(formName) {
      if (this.$refs[formName]) {
        this.$refs[formName].resetFields();
      }
    },

    currentPageChange(currentPageNum) {
      this.searchFormMethod(currentPageNum);
    }
  },
  created() {
    //this.searchFormMethod(1)
  }
};
</script>
