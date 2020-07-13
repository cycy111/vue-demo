
    <template>
  <div class="app-container">
    <div ref="searchForm" class="el-container-custom">
      <el-form :inline="true" v-show="true" :model="searchForm" ref="searchFormRef" size="small">
        <el-form-item v-show="true" prop="applyer">
          <el-select v-model="searchForm.applyer" filterable placeholder="请选择申请人" clearable>
            <el-option
              v-for="(item, index) in selectArr.applyers"
              :value-key="item.value"
              :key="index"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item v-show="true" prop="projectCode">
          <el-input
            v-model="searchForm.projectCode"
            placeholder="请输入项目编号"
            style="width:150px;"
            clearable
          ></el-input>
        </el-form-item>

        <el-form-item v-show="true" prop="docEntry">
          <el-input
            v-model="searchForm.docEntry"
            placeholder="请输入出库单号"
            style="width:150px;"
            clearable
          ></el-input>
        </el-form-item>

        <el-form-item v-show="true" prop="projectName">
          <el-input
            v-model="searchForm.projectName"
            placeholder="请输入项目名称"
            style="width:150px;"
            clearable
          ></el-input>
        </el-form-item>

        <el-form-item v-show="false" prop="checkStatus">
          <el-input
            v-model="searchForm.checkStatus"
            placeholder="请输入审批状态"
            style="width:150px;"
            clearable
          ></el-input>
        </el-form-item>

        <el-form-item v-show="true" prop="createDateS">
          <el-date-picker
            v-model="searchForm.createDateS"
            type="datetime"
            style="width:165px"
            value-format="yyyy-MM-dd HH:mm:ss"
            placeholder="选择开始时间"
          ></el-date-picker>
        </el-form-item>

        <el-form-item v-show="true" prop="createDateE">
          <el-date-picker
            v-model="searchForm.createDateE"
            type="datetime"
            style="width:165px"
            value-format="yyyy-MM-dd HH:mm:ss"
            placeholder="选择结束时间"
          ></el-date-picker>
        </el-form-item>

        <el-form-item>
          <el-button type="default" size="small" @click="resetForm('searchFormRef')">清空</el-button>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" size="small" @click="handleQueryBtnClickFunc()">查询</el-button>
        </el-form-item>

        <el-form-item>
          <el-button type="success" size="small" @click="handleExportBtnClickFunc()">导出</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="el-container" ref="actionForm">
      <el-form :inline="true"></el-form>
    </div>
    <div ref="myElTabs">
      <el-tabs
        v-model="searchForm.checkStatus"
        type="card"
        @tab-click="handleTabClick"
      >
        <el-tab-pane label="全部" name="5"></el-tab-pane>
        <el-tab-pane label="未审批" name="1"></el-tab-pane>
        <el-tab-pane label="审批中" name="2"></el-tab-pane>
        <el-tab-pane label="审批通过" name="3"></el-tab-pane>
        <el-tab-pane label="驳回" name="4"></el-tab-pane>
      </el-tabs>
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
      <el-table-column type="selection" width="60" fixed></el-table-column>

      <el-table-column type="index" label="序号" width="60" fixed></el-table-column>

      <el-table-column prop label="审核操作" width="200" fixed>
        <template slot-scope="scope">
          <el-button
            size="mini"
            v-show="scope.row.isCheckShow"
            type="primary"
            @click="handleApprovalFunc(scope.row)"
          >通过</el-button>

          <el-button
            size="mini"
            v-show="scope.row.isRejectShow"
            type="danger"
            @click="handleRejectFunc(scope.row)"
          >驳回</el-button>
        </template>
      </el-table-column>

      <el-table-column prop="docEntry" label="出库单号" width="120" fixed>
        <template slot-scope="scope">
          <a
            href="javascript:void(0);"
            @click="
            $router.push({
              name: 'WmsOrderApprovalInfo',
              params: {docEntry:scope.row.docEntry}
            })
          "
          >{{ scope.row.docEntry }}</a>
        </template>
      </el-table-column>

      <el-table-column prop="createDate" label="建单时间" width="120"></el-table-column>

      <el-table-column prop="partQty" label="领用数量" width="120"></el-table-column>

      <el-table-column prop="projectCode" label="项目编号" width="120"></el-table-column>

      <el-table-column prop="projectName" label="项目名称" width="120"></el-table-column>

      <el-table-column prop="dmadDept" label="需求部门" width="120"></el-table-column>

      <el-table-column prop="userName" label="申请人" width="120"></el-table-column>

      <el-table-column prop="productType" label="物资类别" width="120"></el-table-column>

      <el-table-column prop="outType" label="出库类型" width="120"></el-table-column>

      <el-table-column prop="checkStatus" label="审批状态" width="120"></el-table-column>

      <el-table-column prop="outStatus" label="出库状态" width="120"></el-table-column>
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
  getOutStorageList,
  updateApply,
  updateReject,
  getApplyer,
  getOutStorageDt,
  getCheckHistory,
  getSelectData
} from '@/api/wmsQuery/wms-order-approval';

