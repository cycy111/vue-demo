<template>
  <div class="app-container">
    <div class="el-container-custom">
      <el-form
        :inline="true"
        :model="searchForm"
        ref="searchFormRef"
        :rules="searchRules"
        size="small"
        class="search-form"
      >
        <el-form-item label="" prop="productCode">
          <el-input
            v-model="searchForm.productCode"
            placeholder="请输入物资编号"
            clearable
          ></el-input>
        </el-form-item>
        <el-form-item label="" prop="productName">
          <el-input
            v-model="searchForm.productName"
            placeholder="请输入物资名称"
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
          <el-button type="primary" size="small" @click="searchFormMethod(1)"
            >查询</el-button
          >
        </el-form-item>
        <el-form-item>
          <el-button type="success" size="small" @click="downStorageSetList"
            >导出</el-button
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
      :cell-style="{ 'text-align': 'center' }"
      size="mini"
    >
      <el-table-column type="index" label="序号" width="45"></el-table-column>
      <el-table-column
        prop="createDate"
        label="导入日期"
        width="150"
      ></el-table-column>
      <el-table-column
        prop="updateDate"
        label="修改日期"
        width="150"
      ></el-table-column>
      <el-table-column
        prop="productCode"
        label="物资编号"
        width="150"
      ></el-table-column>
      <el-table-column
        prop="productName"
        label="物资名称"
        width="250"
      ></el-table-column>
      <el-table-column
        prop="productUnit"
        label="单位"
        width="80"
      ></el-table-column>
      <el-table-column
        prop="lendqty"
        label="借料数量"
        width="100"
      ></el-table-column>
      <el-table-column
        prop="getqty"
        label="已领数量"
        width="100"
      ></el-table-column>
      <el-table-column
        prop="returnqty"
        label="已退"
        width="100"
      ></el-table-column>
      <el-table-column
        prop="regetqty"
        label="补领"
        width="100"
      ></el-table-column>
      <el-table-column
        prop="statusText"
        label="状态"
        width="100"
      ></el-table-column>
      <el-table-column prop="remark" label="备注" width="200"></el-table-column>

      <el-table-column label="操作">
        <template slot-scope="caozuo">
          <el-button
            type="primary"
            :disabled="caozuo.row.status == '1'"
            size="mini"
            @click="showEditPage(caozuo.row)"
            ><i class="iconfont icon-bj"></i>编辑</el-button
          >
        </template>
      </el-table-column>
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
    <el-dialog
      :title="dialog.title"
      :visible.sync="dialog.dialogTableVisible"
      width="1000px"
      :close-on-click-modal="false"
      v-dialogDrag
      v-dialogDragWidth
    >
      <el-form
        :model="dialog.data"
        ref="form"
        status-icon
        :rules="dialog.rules"
        label-width="80px"
        :inline="true"
        label-position="right"
        size="small"
      >
        <el-form-item label="物资编号" :label-width="'80px'" prop="roleName">
          <el-input
            v-model="dialog.data.productCode"
            readonly
            auto-complete="off"
            style="width:217px"
            placeholder="物资编号"
          ></el-input>
        </el-form-item>
        <el-form-item label="已退" :label-width="'80px'" prop="returnqty">
          <el-input
            v-model="dialog.data.returnqty"
            auto-complete="off"
            style="width:217px"
            placeholder=""
          ></el-input>
        </el-form-item>
        <el-form-item label="补领" :label-width="'80px'" prop="regetqty">
          <el-input
            v-model="dialog.data.regetqty"
            auto-complete="off"
            style="width:217px"
            placeholder=""
          ></el-input>
        </el-form-item>
        <el-form-item label="状态" :label-width="'80px'" prop="status">
          <el-select v-model="dialog.data.status" placeholder="请选择状态">
            <el-option
              v-for="(item, index) in statusArr"
              :key="index"
              :label="item.text"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="备注" :label-width="'80px'" prop="remark">
          <el-input
            v-model="dialog.data.remark"
            type="textarea"
            auto-complete="off"
            style="width:217px"
            placeholder=""
          ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancelFunc">取消</el-button>
        <el-button type="primary" @click="saveInfo('form')">保存</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<style>
.search-form .el-form-item__content input {
  width: 140px;
}
</style>

