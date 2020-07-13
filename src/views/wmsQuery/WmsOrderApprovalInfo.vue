<template>
  <div class="app-container audit-info" :style="{maxHeight:maxHeight+'px'}">
    <el-form
      :inline="true"
      :model="approvalForm"
      ref="auditFormRef"
      size="small"
      class="search-form"
    >
      <el-form-item>
        <el-button type="default" size="small" @click="handleBackBtnClickFunc()"
          ><i class="iconfont el-icon-back"></i>返回</el-button
        >
      </el-form-item>
      <el-form-item>
        <el-button
          type="primary"
          v-show="isCheckShow && isCheckShow != 'false'"
          @click="handleApprovalFunc()"
          >通过</el-button
        >
      </el-form-item>
      <el-form-item>
        <el-button
          type="danger"
          v-show="isRejectShow && isRejectShow != 'false'"
          @click="handleRejectFunc()"
          >驳回</el-button
        >
      </el-form-item>
    </el-form>
    <div class="infos">
      <div class="infos-item" v-for="(item, index) in column" :key="index">
        <div class="m-label">{{ item.label + '：' }}</div>
        <div class="m-text">
          {{ infos[item.name] }}
        </div>
      </div>
    </div>
    <el-table
      ref="multipleTable"
      border
      
      :data="tables.tableData"
      tooltip-effect="dark"
      size="mini"
    >
      <el-table-column
        type="index"
        label="序号"
        width="45"
        fixed
      ></el-table-column>
      <el-table-column
        prop="productCode"
        label="物资编号"
        width="120"
      ></el-table-column>
      <el-table-column
        prop="productName"
        label="物资名称"
        width="120"
      ></el-table-column>
      <el-table-column
        prop="kcQty"
        label="库存数量"
        width="120"
      ></el-table-column>
      <el-table-column
        prop="supplier"
        label="供应商"
        width="180"
      ></el-table-column>
      <el-table-column
        prop="location"
        label="储位"
        width="120"
      ></el-table-column>
      <el-table-column
        prop="productUnit"
        label="单位"
        width="120"
      ></el-table-column>
      <el-table-column prop="remark" label="备注" width="120"></el-table-column>
      <el-table-column prop="site" label="站点" width="120"></el-table-column>
      <!-- <el-table-column
        prop="proSeqno"
        label="mis单号"
        width="120"
      ></el-table-column>
      <el-table-column
        prop="spcModel"
        label="规格"
        width="120"
      ></el-table-column>
      <el-table-column prop="price" label="价格" width="120"></el-table-column> -->
      <el-table-column
        prop="partQty"
        label="领用数量"
        width="120"
      ></el-table-column>
    </el-table>

    <h3>审核日志：</h3>
    <el-table
      ref="multipleTable2"
      :max-height="'300px'"
      border
      :data="auditLog"
      tooltip-effect="dark"
      :cell-style="{ 'text-align': 'center' }"
      size="mini"
    >
      <el-table-column type="index" label="序号" width="60"></el-table-column>
      <el-table-column
        prop="checkUserCode"
        label="审批人"
        width="150"
      ></el-table-column>
      <el-table-column
        prop="checkStatus"
        label="审批状态"
        width="150"
      ></el-table-column>
      <el-table-column
        prop="comments"
        label="审批意见"
        width="120"
      ></el-table-column>
      <el-table-column
        prop="checkDate"
        label="审批时间"
        width="150"
      ></el-table-column>
    </el-table>
  </div>
</template>

