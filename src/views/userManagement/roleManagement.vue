<template>
  <div class="app-container">
    <div class="el-container-custom">
      <el-container>
        <el-form :inline="true" :model="searchform">
          <el-form-item label="角色名称">
            <el-input
              placeholder="角色名称"
              size="small"
              v-model="searchform.roleName"
            ></el-input>
          </el-form-item>
          <el-form-item label="角色描述">
            <el-input
              placeholder="角色描述"
              size="small"
              v-model="searchform.roleDesc"
            ></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" size="small" @click="queryRoles"
              >查询</el-button
            >
          </el-form-item>
        </el-form>
      </el-container>
      <el-container>
        <el-form :inline="true">
          <el-form-item>
            <el-button type="success" size="small" @click="addMethod"
              ><i class="iconfont icon-Create_member"></i>新增角色</el-button
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
                <el-button type="primary" size="mini" @click="_deleteRole"
                  >确定</el-button
                >
              </div>
              <el-button type="danger" size="small" slot="reference"
                ><i class="iconfont icon-shanchu"></i>删除角色</el-button
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
      :data="tables.getAllRoleData"
      tooltip-effect="dark"
      size="mini"
      @selection-change="
        val => {
          return (this.multipleSelection = val);
        }
      "
    >
      <el-table-column type="selection" width="55"></el-table-column>
      <el-table-column
        prop="roleName"
        label="角色名称"
        width="100"
      ></el-table-column>
      <el-table-column
        prop="roleDesc"
        label="角色描述"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column prop="status" label="角色状态" show-overflow-tooltip>
        <template slot-scope="rows">
          <span v-if="rows.row.status === '正常'" style="color:#67C23A;">{{
            rows.row.status
          }}</span>
          <span v-else style="color:#F56C6C;">{{ rows.row.status }}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="remark"
        label="备注"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column
        prop="modifierName"
        label="操作人"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column
        prop="modifyDate"
        label="操作时间"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column label="操作">
        <template slot-scope="caozuo">
          <el-button size="mini" @click="editMethod(caozuo.row)">
            <i class="iconfont icon-bj"></i>编辑</el-button
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
                @click="_deleteRole(caozuo.row)"
                >确定</el-button
              >
            </div>
            <el-button size="mini" slot="reference"
              ><i class="iconfont icon-shanchu"></i>删除</el-button
            >
          </el-popover>
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
      :visible.sync="dialogTableVisible"
      width="1000px"
      :close-on-click-modal="false"
      v-dialogDrag
      v-dialogDragWidth
    >
      <el-form
        :model="form"
        ref="form"
        status-icon
        :rules="rules"
        label-width="80px"
        :inline="true"
        label-position="right"
        size="small"
      >
        <el-form-item label="角色名称" :label-width="'80px'" prop="roleName">
          <el-input
            v-model="form.roleName"
            auto-complete="off"
            style="width:217px"
            placeholder="必填"
          ></el-input>
        </el-form-item>
        <el-form-item label="角色描述" :label-width="'80px'" prop="roleDesc">
          <el-input
            v-model="form.roleDesc"
            auto-complete="off"
            style="width:217px"
            placeholder="必填"
          ></el-input>
        </el-form-item>
        <el-form-item label="角色类别" :label-width="'80px'" prop="roleType">
          <el-select v-model="form.roleType" placeholder="请选择角色类别">
            <el-option
              v-for="(item, index) in form.roleTypeList"
              :key="index"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="角色备注" :label-width="'80px'" prop="remark">
          <el-input
            type="textarea"
            v-model="form.remark"
            auto-complete="off"
            style="width:528px"
          ></el-input>
        </el-form-item>
        <el-form-item label="角色状态" :label-width="'80px'" prop="status">
          <el-select v-model="form.status" placeholder="请选择角色状态">
            <el-option
              v-for="(item, index) in form.statusList"
              :key="index"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="模块权限" :label-width="'80px'" prop="moduleList">
          <span :key="index" v-for="(item, index) in options">{{
            item.moduleNo
          }}</span>
          <el-select
            v-model="form.moduleList"
            multiple
            filterable
            placeholder="请分配对应模块权限"
          >
            <el-option
              v-for="(item, index) in options"
              :value-key="item.value"
              :key="index"
              :label="item.label"
              :value="item"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item
          label="TMS业务列表"
          :label-width="'80px'"
          prop="businessList"
        >
          <el-select
            v-model="form.businessList"
            multiple
            filterable
            placeholder="请输入关键词"
          >
            <el-option
              :value-key="item.value"
              v-for="item in selections.options"
              :key="item.value"
              :label="item.label"
              :value="item"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item
          label="WMS项目权限"
          :label-width="'80px'"
          prop="wmsDepartmentList"
        >
          <el-select
            v-model="form.wmsDepartmentList"
            multiple
            filterable
            collapse-tags
            placeholder="请选择"
            @change="wmsDepartChangeEvent"
          >
            <el-option
              :value-key="item.value"
              v-for="item in selections.useDepartment"
              :key="item.value"
              :label="item.label"
              :value="item"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="resetForm('form')">重置</el-button>
        <el-button type="primary" @click="submitRole('form')">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { Message } from 'element-ui';
