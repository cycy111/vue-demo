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
              :value="item.value"
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
        prop="productCode"
        label="物资编号"
        width="120"
      ></el-table-column>
      <el-table-column
        prop="productName"
        label="物资名称"
        width="250"
      ></el-table-column>
      <!-- <el-table-column
        prop="productUnit"
        label="库存单位"
        width="120"
      ></el-table-column> -->
      <el-table-column
        prop="partQty"
        label="计划数量"
        width="120"
      ></el-table-column>
      <el-table-column
        prop="dliveryQty"
        label="已发数量"
        width="120"
      ></el-table-column>
      <el-table-column
        prop="sumQty"
        label="总核销数量"
        width="120"
      ></el-table-column>
      <el-table-column
        prop="sumRQty"
        label="总退回数量"
        width="120"
      ></el-table-column>
      <el-table-column
        prop="returnQty"
        label="待还"
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
import { getCOutStorageTotal } from '@/api/dianwangManagement/borrowMaterialBackTotal';
import '@/styles/custom.scss';
export default {
  name: 'borrowMaterialBackTotal',
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
        projectCode: '',
        enComName: '',
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
      getCOutStorageTotal({
        deptCode: this.deptCode,
        lendOrder: this.searchForm.lendOrder,
        projectCode: this.searchForm.projectCode,
        enComName: this.searchForm.enComName,
        pageSize: this.tables.postParams.pageSize,
        pageIndex: this.tables.postParams.currentPage
      })
        .then(res => {
          if (res.data.resultCode == 1) {
            //遍历数组
            if (res.data.data.length) {
              for (let item of res.data.data) {
                let partQty = new Big(item.partQty || 0);
                item.partQty = parseFloat(partQty.toFixed(2));
                let dliveryQty = new Big(item.dliveryQty || 0);
                item.dliveryQty = parseFloat(dliveryQty.toFixed(2));
                let sumQty = new Big(item.sumQty || 0);
                item.sumQty = parseFloat(sumQty.toFixed(2));
                let returnQty = new Big(item.returnQty || 0);
                item.returnQty = parseFloat(returnQty.toFixed(2));
                let sumRQty = new Big(item.sumRQty || 0);
                item.sumRQty = parseFloat(sumRQty.toFixed(2));
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
      getCOutStorageTotal({
        deptCode: this.deptCode,
        lendOrder: this.searchForm.lendOrder,
        projectCode: this.searchForm.projectCode,
        enComName: this.searchForm.enComName,
        pageSize: 20000,
        pageIndex: 1
      })
        .then(res => {
          if (res.data.resultCode == 1) {
            //遍历数组
            if (res.data.data.length) {
              for (let item of res.data.data) {
                let partQty = new Big(item.partQty || 0);
                item.partQty = parseFloat(partQty.toFixed(2));
                let dliveryQty = new Big(item.dliveryQty || 0);
                item.dliveryQty = parseFloat(dliveryQty.toFixed(2));
                let sumQty = new Big(item.sumQty || 0);
                item.sumQty = parseFloat(sumQty.toFixed(2));
                let returnQty = new Big(item.returnQty || 0);
                item.returnQty = parseFloat(returnQty.toFixed(2));
                let sumRQty = new Big(item.sumRQty || 0);
                item.sumRQty = parseFloat(sumRQty.toFixed(2));
              }
            }
            let data = res.data.data;
            //let cols = "物资编号,物资名称,单位,库存数量,借料已领数量,ERP出库未领数量"
            let cols =
              '借料单号,物资编号,物资名称,计划数量,已发数量,总核销数量,总退回数量,待还';
            let fields =
              'lendOrder,productCode,productName,partQty,dliveryQty,sumQty,sumRQty,returnQty';
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
      this.searchForm.lendOrder = '';
      this.searchForm.projectCode = '';
      this.searchForm.enComName = '';
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