<script>
import { Message, ColorPicker } from 'element-ui';
import messages from '@/utils/messages';
import Big from 'big.js';
import '@/styles/custom.scss';
import { getKpiInfo } from '@/api/yuebao/kpiBase';
import {
  updateApply,
  updateReject,
  getCheckHistory,
  getOutStorageDt,
  getOutStorageList
} from '@/api/wmsQuery/wms-order-approval';
export default {
  name: 'wmsOrderApproval',
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
      approvalForm: {
        checkSuggest: ''
      },
      maxHeight: document.body.clientHeight - 84,
      column: [
        { name: 'docEntry', label: '来源单号' },
        { name: 'outType', label: '出库类型' },
        { name: 'assCode', label: '出库单据编号' },
        { name: 'outStatus', label: '出库状态' },
        { name: 'projectCode', label: '项目编号' },
        { name: 'projectName', label: '项目名称' },
        { name: 'outOrz', label: '组织' },
        { name: 'productType', label: '物资类型' },
        { name: 'dliveryType', label: '配送方式' },
        { name: 'accountant', label: '帐务员' },
        { name: 'enComCode', label: '施工单位' },
        { name: 'enComName', label: '施工单位名称' },
        { name: 'docDate', label: '单据时间' },
        { name: 'recAddress', label: '收货地址' },
        { name: 'reciever', label: '收货人' },
        { name: 'checkStatus', label: '审批状态' },
        { name: 'currentCheckUser', label: '当前处理人' },
        { name: 'checkComments', label: '最后审批意见' },
        { name: 'remark', label: '备注' }
      ],
      infos: {},
      orderStatus: [
        { value: -1, text: '全部' },
        { value: 0, text: '未审批' },
        { value: 1, text: '已审批' },
        { value: 2, text: '驳回' }
      ],
      auditLog: [],
      outCode: '',
      outStatus: '',
      ledCheckStatus: '',
      docEntry: '',
      isCheckShow: false,
      isRejectShow: false,
      errTimeout: {}
    };
  },
  computed: {
    deptCode() {
      return this.$store.getters.deptCode;
    }
  },
  methods: {
    searchFormMethod(currentPage) {
      if (currentPage) {
        this.tables.postParams.currentPage = currentPage;
      }
      getOutStorageDt({
        docEntry: this.docEntry,
        deptCode: this.deptCode
      })
        .then(res => {
          if (res.data.resultCode == 1) {
            if (res.data.data && res.data.data.length) {
              var data = res.data.data[0];
              this.infos = data;
              this.tables.tableData = data.dt;
            } else {
              return Message({
                message: '没有找到相关数据',
                type: 'error',
                duration: 2 * 1000
              });
            }
          } else {
            return Message({
              message: res.data.message,
              type: 'error',
              duration: 2 * 1000
            });
          }
        })
        .catch(err => {
          return Message({
            message: err,
            type: 'error',
            duration: 2 * 1000
          });
        });
    },
    getAuditLog() {
      let data = { docEntry: this.docEntry, deptCode: this.deptCode };
      getCheckHistory(data)
        .then(res => {
          if (res.data.resultCode == 1) {
            let data = res.data.data;
            this.auditLog = data;
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
      if (this.$refs[formName]) {
        this.$refs[formName].resetFields();
      }
    },
    handleApprovalFunc() {
      this.$confirm('您是否需要进行审批?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          let data = { docEntry: this.docEntry, deptCode: this.deptCode };
          updateApply(data)
            .then(res => {
              if (res.data.resultCode == 1) {
                this.searchFormMethod();
                this.getAuditLog();
                this.isCheckShow = false;
                this.isRejectShow = true;
                return Message({
                  message: '审批成功',
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
        .catch(() => {
          // this.$message({
          //   type: 'info',
          //   message: ''
          // });
        });
    },
    handleRejectFunc() {
      this.$prompt('请输入驳回原因', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputPattern: /\S+/,
        inputErrorMessage: '请输入驳回原因'
      })
        .then(({ value }) => {
          let data = {
            docEntry: this.docEntry,
            checkComments: value,
            deptCode: this.deptCode
          };
          updateReject(data)
            .then(res => {
              if (res.data.resultCode == 1) {
                this.searchFormMethod();
                this.getAuditLog();
                this.isRejectShow = false;
                this.isCheckShow = true;
                return Message({
                  message: '驳回成功',
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
        .catch(() => {
          // this.$message({
          //   type: 'info',
          //   message: '取消输入'
          // });
        });
    },
    handleBackBtnClickFunc() {
      this.$router.go(-1);
      this.$router.push({ name: 'WmsOrderApproval' });
    },
    getAuditInfo() {
      let data = {
        docEntry: this.docEntry,
        deptCode: this.deptCode,
        checkStatus: '6',
        pageSize: this.tables.postParams.pageSize,
        pageIndex: this.tables.postParams.currentPage
      };
      getOutStorageList(data)
        .then(res => {
          if (res.data.resultCode === 1) {
            let data = res.data.data;
            if (!(data && data.length)) {
              return;
            }
            this.isCheckShow = data[0].isCheckShow;
            this.isRejectShow = data[0].isRejectShow;
          } else {
            clearTimeout(this.getAuditInfo);
            this.getAuditInfo = setTimeout(() => {
              this.getAuditInfo();
            }, 2000);
          }
        })
        .catch(err => {
          clearTimeout(this.getAuditInfo);
          this.getAuditInfo = setTimeout(() => {
            this.getAuditInfo();
          }, 2000);
        });
    }
  },
  created() {},

  mounted() {
    this.docEntry = this.$route.params.docEntry;
    this.searchFormMethod(1);
    this.getAuditLog();
    this.getAuditInfo();
    this.maxHeight = document.body.clientHeight - 84;
  },
  activated() {
    this.docEntry = this.$route.params.docEntry;
    this.searchFormMethod(1);
    this.getAuditLog();
    this.getAuditInfo();
    this.maxHeight = document.body.clientHeight - 84;
  },
  beforeRouteLeave(to, from, next) {
    clearTimeout(this.errTimeout);
    next();
  }
};
</script>

<style lang="stylus">
.audit-info {
  overflow-y:auto;
  h3 {
    font-weight: normal;
    color: #67c23a;
    margin-top: 20px;
  }
  .search-form {
    .el-form-item__content textarea {
      width: 600px;
    }
  }
  .order-info.el-form {
    display: flex;
    flex-wrap: wrap;
    .el-form-item {
      width: 350px;
      margin-bottom: 5px;
      .el-form-item__label {
        width: 100px;
      }
      .el-input__inner {
        width: 250px;
      }
    }
  }
  .infos{
    margin-bottom:20px;
  font-size:14px;
  font-weight:500;
  line-height:30px;
  display:flex;
  flex-direction:row;
  flex-wrap: wrap;
  .infos-item{
    width:24%;
    padding:0px 5px;
    direction:row;
    align-items:baseline;
    display:block;
    justify-content:space-between;
    .m-label{
      color:#333
      display: inline-block;
    }
    .m-text{
      display: inline;
      padding-left:0;
      color:#666;
    }
  }
}
}
</style>
