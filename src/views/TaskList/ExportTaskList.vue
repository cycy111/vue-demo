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
        <el-form-item v-show="true" prop="name">
          <el-input
            v-model="searchForm.name"
            placeholder="请输入任务名称"
            style="width:150px;"
            clearable
          ></el-input>
        </el-form-item>

        <el-form-item v-show="true" prop="status">
          <el-select
            v-model="searchForm.status"
            filterable
            placeholder="请选择任务状态"
            clearable
          >
            <el-option
              v-for="(item, index) in selectArr.status"
              :value-key="item.value"
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
            @click="handleExportBtnClickFunc()"
            >导出</el-button
          >
        </el-form-item>
      </el-form>
    </div>
    <div class="el-container" ref="actionForm">
      <el-form :inline="true"> </el-form>
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
      :cell-style="cellStyleFunc"
      @selection-change="
        val => {
          return (this.multipleSelection = val);
        }
      "
      @sort-change="sortChangeFunc"
    >
      <el-table-column type="selection" width="60" fixed> </el-table-column>

      <el-table-column
        type="index"
        label="序号"
        width="60"
        fixed
      ></el-table-column>

      <el-table-column prop="id" label="任务ID" width="120"></el-table-column>

      <el-table-column
        prop="name"
        label="任务描述"
        width="120"
      ></el-table-column>

      <el-table-column
        prop="status"
        label="任务状态"
        width="120"
      ></el-table-column>

      <el-table-column
        prop="progress"
        label="进度"
        width="120"
      ></el-table-column>

      <el-table-column prop="" label="操作" width="120">
        <template slot-scope="scope">
          <div style="text-align:center">
            <a size="mini" v-if="scope.row.url" :href="scope.row.url">下载</a>
          </div>
        </template>
      </el-table-column>
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
import { getTaskTb } from '@/api/TaskList/export-task-list';

const _ = require('lodash');

export default {
  data() {
    return {
      popoverVisible: {},
      dialog: {
        title: '导出任务列表',
        visible: false
      },
      selectArr: {
        status: [
          { label: '待处理', value: '0' },
          { label: '处理中', value: '1' },
          { label: '处理完成', value: '2' },
          { label: '处理失败', value: '3' },
          { label: '已取消', value: '4' }
        ]
      },
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
        name: '',
        status: ''
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
    title: '导出任务列表',
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
      getTaskTb(data)
        .then(res => {
          if (res.data.resultCode == 1) {
            let cols = '任务ID,任务描述,任务状态,进度,操作';
            let fields = 'id,name,status,progress';
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
      getTaskTb(data)
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
      print('long export');
    },
    handleDownloadFunc(row) {
      console.log(row);
    },
    cellStyleFunc(obj) {
      if (obj.column.label == '操作') {
        return 'color:#409EFF';
      } else {
        return '';
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
    this.handleQueryBtnClickFunc();
  },
  mounted() {
    this.setTableMaxHeight();

    this.searchForm.deptCode = this.deptCode;
    this.handleQueryBtnClickFunc();
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
