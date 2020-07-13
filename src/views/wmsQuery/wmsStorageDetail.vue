<template>
  <div class="app-container">
    <div class="el-container-custom">
      <el-form
        :inline="true"
        :model="searchForm"
        ref="searchFormRef"
        :rules="searchRules"
        size="small"
        clearable
        class="search-form"
      >
        <el-form-item label="" prop="docentry">
          <el-input
            v-model="searchForm.docentry"
            clearable
            placeholder="请输入来源单号"
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
            placeholder="请输入物资编码"
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
        <el-form-item label="" prop="orderType">
          <el-input
            v-model="searchForm.orderType"
            placeholder="请输入单据类型"
            clearable
          ></el-input>
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
      <!-- <el-table-column
        prop="deptName"
        label="区域项目"
        width="120"
      ></el-table-column> -->
      <el-table-column
        prop="docEntry"
        label="来源单号"
        width="120"
      ></el-table-column>
      <el-table-column
        prop="productCode"
        label="物资编码"
        width="150"
      ></el-table-column>
      <el-table-column
        prop="productName"
        label="物资名称"
        width="250"
      ></el-table-column>
      <el-table-column
        prop="productType"
        label="物资类型"
        width="120"
      ></el-table-column>
      <el-table-column prop="qty" label="数量" width="200"></el-table-column>
      <el-table-column
        prop="orderType"
        label="单据类型"
        width="120"
      ></el-table-column>
      <el-table-column
        prop="project"
        label="项目"
        width="100"
      ></el-table-column>
      <el-table-column
        prop="supName"
        label="供应商"
        width="200"
      ></el-table-column>
      <el-table-column
        prop="createDate"
        label="操作时间"
        width="200"
      ></el-table-column>
      <el-table-column
        prop="inOrganize"
        label="库存组织"
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
import { tableToExcel } from '@/utils/cmn';
import Big from 'big.js';
import { getKpiInfo } from '@/api/yuebao/kpiBase';
import { findInventoryFlow } from '@/api/wmsQuery/storageQuery';
import '@/styles/custom.scss';
export default {
  name: 'storageQuery',
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
        docentry: '',
        productCode: '',
        productName: '',
        orderType: '',
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
      findInventoryFlow({
        deptCode: this.deptCode,
        productCode: this.searchForm.productCode,
        productName: this.searchForm.productName,
        docentry: this.searchForm.docentry,
        productType: this.searchForm.productType,
        orderType: this.searchForm.orderType,
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
                let qty = new Big(item.qty || 0);
                item.qty = parseFloat(qty.toFixed(2));
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
    downStorageSetList() {
      findInventoryFlow({
        deptCode: this.deptCode,
        productCode: this.searchForm.productCode,
        productName: this.searchForm.productName,
        docentry: this.searchForm.docentry,
        productType: this.searchForm.productType,
        orderType: this.searchForm.orderType,
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
                let qty = new Big(item.qty || 0);
                item.qty = parseFloat(qty.toFixed(2));
              }
            }
            let data = res.data.data;
            let cols =
              '来源单号,物资编码,物资名称,项目,单位,\
          单据类型,供应商,物资类型,操作时间,库存组织,数量';
            console.log(data.length);
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
