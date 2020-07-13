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
      :cell-style="{ 'text-align': 'center' }"
      size="mini"
    >
      <el-table-column type="index" label="序号" width="45"></el-table-column>
      <el-table-column
        prop="deptCode"
        label="区域项目"
        width="120"
      ></el-table-column>
      <el-table-column
        prop="userName"
        label="账号名称"
        width="150"
      ></el-table-column>
      <el-table-column
        prop="loginCount"
        label="登陆次数"
        width="250"
      ></el-table-column>
      <el-table-column
        prop="unLoginTime"
        label="未登陆天数"
        width="100"
      ></el-table-column>
      <el-table-column
        prop="lastLoginTime"
        label="登陆时间"
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
import { pickerOptions } from '@/utils/index';
import { pagination, tableToExcel } from '@/utils/cmn';
import Big from 'big.js';
import { getKpiInfo } from '@/api/yuebao/kpiBase';
import { findLoginLog } from '@/api/wmsQuery/storageQuery';
import '@/styles/custom.scss';
export default {
  name: 'wmsAccountUse',
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
      findLoginLog({
        area: '东二',
        deptCode: this.deptCode,
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
                let loginCount = new Big(item.loginCount || 0);
                item.loginCount = parseFloat(loginCount.toFixed(0));
                //根据部门代码查询部门名称
                item.deptCode = this.getDeptName(item.deptCode);
              }
            }
            let data = pagination(
              this.tables.postParams.currentPage,
              this.tables.postParams.pageSize,
              res.data.data
            );
            this.tables.storageData = data;
            if (this.tables.postParams.currentPage == 1) {
              this.tables.postParams.total = res.data.data.length;
            }
            console.dir(this.$refs.multipleTable);
            //this.$refs.multipleTable.childNodes[2].scrollTop = 0;
            document.querySelector('.el-table__body-wrapper').scrollTop = 0;
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
    },
    getDeptName(deptCode) {
      let depts = this.$store.getters.userDepartments;
      for (let item of depts) {
        if (item.value == deptCode) {
          return item.label;
        }
      }
    },
    downStorageSetList() {
      findLoginLog({
        area: '东二',
        deptCode: this.deptCode,
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
                let loginCount = new Big(item.loginCount || 0);
                item.loginCount = parseFloat(loginCount.toFixed(0));
                item.deptCode = this.getDeptName(item.deptCode);
              }
            }
            let data = res.data.data;
            let cols = '区域项目,账号名称,登陆次数,登陆时间,未登陆天数';

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
    }
  },
  created() {
    //this.searchFormMethod(1)
  }
};
</script>
