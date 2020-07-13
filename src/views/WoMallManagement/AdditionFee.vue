<template>
  <div class="app-container">
    <div ref="searchForm" class="el-container-custom">
      <el-form
        :inline="true"
        v-show="false"
        :model="searchForm"
        ref="searchFormRef"
        size="small"
      >
        <el-form-item v-show="true" prop="id">
          <el-input
            v-model="searchForm.id"
            placeholder="请输入唯一编号"
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
    <div class="el-container" ref="actionForm">
      <el-form :inline="true">
        <el-form-item>
          <el-button
            type="success"
            size="small"
            @click="handleCreateBtnClickFunc()"
            ><i class="el-icon-circle-plus-outline"></i>新增</el-button
          >
        </el-form-item>

        <el-form-item>
          <el-popover
            placement="bottom"
            width="160"
            v-model="popoverVisible.batchDelBtn"
          >
            <p>{{ '是否确定删除？' }}</p>
            <div style="text-align: right; margin: 0">
              <el-button
                size="mini"
                type="text"
                @click="popoverVisible.batchDelBtn = false"
                >取消</el-button
              >
              <el-button
                type="primary"
                size="mini"
                @click="handleBatchDelBtnClickFunc()"
                >确定</el-button
              >
            </div>
            <el-button type="danger" size="small" slot="reference"
              ><i class="iconfont icon-shanchu"></i>批量删除</el-button
            >
          </el-popover>
        </el-form-item>

        <el-form-item>
          <el-button
            type="success"
            size="small"
            @click="handleGetAdditionFeeBtnClickFunc()"
            ><i class="iconfont el-icon-s-promotion"></i
            >推送获取追加费用</el-button
          >
        </el-form-item>

        <el-form-item>
          <el-button
            type="primary"
            size="small"
            @click="handlePushToWoMallBtnClickFunc()"
            ><i class="iconfont el-icon-upload"></i>推送追加费用</el-button
          >
        </el-form-item>

        <el-form-item>
          <el-button
            type="success"
            size="small"
            @click="handleConfirmAdditionFeeBtnClickFunc()"
            ><i class="iconfont el-icon-s-promotion"></i
            >推送确认追加费用</el-button
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
        prop="orderNO"
        label="物流订单号"
        width="140"
      ></el-table-column>

      <el-table-column prop="loadAddExpense" label="追加装卸费" width="120">
        <template slot-scope="scope">
          <span v-show="scope.row.loadAddExpense">
            <span class="col-content">{{ scope.row.loadAddExpense }}</span
            ><span class="col-suffix">{{ '元' }}</span>
          </span>
        </template>
      </el-table-column>

      <el-table-column prop="stockAddExpense" label="追加送仓费" width="120">
        <template slot-scope="scope">
          <span v-show="scope.row.stockAddExpense">
            <span class="col-content">{{ scope.row.stockAddExpense }}</span
            ><span class="col-suffix">{{ '元' }}</span>
          </span>
        </template>
      </el-table-column>

      <el-table-column prop="futileExpense" label="空跑费" width="120">
        <template slot-scope="scope">
          <span v-show="scope.row.futileExpense">
            <span class="col-content">{{ scope.row.futileExpense }}</span
            ><span class="col-suffix">{{ '元' }}</span>
          </span>
        </template>
      </el-table-column>

      <el-table-column prop="otherExpense" label="其他费用" width="120">
        <template slot-scope="scope">
          <span v-show="scope.row.otherExpense">
            <span class="col-content">{{ scope.row.otherExpense }}</span
            ><span class="col-suffix">{{ '元' }}</span>
          </span>
        </template>
      </el-table-column>

      <el-table-column prop="totalAddExpense" label="总追加费用" width="120">
        <template slot-scope="scope">
          <span v-show="scope.row.totalAddExpense">
            <span class="col-content">{{ scope.row.totalAddExpense }}</span
            ><span class="col-suffix">{{ '元' }}</span>
          </span>
        </template>
      </el-table-column>

      <el-table-column
        prop="needEleContractDesc"
        label="是否需要电子合同"
        width="120"
      ></el-table-column>

      <el-table-column
        prop="eleContractNo"
        label="电子合同编号"
        width="120"
      ></el-table-column>

      <el-table-column
        prop="flagDesc"
        label="类别"
        width="120"
      ></el-table-column>

      <el-table-column
        prop="sendStateDesc"
        label="推送状态"
        width="120"
      ></el-table-column>

      <el-table-column prop="remark" label="备注" width="120"></el-table-column>

      <el-table-column
        prop="addDate"
        label="创建时间"
        width="140"
      ></el-table-column>

      <el-table-column
        prop="editDate"
        label="修改时间"
        width="140"
      ></el-table-column>

      <el-table-column
        prop="operatorId"
        label="操作人"
        width="120"
      ></el-table-column>

      <el-table-column width="120" label="操作" fixed="right">
        <template slot-scope="caozuo">
          <el-button size="mini" @click="handleEditBtnClickFunc(caozuo.row)"
            ><i class="iconfont icon-bj"></i>编辑</el-button
          >
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

    <el-dialog
      :title="dialog.title"
      :visible.sync="dialog.visible"
      width="1100px"
      :close-on-click-modal="false"
      v-dialogDrag
      v-dialogDragWidth
      @closed="addEditDialogCloseFunc"
    >
      <el-form
        :model="addForm.data"
        ref="addFormRef"
        status-icon
        :rules="addForm.rules"
        label-width="150px"
        :inline="true"
        label-position="right"
        size="small"
      >
        <el-form-item label="唯一编号" v-show="false" prop="id">
          <el-input
            v-model="addForm.data.id"
            placeholder=""
            style="width:165px;"
            clearable
          >
            <i slot="suffix" class="el-input__icon"></i>
          </el-input>
        </el-form-item>

        <el-form-item label="物流订单号" v-show="true" prop="orderNO">
          <el-input
            v-model="addForm.data.orderNO"
            placeholder=""
            style="width:165px;"
            clearable
            disabled
          >
            <i slot="suffix" class="el-input__icon"></i>
          </el-input>
        </el-form-item>

        <el-form-item label="追加装卸费" v-show="true" prop="loadAddExpense">
          <el-input
            v-model="addForm.data.loadAddExpense"
            placeholder=""
            style="width:165px;"
            clearable
          >
            <i slot="suffix" class="el-input__icon">元</i>
          </el-input>
        </el-form-item>

        <el-form-item label="追加送仓费" v-show="true" prop="stockAddExpense">
          <el-input
            v-model="addForm.data.stockAddExpense"
            placeholder=""
            style="width:165px;"
            clearable
          >
            <i slot="suffix" class="el-input__icon">元</i>
          </el-input>
        </el-form-item>

        <el-form-item label="空跑费" v-show="true" prop="futileExpense">
          <el-input
            v-model="addForm.data.futileExpense"
            placeholder=""
            style="width:165px;"
            clearable
          >
            <i slot="suffix" class="el-input__icon">元</i>
          </el-input>
        </el-form-item>

        <el-form-item label="其他费用" v-show="true" prop="otherExpense">
          <el-input
            v-model="addForm.data.otherExpense"
            placeholder=""
            style="width:165px;"
            clearable
          >
            <i slot="suffix" class="el-input__icon">元</i>
          </el-input>
        </el-form-item>

        <el-form-item label="总追加费用" v-show="true" prop="totalAddExpense">
          <el-input
            v-model="addForm.data.totalAddExpense"
            placeholder=""
            style="width:165px;"
            clearable
            disabled
          >
            <i slot="suffix" class="el-input__icon">元</i>
          </el-input>
        </el-form-item>

        <el-form-item
          label="是否需要电子合同"
          v-show="false"
          prop="needEleContract"
        >
          <el-select
            v-model="addForm.data.needEleContract"
            filterable
            placeholder="请选择是否需要电子合同"
            style="width:165px"
            clearable
          >
            <el-option
              v-for="(item, index) in selectArr.needEleContract"
              :value-key="item.value"
              :key="index"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="电子合同编号" v-show="false" prop="eleContractNo">
          <el-input
            v-model="addForm.data.eleContractNo"
            placeholder=""
            style="width:165px;"
            clearable
          >
            <i slot="suffix" class="el-input__icon"></i>
          </el-input>
        </el-form-item>

        <el-form-item label="类别" v-show="false" prop="flag">
          <el-select
            v-model="addForm.data.flag"
            filterable
            placeholder="请选择类别"
            style="width:165px"
            clearable
          >
            <el-option
              v-for="(item, index) in selectArr.flag"
              :value-key="item.value"
              :key="index"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="推送状态" v-show="false" prop="sendState">
          <el-select
            v-model="addForm.data.sendState"
            filterable
            placeholder="请选择推送状态"
            disabled
            style="width:165px"
            clearable
          >
            <el-option
              v-for="(item, index) in selectArr.sendState"
              :value-key="item.value"
              :key="index"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="备注" v-show="true" prop="remark">
          <el-input
            v-model="addForm.data.remark"
            placeholder=""
            style="width:165px;"
            clearable
          >
            <i slot="suffix" class="el-input__icon"></i>
          </el-input>
        </el-form-item>

        <el-form-item label="创建时间" v-show="false" prop="addDate">
          <el-date-picker
            v-model="addForm.data.addDate"
            type="datetime"
            style="width:165px"
            value-format="yyyy-MM-dd HH:mm:ss"
            placeholder="选择创建时间"
          >
          </el-date-picker>
        </el-form-item>

        <el-form-item label="修改时间" v-show="false" prop="editDate">
          <el-date-picker
            v-model="addForm.data.editDate"
            type="datetime"
            style="width:165px"
            value-format="yyyy-MM-dd HH:mm:ss"
            placeholder="选择修改时间"
          >
          </el-date-picker>
        </el-form-item>

        <el-form-item label="操作人" v-show="false" prop="operatorId">
          <el-input
            v-model="addForm.data.operatorId"
            placeholder=""
            style="width:165px;"
            clearable
          >
            <i slot="suffix" class="el-input__icon"></i>
          </el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <!-- <el-button v-if="dialog.title=='新增用户'" @click="resetForm('addFormRef')">重置</el-button> -->
        <el-button @click="dialog.visible = false">取消</el-button>
        <el-button type="primary" @click="subAddForm()">确 定</el-button>
      </div>
    </el-dialog>
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
  getExpenseDetail,
  addExpenseDetail,
  upExpenseDetail,
  delExpenseDetail,
  addQueueList
} from '@/api/WoMallManagement/addition-fee';

