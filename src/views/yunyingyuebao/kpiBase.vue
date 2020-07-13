<template>
  <div class="app-container">
    <div class="el-container-custom">
      <el-container>
        <el-form
          :inline="true"
          :model="searchForm"
          ref="searchFormRef"
          size="small"
        >
          <el-form-item label="" :label-width="'80px'" prop="kCode" clearable>
            <el-select
              v-model="searchForm.kCode"
              filterable
              placeholder="请选择Kpi项目"
            >
              <el-option
                v-for="(item, index) in kpiItems"
                :key="index"
                :label="item.name"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>

          <el-form-item
            label="指标值："
            :label-width="'80px'"
            prop="kValue"
            clearable
          >
            <el-input-number
              v-model="searchForm.kValue"
              controls-position="right"
              :precision="2"
              :step="1"
              placeholder="请选择考核结果"
            ></el-input-number>
          </el-form-item>
          <el-form-item label="" :label-width="'80px'" prop="kResult" clearable>
            <el-select
              v-model="searchForm.kResult"
              placeholder="请选择考核结果"
            >
              <el-option
                v-for="(item, index) in ['达标', '不达标']"
                :key="index"
                :label="item"
                :value="item"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" size="small" @click="searchFormMethod"
              >查询</el-button
            >
          </el-form-item>
          <el-form-item>
            <el-button
              type="default"
              size="small"
              @click="resetForm('searchFormRef')"
              >清空</el-button
            >
          </el-form-item>
        </el-form>
      </el-container>
      <el-container>
        <el-form :inline="true">
          <el-form-item>
            <el-button type="success" size="medium " @click="addKPIMethod"
              ><i class="el-icon-circle-plus-outline"></i>新增</el-button
            >
          </el-form-item>
          <el-form-item>
            <el-popover placement="bottom" width="160" v-model="popoverVisible">
              <p>{{ messages.delete.confirm }}</p>
              <div style="text-align: right; margin: 0">
                <el-button
                  size="mini"
                  type="text"
                  @click="popoverVisible = false"
                  >取消</el-button
                >
                <el-button type="primary" size="mini" @click="_deleteKpiInfo"
                  >确定</el-button
                >
              </div>
              <el-button type="danger" size="medium " slot="reference"
                ><i class="el-icon-delete"></i>批量删除</el-button
              >
            </el-popover>
          </el-form-item>
        </el-form>
      </el-container>
    </div>
    <el-table
      ref="multipleTable"
      border
      :max-height="tables.tableMaxHeight"
      :data="tables.getAllKpiData"
      tooltip-effect="dark"
      size="mini"
      @selection-change="
        val => {
          return (this.multipleSelection = val);
        }
      "
    >
      <el-table-column type="selection" width="55"></el-table-column>
      <el-table-column prop="rowNo" label="编号" width="100"></el-table-column>
      <el-table-column
        prop="kName"
        label="KPI名称"
        width="100"
      ></el-table-column>
      <el-table-column
        prop="deptName"
        label="使用部门"
        width="150"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column
        prop="kValue"
        label="指标值"
        width="100"
      ></el-table-column>
      <el-table-column prop="unit" label="单位" width="100"></el-table-column>
      <el-table-column
        prop="cValue"
        label="完成值"
        width="100"
      ></el-table-column>
      <el-table-column
        prop="kResult"
        label="考核结果"
        show-overflow-tooltip
        width="105"
      ></el-table-column>

      <el-table-column
        prop="creator"
        label="创建人"
        width="80"
        show-overflow-tooltip
      ></el-table-column>
      <!-- <el-table-column prop="" label="备注" show-overflow-tooltip></el-table-column> -->
      <el-table-column
        prop="createDate"
        label="创建时间"
        show-overflow-tooltip
        width="150"
      ></el-table-column>
      <el-table-column
        prop="remark"
        label="说明"
        show-overflow-tooltip
        width="150"
      ></el-table-column>
      <el-table-column label="操作">
        <template slot-scope="caozuo">
          <el-button size="mini" @click="editMethod(caozuo.row)"
            ><i class="iconfont icon-bj"></i>编辑</el-button
          >
          <el-popover
            placement="bottom"
            width="160"
            v-model="caozuo.row.visible"
          >
            <p>{{ messages.delete.confirm }}</p>
            <div style="text-align: right; margin: 0">
              <el-button
                size="mini"
                type="text"
                @click="caozuo.row.visible = false"
                >取消</el-button
              >
              <el-button
                type="primary"
                size="mini"
                @click="_deleteKpiInfo(caozuo.row)"
                >确定</el-button
              >
            </div>
            <el-button size="mini" slot="reference"
              ><i class="iconfont icon-shanchu"></i>删除</el-button
            >
          </el-popover>
          <!-- <el-button size="mini" @click="_deleteKpiInfo(caozuo.row)"><i class="iconfont icon-shanchu"></i>删除</el-button> -->
        </template>
      </el-table-column>
    </el-table>
    <div class="pagination-box">
      <el-pagination
        background
        small
        @current-change="currentPage"
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
      :modal-append-to-body="false"
      :visible.sync="dialog.visible"
      width="1000px"
      :close-on-click-modal="false"
      v-dialogDrag
      v-dialogDragWidth
    >
      <el-form
        :model="form"
        ref="forms"
        status-icon
        :rules="rules"
        label-width="80px"
        :inline="true"
        label-position="right"
        size="small"
      >
        <el-form-item
          label="Kpi项目"
          title="Kpi项目"
          :label-width="'80px'"
          prop="kCode"
        >
          <el-select v-model="form.kCode" placeholder="请选择Kpi项">
            <el-option
              v-for="(item, index) in kpiItems"
              :value-key="item.value"
              :key="index"
              :label="item.name"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="比较符" :label-width="'80px'" prop="cValue">
          <el-select v-model="form.cValue" placeholder="请选择比较符">
            <!-- <el-option label="大于" value="大于"></el-option>
            <el-option label="大于等于" value="大于等于"></el-option> -->
            <el-option label="小于" value="小于"></el-option>
          </el-select>
          <!-- <el-input v-model="form.cValue" auto-complete="off" style="width:217px"></el-input> -->
        </el-form-item>
        <el-form-item label="指标值" :label-width="'80px'" prop="kValue">
          <el-input-number
            v-model="form.kValue"
            controls-position="right"
            style="width:217px"
            :precision="2"
            :step="1"
            placeholder="请输入指标值"
          ></el-input-number>
        </el-form-item>
        <el-form-item label="单位" :label-width="'80px'" prop="unit">
          <el-input
            v-model="form.unit"
            auto-complete="off"
            style="width:217px"
          ></el-input>
        </el-form-item>

        <el-form-item
          label="考核结果"
          :label-width="'80px'"
          prop="kResult"
          clearable
        >
          <el-select v-model="form.kResult" placeholder="请选择考核结果">
            <el-option label="达标" value="达标"></el-option>
            <el-option label="不达标" value="不达标"></el-option>
          </el-select>
          <!-- <el-input v-model="form.kResult" auto-complete="off" style="width:217px"></el-input> -->
        </el-form-item>
        <el-form-item label="使用部门" :label-width="'80px'" prop="deptCode">
          <el-select
            v-model="form.deptCode"
            filterable
            placeholder="请选择用户状态"
          >
            <el-option
              v-for="(item, index) in tables.useDepartment"
              :value-key="item.value"
              :key="index"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="备注说明" :label-width="'80px'" prop="remark">
          <el-input
            v-model="form.remark"
            type="textarea"
            auto-complete="off"
            :style="'width:526px'"
          ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="resetForm('forms')">重置</el-button>
        <el-button type="primary" @click="submit('forms')">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { Message } from 'element-ui';
