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
        <el-form-item label="" prop="productCode">
          <el-input
            v-model="searchForm.lendOrder"
            placeholder="请输入借料单号"
            clearable
          ></el-input>
        </el-form-item>
        <el-form-item label="" :label-width="'80px'" clearable>
          <el-select
            v-model="searchForm.enComName"
            filterable
            placeholder="请选择领用单位"
          >
            <el-option
              v-for="(item, index) in borrowMaterialRegions"
              :key="index"
              :label="item.value"
              :value="item.key"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="" :label-width="'80px'" clearable>
          <el-select
            v-model="searchForm.projectCode"
            filterable
            placeholder="请选择项目"
          >
            <el-option
              v-for="(item, index) in projects"
              :key="index"
              :label="item.value"
              :value="item.key"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="" :label-width="'80px'" clearable>
          <el-select
            v-model="searchForm.cType"
            filterable
            placeholder="请选择核销方式"
          >
            <el-option
              v-for="(item, index) in hexiaoType"
              :key="index"
              :label="item.value"
              :value="item.key"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="" :label-width="'80px'" clearable>
          <el-select
            v-model="searchForm.lUser"
            filterable
            placeholder="请选择借料人"
          >
            <el-option
              v-for="(item, index) in borrowMaterialRegions"
              :key="index"
              :label="item.value"
              :value="item.key"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="" :label-width="'80px'" clearable>
          <el-select
            v-model="searchForm.cUser"
            filterable
            placeholder="请选择退料人"
          >
            <el-option
              v-for="(item, index) in borrowMaterialRegions"
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
      :data="tables.tableData"
      tooltip-effect="dark"
      :cell-style="{ 'text-align': 'center' }"
      size="mini"
    >
      <el-table-column type="index" label="序号" width="45"></el-table-column>
      <el-table-column
        prop="lendOrder"
        label="借料单号"
        width="120"
      ></el-table-column>
      <el-table-column
        prop="checkDate"
        label="审核时间"
        width="120"
      ></el-table-column>
      <el-table-column
        prop="productCode"
        label="物资编号"
        width="200"
      ></el-table-column>
      <el-table-column
        prop="productName"
        label="物资名称"
        width="200"
      ></el-table-column>
      <el-table-column
        prop="projectCode"
        label="项目编号"
        width="120"
      ></el-table-column>
      <el-table-column
        prop="projectName"
        label="项目名称"
        width="120"
      ></el-table-column>
      <el-table-column
        prop="enComName"
        label="施工单位"
        width="120"
      ></el-table-column>
      <el-table-column
        prop="lUser"
        label="借料人"
        width="120"
      ></el-table-column>
      <el-table-column
        prop="cUser"
        label="退料人"
        width="250"
      ></el-table-column>
      <el-table-column
        prop="productUnit"
        label="单位"
        width="120"
      ></el-table-column>
      <el-table-column
        prop="cOrder"
        label="核销借库单号"
        width="120"
      ></el-table-column>
      <el-table-column
        prop="reNo"
        label="退单凭证号"
        width="120"
      ></el-table-column>
      <el-table-column
        prop="sumQty"
        label="总核销数量"
        width="120"
      ></el-table-column>
      <el-table-column
        prop="cQty"
        label="本次核销数量"
        width="120"
      ></el-table-column>
      <el-table-column
        prop="rQty"
        label="本次退回数量"
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
import { getSelectData } from '@/api/dianwangManagement/baseData';
import { getErpOutStorageDt } from '@/api/dianwangManagement/storageOutBackDetail';
import '@/styles/custom.scss';
export default {
  name: 'storageOutBackDetail',
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
        lendOrder: '',
        lUser: '',
        cUser: '',
        cType: '',
        enComName: '',
        projectCode: '',
        searchDate: []
      },
      searchRules: {
        deptCode: [{ required: true, message: '请选择项目', trigger: 'change' }]
      },
      projects: [],
      borrowMaterialRegions: [],
      hexiaoType: [
        { key: 1, value: '出库单核销' },
        { key: 2, value: '实物退回' }
      ]
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
      getErpOutStorageDt({
        deptCode: this.deptCode,
        lendOrder: this.searchForm.lendOrder,
        enComName: this.searchForm.enComName,
        projectCode: this.searchForm.projectCode,
        lUser: this.searchForm.lUser,
        cUser: this.searchForm.cUser,
        cType: this.searchForm.cType,
        pageSize: this.tables.postParams.pageSize,
        pageIndex: this.tables.postParams.currentPage
      })
        .then(res => {
          if (res.data.resultCode == 1) {
            //遍历数组
            if (res.data.data.length) {
              for (let item of res.data.data) {
                let sumQty = new Big(item.sumQty || 0);
                item.sumQty = parseFloat(sumQty.toFixed(2));
                let cQty = new Big(item.cQty || 0);
                item.cQty = parseFloat(cQty.toFixed(2));
                let rQty = new Big(item.rQty || 0);
                item.rQty = parseFloat(rQty.toFixed(2));
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
      getErpOutStorageDt({
        deptCode: this.deptCode,
        lendOrder: this.searchForm.lendOrder,
        enComName: this.searchForm.enComName,
        projectCode: this.searchForm.projectCode,
        lUser: this.searchForm.lUser,
        cUser: this.searchForm.cUser,
        cType: this.searchForm.cType,
        pageSize: 20000,
        pageIndex: 1
      })
        .then(res => {
          if (res.data.resultCode == 1) {
            //遍历数组
            if (res.data.data.length) {
              for (let item of res.data.data) {
                let sumQty = new Big(item.sumQty || 0);
                item.sumQty = parseFloat(sumQty.toFixed(2));
                let cQty = new Big(item.cQty || 0);
                item.cQty = parseFloat(cQty.toFixed(2));
                let rQty = new Big(item.rQty || 0);
                item.rQty = parseFloat(rQty.toFixed(2));
              }
            }
            let data = res.data.data;
            //let cols = "物资编号,物资名称,单位,库存数量,借料已领数量,ERP出库未领数量"
            let cols =
              '借料单号,审核时间,物资编号,物资名称,项目编号,项目名称,施工单位,借料人,退料人,单位,核销借库单号,退单凭证号,总核销数量,本次核销数量,本次退回数量';
            let fields =
              'lendOrder,checkDate,productCode,productName,projectCode,projectName,enComName,lUser,cUser,productUnit,cOrder,reNo,sumQty,cQty,rQty';
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
      this.searchForm.lendOrder = '';
      this.searchForm.lUser = '';
      this.searchForm.cUser = '';
      this.searchForm.cType = '';
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
  created() {
    //this.searchFormMethod(1)
    this.initSelectData();
  }
};
</script>