<script>
import { Message, ColorPicker } from 'element-ui';
import messages from '@/utils/messages';
import { pickerOptions } from '@/utils/index';
import { tableToExcel } from '@/utils/cmn';
import Big from 'big.js';
import { getKpiInfo } from '@/api/yuebao/kpiBase';
import '@/styles/custom.scss';
import {
  getHistoryLendList,
  updateHistoryLend
} from '@/api/dianwangManagement/historyBorrowMaterial';
export default {
  name: 'storageQuery',
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
      dialog: {
        title: '历史借料编辑',
        dialogTableVisible: false,
        data: {},
        oldData: {},
        rules: {
          returnqty: [
            {
              trigger: 'change',
              validator: (rule, value, callback) => {
                if (!/^(-?\d+)(\.\d+)?$/.test(value)) {
                  return callback(new Error('请输入数值'));
                }
                callback();
              }
            }
          ],
          regetqty: [
            {
              trigger: 'change',
              validator: (rule, value, callback) => {
                if (!/^(-?\d+)(\.\d+)?$/.test(value)) {
                  return callback(new Error('请输入数值'));
                }
                callback();
              }
            }
          ]
        }
      },
      statusArr: [
        { text: '未结', value: '0' },
        { text: '已结', value: '1' }
      ],
      searchForm: {
        deptCode: '',
        productCode: '',
        productName: '',
        searchDate: []
      },
      searchRules: {
        deptCode: [{ required: true, message: '请选择项目', trigger: 'change' }]
      }
    };
  },
  computed: {
    deptCode() {
      return this.$store.getters.deptCode;
    }
  },
  watch: {
    deptCode(newVal, oldVal) {
      //this.searchFormMethod(1);
    }
  },
  methods: {
    searchFormMethod(currentPage) {
      if (currentPage) {
        this.tables.postParams.currentPage = currentPage;
      }
      getHistoryLendList({
        deptCode: this.deptCode,
        productCode: this.searchForm.productCode,
        productName: this.searchForm.productName,
        pageSize: this.tables.postParams.pageSize,
        pageIndex: this.tables.postParams.currentPage
      })
        .then(res => {
          if (res.data.resultCode == 1) {
            //遍历数组
            if (res.data.data.length) {
              for (let item of res.data.data) {
                let lendqty = new Big(item.lendqty || 0);
                item.lendqty = parseFloat(lendqty.toFixed(2));
                let getqty = new Big(item.getqty || 0);
                item.getqty = parseFloat(getqty.toFixed(2));
                let returnqty = new Big(item.returnqty || 0);
                item.returnqty = parseFloat(returnqty.toFixed(2));
                let regetqty = new Big(item.regetqty || 0);
                item.regetqty = parseFloat(regetqty.toFixed(2));
                item.statusText = item.status == 1 ? '已结' : '未结';
              }
            }
            this.tables.tableData = res.data.data;
            if (res.data.pageIndex == 1) {
              this.tables.postParams.total = res.data.counts;
            }
          } else {
            Message({
              message: res.data.message,
              type: 'error',
              duration: 2 * 1000
            });
          }
        })
        .catch(err => {
          Message({
            message: err,
            type: 'error',
            duration: 2 * 1000
          });
        });
    },
    downStorageSetList() {
      getHistoryLendList({
        deptCode: this.deptCode,
        productCode: this.searchForm.productCode,
        productName: this.searchForm.productName,
        pageSize: 20000,
        pageIndex: 1
      })
        .then(res => {
          if (res.data.resultCode == 1) {
            //遍历数组
            if (res.data.data.length) {
              for (let item of res.data.data) {
                let lendqty = new Big(item.lendqty || 0);
                item.lendqty = parseFloat(lendqty.toFixed(2));
                let getqty = new Big(item.getqty || 0);
                item.getqty = parseFloat(getqty.toFixed(2));
                let returnqty = new Big(item.returnqty || 0);
                item.returnqty = parseFloat(returnqty.toFixed(2));
                let regetqty = new Big(item.regetqty || 0);
                item.regetqty = parseFloat(regetqty.toFixed(2));
                item.statusText = item.status == 1 ? '已结' : '未结';
              }
            }
            let data = res.data.data;
            let cols =
              '导入日期,修改日期,物资编号,物资名称,单位,\
          借料数量,已领数量,已退,补领,状态,备注';
            let fields =
              'createDate,updateDate,productCode,productName,productUnit,lendqty,getqty,returnqty,regetqty,statusText,remark';
            tableToExcel(data, cols, fields);
          } else {
            Message({
              message: res.data.message,
              type: 'error',
              duration: 2 * 1000
            });
          }
        })
        .catch(err => {
          Message({
            message: err,
            type: 'error',
            duration: 2 * 1000
          });
        });
    },
    showEditPage(row) {
      this.dialog.dialogTableVisible = true;
      this.dialog.oldData = Object.assign({}, row);
      this.dialog.data = row;
    },
    cancelFunc() {
      this.dialog.dialogTableVisible = false;
      this.dialog.data.returnqty = this.dialog.oldData.returnqty;
      this.dialog.data.regetqty = this.dialog.oldData.regetqty;
      this.dialog.data.status = this.dialog.oldData.status;
      this.dialog.data.remark = this.dialog.oldData.remark;
    },
    saveInfo() {
      if (this.dialog.oldData.status == '1') {
        return Message({
          message: '已结状态无法更改',
          type: 'error',
          duration: 2 * 1000
        });
      }
      updateHistoryLend({
        id: this.dialog.data.id,
        returnqty: this.dialog.data.returnqty,
        regetqty: this.dialog.data.regetqty,
        status: this.dialog.data.status,
        remark: this.dialog.data.remark
      })
        .then(res => {
          if (res.data.resultCode == 1) {
            Message({
              message: '保存成功',
              type: 'success',
              duration: 2 * 1000
            });
            this.dialog.oldData = this.dialog.data;
            this.dialog.data.statusText =
              this.dialog.data.status == '1' ? '已结' : '未结';
          } else {
            Message({
              message: res.data.message,
              type: 'error',
              duration: 2 * 1000
            });
          }
        })
        .catch(err => {
          Message({
            message: err,
            type: 'error',
            duration: 2 * 1000
          });
        });
    },
    getDeptName(deptCode) {
      let depts = this.$store.getters.userDepartments;
      for (let item of depts) {
        if (item.value == deptCode) {
          return item.label;
        }
      }
    },
    resetForm(formName) {
      if (this.$refs[formName]) {
        this.$refs[formName].resetFields();
      }
    },

    currentPageChange(currentPageNum) {
      this.searchFormMethod(currentPageNum);
    }
  },
  created() {
    //this.searchFormMethod(1)
  }
};
</script>
