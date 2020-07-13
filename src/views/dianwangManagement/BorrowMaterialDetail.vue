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
            prop="searchDate"
          >
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
          </el-form-item> -->
        <el-form-item label="" clearable>
          <el-input
            v-model="searchForm.productCode"
            placeholder="请输入物资编号"
          ></el-input>
        </el-form-item>
        <el-form-item label="" clearable>
          <el-input
            v-model="searchForm.productName"
            placeholder="请输入物资名称"
          ></el-input>
        </el-form-item>
        <el-form-item label="出库组织" :label-width="'80px'" clearable>
          <el-select
            v-model="searchForm.outOrz"
            filterable
            placeholder="请选择出库组织"
          >
            <el-option
              v-for="(item, index) in outOrganizations"
              :key="index"
              :label="item.value"
              :value="item.key"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="领料单位" :label-width="'80px'" clearable>
          <el-select
            v-model="searchForm.enComName"
            filterable
            placeholder="请选择领料单位"
          >
            <el-option
              v-for="(item, index) in borrowMaterialRegions"
              :key="index"
              :label="item.value"
              :value="item.key"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="项目名称" :label-width="'80px'" clearable>
          <el-select
            v-model="searchForm.projectCode"
            filterable
            placeholder="请选择项目名称"
          >
            <el-option
              v-for="(item, index) in projects"
              :key="index"
              :label="item.value"
              :value="item.key"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="查询范围" :label-width="'80px'" clearable>
          <el-select v-model="searchForm.range" placeholder="请选择查询范围">
            <el-option
              v-for="(item, index) in borrowSelect"
              :key="index"
              :label="item.label"
              :value="item.value"
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
      :data="tables.tableData"
      tooltip-effect="dark"
      :cell-style="{ 'text-align': 'center' }"
      size="mini"
    >
      <el-table-column type="index" label="序号" width="45"></el-table-column>
      <el-table-column
        prop="outOrzN"
        label="出库组织"
        width="200"
      ></el-table-column>
      <!-- <el-table-column
        prop="locCount"
        label="项目编号"
        width="150"
      ></el-table-column> -->
      <el-table-column
        prop="projectName"
        label="项目名称"
        width="200"
      ></el-table-column>
      <el-table-column
        prop="enComName"
        label="领料单位"
        width="200"
      ></el-table-column>
      <el-table-column
        prop="productCode"
        label="物料编号"
        width="120"
      ></el-table-column>
      <el-table-column
        prop="productName"
        label="物料名称"
        width="400"
      ></el-table-column>
      <el-table-column
        prop="productUnit"
        label="单位"
        width="100"
      ></el-table-column>
      <el-table-column
        v-if="isShowBorrowColumn"
        prop="lendQty"
        label="借料已领"
        width="100"
        :key="Math.random()"
      ></el-table-column>
      <el-table-column
        v-if="isShowBorrowColumn"
        prop="relendQty"
        label="借料未领"
        width="100"
        :key="Math.random()"
      ></el-table-column>

      <el-table-column
        v-if="isShowChuKuColumn"
        prop="getQty"
        label="ERP出库已领"
        width="100"
        :key="Math.random()"
      ></el-table-column>
      <el-table-column
        v-if="isShowChuKuColumn"
        prop="reGetQty"
        label="ERP出库未领"
        width="100"
        :key="Math.random()"
      ></el-table-column>
      <el-table-column
        v-if="isShowChuKuColumn"
        prop="docentry"
        label="未领单据"
        width="120"
        :key="Math.random()"
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
.el-table table thead tr th {
  color: #666;
}</style
>>

