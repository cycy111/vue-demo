<template>
  <div class="app-container">
    <div ref="searchForm" class="el-container-custom">
      <el-form
        :inline="true"
        v-show="true"
        :model="searchForm"
        ref="searchFormRef"
        size="small"
      >
        <el-form-item v-show="true" prop="productCode">
          <el-input
            v-model="searchForm.productCode"
            placeholder="请输入物资编码"
            style="width:150px;"
            clearable
          ></el-input>
        </el-form-item>

        <el-form-item v-show="true" prop="productName">
          <el-input
            v-model="searchForm.productName"
            placeholder="请输入物资名称"
            style="width:150px;"
            clearable
          ></el-input>
        </el-form-item>

        <el-form-item v-show="true" prop="productType">
          <el-input
            v-model="searchForm.productType"
            placeholder="请输入物资类别"
            style="width:150px;"
            clearable
          ></el-input>
        </el-form-item>

        <el-form-item v-show="true" prop="supName">
          <el-input
            v-model="searchForm.supName"
            placeholder="请输入供应商"
            style="width:150px;"
            clearable
          ></el-input>
        </el-form-item>

        <el-form-item v-show="true" prop="inSdateS">
          <el-date-picker
            v-model="searchForm.inSdateS"
            type="date"
            style="width:165px"
            value-format="yyyy-MM-dd"
            placeholder="选择开始时间"
          ></el-date-picker>
        </el-form-item>

        <el-form-item v-show="true" prop="inSdateE">
          <el-date-picker
            v-model="searchForm.inSdateE"
            type="date"
            style="width:165px"
            value-format="yyyy-MM-dd"
            placeholder="选择结束时间"
          ></el-date-picker>
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
          <el-button
            type="primary"
            size="small"
            @click="handleQueryBtnClickFunc()"
            >查询</el-button
          >
        </el-form-item>

        <el-form-item>
          <el-button
            type="success"
            size="small"
            @click="handleLongExportBtnClickFunc()"
            >导出</el-button
          >
        </el-form-item>
      </el-form>
    </div>
    <div class="el-container" ref="actionForm">
      <el-form :inline="true"></el-form>
    </div>

    <el-table
      ref="multipleTable"
      border
      :max-height="tables.tableMaxHeight"
      :data="tables.tableData"
      tooltip-effect="dark"
      size="mini"
      :row-class-name="tableRowClassName"
      :highlight-current-row="false"
      @selection-change="
        val => {
          return (this.multipleSelection = val);
        }
      "
      @sort-change="sortChangeFunc"
    >
      <el-table-column type="selection" width="60" fixed></el-table-column>

      <el-table-column
        type="index"
        label="序号"
        width="60"
        fixed
      ></el-table-column>

      <el-table-column
        prop="docEntry"
        label="库存单号"
        width="120"
      ></el-table-column>

      <el-table-column
        prop="productCode"
        label="物资编码"
        width="120"
      ></el-table-column>

      <el-table-column
        prop="productName"
        label="物资名称"
        width="120"
      ></el-table-column>

      <el-table-column
        prop="productType"
        label="物资类别"
        width="120"
      ></el-table-column>

      <el-table-column
        prop="cgdhms"
        label="采购单描述"
        width="200"
      ></el-table-column>

      <el-table-column
        prop="enComCode"
        label="施工单位"
        width="200"
      ></el-table-column>

      <el-table-column
        prop="inOrganize"
        label="组织"
        width="120"
      ></el-table-column>

      <el-table-column
        prop="packCode"
        label="箱号"
        width="120"
      ></el-table-column>

      <el-table-column
        prop="projectCode"
        label="项目编号"
        width="120"
      ></el-table-column>

      <el-table-column
        prop="projectName"
        label="项目名称"
        width="200"
      ></el-table-column>

      <el-table-column
        prop="proSeqno"
        label="批次号"
        width="120"
      ></el-table-column>

      <el-table-column
        prop="purchaseCode"
        label="相关单号"
        width="120"
      ></el-table-column>

      <el-table-column
        prop="productUnit"
        label="单位"
        width="120"
      ></el-table-column>

      <el-table-column
        prop="orderType"
        label="单据类型"
        width="120"
      ></el-table-column>

      <el-table-column
        prop="inSDate"
        label="收货时间"
        width="180"
      ></el-table-column>

      <el-table-column
        prop="proProperty"
        label="物资属性"
        width="120"
      ></el-table-column>

      <el-table-column
        prop="cgdid"
        label="采购单号"
        width="120"
      ></el-table-column>

      <el-table-column
        prop="location"
        label="储位"
        width="120"
      ></el-table-column>

      <el-table-column
        prop="qty"
        label="库存数量"
        width="120"
      ></el-table-column>

      <el-table-column
        prop="xzDate"
        label="闲置天数"
        width="120"
      ></el-table-column>

      <el-table-column prop="whCode" label="仓库" width="120"></el-table-column>

      <el-table-column
        prop="supName"
        label="供应商"
        width="180"
      ></el-table-column>
    </el-table>

    <div ref="pagingBox" class="pagination-box">
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
<script>
import md5 from 'md5';
import { Message } from 'element-ui';
import messages from '@/utils/messages';
import { tirmFilter } from '@/utils/tools';
import '@/directives/dialogCtrl.js';
import { tableToExcel } from '@/utils/cmn';
import Big from 'big.js';
import {
  validateNumber,
  validateMoblePhone,
  validateEmail
} from '@/utils/validate';
import {
  findStorageDetl,
  downStorageDetl
} from '@/api/wmsQuery/wms-storage-list';

