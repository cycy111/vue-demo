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
        <el-form-item v-show="true" prop="contractNo">
          <el-input
            v-model="searchForm.contractNo"
            placeholder="请输入电子合同编号"
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
            type="primary"
            size="small"
            @click="handlePushGetContractBtnClickFunc()"
            ><i class="iconfont el-icon-upload"></i
            >推送获取电子合同信息</el-button
          >
        </el-form-item>

        <el-form-item>
          <el-button
            type="primary"
            size="small"
            @click="handlePushToWoMallBtnClickFunc()"
            ><i class="iconfont el-icon-upload"></i>推送签署电子合同</el-button
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
      :cell-style="cellStyleFunc"
      @selection-change="
        val => {
          return (this.multipleSelection = val);
        }
      "
      @sort-change="sortChangeFunc"
    >
      <el-table-column
        type="index"
        label="序号"
        width="45"
        fixed
      ></el-table-column>

      <el-table-column
        prop="contractNo"
        label="合同编号"
        width="140"
      ></el-table-column>

      <el-table-column prop="contractContent" label="合同内容" width="120">
        <template slot-scope="scope">
          <a
            href="javascript:void(0);"
            @click="showContent(scope.row.contractContent)"
            >{{ '查看内容' }}</a
          >
        </template>
      </el-table-column>

      <el-table-column
        prop="statusDesc"
        label="状态"
        width="120"
      ></el-table-column>

      <el-table-column
        prop="collectTime"
        label="货物揽收时间"
        width="140"
      ></el-table-column>

      <el-table-column
        prop="arriveTime"
        label="预计到货时间"
        width="140"
      ></el-table-column>

      <el-table-column
        prop="bankName"
        label="开户银行"
        width="120"
      ></el-table-column>

      <el-table-column
        prop="bankAddress"
        label="银行地址"
        width="120"
      ></el-table-column>

      <el-table-column
        prop="userName"
        label="账户名称"
        width="120"
      ></el-table-column>

      <el-table-column
        prop="cardNo"
        label="账户号码"
        width="120"
      ></el-table-column>

      <el-table-column
        prop="postCode"
        label="邮编"
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
        <el-form-item label="合同编号" v-show="true" prop="contractNo">
          <el-input
            v-model="addForm.data.contractNo"
            placeholder=""
            style="width:165px;"
            clearable
            addForm.config.disabled
          >
            <i slot="suffix" class="el-input__icon"></i>
          </el-input>
        </el-form-item>

        <el-form-item label="合同内容" v-show="true" prop="contractContent">
          <el-input
            v-model="addForm.data.contractContent"
            placeholder=""
            style="width:165px;"
            clearable
          >
            <i slot="suffix" class="el-input__icon"></i>
          </el-input>
        </el-form-item>

        <el-form-item label="状态" v-show="true" prop="status">
          <el-select
            v-model="addForm.data.status"
            filterable
            placeholder="请选择状态"
            style="width:165px"
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

        <el-form-item label="货物揽收时间" v-show="true" prop="collectTime">
          <el-date-picker
            v-model="addForm.data.collectTime"
            type="datetime"
            style="width:165px"
            value-format="yyyy-MM-dd HH:mm:ss"
            placeholder="选择货物揽收时间"
          >
          </el-date-picker>
        </el-form-item>

        <el-form-item label="预计到货时间" v-show="true" prop="arriveTime">
          <el-date-picker
            v-model="addForm.data.arriveTime"
            type="datetime"
            style="width:165px"
            value-format="yyyy-MM-dd HH:mm:ss"
            placeholder="选择预计到货时间"
          >
          </el-date-picker>
        </el-form-item>

        <el-form-item label="开户银行" v-show="true" prop="bankName">
          <el-input
            v-model="addForm.data.bankName"
            placeholder=""
            style="width:165px;"
            clearable
          >
            <i slot="suffix" class="el-input__icon"></i>
          </el-input>
        </el-form-item>

        <el-form-item label="银行地址" v-show="true" prop="bankAddress">
          <el-input
            v-model="addForm.data.bankAddress"
            placeholder=""
            style="width:165px;"
            clearable
          >
            <i slot="suffix" class="el-input__icon"></i>
          </el-input>
        </el-form-item>

        <el-form-item label="账户名称" v-show="true" prop="userName">
          <el-input
            v-model="addForm.data.userName"
            placeholder=""
            style="width:165px;"
            clearable
          >
            <i slot="suffix" class="el-input__icon"></i>
          </el-input>
        </el-form-item>

        <el-form-item label="账户号码" v-show="true" prop="cardNo">
          <el-input
            v-model="addForm.data.cardNo"
            placeholder=""
            style="width:165px;"
            clearable
          >
            <i slot="suffix" class="el-input__icon"></i>
          </el-input>
        </el-form-item>

        <el-form-item label="邮编" v-show="true" prop="postCode">
          <el-input
            v-model="addForm.data.postCode"
            placeholder=""
            style="width:165px;"
            clearable
          >
            <i slot="suffix" class="el-input__icon"></i>
          </el-input>
        </el-form-item>

        <el-form-item label="推送状态" v-show="true" prop="sendState">
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

        <el-form-item label="修改时间" v-show="false" prop="editDate">
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

        <el-form-item label="操作人" v-show="false" prop="operatorId">
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
  getEleContract,
  addEleContract,
  upEleContract,
  delEleContract,
  addQueueList
} from '@/api/WoMallManagement/electronic-contract';

