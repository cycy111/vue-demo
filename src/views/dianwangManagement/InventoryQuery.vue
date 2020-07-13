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
        <el-form-item label prop="productCode">
          <el-input
            v-model="searchForm.productCode"
            placeholder="请输入物资编号"
            clearable
          ></el-input>
        </el-form-item>
        <el-form-item label prop="productName">
          <el-input
            v-model="searchForm.productName"
            placeholder="请输入物资名称"
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
    <div class="t-total" v-if="tables.postParams.total">
      <span class="t-wrap">
        库存总数量：
        <span class="t-num">{{ tQty }}</span>
      </span>
      <span class="t-wrap">
        ERP已出库未领总数量：
        <span class="t-num">{{ tReGetQty }}</span>
      </span>
      <span class="t-wrap">
        借料未销总数量：
        <span class="t-num">{{ tLendResQty }}</span>
      </span>
      <span class="t-wrap">
        ERP未销总数量：
        <span class="t-num">{{ tErpResQty }}</span>
      </span>
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
        prop="productCode"
        label="物资编号"
        width="120"
      ></el-table-column>
      <el-table-column
        prop="productName"
        label="物资名称"
        width="150"
      ></el-table-column>
      <el-table-column
        prop="productUnit"
        label="单位"
        width="250"
      ></el-table-column>
      <el-table-column
        prop="qty"
        label="库存数量"
        width="100"
      ></el-table-column>
      <el-table-column
        prop="lendQty"
        label="借料已领数量"
        width="120"
      ></el-table-column>
      <el-table-column
        prop="reGetQty"
        label="ERP已出库未领"
        width="120"
      ></el-table-column>
      <el-table-column
        prop="lendResQty"
        label="借料未销数量"
        width="120"
      ></el-table-column>
      <el-table-column
        prop="erpResQty"
        label="ERP未销数量"
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
<style lang="less">
.search-form .el-form-item__content input {
  width: 140px;
}
.t-total {
  text-align: right;
}
.t-wrap {
  font-size: 12px;
  margin-right: 1em;
}
.t-num {
  color: #409eff;
}
</style>

<script>
import { Message, ColorPicker } from 'element-ui';
import messages from '@/utils/messages';
import { pickerOptions } from '@/utils/index';
import { tableToExcel } from '@/utils/cmn';
import Big from 'big.js';
import { getKpiInfo } from '@/api/yuebao/kpiBase';
import { getStorageList } from '@/api/dianwangManagement/inventoryQuery';
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
      tReGetQty: 0,
      tQty: 0,
      searchForm: {
        deptCode: '',
        productCode: '',
        productName: '',
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
      getStorageList({
        deptCode: this.deptCode,
        productCode: this.searchForm.productCode,
        productName: this.searchForm.productName,
        pageSize: this.tables.postParams.pageSize,
        pageIndex: this.tables.postParams.currentPage
      })
        .then(res => {
          if (res.data.resultCode == 1) {
            //遍历数组
            if (res.data.data.storageList.length) {
              for (let item of res.data.data.storageList) {
                let qty = new Big(item.qty || 0);
                item.qty = parseFloat(qty.toFixed(2));
                let lendQty = new Big(item.lendQty || 0);
                item.lendQty = parseFloat(lendQty.toFixed(2));
                let reGetQty = new Big(item.reGetQty || 0);
                item.reGetQty = parseFloat(reGetQty.toFixed(2));
                let lendResQty = new Big(item.lendResQty || 0);
                item.lendResQty = parseFloat(lendResQty.toFixed(2));
                let erpResQty = new Big(item.erpResQty || 0);
                item.erpResQty = parseFloat(erpResQty.toFixed(2));
              }
            }
            this.tables.tableData = res.data.data.storageList;
            if (res.data.pageIndex == 1) {
              this.tables.postParams.total = res.data.counts;
              let tQty = new Big(res.data.data.tQty || 0);
              this.tQty = parseFloat(tQty.toFixed(2));
              let tReGetQty = new Big(res.data.data.tReGetQty || 0);
              this.tReGetQty = parseFloat(tReGetQty.toFixed(2));
              let tLendResQty = new Big(res.data.data.tLendResQty || 0);
              this.tLendResQty = parseFloat(tLendResQty.toFixed(2));
              let tErpResQty = new Big(res.data.data.tErpResQty || 0);
              this.tErpResQty = parseFloat(tErpResQty.toFixed(2));
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
      getStorageList({
        deptCode: this.deptCode,
        productCode: this.searchForm.productCode,
        productName: this.searchForm.productName,
        pageSize: 20000,
        pageIndex: 1
      })
        .then(res => {
          if (res.data.resultCode == 1) {
            //遍历数组
            if (res.data.data.length) {
              for (let item of res.data.data) {
                let qty = new Big(item.qty || 0);
                item.qty = parseFloat(qty.toFixed(2));
                let lendQty = new Big(item.lendQty || 0);
                item.lendQty = parseFloat(lendQty.toFixed(2));
                let reGetQty = new Big(item.reGetQty || 0);
                item.reGetQty = parseFloat(reGetQty.toFixed(2));
                let lendResQty = new Big(item.lendResQty || 0);
                item.lendResQty = parseFloat(lendResQty.toFixed(2));
                let erpResQty = new Big(item.erpResQty || 0);
                item.erpResQty = parseFloat(erpResQty.toFixed(2));
              }
            }
            let data = res.data.data;
            //let cols = "物资编号,物资名称,单位,库存数量,借料已领数量,ERP出库未领数量"
            let cols =
              '物资编号,物资名称,单位,库存数量,借料已领数量,ERP已出库未领';
            let fields =
              'productCode,productName,productUnit,qty,lendQty,reGetQty';
            tableToExcel(data, cols, fields);
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