const _ = require('lodash');

export default {
  data() {
    return {
      popoverVisible: {
        batchDelBtn: false
      },
      dialog: {
        title: '追加费用信息',
        visible: false
      },
      selectArr: {
        needEleContract: [
          { label: '需要', value: '0' },
          { label: '不需要', value: '1' }
        ],

        flag: [
          { label: '查询取得的追加费用', value: '1' },
          { label: '维护要推送到平台的追加费用', value: '2' }
        ],

        sendState: [
          { label: '未推送', value: '0' },
          { label: '已推送', value: '1' },
          { label: '已驳回', value: '2' }
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
        id: ''
      },
      addForm: {
        data: {
          id: '',
          orderNO: '',
          loadAddExpense: null,
          stockAddExpense: null,
          futileExpense: null,
          otherExpense: null,
          totalAddExpense: null,
          needEleContract: '',
          eleContractNo: '',
          flag: '1',
          sendState: '0',
          remark: '',
          addDate: '',
          editDate: '',
          operatorId: ''
        },
        config: {
          disabled: false
        },
        rules: {
          id: [],

          orderNO: [
            {
              required: true,
              trigger: 'blur',
              message: '物流订单号不能为空'
            }
          ],

          loadAddExpense: [
            {
              trigger: 'change',
              validator: validateNumber
            }
          ],

          stockAddExpense: [
            {
              trigger: 'change',
              validator: validateNumber
            }
          ],

          futileExpense: [
            {
              trigger: 'change',
              validator: validateNumber
            }
          ],

          otherExpense: [
            {
              trigger: 'change',
              validator: validateNumber
            }
          ],

          totalAddExpense: [
            {
              required: true,
              trigger: 'blur',
              message: '总追加费用不能为空'
            },

            {
              trigger: 'change',
              validator: validateNumber
            }
          ],

          needEleContract: [],

          eleContractNo: [],

          flag: [],

          sendState: [],

          remark: [],

          addDate: [],

          editDate: [],

          operatorId: []
        }
      }
    };
  },
  components: {},
  watch: {
    totalFee: function(val, oldVal) {
      this.addForm.data.totalAddExpense = val;
    }
  },
  computed: {
    selectIds() {
      return this.multipleSelection.map(c => {
        return c.id;
      });
    },

    totalFee() {
      let total =
        this.addForm.data.loadAddExpense -
        0 +
        (this.addForm.data.stockAddExpense - 0) +
        (this.addForm.data.futileExpense - 0) +
        (this.addForm.data.otherExpense - 0);
      total = parseFloat(new Big(total).toFixed(4));
      return total;
    }
  },
  metas: {
    title: '追加费用信息',
    titleTemplate: '%s - 兆航物流TMS后台管理系统',

    totalFee: function(val, oldVal) {
      this.addForm.data.totalAddExpense = val;
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
      getExpenseDetail(data)
        .then(res => {
          if (res.data.resultCode == 1) {
            let cols =
              '物流订单号,追加装卸费,追加送仓费,空跑费,其他费用,总追加费用,是否需要电子合同,电子合同编号,类别,推送状态,备注,创建时间,修改时间,操作人';
            let fields =
              'orderNO,loadAddExpense,stockAddExpense,futileExpense,otherExpense,totalAddExpense,needEleContractDesc,eleContractNo,flagDesc,sendStateDesc,remark,addDate,editDate,operatorId';
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
      getExpenseDetail(
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
            for (let item of data) {
              if (
                !isNaN(item.loadAddExpense) &&
                item.loadAddExpense !== '' &&
                item.loadAddExpense !== null
              ) {
                let loadAddExpense = new Big(item.loadAddExpense || 0);
                item.loadAddExpense = parseFloat(loadAddExpense.toFixed(4));
              }

              if (
                !isNaN(item.stockAddExpense) &&
                item.stockAddExpense !== '' &&
                item.stockAddExpense !== null
              ) {
                let stockAddExpense = new Big(item.stockAddExpense || 0);
                item.stockAddExpense = parseFloat(stockAddExpense.toFixed(4));
              }

              if (
                !isNaN(item.futileExpense) &&
                item.futileExpense !== '' &&
                item.futileExpense !== null
              ) {
                let futileExpense = new Big(item.futileExpense || 0);
                item.futileExpense = parseFloat(futileExpense.toFixed(4));
              }

              if (
                !isNaN(item.otherExpense) &&
                item.otherExpense !== '' &&
                item.otherExpense !== null
              ) {
                let otherExpense = new Big(item.otherExpense || 0);
                item.otherExpense = parseFloat(otherExpense.toFixed(4));
              }

              if (
                !isNaN(item.totalAddExpense) &&
                item.totalAddExpense !== '' &&
                item.totalAddExpense !== null
              ) {
                let totalAddExpense = new Big(item.totalAddExpense || 0);
                item.totalAddExpense = parseFloat(totalAddExpense.toFixed(4));
              }
            }
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

    handleCreateBtnClickFunc() {
      this.dialog.visible = true;
      this.dialog.title = '新增追加费用信息';
      this.dialog.status = 0;
      this.addForm.config.disabled = false;
    },
    submitAddData(data) {
      addExpenseDetail(data).then(res => {
        if (res.data.resultCode === 1) {
          // this.dialogTableVisible = false;
          this.searchFormMethod();
          this.addForm.data.id = res.data.data;
          //this.resetAddForm();
          this.dialog.title = '编辑快递线路成本价格';
          this.dialog.status = 1;
          this.addForm.config.disabled = true;
          Message({
            message: '新增成功',
            type: 'success',
            duration: 3 * 1000
          });
        } else {
          Message({
            message: res.data.message,
            type: 'error',
            duration: 3 * 1000
          });
        }
      });
    },

    handleBatchDelBtnClickFunc() {
      if (!(this.selectIds && this.selectIds.length)) {
        this.popoverVisible.batchDelBtn = false;
        return Message({
          message: '请至少选择一行数据',
          type: 'error',
          duration: 3 * 1000
        });
      }
      delExpenseDetail(this.selectIds)
        .then(res => {
          if (res.data.resultCode === 1) {
            this.searchFormMethod();
            Message({
              message: '操作成功',
              type: 'success',
              duration: 3 * 1000
            });
            this.popoverVisible.batchDelBtn = false;
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

    handleBatchApprovalBtnClickFunc() {
      if (!(this.selectIds && this.selectIds.length)) {
        this.popoverVisible.batchApprovalBtn = false;
        this.popoverVisible.batchReApprovalBtn = false;
        return Message({
          message: '请至少选择一行数据',
          type: 'error',
          duration: 3 * 1000
        });
      }
      this.changeAudit(1);
    },
    changeAudit(checkState) {
      let data = {
        checkState: checkState,
        id: this.selectIds
      };
      undefined(data)
        .then(res => {
          if (res.data.resultCode === 1) {
            // this.dialogTableVisible = false;
            this.searchFormMethod();
            Message({
              message: '操作成功',
              type: 'success',
              duration: 3 * 1000
            });
            this.popoverVisible.batchReApprovalBtn = false;
            this.popoverVisible.batchApprovalBtn = false;
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

    handleBatchReApprovalBtnClickFunc() {
      if (!(this.selectIds && this.selectIds.length)) {
        return Message({
          message: '请至少选择一行数据',
          type: 'error',
          duration: 3 * 1000
        });
      }
      this.changeAudit(0);
    },

    submitEditData(data) {
      upExpenseDetail(data).then(res => {
        if (res.data.resultCode == 1) {
          this.searchFormMethod();
          Message({
            message: '修改成功',
            type: 'success',
            duration: 3 * 1000
          });
        } else {
          return Message({
            message: res.data.message,
            type: 'error',
            duration: 3 * 1000
          });
        }
      });
    },
    addEditDialogCloseFunc() {
      this.resetForm('addFormRef');
    },
    handleEditBtnClickFunc(row) {
      this.dialog.visible = true;
      this.dialog.title = '编辑追加费用信息';
      this.dialog.status = 1;
      this.addForm.config.disabled = true;
      this.addForm.data.id = row.id;

      getExpenseDetail({
        id: row.id || -1
      }).then(res => {
        if (res.data.resultCode === 1) {
          let data = res.data.data;
          for (let item of data) {
            if (
              !isNaN(item.loadAddExpense) &&
              item.loadAddExpense !== '' &&
              item.loadAddExpense !== null
            ) {
              let loadAddExpense = new Big(item.loadAddExpense || 0);
              item.loadAddExpense = parseFloat(loadAddExpense.toFixed(4));
            }

            if (
              !isNaN(item.stockAddExpense) &&
              item.stockAddExpense !== '' &&
              item.stockAddExpense !== null
            ) {
              let stockAddExpense = new Big(item.stockAddExpense || 0);
              item.stockAddExpense = parseFloat(stockAddExpense.toFixed(4));
            }

            if (
              !isNaN(item.futileExpense) &&
              item.futileExpense !== '' &&
              item.futileExpense !== null
            ) {
              let futileExpense = new Big(item.futileExpense || 0);
              item.futileExpense = parseFloat(futileExpense.toFixed(4));
            }

            if (
              !isNaN(item.otherExpense) &&
              item.otherExpense !== '' &&
              item.otherExpense !== null
            ) {
              let otherExpense = new Big(item.otherExpense || 0);
              item.otherExpense = parseFloat(otherExpense.toFixed(4));
            }

            if (
              !isNaN(item.totalAddExpense) &&
              item.totalAddExpense !== '' &&
              item.totalAddExpense !== null
            ) {
              let totalAddExpense = new Big(item.totalAddExpense || 0);
              item.totalAddExpense = parseFloat(totalAddExpense.toFixed(4));
            }
          }
          if (data.length > 0) {
            data = data[0];
          } else {
            console.log('获取数据失败');
            return;
          }

          this.addForm.data = data;
        }
      });
    },

    sortChangeFunc(obj) {
      this.tables.postParams.orderDirection = obj.order;
      this.tables.postParams.orderProp = obj.prop;
      this.searchFormMethod(1, false);
    },

    handleGetAdditionFeeBtnClickFunc() {
      this.getAdditionFee();
    },

    handlePushToWoMallBtnClickFunc() {
      this.pushToWoMall();
    },

    handleConfirmAdditionFeeBtnClickFunc() {
      this.confirmAdditionFee();
    },

    getAdditionFee() {
      let data = {
        interfaceId: '2.13',
        interfaceName: '查看追加费用接口',
        paramId: this.$route.params.orderNO
      };
      this.pushMsg(data);
    },

    pushToWoMall(a, b) {
      if (!(this.selectIds && this.selectIds.length)) {
        return Message({
          message: '请至少选择一行数据',
          type: 'error',
          duration: 3 * 1000
        });
      }
      let data = {
        interfaceId: '2.15',
        interfaceName: '推送追加费用接口',
        paramId: this.selectIds.join(',')
      };
      this.pushMsg(data);
    },

    confirmAdditionFee() {
      let data = {
        interfaceId: '2.14',
        interfaceName: '追加费用确认接口',
        paramId: this.$route.params.orderNO
      };
      this.pushMsg(data);
    },

    pushMsg(data) {
      addQueueList(data)
        .then(res => {
          if (res.data.resultCode == 1) {
            return Message({
              message: '操作成功，请稍后在消息推送列表中查看结果',
              type: 'success',
              duration: 3 * 1000
            });
          } else {
            return Message({
              message: res.data.message,
              type: 'error',
              duration: 3 * 1000
            });
          }
        })
        .catch(err => {
          return Message({
            message: err,
            type: 'error',
            duration: 3 * 1000
          });
        });
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
    this.addForm.data.orderNO = this.$route.params.orderNO;
    this.searchForm.orderNO = this.$route.params.orderNO;
    this.handleQueryBtnClickFunc();
  },
  mounted() {
    this.setTableMaxHeight();

    this.addForm.data.orderNO = this.$route.params.orderNO;
    this.searchForm.orderNO = this.$route.params.orderNO;
    this.handleQueryBtnClickFunc();
  },
  created() {},
  beforeRouteLeave(to, from, next) {
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
.dialog-content {
}
</style>