import messages from '@/utils/messages';
import {
  getKpiInfo,
  addKpiInfo,
  updateKpiInfo,
  deleteKpiInfo
} from '@/api/yuebao/kpiBase';
import { tirmFilter } from '@/utils/tools';
import { validateChinese } from '@/utils/validate';
import '@/directives/dialogCtrl.js';
import '@/styles/custom.scss';
export default {
  name: 'kpiBase',
  data() {
    return {
      popoverVisible: false,
      dialog: {
        title: '',
        visible: false
      },
      kpiItems: [
        {
          name: '呆滞率',
          value: 'dullrate'
        },
        {
          name: '库存金额',
          value: 'storageamount'
        },
        {
          name: '周转次数',
          value: 'turnover'
        }
      ],
      messages: messages,
      multipleSelection: [],
      tables: {
        tableMaxHeight: document.body.clientHeight - 230,
        getAllKpiData: [],
        useDepartment: [],
        pageSizes: [10, 20, 30, 40],
        rows: null,
        postParams: {
          currentPage: 1,
          pageSize: 10,
          total: 0
        }
      },
      searchForm: {
        kCode: '',
        kName: '',
        kValue: '',
        cValue: 0,
        kResult: '',
        deptCode: ''
      },
      form: {
        id: 0,
        kCode: '',
        kName: '',
        kValue: '',
        unit: '',
        cValue: '',
        kResult: '',
        deptCode: '',
        remark: ''
      },
      rules: {
        kCode: [
          {
            required: true,
            message: 'kpi编号必须填写',
            trigger: 'change'
          },
          {
            trigger: 'change',
            validator: (rule, value, callback) => {
              if (!/^[a-z0-9]{5,16}$/.test(value)) {
                return callback(new Error('格式:5-16位小写字母、数字'));
              }
              callback();
            }
          }
        ],
        kName: [
          {
            required: true,
            message: 'kpi名称必须填写',
            trigger: 'change'
          },
          {
            trigger: 'change',
            validator: validateChinese
          }
        ],
        unit: [
          {
            required: true,
            message: '单位必须填写',
            trigger: 'change'
          },
          {
            trigger: 'change',
            validator: validateChinese
          }
        ],
        cValue: [
          {
            required: true,
            message: '完成值必须填写',
            trigger: 'change'
          },
          {
            trigger: 'change',
            validator: validateChinese
          }
        ],
        kResult: [
          {
            required: true,
            message: '考核结果必须填写',
            trigger: 'change'
          },
          {
            trigger: 'change',
            validator: validateChinese
          }
        ],
        kValue: [
          {
            required: true,
            message: '请输入指标值，只能为数字',
            trigger: 'change'
          }
        ],
        remark: []
      }
    };
  },
  metas: {
    title: 'KPI基础配置',
    titleTemplate: '%s - 兆航物流TMS后台管理系统'
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
    searchFormMethod() {
      this._getKpiInfo();
    },
    _deleteKpiInfo(row) {
      let delData = [];
      //批量删除
      if (row.type === 'click' && this.multipleSelection.length !== 0) {
        delData = this.multipleSelection.map(v => {
          return v.id;
        });
      }
      //单独删除
      if (row.id) {
        delData = [];
        delData.push(row.id);
      }
      if (delData.length === 0) {
        return Message({
          message: messages.delete.empty,
          type: 'error',
          duration: 1 * 1000
        });
      }
      deleteKpiInfo(delData).then(res => {
        if (res.data.resultCode === 1) {
          this.popoverVisible = false;
          this._getKpiInfo();
          Message({
            message: '删除成功!',
            type: 'success',
            duration: 3 * 1000
          });
        } else {
          Message({
            message: res.data.message,
            type: 'error',
            duration: 1 * 1000
          });
          setTimeout(() => {
            this.popoverVisible = false;
          }, 1000);
        }
      });
    },
    editMethod(row) {
      this.dialog.title = '编辑KPI指标';
      this.dialog.visible = true;
      this.form.id = row.id;
      this.form.kCode = row.kCode;
      this.form.kName = row.kName;
      this.form.kValue = row.kValue;
      this.form.unit = row.unit;
      this.form.cValue = row.cValue;
      this.form.kResult = row.kResult;
      this.form.deptCode = row.deptCode;
      this.form.remark = row.remark;
    },
    addKPIMethod() {
      this.dialog.visible = true;
      this.dialog.title = '新增KPI指标';
      this.resetForm('forms');
    },
    submit(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          //console.log("fuxily"+JSON.stringify(this.form))
          if (this.dialog.title === '编辑KPI指标') {
            return this.submitEditData(this.form);
          }
          this.submitAddData(this.form);
        } else {
          return false;
        }
      });
    },
    submitEditData(data) {
      updateKpiInfo(data).then(res => {
        if (res.data.resultCode !== 1) {
          return Message({
            message: res.data.message,
            type: 'error',
            duration: 3 * 1000
          });
        }
        this._getKpiInfo();
        this.dialog.visible = false;
      });
    },
    submitAddData(data) {
      data.Creator = 'sys';
      addKpiInfo([data]).then(res => {
        if (res.data.resultCode !== 1) {
          return Message({
            message: res.data.message,
            type: 'error',
            duration: 1 * 1000
          });
        }
        this.dialog.visible = false;
        this._getKpiInfo();
      });
    },
    resetForm(formName) {
      if (this.$refs[formName]) {
        this.$refs[formName].resetFields();
      }
    },
    _getKpiInfo() {
      tirmFilter(this.searchForm);
      let data = {
        kCode: this.searchForm.kCode,
        kName: this.searchForm.kName,
        kValue: this.searchForm.kValue,
        kResult: this.searchForm.kResult,
        cValue: this.searchForm.cValue,
        deptCode: this.deptCode,
        pageIndex: this.tables.postParams.currentPage,
        pageSize: this.tables.postParams.pageSize
      };
      //console.log(data.pageIndex);
      getKpiInfo(data).then(res => {
        if (res.data.resultCode === 1) {
          if (this.tables.postParams.currentPage == 1) {
            this.tables.postParams.total = res.data.counts;
          }
          this.tables.getAllKpiData = res.data.data.kpiInfo;
          this.tables.useDepartment = res.data.data.depart;
          return;
        }
        this.tables.getAllKpiData = [];
        Message({
          message: res.data.message,
          type: 'error',
          duration: 3 * 1000
        });
      });
    },
    currentPage(currentPage) {
      //console.log(currentPage);
      this.tables.postParams.currentPage = currentPage;
      this._getKpiInfo();
    }
  },
  created() {
    this._getKpiInfo();
  }
};
</script>
