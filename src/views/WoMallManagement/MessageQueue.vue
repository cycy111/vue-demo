<template>
  <div class="app-container">
    <div class="el-container-custom">
      <el-form
        :inline="true"
        v-show="true"
        :model="searchForm"
        ref="searchFormRef"
        size="small"
      >
        <el-form-item prop="id">
          <el-input
            v-model="searchForm.id"
            placeholder="请输入 唯一编号"
            style="width:150px;"
            clearable
          ></el-input>
        </el-form-item>

        <el-form-item prop="interfaceId">
          <el-input
            v-model="searchForm.interfaceId"
            placeholder="请输入调用接口的编号"
            style="width:150px;"
            clearable
          ></el-input>
        </el-form-item>

        <el-form-item prop="interfaceName">
          <el-input
            v-model="searchForm.interfaceName"
            placeholder="请输入对应调用接口的名称"
            style="width:150px;"
            clearable
          ></el-input>
        </el-form-item>

        <el-form-item prop="processState">
          <el-select
            v-model="searchForm.processState"
            filterable
            placeholder="请选择处理状态"
            clearable
          >
            <el-option
              v-for="(item, index) in selectArr.processState"
              :value-key="item.value"
              :key="index"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item prop="addDateS">
          <el-date-picker
            v-model="searchForm.addDateS"
            type="datetime"
            style="width:157px"
            value-format="yyyy-MM-dd HH:mm:ss"
            placeholder="选择创建开始时间"
          >
          </el-date-picker>
        </el-form-item>

        <el-form-item prop="addDateE">
          <el-date-picker
            v-model="searchForm.addDateE"
            type="datetime"
            style="width:157px"
            value-format="yyyy-MM-dd HH:mm:ss"
            placeholder="选择创建结束时间"
          >
          </el-date-picker>
        </el-form-item>

        <el-form-item prop="operatorId">
          <el-input
            v-model="searchForm.operatorId"
            placeholder="请输入操作人"
            style="width:150px;"
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
    <el-container>
      <el-form :inline="true"> </el-form>
    </el-container>

    <el-table
      ref="multipleTable"
      border
      :data="tables.tableData"
      tooltip-effect="dark"
      size="mini"
      @selection-change="
        val => {
          return (this.multipleSelection = val);
        }
      "
      @sort-change="sortChangeFunc"
    >
      <el-table-column type="selection" width="45" fixed> </el-table-column>
      <el-table-column
        type="index"
        label="序号"
        width="45"
        fixed
      ></el-table-column>

      <el-table-column
        prop="interfaceId"
        label="接口的编号"
        width="120"
      ></el-table-column>

      <el-table-column
        prop="interfaceName"
        label="接口的名称"
        width="120"
      ></el-table-column>

      <el-table-column
        prop="paramId"
        label="接口参数值ID"
        width="120"
      ></el-table-column>

      <el-table-column prop="callTimes" label="调用次数" width="120">
        <template slot-scope="scope" v-show="scope.row.callTimes">
          <span class="col-content">{{ scope.row.callTimes }}</span
          ><span class="col-suffix">{{ '次' }}</span>
        </template>
      </el-table-column>

      <el-table-column
        prop="processStateDesc"
        label="处理状态"
        width="120"
      ></el-table-column>

      <el-table-column prop="remark" label="备注" width="120"></el-table-column>

      <el-table-column
        prop="addDate"
        label="创建时间"
        width="120"
      ></el-table-column>

      <el-table-column
        prop="processDate"
        label="处理时间"
        width="120"
      ></el-table-column>

      <el-table-column
        prop="operatorId"
        label="操作人"
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
import { getMsgQueHis } from '@/api/WoMallManagement/message-queue';

const _ = require('lodash');

export default {
  data() {
    return {
      popoverVisible: {},
      dialog: {
        title: '推送消息记录',
        visible: false
      },
      selectArr: {
        processState: [
          { label: '处理失败', value: '1' },
          { label: '处理成功', value: '2' }
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
        id: '',
        interfaceId: '',
        interfaceName: '',
        processState: '',
        addDateS: '',
        addDateE: '',
        operatorId: ''
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
  watch: {},
  computed: {
    selectIds() {
      return this.multipleSelection.map(c => {
        return c.id;
      });
    }
  },
  metas: {
    title: '推送消息记录',
    titleTemplate: '%s - 兆航物流TMS后台管理系统'
  },
  methods: {
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
      getMsgQueHis(data)
        .then(res => {
          if (res.data.resultCode == 1) {
            let cols =
              '接口的编号,接口的名称,接口参数值ID,调用次数,处理状态,备注,创建时间,处理时间,操作人';
            let fields =
              'interfaceId,interfaceName,paramId,callTimes,processStateDesc,remark,addDate,processDate,operatorId';
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
      getMsgQueHis(
        data
          ? data
          : {
              pageSize: this.tables.postParams.pageSize,
              pageIndex: this.tables.postParams.currentPage
            }
      )
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
            if (res.data.pageIndex == 1) {
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

    refresh() {
      this.searchFormMethod(1);
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
  activated() {},
  mounted() {},
  created() {},
  beforeRouteLeave(to, from, next) {
    from.meta.keepAlive = false;
    next();
  }
};
</script>
<style>
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
</style>