const _ = require('lodash');

export default {
  data() {
    return {
      popoverVisible: {},
      dialog: {
        title: '',
        visible: false
      },
      selectArr: {
        applyers: []
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
        applyer: '',
        projectCode: '',
        docEntry: '',
        projectName: '',
        checkStatus: '1',
        createDateS: '',
        createDateE: ''
      },
      addForm: {
        data: {},
        config: {
          disabled: false
        },
        rules: {}
      },
      projects: [],
      activeName: 1
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
        return c.docEntry;
      });
    },

    deptCode() {
      return this.$store.getters.deptCode;
    }
  },
  metas: {
    title: '',
    titleTemplate: '%s - 兆航物流TMS后台管理系统'
  },
  methods: {
    setTableMaxHeight() {
      let this$ = this;
      setTimeout(() => {
        let height =
          document.body.clientHeight -
          125 -
          (this.$refs.searchForm.clientHeight +
            this.$refs.actionForm.clientHeight +
            this.$refs.myElTabs.clientHeight +
            this.$refs.pagingBox.clientHeight
          );
        this.tables.tableMaxHeight = height;
      }, 500);
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
      if (this.beforeQueryFunc) {
        this.beforeQueryFunc();
      }
      this.searchFormMethod(1, false);
    },
    handleExportBtnClickFunc() {
      tirmFilter(this.searchForm);
      let data = _.assign({ pageIndex: 1, pageSize: 10000 }, this.searchForm);
      getOutStorageList(data)
        .then(res => {
          if (res.data.resultCode == 1) {
            let cols =
              '审核操作,出库单号,建单时间,领用数量,项目编号,项目名称,需求部门,申请人,物资类别,出库类型,审批状态,出库状态';
            let fields =
              ',docEntry,createDate,partQty,projectCode,projectName,dmadDept,userName,productType,outType,checkStatus,outStatus';
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
      getOutStorageList(data)
        .then(res => {
          if (res.data.resultCode === 1) {
            let data = res.data.data;

            this.tables.tableData = data;
            if (needSaveSelect) {
              for (let item of this.multipleSelection) {
                let obj = _.find(this.tables.tableData, {
                  docEntry: item.docEntry
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
          if (_.includes(res.data.message, '无效')) {
            return Message({
              message: '当前部门暂未开通此功能，请联系管理员',
              type: 'error',
              duration: 3 * 1000
            });
          }
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

    cellStyleFunc(obj) {
      if (obj.columnIndex === 3) {
        return 'color:#409EFF';
      } else {
        return '';
      }
    },

    getApplyers() {
      let data = { deptCode: this.deptCode };
      getApplyer(data)
        .then(res => {
          if (res.data.resultCode == 1) {
            let data = res.data.data;
            this.selectArr.applyers = data.map(c => {
              return { label: c.userName, value: c.userId };
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
    handleApprovalFunc(row) {
      this.$confirm('您是否需要进行审批?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          let data = { docEntry: row.docEntry, deptCode: this.deptCode };
          updateApply(data)
            .then(res => {
              if (res.data.resultCode == 1) {
                this.searchFormMethod();
                row.isRejectShow = false;
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
    handleRejectFunc(row) {
      this.$prompt('请输入驳回原因', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputPattern: /\S+/,
        inputErrorMessage: '请输入驳回原因'
      })
        .then(({ value }) => {
          let data = {
            docEntry: row.docEntry,
            checkComments: value,
            deptCode: this.deptCode
          };
          updateReject(data)
            .then(res => {
              if (res.data.resultCode == 1) {
                row.isRejectShow = false;
                this.searchFormMethod();
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
    handleTabClick(tab, event) {
      this.searchFormMethod();
    },
    beforeQueryFunc() {
      this.searchForm.checkStatus = '5';
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
  mounted() {
    this.setTableMaxHeight();

    this.searchForm.deptCode = this.deptCode;
    this.getApplyers();
    this.searchFormMethod();
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
