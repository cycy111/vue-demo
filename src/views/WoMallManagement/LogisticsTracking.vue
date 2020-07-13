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
        <el-form-item v-show="false" prop="id">
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

      <el-table-column prop="id" label="唯一ID" width="120"></el-table-column>

      <el-table-column
        prop="orderNO"
        label="物流单号"
        width="140"
      ></el-table-column>

      <el-table-column
        prop="msgTime"
        label="操作时间"
        width="140"
      ></el-table-column>

      <el-table-column
        prop="content"
        label="  配送内容"
        width="120"
      ></el-table-column>

      <el-table-column
        prop="isDeliveredDesc"
        label="是否妥投"
        width="120"
      ></el-table-column>

      <el-table-column
        prop="remark"
        label="  备注"
        width="200"
      ></el-table-column>

      <el-table-column
        prop="addDate"
        label="  创建时间"
        width="140"
      ></el-table-column>

      <el-table-column
        prop="editDate"
        label="  修改时间"
        width="140"
      ></el-table-column>

      <el-table-column
        prop="operatorId"
        label="  操作人"
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
        <el-form-item label="物流单号" v-show="true" prop="orderNO">
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

        <el-form-item label="操作时间" v-show="true" prop="msgTime">
          <el-date-picker
            v-model="addForm.data.msgTime"
            type="datetime"
            style="width:165px"
            value-format="yyyy-MM-dd HH:mm:ss"
            placeholder="选择操作时间"
          >
          </el-date-picker>
        </el-form-item>

        <el-form-item label="配送内容" v-show="true" prop="content">
          <el-input
            v-model="addForm.data.content"
            placeholder=""
            style="width:165px;"
            clearable
          >
            <i slot="suffix" class="el-input__icon"></i>
          </el-input>
        </el-form-item>

        <el-form-item label="是否妥投" v-show="true" prop="isDelivered">
          <el-select
            v-model="addForm.data.isDelivered"
            filterable
            placeholder="请选择是否妥投"
            style="width:165px"
            clearable
          >
            <el-option
              v-for="(item, index) in selectArr.isDelivered"
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
  getOrderTrack,
  addOrderTrack,
  upOrderTrack,
  delOrderTrack,
  addQueueList
} from '@/api/WoMallManagement/logistics-tracking';

const _ = require('lodash');

export default {
  data() {
    return {
      popoverVisible: {
        batchDelBtn: false
      },
      dialog: {
        title: '物流追踪信息',
        visible: false
      },
      selectArr: {
        isDelivered: [
          { label: '否', value: '0' },
          { label: '是', value: '1' }
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
        orderNO: ''
      },
      addForm: {
        data: {
          orderNO: '',
          msgTime: '',
          content: '',
          isDelivered: '0',
          remark: '',
          addDate: '',
          editDate: '',
          operatorId: ''
        },
        config: {
          disabled: false
        },
        rules: {
          orderNO: [
            {
              required: true,
              trigger: 'blur',
              message: '物流单号不能为空'
            }
          ],

          msgTime: [
            {
              required: true,
              trigger: 'blur',
              message: '操作时间不能为空'
            }
          ],

          content: [
            {
              required: true,
              trigger: 'blur',
              message: '配送内容不能为空'
            }
          ],

          isDelivered: [
            {
              required: true,
              trigger: 'blur',
              message: '是否妥投不能为空'
            }
          ],

          remark: [],

          addDate: [],

          editDate: [],

          operatorId: []
        }
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
    title: '物流追踪信息',
    titleTemplate: '%s - 兆航物流TMS后台管理系统'
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
      getOrderTrack(data)
        .then(res => {
          if (res.data.resultCode == 1) {
            let cols =
              '唯一ID,物流单号,操作时间,  配送内容,是否妥投,  备注,  创建时间,  修改时间,  操作人';
            let fields =
              'id,orderNO,msgTime,content,isDeliveredDesc,remark,addDate,editDate,operatorId';
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
      getOrderTrack(
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

    handleCreateBtnClickFunc() {
      this.dialog.visible = true;
      this.dialog.title = '新增物流追踪信息';
      this.dialog.status = 0;
      this.addForm.config.disabled = false;
    },
    submitAddData(data) {
      addOrderTrack(data).then(res => {
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
      delOrderTrack(this.selectIds)
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
      upOrderTrack(data).then(res => {
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
      this.dialog.title = '编辑物流追踪信息';
      this.dialog.status = 1;
      this.addForm.config.disabled = true;
      this.addForm.data.id = row.id;

      getOrderTrack({
        id: row.id || -1
      }).then(res => {
        if (res.data.resultCode === 1) {
          let data = res.data.data;

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
  },
  mounted() {
    this.setTableMaxHeight();

    this.searchForm.orderNO = this.$route.params.orderNO;
    this.addForm.data.orderNO = this.$route.params.orderNO;
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
