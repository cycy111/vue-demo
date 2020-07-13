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

        <el-form-item v-show="true" prop="orderNO">
          <el-input
            v-model="searchForm.orderNO"
            placeholder="请输入物流订单号"
            style="width:150px;"
            clearable
          ></el-input>
        </el-form-item>

        <el-form-item v-show="true" prop="expressNo">
          <el-input
            v-model="searchForm.expressNo"
            placeholder="请输入快递单号"
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

        <el-form-item v-show="showReserve">
          <el-button
            type="primary"
            size="small"
            @click="handlePushToWoMallBtnClickFunc()"
            ><i class="iconfont el-icon-upload"></i>推送预约信息</el-button
          >
        </el-form-item>

        <el-form-item v-show="showWeight">
          <el-button
            type="primary"
            size="small"
            @click="handlePushWeightToWoMallBtnClickFunc()"
            ><i class="iconfont el-icon-upload"></i>推送实际重量</el-button
          >
        </el-form-item>

        <el-form-item>
          <el-button
            type="success"
            size="small"
            @click="handleGenTmsShipmentClickFunc()"
            ><i class="iconfont el-icon-s-promotion"></i
            >生成TMS运输单</el-button
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

      <el-table-column prop="id" label="唯一编号" width="120"></el-table-column>

      <el-table-column
        prop="orderNO"
        label="物流订单号"
        width="140"
      ></el-table-column>

      <el-table-column
        prop="expressNo"
        label="快递单号"
        width="120"
      ></el-table-column>

      <el-table-column
        prop="courierPhone"
        label="上门快递员电话"
        width="120"
      ></el-table-column>

      <el-table-column
        prop="courierName"
        label="上门快递员姓名"
        width="120"
      ></el-table-column>

      <el-table-column prop="heavy" label="重量(kg)" width="120">
        <template slot-scope="scope">
          <span v-show="scope.row.heavy">
            <span class="col-content">{{ scope.row.heavy }}</span
            ><span class="col-suffix">{{ 'kg' }}</span>
          </span>
        </template>
      </el-table-column>

      <el-table-column
        prop="arriveTime"
        label="上门时间"
        width="140"
      ></el-table-column>

      <el-table-column
        prop="goodsArriveTime"
        label="预计到货时间"
        width="140"
      ></el-table-column>

      <el-table-column
        prop="deliveryModeDesc"
        label="发货方式"
        width="120"
      ></el-table-column>

      <el-table-column
        prop="sendStateDesc"
        label="推送状态"
        width="120"
      ></el-table-column>

      <el-table-column prop="remark" label="备注" width="200"></el-table-column>

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

        <el-form-item label="快递单号" v-show="true" prop="expressNo">
          <el-input
            v-model="addForm.data.expressNo"
            placeholder=""
            style="width:165px;"
            clearable
          >
            <i slot="suffix" class="el-input__icon"></i>
          </el-input>
        </el-form-item>

        <el-form-item label="上门快递员电话" v-show="true" prop="courierPhone">
          <el-input
            v-model="addForm.data.courierPhone"
            placeholder=""
            style="width:165px;"
            clearable
          >
            <i slot="suffix" class="el-input__icon"></i>
          </el-input>
        </el-form-item>

        <el-form-item label="上门快递员姓名" v-show="true" prop="courierName">
          <el-input
            v-model="addForm.data.courierName"
            placeholder=""
            style="width:165px;"
            clearable
          >
            <i slot="suffix" class="el-input__icon"></i>
          </el-input>
        </el-form-item>

        <el-form-item label="重量(kg)" v-show="true" prop="heavy">
          <el-input
            v-model="addForm.data.heavy"
            placeholder=""
            style="width:165px;"
            clearable
          >
            <i slot="suffix" class="el-input__icon">kg</i>
          </el-input>
        </el-form-item>

        <el-form-item label="上门时间" v-show="true" prop="arriveTime">
          <el-date-picker
            v-model="addForm.data.arriveTime"
            type="datetime"
            style="width:165px"
            value-format="yyyy-MM-dd HH:mm:ss"
            placeholder="选择上门时间"
          >
          </el-date-picker>
        </el-form-item>

        <el-form-item label="预计到货时间" v-show="true" prop="goodsArriveTime">
          <el-date-picker
            v-model="addForm.data.goodsArriveTime"
            type="datetime"
            style="width:165px"
            value-format="yyyy-MM-dd HH:mm:ss"
            placeholder="选择预计到货时间"
          >
          </el-date-picker>
        </el-form-item>

        <el-form-item label="发货方式）" v-show="true" prop="deliveryMode">
          <el-select
            v-model="addForm.data.deliveryMode"
            filterable
            placeholder="请选择发货方式）"
            style="width:165px"
            clearable
          >
            <el-option
              v-for="(item, index) in selectArr.deliveryMode"
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

        <el-form-item label="创建时间" v-show="true" prop="addDate">
          <el-date-picker
            v-model="addForm.data.addDate"
            type="datetime"
            style="width:165px"
            value-format="yyyy-MM-dd HH:mm:ss"
            disabled
            placeholder="选择创建时间"
          >
          </el-date-picker>
        </el-form-item>

        <el-form-item label="修改时间" v-show="true" prop="editDate">
          <el-date-picker
            v-model="addForm.data.editDate"
            type="datetime"
            style="width:165px"
            value-format="yyyy-MM-dd HH:mm:ss"
            disabled
            placeholder="选择修改时间"
          >
          </el-date-picker>
        </el-form-item>

        <el-form-item label="操作人" v-show="true" prop="operatorId">
          <el-input
            v-model="addForm.data.operatorId"
            placeholder=""
            style="width:165px;"
            clearable
            disabled
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
  getTakeCargo,
  addTakeCargo,
  upTakeCargo,
  delTakeCargo,
  genTmsShipment,
  getOrderCargo,
  getOrderUser,
  getLogisticsOrder,
  addQueueList,
  getAreaList
} from '@/api/WoMallManagement/take-cargo-info';