import * as moment from 'moment';

const _ = require('lodash');

export default {
  data() {
    return {
      popoverVisible: {},
      dialog: {
        title: '库存明细查询',
        visible: false
      },
      selectArr: {},
      multipleSelection: [],
      tables: {
        tableMaxHeight: document.body.clientHeight - 280,
        tableData: [],
        pageSizes: [10, 20, 30, 40],
        rows: null,
        postParams: {
          currentPage: 1,
          pageSize: 50,
          total: 0,
          orderDirection: '',
          orderProp: ''
        }
      },
      searchForm: {
        productCode: '',
        productName: '',
        productType: '',
        supName: '',
        inSdateS: '',
        inSdateE: ''
      },
      addForm: {
        data: {},
        config: {
          disabled: false
        },
        rules: {}
      }
    };
  },
  components: {},
  watch: {
    deptCode: function(val, oldVal) {
      this.searchForm.deptCode = val;
    }
  },
  computed: {
    selectIds() {
      return this.multipleSelection.map(c => {
        return c.id;
      });
    },

    deptCode() {
      return this.$store.getters.deptCode;
    }
  },
  metas: {
    title: '库存明细查询',
    titleTemplate: '%s - 兆航物流TMS后台管理系统',

    deptCode: function(val, oldVal) {
      this.searchForm.deptCode = val;
    }
  },
  methods: {
    setTableMaxHeight() {
      setTimeout(() => {
        let height =
          document.body.clientHeight -
          125 -
          (this.$refs.searchForm.clientHeight +
            this.$refs.actionForm.clientHeight +
            this.$refs.pagingBox.clientHeight);
        this.tables.tableMaxHeight = height;
      }, 200);
    },
    searchFormMethod(currentPage, needSaveSelect = true) {
      if (currentPage) {
        this.tables.postParams.currentPage = currentPage;
      }
      tirmFilter(this.searchForm);
      let data = _.assignIn({}, this.searchForm);
      data.pageSize = this.tables.postParams.pageSize;
      data.pageIndex = this.tables.postParams.currentPage;
      this.queryData(data, needSaveSelect);
    },
    currentPageChange(currentPageNum) {
      this.searchFormMethod(currentPageNum);
    },

    handleQueryBtnClickFunc() {
      this.searchFormMethod(1, false);
    },
    handleExportBtnClickFunc() {
      tirmFilter(this.searchForm);
      let data = _.assign({ pageIndex: 1, pageSize: 10000 }, this.searchForm);
      findStorageDetl(data)
        .then(res => {
          if (res.data.resultCode == 1) {
            let cols =
              '库存单号,物资编码,物资名称,物资类别,采购单描述,施工单位,组织,箱号,项目编号,项目名称,批次号,相关单号,单位,单据类型,收货时间,物资属性,采购单号,储位,库存数量,闲置天数,仓库,供应商';
            let fields =
              'docEntry,productCode,productName,productType,cgdhms,enComCode,inOrganize,packCode,projectCode,projectName,proSeqno,purchaseCode,productUnit,orderType,inSDate,proProperty,cgdid,location,qty,xzDate,whCode,supName';
            tableToExcel(res.data.data, cols, fields);
          } else {
            Message({
              message: res.data.message,
              type: 'error',
              duration: 3 * 1000
            });
          }
        })
        .catch(err => {
          Message({
            message: err,
            type: 'error',
            duration: 3 * 1000
          });
        });
    },

    queryData(data, needSaveSelect) {
      let reqData = data
        ? data
        : {
            pageSize: this.tables.postParams.pageSize,
            pageIndex: this.tables.postParams.currentPage
          };
      findStorageDetl(data)
        .then(res => {
          if (res.data.resultCode === 1) {
            let data = res.data.data;

            this.tables.tableData = data;
            if (needSaveSelect) {
              for (let item of this.multipleSelection) {
                let obj = _.find(this.tables.tableData, {
                  id: item.id
                });
                if (obj) {
                  setTimeout(() => {
                    console.log(obj);
                    this.$refs.multipleTable.toggleRowSelection(obj, true);
                  }, 0);
                }
              }
            }
            if (reqData.pageIndex == 1) {
              this.tables.postParams.total = res.data.counts;
            }
            return;
          }
          this.tables.tableData = [];
          Message({
            message: res.data.message,
            type: 'error',
            duration: 3 * 1000
          });
        })
        .catch(err => {
          Message({
            message: err,
            type: 'error',
            duration: 3 * 1000
          });
        });
    },

    sortChangeFunc(obj) {
      this.tables.postParams.orderDirection = obj.order;
      this.tables.postParams.orderProp = obj.prop;
      this.searchFormMethod(1, false);
    },

    tableRowClassName({ row, rowIndex }) {},
    handleLongExportBtnClickFunc() {
      tirmFilter(this.searchForm);
      let data = _.assignIn({}, this.searchForm);
      data.reportName =
        this.getDeptName(this.deptCode) +
        '库存明细报表' +
        moment().format('YYYY-MM-DD HH:mm');
      data.pageIndex = 1;
      data.pageSize = 10000000;
      downStorageDetl(data)
        .then(res => {
          if (res.data.resultCode == 1) {
            Message({
              dangerouslyUseHTMLString: true,
              message:
                '导出任务生成成功，可前往“任务列表->导出任务进度“可查询进度<a href="/TaskList/ExportTaskList" style="color:rgb(64, 158, 255)">&nbsp;&nbsp;立即前往&nbsp;</a>',
              type: 'success',
              duration: 0,
              showClose: true
            });
          } else if (res.data.resultCode == -110010) {
            Message({
              dangerouslyUseHTMLString: true,
              message:
                '正在导出中，可前往“任务列表->导出任务进度“可查询进度<a href="/TaskList/ExportTaskList" style="color:rgb(64, 158, 255)">&nbsp;&nbsp;立即前往&nbsp;</a>',
              type: 'success',
              duration: 0,
              showClose: true
            });
          } else {
            Message({
              message: res.data.message,
              type: 'error',
              duration: 3 * 1000
            });
          }
        })
        .catch(err => {
          Message({
            message: err,
            type: 'error',
            duration: 3 * 1000
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
      this.$refs[formName].resetFields();
    },
    subAddForm() {
      this.$refs['addFormRef'].validate(valid => {
        if (valid) {
          let data = JSON.parse(JSON.stringify(this.addForm.data));
          //清楚左右空格
          tirmFilter(data);
          //将百分号的项除以100后保存

          //1是编辑，二是新增
          if (this.dialog.status === 1) {
            return this.submitEditData(data);
          } else {
            this.submitAddData(data);
          }
        } else {
          return false;
        }
      });
    }
  },
  activated() {
    this.searchForm.deptCode = this.deptCode;
    // this.handleQueryBtnClickFunc();
  },
  mounted() {
    this.setTableMaxHeight();

    this.searchForm.deptCode = this.deptCode;
    // this.handleQueryBtnClickFunc();
  },
  created() {},
  beforeRouteLeave(to, from, next) {
    next();
  }
};
</script>
<style lang="less">
.el-table .el-button {
  margin: 5px;
}
.port-de {
  margin: 0 auto;
}
h3 {
  font-size: 18px;
  font-weight: 400;
}
.dialog-content {
}
</style>
