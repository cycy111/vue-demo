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
        <el-form-item label="" prop="docEntry">
          <el-input
            v-model="searchForm.docEntry"
            placeholder="请输入入库单号"
            clearable
          ></el-input>
        </el-form-item>
        <el-form-item label="" prop="cgdid">
          <el-input
            v-model="searchForm.cgdid"
            placeholder="请输入采购单号"
            clearable
          ></el-input>
        </el-form-item>
        <el-form-item label="" prop="purchaseCode">
          <el-input
            v-model="searchForm.purchaseCode"
            placeholder="请输入关联单号"
            clearable
          ></el-input>
        </el-form-item>
        <el-form-item label="" prop="projectCode">
          <el-input
            v-model="searchForm.projectCode"
            placeholder="请输入项目编号"
            clearable
          ></el-input>
        </el-form-item>
        <el-form-item label="" prop="projectName">
          <el-input
            v-model="searchForm.projectName"
            placeholder="请输入项目名称"
            clearable
          ></el-input>
        </el-form-item>
        <el-form-item label="" prop="docType">
          <el-input
            v-model="searchForm.docType"
            placeholder="请输入单据类型"
            clearable
          ></el-input>
        </el-form-item>
        <el-form-item label="" prop="productType">
          <el-input
            v-model="searchForm.productType"
            placeholder="请输入物资类型"
            clearable
          ></el-input>
        </el-form-item>
        <el-form-item label="" prop="productCode">
          <el-input
            v-model="searchForm.productCode"
            placeholder="请输入物料编号"
            clearable
          ></el-input>
        </el-form-item>
        <el-form-item label="" prop="productName">
          <el-input
            v-model="searchForm.productName"
            placeholder="请输入物资名称"
            clearable
          ></el-input>
        </el-form-item>
        <el-form-item label="" prop="supName">
          <el-input
            v-model="searchForm.supName"
            placeholder="请输入供应商"
            clearable
          ></el-input>
        </el-form-item>

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
          <el-button type="success" size="small" @click="downInStorageDt"
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
      <el-table-column
        prop="dept"
        label="区域项目"
        width="120"
      ></el-table-column>
      <el-table-column
        prop="checkDate"
        label="操作时间"
        width="120"
      ></el-table-column>
      <el-table-column
        prop="docEntry"
        label="入库单号"
        width="120"
      ></el-table-column>

      <el-table-column
        prop="productCode"
        label="物料编号"
        width="120"
      ></el-table-column>
      <el-table-column
        prop="productName"
        label="物资名称"
        width="250"
      ></el-table-column>
      <el-table-column
        prop="inQty"
        label="收货数量"
        width="80"
      ></el-table-column>
      <el-table-column
        prop="location"
        label="上架储位"
        width="100"
      ></el-table-column>

      <el-table-column
        prop="projectCode"
        label="项目编号"
        width="120"
      ></el-table-column>
      <el-table-column
        prop="projectName"
        label="项目名称"
        width="150"
      ></el-table-column>
      <el-table-column
        prop="cgdid"
        label="采购单号"
        width="120"
      ></el-table-column>
      <el-table-column
        prop="purchaseCode"
        label="关联单号"
        width="120"
      ></el-table-column>
      <el-table-column
        prop="docType"
        label="单据类型"
        width="100"
      ></el-table-column>
      <el-table-column
        prop="productType"
        label="物资类型"
        width="100"
      ></el-table-column>
      <el-table-column
        prop="supName"
        label="供应商"
        width="150"
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
import fecha from 'fecha';
import { getKpiInfo } from '@/api/yuebao/kpiBase';
import {
  findInStorageDt,
  downInStorageDt
} from '@/api/wmsQuery/inStorageDetail';
import '@/styles/custom.scss';
export default {
  name: 'inStorageDetail',
  data() {
    return {
      useDepartmentData: [],
      currentPage: 1,
      tables: {
        tableMaxHeight: document.body.clientHeight - 260,
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
        docEntry: '',
        productCode: '',
        productName: '',
        supName: '',
        purchaseCode: '',
        cgdid: '',
        projectCode: '',
        projectName: '',
        location: '',
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
      findInStorageDt({
        deptCode: this.deptCode,
        docEntry: this.searchForm.docEntry,
        productCode: this.searchForm.productCode,
        productName: this.searchForm.productName,
        supName: this.searchForm.supName,
        cgdid: this.searchForm.cgdid,
        purchaseCode: this.searchForm.purchaseCode,
        projectCode: this.searchForm.projectCode,
        projectName: this.searchForm.projectName,
        location: this.searchForm.location,
        docType: this.searchForm.docType,
        productType: this.searchForm.productType,
        startDate:
          this.searchForm.searchDate && this.searchForm.searchDate.length
            ? this.searchForm.searchDate[0]
            : '',
        endDate:
          this.searchForm.searchDate && this.searchForm.searchDate.length
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
                let qty = new Big(item.inQty || 0);
                item.inQty = parseFloat(qty.toFixed(2));
                if (item.checkDate) {
                  item.checkDate = fecha.format(
                    new Date(item.checkDate),
                    'YYYY-MM-DD HH:MM'
                  );
                }
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
    downInStorageDt() {
      downInStorageDt({
        deptCode: this.deptCode,
        docEntry: this.searchForm.docEntry,
        productCode: this.searchForm.productCode,
        productName: this.searchForm.productName,
        supName: this.searchForm.supName,
        cgdid: this.searchForm.cgdid,
        purchaseCode: this.searchForm.purchaseCode,
        projectCode: this.searchForm.projectCode,
        projectName: this.searchForm.projectName,
        location: this.searchForm.location,
        docType: this.searchForm.docType,
        productType: this.searchForm.productType,
        startDate:
          this.searchForm.searchDate && this.searchForm.searchDate.length
            ? this.searchForm.searchDate[0]
            : '',
        endDate:
          this.searchForm.searchDate && this.searchForm.searchDate.length
            ? this.searchForm.searchDate[1]
            : '',
        pageSize: this.tables.postParams.pageSize,
        pageIndex: this.tables.postParams.currentPage
      })
        .then(res => {
          let blob = new Blob([res.data], { type: 'application/vnd.ms-excel' }); //application/vnd.ms-excel  application/vnd.openxmlformats-officedocument.spreadsheetml.sheet
          if ('msSaveOrOpenBlob' in navigator) {
            window.navigator.msSaveOrOpenBlob(blob, 'checktask.xls');
          } else {
            let objectUrl = URL.createObjectURL(blob);
            window.location.href = objectUrl;
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
    //this.searchFormMethod(1);
  }
};
</script>
