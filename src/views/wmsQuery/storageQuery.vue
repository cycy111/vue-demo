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
        <!-- <el-form-item
          label=""
          prop="docType"
        >
          <el-input
            v-model="searchForm.docType"
            placeholder="请输入单据类型"
            clearable
          ></el-input>
        </el-form-item> -->
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
        <el-form-item label="" :label-width="'80px'" clearable prop="whCode">
          <el-select
            v-model="searchForm.whCode"
            filterable
            placeholder="请选择仓库"
          >
            <el-option
              v-for="(item, index) in whCodes"
              :key="index"
              :label="item.value"
              :value="item.key"
            ></el-option>
          </el-select>
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
      <el-table-column
        prop="deptName"
        label="区域项目"
        width="120"
      ></el-table-column>
      <el-table-column
        prop="productCode"
        label="物料编号"
        width="150"
      ></el-table-column>
      <el-table-column
        prop="productName"
        label="物资名称"
        width="250"
      ></el-table-column>
      <el-table-column
        prop="qty"
        label="库存数量"
        width="100"
      ></el-table-column>
      <el-table-column
        prop="docType"
        label="单据类型"
        width="120"
      ></el-table-column>
      <el-table-column
        prop="productType"
        label="物资类型"
        width="120"
      ></el-table-column>
      <el-table-column
        prop="whName"
        label="仓库"
        width="150"
      ></el-table-column>
      <el-table-column
        prop="supName"
        label="供应商"
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
import Big from 'big.js';
import { getKpiInfo } from '@/api/yuebao/kpiBase';
import { getSelectData } from '@/api/dianwangManagement/baseData';
import { findStorage, downStorageSetList } from '@/api/wmsQuery/storageQuery';
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
        productCode: '',
        productName: '',
        supName: '',
        whCode:'',
        docType: '',
        productType: '',
        searchDate: []
      },
      searchRules: {
        deptCode: [{ required: true, message: '请选择项目', trigger: 'change' }]
      },
      whCodes:[]
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
      this.resetForm('searchFormRef');
      this.initSelectData();
    }
  },
  methods: {
    searchFormMethod(currentPage) {
      if (currentPage) {
        this.tables.postParams.currentPage = currentPage;
      }
      findStorage({
        deptCode: this.deptCode,
        productCode: this.searchForm.productCode,
        productName: this.searchForm.productName,
        docType: this.searchForm.docType,
        productType: this.searchForm.productType,
        supName: this.searchForm.supName,
        whCode: this.searchForm.whCode,
        startDate: this.searchForm.searchDate.length
          ? this.searchForm.searchDate[0]
          : '',
        endDate: this.searchForm.searchDate.length
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
      downStorageSetList({
        deptCode: this.deptCode,
        productCode: this.searchForm.productCode,
        productName: this.searchForm.productName,
        docType: this.searchForm.docType,
        productType: this.searchForm.productType,
        whCode: this.searchForm.whCode,
        supName: this.searchForm.supName,
        startDate: this.searchForm.searchDate.length
          ? this.searchForm.searchDate[0]
          : '',
        endDate: this.searchForm.searchDate.length
          ? this.searchForm.searchDate[1]
          : ''
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
    async initSelectData() {
      //获取仓库列表
      getSelectData({ deptCode: this.deptCode, selectType: 5 }).then(res => {
        this.whCodes = this.getResData(res);
      });
      // this.projects = this.getResData(res2);
      // this.borrowMaterialRegions = this.getResData(res3);
    },
    getResData(res) {
      if (res.data.resultCode == 1) {
        return res.data.data;
      } else {
        console.log(res.data.messages);
        Message({
          message: res.data.message,
          type: 'error',
          duration: 2 * 1000
        });
        return [];
      }
    },

    currentPageChange(currentPageNum) {
      this.searchFormMethod(currentPageNum);
    }
  },
  created() {
    //this.searchFormMethod(1);
  },
  mounted(){
    this.initSelectData();
  },
  activated(){
    this.initSelectData();
  }
};
</script>