const _ = require('lodash');

export default {
  data() {
    return {
      popoverVisible: {},
      dialog: {
        title: '电子合同信息',
        visible: false
      },
      selectArr: {
        status: [
          { label: '未签署', value: '0' },
          { label: '已签署', value: '1' }
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
        contractNo: ''
      },
      addForm: {
        data: {
          contractNo: '',
          contractContent: '',
          status: '0',
          collectTime: '',
          arriveTime: '',
          bankName: '',
          bankAddress: '',
          userName: '',
          cardNo: '',
          postCode: '',
          sendState: '0',
          remark: '',
          editDate: '',
          operatorId: ''
        },
        config: {
          disabled: false
        },
        rules: {
          contractNo: [
            {
              required: true,
              trigger: 'blur',
              message: '合同编号不能为空'
            }
          ],

          contractContent: [],

          status: [],

          collectTime: [],

          arriveTime: [],

          bankName: [],

          bankAddress: [],

          userName: [],

          cardNo: [
            {
              trigger: 'change',
              validator: validateNumber
            }
          ],

          postCode: [],

          sendState: [],

          remark: [],

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
        return c.contractNo;
      });
    }
  },
  metas: {
    title: '电子合同信息',
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
      getEleContract(data)
        .then(res => {
          if (res.data.resultCode == 1) {
            let cols =
              '合同编号,合同内容,状态,货物揽收时间,预计到货时间,开户银行,银行地址,账户名称,账户号码,邮编,推送状态,备注,创建时间,修改时间,操作人';
            let fields =
              'contractNo,contractContent,statusDesc,collectTime,arriveTime,bankName,bankAddress,userName,cardNo,postCode,sendStateDesc,remark,addDate,editDate,operatorId';
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
      getEleContract(
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
                  contractNo: item.contractNo
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
      this.dialog.title = '新增电子合同信息';
      this.dialog.status = 0;
      this.addForm.config.disabled = false;
    },
    submitAddData(data) {
      addEleContract(data).then(res => {
        if (res.data.resultCode === 1) {
          // this.dialogTableVisible = false;
          this.searchFormMethod();
          this.addForm.data.contractNo = res.data.data;
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
      delEleContract(this.selectIds)
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
        ids: this.selectIds
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
      upEleContract(data).then(res => {
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
      this.dialog.title = '编辑电子合同信息';
      this.dialog.status = 1;
      this.addForm.config.disabled = true;
      this.addForm.data.contractNo = row.contractNo;

      getEleContract({
        contractNo: row.contractNo || -1
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

    handlePushGetContractBtnClickFunc() {
      this.pushGetContract();
    },

    handlePushToWoMallBtnClickFunc() {
      this.pushToWoMall();
    },

    pushGetContract() {
      let data = {
        interfaceId: '2.11',
        interfaceName: '电子合同查询接口',
        paramId: this.$route.params.orderNO
      };
      this.pushMsg(data);
    },

    pushToWoMall(a, b) {
      let obj = this.tables.tableData && this.tables.tableData[0];
      if (!(obj && obj.contractNo)) {
        return Message({
          message: '没有合同信息',
          type: 'error',
          duration: 3 * 1000
        });
      }
      let data = {
        interfaceId: '2.12',
        interfaceName: '电子合同签署接口',
        paramId: obj.contractNo
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
    showContent(content) {
      console.log(content);
      this.$alert(content, '合同内容', {
        dangerouslyUseHTMLString: true,
        customeClass: 'big-message-box'
      });
    },
    cellStyleFunc(obj) {
      if (obj.columnIndex === 3) {
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
    this.searchForm.orderNO = this.$route.params.orderNO;
    this.handleQueryBtnClickFunc();
  },
  mounted() {
    this.setTableMaxHeight();

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

.big-message-box .el-message-box__wrapper .el-message-box {
  width: 80%;
}
.big-message-box .el-message-box__wrapper .el-message-box__content {
  max-height: 500px;
  overflow: auto;
}
</style>