import {
  getRoleList,
  createRole,
  deleteRole,
  updateRole,
  getRoleInfo
} from '@/api/roles';
import { getBaseData, getDictionaryData } from '@/api/baseData';
import { getKpiInfo } from '@/api/yuebao/kpiBase';
import { getAllModules } from '@/api/modules';
import * as screenfull from 'screenfull';
import messages from '@/utils/messages';
import '@/directives/dialogCtrl.js';
export default {
  data() {
    return {
      popoverVisible: false,
      messages: messages,
      dialog: {
        title: '提示'
      },
      oldOptions: [],
      multipleSelection: [],
      dialogTableVisible: false,
      tables: {
        tableMaxHeight: document.body.clientHeight - 230,
        getAllRoleData: [],
        pageSizes: [10, 20, 30, 40],
        postParams: {
          currentPage: 1,
          pageSize: 10,
          total: 0
        }
      },
      form: {
        roleId: '',
        roleName: '',
        roleDesc: '',
        roleType: '',
        status: '',
        statusList: [],
        remark: '',
        moduleList: [],
        roleTypeList: [],
        businessList: [],
        wmsDepartmentList: []
      },
      selections: {
        options: [],
        useDepartment: []
      },
      rules: {
        roleName: [
          {
            required: true,
            trigger: 'change',
            message: '角色名称必须填写'
          }
        ],
        roleDesc: [
          {
            required: true,
            trigger: 'change',
            message: '角色描述必须填写'
          }
        ],
        roleType: [
          {
            required: true,
            trigger: 'change',
            message: '角色类别必须选择'
          }
        ],
        status: [
          {
            required: true,
            trigger: 'change',
            message: '角色状态必须选择'
          }
        ]
      },
      searchform: {
        roleName: '',
        roleDesc: ''
      },
      options: []
    };
  },
  metas: {
    title: '角色管理',
    titleTemplate: '%s - 兆航物流TMS后台管理系统'
  },
  methods: {
    _deleteRole(row) {
      let delData = [];
      //批量删除
      if (row.type === 'click' && this.multipleSelection.length !== 0) {
        delData = this.multipleSelection.map(v => {
          return v.roleId;
        });
      }
      //单独删除
      if (row.roleId) {
        delData = [];
        delData.push(row.roleId);
      }
      if (delData.length === 0) {
        return Message({
          message: messages.delete.empty,
          type: 'error',
          duration: 1 * 1000
        });
      }
      deleteRole(delData).then(res => {
        if (res.data.resultCode === 1) {
          this.popoverVisible = false;
          this._getRoleList();
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
    isIncludeAll(optionArr) {
      if (!optionArr) {
        return false;
      }
      for (let item of optionArr) {
        if (item.label === '全部') {
          return true;
        }
      }
      return false;
    },
    editMethod(row) {
      this.dialogTableVisible = true;
      this.dialog.title = '编辑角色';
      this.resetForm('form');
      this.form.roleId = row.roleId;
      getRoleInfo(row.roleId).then(res => {
        if (res.data.resultCode === 1) {
          let data = res.data.data;
          this.form.roleName = data.roleName;
          this.form.roleDesc = data.roleDesc;
          this.form.roleType = data.roleType;
          this.form.status = data.status;
          this.form.remark = data.remark;
          this.form.moduleList = this.options.filter(item1 => {
            return data.moduleList.some(item2 => {
              return item1.value === item2.moduleNo;
            });
          });
          this.form.businessList = this.selections.options.filter(item1 => {
            return data.businessList.some(item2 => {
              return item1.value === item2.businessId;
            });
          });
          this.form.wmsDepartmentList = this.selections.useDepartment.filter(
            item1 => {
              return data.wmsDepartmentList.some(item2 => {
                return item1.value === item2.deptCode;
              });
            }
          );
        }
      });
    },
    addMethod() {
      this.dialogTableVisible = true;
      this.dialog.title = '新增角色';
      this.resetForm('form');
    },
    wmsDepartChangeEvent(val) {
      let allValues = [];
      //保留所有值
      for (let item of this.selections.useDepartment) {
        allValues.push(item);
      }
      // 用来储存上一次的值，可以进行对比
      const oldVal = this.oldOptions.length === 1 ? [] : this.oldOptions;

      // 若是全部选择
      if (this.isIncludeAll(val)) this.form.wmsDepartmentList = allValues;

      // 取消全部选中  上次有 当前没有 表示取消全选
      if (this.isIncludeAll(oldVal) && !this.isIncludeAll(val))
        this.form.wmsDepartmentList = [];

      // 点击非全部选中  需要排除全部选中 以及 当前点击的选项
      // 新老数据都有全部选中
      if (this.isIncludeAll(oldVal) && this.isIncludeAll(val)) {
        // const index = val.indexOf('1')
        val.splice(0, 1); // 排除全选选项
        this.form.wmsDepartmentList = val;
      }

      //全选未选 但是其他选项全部选上 则全选选上 上次和当前 都没有全选
      if (!this.isIncludeAll(oldVal) && !this.isIncludeAll(val)) {
        if (val.length === allValues.length - 1)
          this.form.wmsDepartmentList = [{ label: '全部', value: '1' }].concat(
            val
          );
      }

      //储存当前最后的结果 作为下次的老数据
      this.oldOptions = this.form.wmsDepartmentList;
    },
    _getKpiInfo(data) {
      getKpiInfo(data ? data : { type: 3 }).then(res => {
        if (res.data.resultCode === 1) {
          if (res.data.data.depart && res.data.data.depart.length) {
            this.selections.useDepartment = res.data.data.depart;
            this.selections.useDepartment.unshift({
              deptName: '全部',
              deptCode: '1',
              label: '全部',
              value: '1'
            });
            return;
          }
        }
        this.selections.useDepartment = [];
        Message({
          message: res.data.message,
          type: 'error',
          duration: 3 * 1000
        });
      });
    },
    submitRole(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          let data = JSON.parse(JSON.stringify(this.form));
          if (data.wmsDepartmentList && data.wmsDepartmentList.length) {
            let wmsDepartmentList = [];
            for (let item of data.wmsDepartmentList) {
              if (item.label != '全部') {
                wmsDepartmentList.push({
                  deptCode: item.deptCode,
                  roleId: data.roleId
                });
              }
            }
            data.wmsDepartmentList = wmsDepartmentList;
          }
          if (data.businessList.length) {
            let businessList = [];
            data.businessList.map(item => {
              item.businessId = item.value;
              item.businessCode = item.value;
              item.businessName = item.label;
              businessList.push({
                businessId: item.businessId,
                roleId: data.roleId
              });
            });
            data.businessList = businessList;
          }
          if (data.moduleList.length) {
            data.moduleList.map(item => {
              item.moduleNo = item.value;
              item.moduleName = item.label;
            });
          }
          if (this.dialog.title === '新增角色') {
            return this.submitAddRole(data);
          }
          this.submitEditRole(data);
        } else {
          return false;
        }
      });
    },
    submitEditRole(data) {
      updateRole(data).then(res => {
        if (res.data.resultCode === 1) {
          Message({
            message: res.data.message,
            type: 'success',
            duration: 2 * 1000
          });
          this.dialogTableVisible = false;
          this._getRoleList();
        } else {
          Message({
            message: res.data.message,
            type: 'error',
            duration: 2 * 1000
          });
        }
      });
    },
    submitAddRole(data) {
      createRole(data).then(res => {
        if (res.data.resultCode === 1) {
          this.dialogTableVisible = false;
          this._getRoleList();
        } else {
          Message({
            message: res.data.message,
            type: 'error',
            duration: 2 * 1000
          });
        }
      });
    },
    resetForm(formName) {
      if (this.$refs[formName]) {
        this.$refs[formName].resetFields();
      }
    },
    queryRoles() {
      this._getRoleList({
        roleName: this.searchform.roleName,
        roleDesc: this.searchform.roleDesc
      });
    },
    _getBaseData() {
      getBaseData().then(res => {
        if (res.data.resultCode === 1 && res.data.data) {
          this.selections.options = res.data.data.businessList.map(item => {
            return {
              value: item.businessId,
              label: item.businessName
            };
          });
        }
      });
    },
    _getRoleList(data) {
      getRoleList(data ? data : {}).then(res => {
        if (res.data.resultCode === 1 && res.data.data) {
          let tempArr = res.data.data;
          tempArr.map((val, i) => {
            val.visible = false;
          });
          this.tables.getAllRoleData = tempArr;
          this.tables.postParams.total = res.data.totalCount;
        } else {
          this.tables.getAllRoleData = [];
        }
      });
    },
    _getAllModules() {
      //获取权限模块
      getAllModules({ pageIndex: 1, pageSize: 50 }).then(res => {
        if (res.data.resultCode === 1) {
          this.options = res.data.data.map(item => {
            return {
              value: item.moduleNo,
              label: item.moduleName
            };
          });
        } else {
          Message({
            message: res.data.message,
            type: 'error',
            duration: 2 * 1000
          });
        }
      });
    },
    _getDictionaryData() {
      getDictionaryData(['Role_RoleType', 'Role_Status']).then(res => {
        if (res.data.resultCode === 1) {
          let data = res.data.data;
          this.form.statusList = data.Role_Status.map(item => {
            item.value = item.code;
            item.label = item.name;
            return item;
          });
          this.form.roleTypeList = data.Role_RoleType.map(item => {
            item.value = item.code;
            item.label = item.name;
            return item;
          });
        }
      });
    }
  },
  mounted() {
    this._getRoleList();
    this._getBaseData();
    this._getAllModules();
    this._getDictionaryData();
    this._getKpiInfo();
  }
};
</script>
