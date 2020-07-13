<template>
  <div class="exception-list app-container">
    <div class="order-info">
      <el-row>
        <el-col :span="8"
          ><label>订单号:</label><span>{{ orderInfo.ordNo }}</span></el-col
        >
        <el-col :span="8"
          ><label>客户订单号:</label
          ><span>{{ orderInfo.clientOrdNo }}</span></el-col
        >
        <el-col :span="8"
          ><label>装运编号:</label
          ><span>{{ orderInfo.shipmentNo }}</span></el-col
        >
      </el-row>
      <el-row>
        <el-col :span="8"
          ><label>司机姓名:</label
          ><span>{{ orderInfo.driverName }}</span></el-col
        >
        <el-col :span="8"
          ><label>司机电话:</label
          ><span>{{ orderInfo.driverPhone }}</span></el-col
        >
        <el-col :span="8"
          ><label>车牌号:</label><span>{{ orderInfo.plate }}</span></el-col
        >
      </el-row>
    </div>
    <el-table
      :data="tables.data"
      style="width: 100%"
      tooltip-effect="dark"
      size="mini"
      border
      :max-height="tables.tableMaxHeight"
    >
      <el-table-column prop="type" label="预警类型" width="80">
        <template slot-scope="scope">
          <span>{{ getExceptionType(scope.row.type) }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="alarmLevel" label="预警级别" width="80">
      </el-table-column>

      <el-table-column prop="alarmDetail" label="异常详情" width="200">
        <template slot-scope="scope">
          <span>{{ getExceptionDes(scope.row) }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="prophase" label="异常状态" width="80">
      </el-table-column>
      <el-table-column prop="reason" label="异常原因" width="150">
      </el-table-column>
      <el-table-column prop="remark" label="处理过程" width="150">
      </el-table-column>
      <el-table-column prop="addtime" label="发生时间" width="100">
      </el-table-column>
      <el-table-column prop="beginTime" label="开始处理时间" width="100">
      </el-table-column>
      <el-table-column prop="endTime" label="处理完成时间" width="100">
      </el-table-column>
      <el-table-column prop="closeReason" label="关闭原因" width="150">
      </el-table-column>
      <el-table-column prop="closeTime" label="异常关闭时间" width="100">
      </el-table-column>
      <el-table-column label="操作" width="120" align="center">
        <template slot-scope="scope">
          <el-button
            @click.native.prevent="handleExceptionBtnClick(scope.row)"
            type="text"
            size="small"
          >
            {{ scope.row.prophase == '未处理' ? '开始处理' : '处理' }}
          </el-button>
          <el-button
            @click.native.prevent="closeExceptionBtnClick(scope.row)"
            type="text"
            size="small"
          >
            关闭
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog title="处理预警" :visible.sync="handleDialogVisible" width="30%">
      <el-form
        :model="saveForm"
        ref="saveForm"
        status-icon
        :rules="saveFormRules"
        label-width="80px"
        :inline="false"
        label-position="right"
        size="small"
      >
        <el-form-item label="异常原因" :label-width="'80px'" prop="reason">
          <el-input
            v-model="saveForm.reason"
            auto-complete="off"
            style="width:100%"
            placeholder="请输入异常原因（必填）"
          ></el-input>
        </el-form-item>
        <el-form-item label="处理过程" :label-width="'80px'" prop="roleType">
          <el-input
            v-model="saveForm.remark"
            :row="2"
            type="textarea"
            placeholder="请输入具体的处理过程（必填）"
          ></el-input>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="saveBtnClickFunc">保存</el-button>
        <el-button @click="handleDialogVisible = false">取消</el-button>
      </span>
    </el-dialog>
    <el-dialog
      title="关闭预警"
      :visible.sync="closeAlarmDialogVisible"
      width="30%"
    >
      <el-form
        :model="saveForm"
        ref="saveForm2"
        status-icon
        :rules="saveFormRules2"
        label-width="80px"
        :inline="false"
        label-position="right"
        size="small"
      >
        <el-form-item label="关闭原因" :label-width="'80px'" prop="closeReason">
          <el-input
            v-model="saveForm.closeReason"
            :row="2"
            type="textarea"
            placeholder="请输入关闭原因（必填）"
          ></el-input>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="saveBtnClickFunc">确定</el-button>
        <el-button @click="closeAlarmDialogVisible = false">取消</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {
  getOrderAlarmList,
  saveOrderAlarmHandle
} from '@/api/OrderManagement1/orderAlarm';
import { Message } from 'element-ui';
import { getUserInfo } from '@/api/users';
import { getBaseData, getDictionaryData } from '@/api/baseData';
import { mapState, mapGetters } from 'vuex';
import fecha from 'fecha';
import Big from 'big.js';
export default {
  name: 'ExceptionDetail',
  data() {
    return {
      form: {
        pageIndex: 1,
        pageSize: 10,
        ordIdx: ''
      },
      saveForm: {
        idx: '',
        reason: '',
        remark: '',
        prophase: '',
        isClose: false,
        closeReason: '',
        ordIdx: '',
        type: ''
      },
      currentRow: null,
      saveFormRules: {
        reason: [
          { required: true, message: '请输入异常原因', trigger: 'blur' }
        ],
        remark: [
          { required: true, message: '请输入异常处理的过程', trigger: 'blur' }
        ]
      },
      saveFormRules2: {
        closeReason: [
          { required: true, message: '请输入关闭原因', trigger: 'blur' }
        ]
      },
      businessList: [],
      tables: {
        tableMaxHeight: document.body.clientHeight - 230,
        pageSizes: [10, 20, 30, 40],
        total: 0,
        data: []
      },
      orderInfo: {
        ordNo: '23343125425',
        clientOrdNo: 'kh23423423'
      },
      handleDialogVisible: false,
      closeAlarmDialogVisible: false,
      exceptionType: [
        '时间预警',
        '偏离预警',
        '胎压预警',
        '疲劳预警',
        '超速预警'
      ]
    };
  },
  watch: {
    props(newVal, oldVal) {
      this.form.ordIdx = newVal;
      this._getOrderAlarmList(1);
    },
    $route() {
      this.form.ordIdx = this.$route.params.ordIdx;
      this._getOrderAlarmList(1);
    }
  },
  props: ['ordIdx'],
  methods: {
    _getOrderAlarmList(pageIndex) {
      if (pageIndex) {
        this.form.pageIndex = pageIndex;
      } else {
        this.form.pageIndex = 1;
      }
      getOrderAlarmList(this.form)
        .then(res => {
          if (res.data.resultCode == 1) {
            this.tables.data = res.data.data.orderAlarmList;
            this.orderInfo = res.data.data;
          } else {
            Message({
              message: res.data.message,
              type: 'error',
              duration: 3 * 1000
            });
            //window.location.reload()
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
    getExceptionType(type) {
      return this.exceptionType[type] || '未知预警';
    },
    getExceptionDes(row) {
      if (row.type == 0) {
        //时间预警
        let alarmLevelLDes = ['订单可能会延误', '订单已经延误', '订单已经延误'];
        return alarmLevelLDes[row.alarmLevel];
      } else if (row.type == 1) {
        //偏离预警
        return `车辆已偏离标准路线${new Big(row.alarmDetail).toFixed(0)}米`;
      } else if (row.type == 2) {
        //胎压预警
        return row.alarmDetail;
      } else if (row.type == 3) {
        //疲劳预警
        row.alarmDetail;
      } else if (row.type == 4) {
        //超速预警
        row.alarmDetail;
      }
    },
    handleExceptionBtnClick(row) {
      this.currentRow = row;
      this.saveForm.idx = row.idx;
      this.saveForm.reason = row.reason;
      this.saveForm.remark = row.remark;
      this.saveForm.isClose = false;
      this.saveForm.closeReason = '';
      this.saveForm.type = row.type;
      this.saveForm.ordIdx = row.ordIdx;
      //如果点击了处理，则算作处理异常开始
      if (row.prophase == '未处理') {
        saveOrderAlarmHandle({
          idx: row.idx,
          type: row.type,
          prophase: '处理中'
        })
          .then(res => {
            if (res.data.resultCode == 1) {
              row.prophase = '处理中';
              row.beginTime = fecha.format(new Date(), 'YYYY-MM-DD HH:MM');
              this.$message({
                type: 'success',
                message: '已记录开始处理时间，请尽快处理此异常！',
                duration: 5000
              });
            } else {
              this.$message({
                type: 'error',
                message: res.data.message
              });
            }
          })
          .catch(err => {
            this.$message({
              type: 'error',
              message: err
            });
          });
      } else {
        this.saveForm.prophase = '已处理';
        this.handleDialogVisible = true;
      }
    },
    closeExceptionBtnClick(row) {
      let this$ = this;
      this.currentRow = row;
      this.$confirm('您确定这不是一个异常吗?', '温馨提示', {
        confirmButtonText: '是',
        cancelButtonText: '否',
        type: 'warning'
      })
        .then(() => {
          this.saveForm.idx = row.idx;
          this.saveForm.reason = row.reason;
          this.saveForm.remark = row.remark;
          this.saveForm.isClose = true;
          this.saveForm.closeReason = row.closeReason;
          this.saveForm.type = row.type;
          this.saveForm.ordIdx = row.ordIdx;
          this.closeAlarmDialogVisible = true;
        })
        .catch(() => {
          // this.$message({
          //   type: 'info',
          //   message: 'Delete canceled'
          // });
        });
    },
    saveBtnClickFunc() {
      var formName = this.saveForm.isClose ? 'saveForm2' : 'saveForm';
      this.$refs[formName].validate(valid => {
        if (valid) {
          saveOrderAlarmHandle(this.saveForm)
            .then(res => {
              if (res.data.resultCode == 1) {
                if (this.saveForm.isClose) {
                  //移除关闭的元素
                  this.tables.data.splice(
                    this.tables.data.indexOf(this.currentRow),
                    1
                  );
                  this.closeAlarmDialogVisible = false;
                } else {
                  if (this.currentRow) {
                    this.currentRow.prophase = '已处理';
                    this.currentRow.reason = this.saveForm.reason;
                    this.currentRow.remark = this.saveForm.remark;
                    this.currentRow.endTime = fecha.format(
                      new Date(),
                      'YYYY-MM-DD HH:MM'
                    );
                    this.handleDialogVisible = false;
                  }
                }
              } else {
                this.$message({
                  type: 'info',
                  message: res.data.message
                });
              }
            })
            .catch(err => {
              this.$message({
                type: 'info',
                message: err
              });
            });
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    }
  },
  computed: {
    userInfo: function() {
      return this.$store.getters.userInfo;
    }
    //   ...mapGetters({
    //       userInfo:"userInfo"
    //   })
    // ...mapGetters['userInfo']
  },
  mounted() {},
  created() {
    this.form.ordIdx = this.$route.params.ordIdx;
    this._getOrderAlarmList(1);
  }
};
</script>

<style lang="scss">
.exception-list {
  .el-table th > .cell {
    text-align: center;
  }
  .order-info {
    padding: 10px 20px 20px 0px;
    font-size: 14px;
    .el-col {
      margin: 5px 0px;
    }
    label {
      color: #333;
      padding: 5px;
      padding-right: 15px;
    }
    span {
      color: rgb(64, 158, 255);
    }
  }
}
</style>
