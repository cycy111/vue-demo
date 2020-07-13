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
        <el-form-item v-show="true" prop="deptcode">
          <el-input
            v-model="searchForm.deptcode"
            placeholder="请输入部门名称"
            style="width:150px;"
            clearable
          ></el-input>
        </el-form-item>

        <el-form-item v-show="true" prop="province">
          <el-input
            v-model="searchForm.province"
            placeholder="请输入省份名称"
            style="width:150px;"
            clearable
          ></el-input>
        </el-form-item>

        <el-form-item v-show="true" prop="isEnable">
          <el-select
            v-model="searchForm.isEnable"
            filterable
            placeholder="请选择启用状态"
            clearable
          >
            <el-option
              v-for="(item, index) in selectArr.isEnable"
              :value-key="item.value"
              :key="index"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item v-show="true" prop="alarmLevel">
          <el-select
            v-model="searchForm.alarmLevel"
            filterable
            placeholder="请选择预警级别"
            clearable
          >
            <el-option
              v-for="(item, index) in selectArr.alarmLevel"
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

      <el-table-column
        prop="alarmLevelDesc"
        label="预警级别"
        width="120"
      ></el-table-column>

      <el-table-column
        prop="province"
        label="省份"
        width="120"
      ></el-table-column>

      <el-table-column
        prop="deptcode"
        label="部门"
        width="120"
      ></el-table-column>

      <el-table-column
        prop="area"
        label="所属区域"
        width="120"
      ></el-table-column>

      <el-table-column
        prop="serviceManager"
        label="客服经理"
        width="120"
      ></el-table-column>

      <el-table-column
        prop="center"
        label="所属中心"
        width="120"
      ></el-table-column>

      <el-table-column
        prop="serviceSuv"
        label="客服总监"
        width="120"
      ></el-table-column>

      <el-table-column
        prop="indate"
        label="最近入库时间"
        width="180"
      ></el-table-column>

      <el-table-column
        prop="outdate"
        label="最近出库时间"
        width="180"
      ></el-table-column>

      <el-table-column prop="remark" label="备注" width="120"></el-table-column>

      <el-table-column
        prop="isnableDesc"
        label="项目使用状态"
        width="120"
      ></el-table-column>

      <el-table-column prop="port" label="端口号" width="120"></el-table-column>
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
import { getWMSsUsage } from '@/api/wmsQuery/wms-project-usage';

const _ = require('lodash');

export default {
  data() {
    return {
      popoverVisible: {},
      dialog: {
        title: 'WMS项目使用情况查询',
        visible: false
      },
      selectArr: {
        isEnable: [
          { label: '正常', value: 'Y' },
          { label: '已停用', value: 'N' }
        ],

        alarmLevel: [
          { label: '一级预警', value: '1' },
          { label: '二级预警', value: '2' },
          { label: '三级预警', value: '3' }
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
        deptcode: '',
        province: '',
        isEnable: 'Y',
        alarmLevel: ''
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
    title: 'WMS项目使用情况查询',
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
      getWMSsUsage(data)
        .then(res => {
          if (res.data.resultCode == 1) {
            let cols =
              '预警级别,省份,部门,所属区域,客服经理,所属中心,客服总监,最近入库时间,最近出库时间,备注,项目使用状态,端口号';
            let fields =
              'alarmLevelDesc,province,deptcode,area,serviceManager,center,serviceSuv,indate,outdate,remark,isnableDesc,port';
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
      getWMSsUsage(
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

    tableRowClassName({ row, rowIndex }) {
      if (row.alarmLevel == 1) {
        return 'level-1-row';
      } else if (row.alarmLevel == 2) {
        return 'level-2-row';
      } else if (row.alarmLevel == 3) {
        return 'level-3-row';
      }
      return '';
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
    //this.searchForm.orderNO = this.$route.params.orderNO;
    this.handleQueryBtnClickFunc();
  },
  mounted() {
    this.setTableMaxHeight();

    //this.searchForm.orderNO = this.$route.params.orderNO;
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

#app .level-1-row {
  background-color: #f2dede;
  &.hover-row td {
    background-color: #d9edf7 !important;
  }
}
#app .level-2-row {
  background-color: #fcf8e3;
  &.hover-row td {
    background-color: #d9edf7 !important;
  }
}
#app .level-3-row {
  background-color: #dff0d8;
  &.hover-row td {
    background-color: #d9edf7 !important;
  }
}
#app .el-table__row {
  &.hover-row td {
    background-color: #d9edf7 !important;
  }
}
</style>