<script>
import { Message, ColorPicker } from 'element-ui';
import messages from '@/utils/messages';
import { pickerOptions } from '@/utils/index';
import { tableToExcel } from '@/utils/cmn';
import Big from 'big.js';
import {
  getlendStorageDetl,
  getSelectData
} from '@/api/dianwangManagement/borrowMaterialDetail';
import { Promise } from 'q';
import { debuglog } from 'util';
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
      outOrganizations: [],
      projects: [],
      borrowSelect: [
        { label: '全部', value: -1 },
        { label: '借料数量', value: 1 },
        { label: 'ERP出库数量', value: 2 }
      ],
      borrowMaterialRegions: [],
      searchForm: {
        deptCode: '',
        outOrz: '',
        projectCode: '',
        enComName: '',
        range: -1,
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
    isShowChuKuColumn() {
      if (this.searchForm.range == 2 || this.searchForm.range == -1) {
        return true;
      } else {
        return false;
      }
    },
    isShowBorrowColumn() {
      if (this.searchForm.range == 1 || this.searchForm.range == -1) {
        return true;
      } else {
        return false;
      }
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
      getlendStorageDetl({
        productCode: this.searchForm.productCode,
        productName: this.searchForm.productName,
        deptCode: this.deptCode,
        outOrz: this.searchForm.outOrz,
        projectCode: this.searchForm.projectCode,
        enComCode: this.searchForm.enComName,
        pageSize: this.tables.postParams.pageSize,
        pageIndex: this.tables.postParams.currentPage
      })
        .then(res => {
          if (res.data.resultCode == 1) {
            //遍历数组
            if (res.data.data.length) {
              for (let item of res.data.data) {
                let lendQty = new Big(item.lendQty || 0);
                item.lendQty = parseFloat(lendQty.toFixed(2));
                let relendQty = new Big(item.relendQty || 0);
                item.relendQty = parseFloat(relendQty.toFixed(2));
                let getQty = new Big(item.getQty || 0);
                item.getQty = parseFloat(getQty.toFixed(2));
                let reGetQty = new Big(item.reGetQty || 0);
                item.reGetQty = parseFloat(reGetQty.toFixed(2));
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
      getlendStorageDetl({
        productCode: this.searchForm.productCode,
        productName: this.searchForm.productName,
        deptCode: this.deptCode,
        outOrz: this.searchForm.outOrz,
        projectCode: this.searchForm.projectCode,
        enComCode: this.searchForm.enComName,
        pageSize: 20000,
        pageIndex: 1
      })
        .then(res => {
          if (res.data.resultCode == 1) {
            //遍历数组
            if (res.data.data.length) {
              for (let item of res.data.data) {
                let lendQty = new Big(item.lendQty || 0);
                item.lendQty = parseFloat(lendQty.toFixed(2));
                let relendQty = new Big(item.relendQty || 0);
                item.relendQty = parseFloat(relendQty.toFixed(2));
                let getQty = new Big(item.getQty || 0);
                item.getQty = parseFloat(getQty.toFixed(2));
                let reGetQty = new Big(item.reGetQty || 0);
                item.reGetQty = parseFloat(reGetQty.toFixed(2));
              }
            }
            let data = res.data.data;
            let cols =
              '出库组织,项目名称,领料单位,物料编号,物料名称,\
            单位,借料已领,借料未领,ERP出库已领,ERP出库未领';
            let fields =
              'outOrzN,projectName,enComName,productCode,productName,productUnit,lendQty,relendQty,getQty,reGetQty';
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
      this.searchForm.productCode = '';
      this.searchForm.productName = '';
      this.searchForm.outOrz = '';
      this.searchForm.enComName = '';
      this.searchForm.projectCode = '';
    },

    currentPageChange(currentPageNum) {
      this.searchFormMethod(currentPageNum);
    },

    async initSelectData() {
      getSelectData({ deptCode: this.deptCode, selectType: 1 }).then(res => {
        this.outOrganizations = this.getResData(res);
      });
      getSelectData({ deptCode: this.deptCode, selectType: 2 }).then(res => {
        console.dir(res);
        this.projects = this.getResData(res);
      });
      getSelectData({ deptCode: this.deptCode, selectType: 3 }).then(res => {
        this.borrowMaterialRegions = this.getResData(res);
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
    }
  },
  activated() {
    this.initSelectData();
  },
  created() {
    //this.searchFormMethod(1)
    // this.initSelectData();
  },
  mounted() {
    //this.searchFormMethod(1)
    this.initSelectData();
  }
};
</script>
