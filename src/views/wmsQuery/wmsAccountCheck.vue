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
        <el-form-item label="" prop="accountNo">
          <el-input
            v-model="searchForm.accountNo"
            placeholder="请输入对账单号"
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
      :cell-style="cellStyleFunc"
      size="mini"
    >
      <el-table-column type="index" label="序号" width="45"></el-table-column>
      <el-table-column prop="accountNo" label="对账单号" width="120">
        <template slot-scope="scope">
          <a
            href="javascript:void(0);"
            @click="
              $router.push({
                path: '/wmsQuery/wmsAccountCheckDt',
                query: { accountNo: scope.row.accountNo }
              })
            "
            >{{ scope.row.accountNo }}</a
          >
        </template>
      </el-table-column>
      <el-table-column
        prop="deptCode"
        label="区域项目"
        width="150"
      ></el-table-column>
      <el-table-column
        prop="creator"
        label="创建人"
        width="120"
      ></el-table-column>
      <el-table-column
        prop="createDate"
        label="创建时间"
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
import { pickerOptions } from '@/utils/index';
import Big from 'big.js';
import { getKpiInfo } from '@/api/yuebao/kpiBase';
import { findAccountReport } from '@/api/wmsQuery/accountReport';
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
        accountNo: '',
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
    }
  },
  methods: {
    searchFormMethod(currentPage) {
      if (currentPage) {
        this.tables.postParams.currentPage = currentPage;
      }
      findAccountReport({
        deptCode: this.deptCode,
        accountNo: this.searchForm.accountNo,
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
                // let qty = new Big(item.qty||0);
                // item.qty = parseFloat(qty.toFixed(2));
                item.deptCode = this.getDeptName(item.deptCode);
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
      findAccountReport({
        deptCode: this.deptCode,
        accountNo: this.searchForm.accountNo,
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
                // let qty = new Big(item.qty||0);
                // item.qty = parseFloat(qty.toFixed(2));
                item.deptCode = this.getDeptName(item.deptCode);
              }
            }
            let data = res.data.data;
            let cols = '对账单号,区域项目,创建时间,创建人';
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
    currentPageChange(currentPageNum) {
      this.searchFormMethod(currentPageNum);
    },
    showDetail(checkNo) {},
    resetForm(formName) {
      if (this.$refs[formName]) {
        this.$refs[formName].resetFields();
      }
    },
    cellStyleFunc(obj) {
      if (obj.columnIndex === 1) {
        return 'color:#409EFF';
      } else {
        return '';
      }
    }
  },
  created() {
    //this.searchFormMethod(1);
  }
};
</script>
