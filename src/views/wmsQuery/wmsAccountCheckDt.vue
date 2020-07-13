<template>
  <div class="app-container">
    <div class="el-container-custom">
      <el-form
        v-if="false"
        :inline="true"
        :model="searchForm"
        ref="searchFormRef"
        :rules="searchRules"
        size="small"
        class="search-form"
      >
        <el-form-item label="" clearable>
          <el-input
            v-model="searchForm.checkNo"
            placeholder="请输入盘点单号"
          ></el-input>
        </el-form-item>
        <el-form-item label="" clearable>
          <el-input
            v-model="searchForm.checkType"
            placeholder="请输入盘点类型"
          ></el-input>
        </el-form-item>
        <el-form-item label="">
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
      :data="tables.storageData"
      tooltip-effect="dark"
      :cell-style="{ 'text-align': 'center' }"
      size="mini"
    >
      <el-table-column type="index" label="序号" width="45"></el-table-column>
      <el-table-column prop="productCode" label="物资编号" width="120">
      </el-table-column>
      <el-table-column
        prop="productName"
        label="物资名称"
        width="150"
      ></el-table-column>
      <el-table-column prop="projectCode" label="项目编码" width="120">
      </el-table-column>
      <el-table-column
        prop="projectName"
        label="项目名称"
        width="150"
      ></el-table-column>
      <el-table-column
        prop="wmsQty"
        label="仓库数量"
        width="120"
      ></el-table-column>
      <el-table-column
        prop="ydQty"
        label="移动数量"
        width="120"
      ></el-table-column>
      <el-table-column
        prop="difQty"
        label="差异数量"
        width="120"
      ></el-table-column>
      <el-table-column
        prop="supName"
        label="供应商"
        width="200"
      ></el-table-column>
      <el-table-column
        prop="cgdid"
        label="采购单号"
        width="120"
      ></el-table-column>
      <el-table-column
        prop="packCode"
        label="箱号"
        width="120"
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
import Big from 'big.js';
import { getKpiInfo } from '@/api/yuebao/kpiBase';
import { findAccountReportDt } from '@/api/wmsQuery/accountReport';
import '@/styles/custom.scss';
export default {
  name: 'wmsCheckReportDt',
  data() {
    return {
      useDepartmentData: [],
      currentPage: 1,
      tables: {
        tableMaxHeight: document.body.clientHeight - 230,
        storageData: [],
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
        checkNo: '',
        checkType: '',
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
    },
    regionCode() {
      return this.$store.getters.regionCode;
    }
  },
  watch: {
    deptCode(newVal, oldVal) {
      //this.searchFormMethod(1);
    },
    $route(to, from) {
      this.searchFormMethod(1);
    }
  },
  methods: {
    searchFormMethod(currentPage) {
      if (currentPage) {
        this.tables.postParams.currentPage = currentPage;
      }
      findAccountReportDt({
        deptCode: this.deptCode,
        accountNo: this.$route.query.accountNo,
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
                let wmsQty = new Big(item.wmsQty || 0);
                item.wmsQty = parseFloat(wmsQty.toFixed(2));
                let ydQty = new Big(item.ydQty || 0);
                item.ydQty = parseFloat(ydQty.toFixed(2));
                let difQty = new Big(item.difQty || 0);
                item.difQty = parseFloat(difQty.toFixed(2));
              }
            }
            this.tables.storageData = res.data.data;
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
    downStorageSetList() {},

    currentPageChange(currentPageNum) {
      this.searchFormMethod(currentPageNum);
    },
    showDetail(checkNo) {},
    resetForm(formName) {
      if (this.$refs[formName]) {
        this.$refs[formName].resetFields();
      }
    }
  },
  created() {
    this.searchFormMethod(1);
  }
};
</script>