const _ = require('lodash');

export default {
  data() {
    return {
      popoverVisible: {
        batchDelBtn: false
      },
      dialog: {
        title: '取件信息',
        visible: false
      },
      selectArr: {
        deliveryMode: [
          { label: '快递', value: '1' },
          { label: '零担', value: '2' }
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
        id: '',
        orderNO: '',
        expressNo: ''
      },
      addForm: {
        data: {
          id: '',
          orderNO: '',
          expressNo: '',
          courierPhone: '',
          courierName: '',
          heavy: '',
          arriveTime: '',
          goodsArriveTime: '',
          deliveryMode: '',
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

          expressNo: [
            {
              required: true,
              trigger: 'blur',
              message: '快递单号不能为空'
            }
          ],

          courierPhone: [
            {
              required: true,
              trigger: 'blur',
              message: '上门快递员电话不能为空'
            }
          ],

          courierName: [
            {
              required: true,
              trigger: 'blur',
              message: '上门快递员姓名不能为空'
            }
          ],

          heavy: [],

          arriveTime: [
            {
              required: true,
              trigger: 'blur',
              message: '上门时间不能为空'
            }
          ],

          goodsArriveTime: [
            {
              required: true,
              trigger: 'blur',
              message: '预计到货时间不能为空'
            }
          ],

          deliveryMode: [
            {
              required: true,
              trigger: 'blur',
              message: '发货方式）不能为空'
            }
          ],

          sendState: [
            {
              required: true,
              trigger: 'blur',
              message: '推送状态不能为空'
            }
          ],

          remark: [],

          addDate: [],

          editDate: [],

          operatorId: []
        }
      },
      orderInfo: {},
      showReserve: false,
      showWeight: false
    };
  },
  components: {},
  watch: {
    'orderInfo.operateStateDesc': function(val, oldVal) {
      if (val == '接收确认') {
        this.showReserve = true;
      } else {
        this.showReserve = false;
      }
      if (val != '新增' && val != '拒绝接收' && val != '已取消订单') {
        this.showWeight = true;
      } else {
        this.showWeight = false;
      }
    }
  },
  computed: {
    selectIds() {
      return this.multipleSelection.map(c => {
        return c.id;
      });
    }
  },
  metas: {
    title: '取件信息',
    titleTemplate: '%s - 兆航物流TMS后台管理系统',

    'orderInfo.operateStateDesc': function(val, oldVal) {
      if (val == '接收确认') {
        this.showReserve = true;
      } else {
        this.showReserve = false;
      }
      if (val != '新增' && val != '拒绝接收' && val != '已取消订单') {
        this.showWeight = true;
      } else {
        this.showWeight = false;
      }
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
      getTakeCargo(data)
        .then(res => {
          if (res.data.resultCode == 1) {
            let cols =
              '唯一编号,物流订单号,快递单号,上门快递员电话,上门快递员姓名,重量(kg),上门时间,预计到货时间,发货方式,推送状态,备注,创建时间,修改时间,操作人';
            let fields =
              'id,orderNO,expressNo,courierPhone,courierName,heavy,arriveTime,goodsArriveTime,deliveryModeDesc,sendStateDesc,remark,addDate,editDate,operatorId';
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
      getTakeCargo(
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
                !isNaN(item.heavy) &&
                item.heavy !== '' &&
                item.heavy !== null
              ) {
                let heavy = new Big(item.heavy || 0);
                item.heavy = parseFloat(heavy.toFixed(3));
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
      this.dialog.title = '新增取件信息';
      this.dialog.status = 0;
      this.addForm.config.disabled = false;
    },
    submitAddData(data) {
      addTakeCargo(data).then(res => {
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
      delTakeCargo(this.selectIds)
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
      upTakeCargo(data).then(res => {
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
      this.dialog.title = '编辑取件信息';
      this.dialog.status = 1;
      this.addForm.config.disabled = true;
      this.addForm.data.id = row.id;

      getTakeCargo({
        id: row.id || -1
      }).then(res => {
        if (res.data.resultCode === 1) {
          let data = res.data.data;
          for (let item of data) {
            if (
              !isNaN(item.heavy) &&
              item.heavy !== '' &&
              item.heavy !== null
            ) {
              let heavy = new Big(item.heavy || 0);
              item.heavy = parseFloat(heavy.toFixed(3));
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

    handlePushToWoMallBtnClickFunc() {
      this.pushToWoMall();
    },

    handlePushWeightToWoMallBtnClickFunc() {
      this.pushWeightToWoMall();
    },

    handleGenTmsShipmentClickFunc() {
      this.genTmsShipment();
    },

    pushToWoMall(a, b) {
      if (!(this.selectIds && this.selectIds.length == 1)) {
        return Message({
          message: '请选择一行数据',
          type: 'error',
          duration: 3 * 1000
        });
      }
      let data = {
        interfaceId: '2.9',
        interfaceName: '预约上门信息推送接口',
        paramId: this.selectIds.join(',')
      };
      this.pushMsg(data);
    },

    pushWeightToWoMall(a, b) {
      if (!(this.selectIds && this.selectIds.length == 1)) {
        return Message({
          message: '请选择一行数据',
          type: 'error',
          duration: 3 * 1000
        });
      }
      if (!this.multipleSelection[0].heavy > 0) {
        return Message({
          message: '重量必须大于0',
          type: 'error',
          duration: 3 * 1000
        });
      }
      let data = {
        interfaceId: '2.10',
        interfaceName: '物流商回传物流单实际信息接口',
        paramId: this.selectIds.join(',')
      };
      this.pushMsg(data);
    },

    genTmsShipment() {
      if (!(this.selectIds && this.selectIds.length == 1)) {
        return Message({
          message: '请选择一行数据',
          type: 'error',
          duration: 3 * 1000
        });
      }
      let data = {
        orderNO: this.$route.params.orderNO || -1,
        pageIndex: 1,
        pageSize: 20000
      };
      Promise.all([getOrderCargo(data), getOrderUser(data), getAreaList(data)])
        .then(([res1, res2, res3]) => {
          if (res1.data.resultCode != 1) {
            return Message({
              message: '获取数据失败，请重试',
              type: 'error',
              duration: 3 * 1000
            });
          }
          if (res2.data.resultCode != 1) {
            return Message({
              message: '获取数据失败，请重试',
              type: 'error',
              duration: 3 * 1000
            });
          }
          if (res3.data.resultCode != 1) {
            return Message({
              message: '获取数据失败，请重试',
              type: 'error',
              duration: 3 * 1000
            });
          }
          let row = this.multipleSelection[0];
          let ordClass = row.deliveryMode == '1' ? '1271' : '1270';
          let fromUser = _.find(res2.data.data, function(c) {
            return c.flagDesc == '寄件人';
          });
          if (!fromUser) {
            return Message({
              message: '没有找到寄件人信息',
              type: 'error',
              duration: 3 * 1000
            });
          }
          let toUser = _.find(res2.data.data, function(c) {
            return c.flagDesc == '收件人';
          });
          if (!toUser) {
            return Message({
              message: '没有找到寄件人信息',
              type: 'error',
              duration: 3 * 1000
            });
          }
          //根据areaId获取收寄件人的省市
          if (!(res3.data.data && res3.data.data.length)) {
            return Message({
              message: '没有找到地址信息',
              type: 'error',
              duration: 3 * 1000
            });
          }
          let areas = res3.data.data;
          let fromCity = _.find(areas, function(c) {
            return c.id == fromUser.areaId;
          });
          let toCity = _.find(areas, function(c) {
            return c.id == toUser.areaId;
          });
          var goods = res1.data.data.map(c => {
            return {
              productNo: 'LT' + _.padStart(c.id, 6, '0'),
              productName: c.cargoName,
              orderQty: c.amount,
              length: c.mostLength,
              width: c.mostWidth,
              height: c.mostHigh
            };
          });
          let data = {
            ordBusinessName: '联通商城',
            ordNo: this.$route.params.orderNO,
            ordWeight: row.heavy,
            ordClass: ordClass,
            ordFromCity: fromCity.name,
            ordFromAddress: fromUser.areaInfo,
            ordToCity: toCity.name,
            ordToAddress: toUser.areaInfo,
            ordFromCname: fromUser.userName,
            ordFromCtel: fromUser.phone,
            ordToCname: toUser.userName,
            ordToCtel: toUser.phone,
            products: goods
          };
          genTmsShipment(data)
            .then(res => {
              if (res.data.resultCode == 1) {
                return Message({
                  message: '生成成功',
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
        })
        .catch(err => {
          return Message({
            message: err,
            type: 'error',
            duration: 3 * 1000
          });
        });
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
    getLogisticsInfo() {
      let orderNO = this.$route.params.orderNO || -1;
      let data = _.assign({ pageIndex: 1, pageSize: 1 }, { orderNO: orderNO });
      getLogisticsOrder(data)
        .then(res => {
          if (res.data.resultCode == 1) {
            let data = res.data.data;
            if (data && data.length) {
              this.orderInfo = data[0];
            }
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
    this.searchForm.orderNO = this.$route.params.orderNO;
    this.addForm.data.orderNO = this.$route.params.orderNO;
    this.handleQueryBtnClickFunc();
    this.getLogisticsInfo();
  },
  mounted() {
    this.setTableMaxHeight();

    this.searchForm.orderNO = this.$route.params.orderNO;
    this.addForm.data.orderNO = this.$route.params.orderNO;
    this.handleQueryBtnClickFunc();
    this.getLogisticsInfo();
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
