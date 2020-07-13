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
        <el-form-item label="" :label-width="'80px'" clearable>
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
        <el-form-item label="" prop="productCode">
          <el-input
            v-model="searchForm.productCode"
            placeholder="请输入物资编号"
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
        prop="outOrz"
        label="发料组织"
        width="200"
      ></el-table-column>
      <el-table-column
        prop="outOrzN"
        label="组织名称"
        width="200"
      ></el-table-column>
      <el-table-column
        prop="productCode"
        label="物资编号"
        width="120"
      ></el-table-column>
      <el-table-column
        prop="productName"
        label="物资名称"
        width="250"
      ></el-table-column>
      <el-table-column
        prop="productUnit"
        label="库存单位"
        width="120"
      ></el-table-column>
      <el-table-column
        prop="enComName"
        label="施工单位名称"
        width="200"
      ></el-table-column>
      <el-table-column
        prop="lendQty"
        label="已借领数"
        width="120"
      ></el-table-column>
      <el-table-column
        prop="getQty"
        label="已领挂账数"
        width="120"
      ></el-table-column>
      <el-table-column
        prop="reGetQty"
        label="ERP出库未领"
        width="120"
      ></el-table-column>
      <el-table-column
        prop="relendQty"
        label="未领借料数"
        width="120"
      ></el-table-column>
      <el-table-column
        prop="erpOQty"
        label="ERP核销数量"
        width="120"
      ></el-table-column>
      <el-table-column
        prop="erpresqty"
        label="ERP未销数量"
        width="120"
      ></el-table-column>
      <el-table-column
        prop="erpRQty"
        label="ERP退单数量"
        width="120"
      ></el-table-column>
      <el-table-column
        prop="lendOQty"
        label="借料核销数量"
        width="120"
      ></el-table-column>
      <el-table-column
        prop="lendresqty"
        label="借料未销数量"
        width="120"
      ></el-table-column>
      <el-table-column
        prop="lendRQty"
        label="借料退单数量"
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
import { getlendStorageTotal } from '@/api/dianwangManagement/borrowMaterialTotal';
import '@/styles/custom.scss';
export default {
  name: 'borrowMaterialTotal',
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
        outOrz: '',
        projectCode: '',
        enComName: '',
        searchDate: []
      },
      searchRules: {
        deptCode: [{ required: true, message: '请选择项目', trigger: 'change' }]
      },
      outOrganizations: [],
      projects: [],
      borrowMaterialRegions: []
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
      getlendStorageTotal({
        deptCode: this.deptCode,
        outOrz: this.searchForm.outOrz,
        projectCode: this.searchForm.projectCode,
        enComCode: this.searchForm.enComName,
        productCode: this.searchForm.productCode,
        productName: this.searchForm.productName,
        pageSize: this.tables.postParams.pageSize,
        pageIndex: this.tables.postParams.currentPage
      })
        .then(res => {
          if (res.data.resultCode == 1) {
            //遍历数组
            console.log(res);
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
                let lendresqty = new Big(item.lendresqty || 0);
                item.lendresqty = parseFloat(lendresqty.toFixed(2));
                let lendRQty = new Big(item.lendRQty || 0);
                item.lendRQty = parseFloat(lendRQty.toFixed(2));
                let lendOQty = new Big(item.lendOQty || 0);
                item.lendOQty = parseFloat(lendOQty.toFixed(2));
                let erpresqty = new Big(item.erpresqty || 0);
                item.erpresqty = parseFloat(erpresqty.toFixed(2));
                let erpRQty = new Big(item.erpRQty || 0);
                item.erpRQty = parseFloat(erpRQty.toFixed(2));
                let erpOQty = new Big(item.erpOQty || 0);
                item.erpOQty = parseFloat(erpOQty.toFixed(2));
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
      getlendStorageTotal({
        deptCode: this.deptCode,
        outOrz: this.searchForm.outOrz,
        projectCode: this.searchForm.projectCode,
        enComCode: this.searchForm.enComName,
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
                let lendQty = new Big(item.lendQty || 0);
                item.lendQty = parseFloat(lendQty.toFixed(2));
                let relendQty = new Big(item.relendQty || 0);
                item.relendQty = parseFloat(relendQty.toFixed(2));
                let getQty = new Big(item.getQty || 0);
                item.getQty = parseFloat(getQty.toFixed(2));
                let reGetQty = new Big(item.reGetQty || 0);
                item.reGetQty = parseFloat(reGetQty.toFixed(2));
                let lendresqty = new Big(item.lendresqty || 0);
                item.lendresqty = parseFloat(lendresqty.toFixed(2));
                let lendRQty = new Big(item.lendRQty || 0);
                item.lendRQty = parseFloat(lendRQty.toFixed(2));
                let lendOQty = new Big(item.lendOQty || 0);
                item.lendOQty = parseFloat(lendOQty.toFixed(2));
                let erpresqty = new Big(item.erpresqty || 0);
                item.erpresqty = parseFloat(erpresqty.toFixed(2));
                let erpRQty = new Big(item.erpRQty || 0);
                item.erpRQty = parseFloat(erpRQty.toFixed(2));
                let erpOQty = new Big(item.erpOQty || 0);
                item.erpOQty = parseFloat(erpOQty.toFixed(2));
              }
            }
            let data = res.data.data;
            //let cols = "物资编号,物资名称,单位,库存数量,借料已领数量,ERP出库未领数量"
            let cols =
              '发料组织,组织名称,物资编号,物资名称,库存单位,施工单位名称,已借领数,已领挂账数,ERP出库未领,未领借料数,ERP核销数量,ERP未销数量,ERP退单数量,借料核销数量,借料未销数量,借料退单数量';
            let fields =
              'outOrz,outOrzN,productCode,productName,productUnit,enComName,lendQty,getQty,reGetQty,relendQty,erpOQty,erpresqty,erpRQty,lendOQty,lendresqty,lendRQty';
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
        this.searchForm.productCode = '';
        this.searchForm.productName = '';
        this.searchForm.outOrz = '';
        this.searchForm.projectCode = '';
        this.searchForm.enComName = '';
      }
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
