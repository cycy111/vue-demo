<template>
  <div class="app-container">
    <div class="el-container-custom">
      <el-form
        :inline="true"
        :model="searchForm"
        ref="searchFormRef"
        size="small"
      >
        <el-form-item label="" prop="loginName">
          <el-input
            v-model="searchForm.loginName"
            placeholder="请输入用户编号"
            style="width:150px;"
            clearable
          ></el-input>
        </el-form-item>
        <el-form-item label="" prop="realName" clearable>
          <el-input
            v-model="searchForm.realName"
            placeholder="请输入用户名称"
            style="width:150px;"
            clearable
          ></el-input>
        </el-form-item>
        <el-form-item label="" prop="deptName" clearable>
          <el-input
            v-model="searchForm.deptName"
            placeholder="请输入用户部门"
            clearable
            style="width:150px;"
          ></el-input>
        </el-form-item>
        <!-- <el-form-item label="">
						<el-input placeholder="请输入用户角色"  style="width:150px;"></el-input>
					</el-form-item> -->
        <el-form-item label="" prop="position" clearable>
          <el-input
            v-model="searchForm.position"
            placeholder="请输入用户职位"
            clearable
            style="width:150px;"
          ></el-input>
        </el-form-item>
        <!-- <el-form-item label="" prop="userType">
						<el-input v-model="searchForm.userType" placeholder="请选择用户类别"   style="width:150px;"></el-input>
					</el-form-item> -->

        <el-form-item label="" :label-width="'80px'" prop="userType" clearable>
          <el-select
            v-model="searchForm.userType"
            placeholder="请选择用户类别"
            clearable
          >
            <el-option
              v-for="(item, index) in form.userTypeList"
              :value-key="item.value"
              :key="index"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="" :label-width="'80px'" prop="roleId" clearable>
          <el-select
            v-model="searchForm.roleId"
            placeholder="请选择用户角色"
            clearable
          >
            <el-option
              v-for="(item, index) in roleSelections.options"
              :value-key="item.value"
              :key="index"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" size="small" @click="searchFormMethod(1)"
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
      <el-container>
        <el-form :inline="true">
          <el-form-item>
            <el-button type="success" size="small" @click="addUserMethod"
              ><i class="iconfont icon-Create_member"></i>新增用户</el-button
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
                <el-button type="primary" size="mini" @click="_DeleteUser"
                  >确定</el-button
                >
              </div>
              <el-button type="danger" size="small" slot="reference"
                ><i class="iconfont icon-shanchu"></i>删除用户</el-button
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
      :data="tables.getAllUsersData"
      tooltip-effect="dark"
      size="mini"
      @selection-change="
        val => {
          return (this.multipleSelection = val);
        }
      "
      @sort-change="sortChangeFunc"
    >
      <el-table-column type="selection" width="55"></el-table-column>
      <el-table-column
        prop="loginName"
        label="登录名"
        width="100"
        sortable="custom"
      ></el-table-column>
      <el-table-column
        prop="realName"
        label="用户名称"
        width="120"
        sortable="custom"
      ></el-table-column>
      <el-table-column
        prop="deptName"
        label="部门"
        width="100"
        sortable="custom"
      ></el-table-column>
      <el-table-column
        prop="roleNames"
        label="角色"
        width="100"
      ></el-table-column>
      <el-table-column
        prop="businessNames"
        label="TMS业务"
        width="100"
      ></el-table-column>
      <el-table-column
        label="用户类别"
        prop="userTypeDesc"
        show-overflow-tooltip
        width="105"
      ></el-table-column>
      <!-- <el-table-column prop="mobile" label="移动电话" show-overflow-tooltip></el-table-column>
			<el-table-column prop="email" label="电子邮件" show-overflow-tooltip></el-table-column> -->
      <!-- <el-table-column prop="" label="备注" show-overflow-tooltip></el-table-column> -->
      <!-- <el-table-column prop="modifierName" label="操作人" show-overflow-tooltip width="80"></el-table-column> -->
      <el-table-column
        prop="wmsDepartmentNames"
        label="WMS项目权限"
        width="500"
      ></el-table-column>
      <el-table-column
        prop="editDate"
        label="操作时间"
        show-overflow-tooltip
        width="120"
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
                @click="_DeleteUser(caozuo.row)"
                >确定</el-button
              >
            </div>
            <el-button size="mini" slot="reference"
              ><i class="iconfont icon-shanchu"></i>删除</el-button
            >
          </el-popover>
          <!-- <el-button size="mini" @click="_DeleteUser(caozuo.row)"><i class="iconfont icon-shanchu"></i>删除</el-button> -->
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
      :visible.sync="dialogTableVisible"
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
          label="登录名"
          title="用户编号"
          :label-width="'80px'"
          prop="loginName"
        >
          <el-input
            v-model="form.loginName"
            auto-complete="off"
            style="width:217px"
            placeholder="必填"
            :disabled="formConfig.disabled"
          ></el-input>
        </el-form-item>
        <el-form-item label="用户名称" :label-width="'80px'" prop="realName">
          <el-input
            v-model="form.realName"
            auto-complete="off"
            style="width:217px"
          ></el-input>
        </el-form-item>
        <el-form-item label="所属部门" :label-width="'80px'" prop="deptName">
          <el-input
            v-model="form.deptName"
            auto-complete="off"
            style="width:217px"
          ></el-input>
        </el-form-item>
        <el-form-item label="用户状态" :label-width="'80px'" prop="userStatus">
          <el-select v-model="form.userStatus" placeholder="请选择用户状态">
            <el-option
              v-for="(item, index) in form.userStatusList"
              :value-key="item.value"
              :key="index"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="职位" :label-width="'80px'" prop="position">
          <el-input
            v-model="form.position"
            auto-complete="off"
            style="width:217px"
          ></el-input>
        </el-form-item>
        <el-form-item
          label="用户类别"
          :label-width="'80px'"
          prop="userType"
          clearable
        >
          <el-select v-model="form.userType" placeholder="请选择用户状态">
            <el-option
              v-for="(item, index) in form.userTypeList"
              :value-key="item.value"
              :key="index"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="权限类别" :label-width="'80px'" prop="rightsType">
          <el-select
            v-model="form.rightsType"
            placeholder="请选择用户状态"
            @change="rightsTypeChange"
          >
            <el-option
              v-for="(item, index) in form.rightsTypeList"
              :value-key="item.value"
              :key="index"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="截止日期" :label-width="'80px'" prop="validDate">
          <el-date-picker
            type="date"
            style="width:217px;"
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd"
            v-model="form.validDate"
            placeholder="选择截至使用日期"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="邮箱地址" :label-width="'80px'" prop="email">
          <el-input
            v-model="form.email"
            auto-complete="off"
            style="width:217px"
          ></el-input>
        </el-form-item>
        <el-form-item label="移动电话" :label-width="'80px'" prop="mobile">
          <el-input
            v-model="form.mobile"
            auto-complete="off"
            style="width:217px"
          ></el-input>
        </el-form-item>
        <el-form-item label="初始密码" :label-width="'80px'" prop="pwd">
          <el-input
            v-model="form.pwd"
            type="password"
            auto-complete="off"
            style="width:217px"
            placeholder="请输入初始密码"
          ></el-input>
        </el-form-item>
        <el-form-item label="备注说明" :label-width="'80px'" prop="remark">
          <el-input
            v-model="form.remark"
            type="textarea"
            auto-complete="off"
            :style="dialog.title === '编辑用户' ? 'width:526px' : 'width:217px'"
          ></el-input>
        </el-form-item>
        <el-form-item
          label="TMS业务列表"
          :label-width="'80px'"
          prop="businessList"
          v-if="superAdminObj.isShow"
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
          v-if="superAdminObj.isShow"
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
              v-for="(item, index) in selections.useDepartment"
              :key="index"
              :label="item.label"
              :value="item"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item
          label="角色列表"
          :label-width="'80px'"
          prop="roleList"
          v-if="superAdminObj.isShow"
        >
          <el-select
            v-model="form.roleList"
            multiple
            filterable
            placeholder="请输入关键词"
          >
            <el-option
              v-for="(item, index) in roleSelections.options"
              :value-key="item.value"
              :key="index"
              :label="item.label"
              :value="item"
            ></el-option>
          </el-select>
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
import md5 from 'md5';
import { Message } from 'element-ui';
import {
  getAllUsers,
  deleteUser,
  getUserInfo,
  modifyUser,
  createUser
} from '@/api/users';
import { getKpiInfo } from '@/api/yuebao/kpiBase';

import { getRoleList } from '@/api/roles';
import { getBaseData, getDictionaryData } from '@/api/baseData';
import { validateLoginName, validateMoblePhone } from '@/utils/validate';

import messages from '@/utils/messages';
import { tirmFilter } from '@/utils/tools';

import * as screenfull from 'screenfull';
import '@/directives/dialogCtrl.js';
export default {
  data() {
    return {
      popoverVisible: false,
      dialog: {
        title: '新增用户'
      },
      oldOptions: '',
      messages: messages,
      multipleSelection: [],
      dialogTableVisible: false,
      tables: {
        tableMaxHeight: document.body.clientHeight - 280,
        getAllUsersData: [],
        dialogVisible: false,
        dialogVisibleDetails: false,
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
        loginName: '',
        realName: '',
        deptName: '',
        userType: '',
        position: '',
        roleId: ''
      },
      form: {
        userId: '',
        loginName: '', //登录名
        realName: '', //用户名称
        deptName: '', //所属部门
        userType: '', //用户类别
        userTypeList: [],
        userStatus: '',
        remark: '',
        userStatusList: [],
        position: '', //职位
        validDate: '', //截止日期
        email: '',
        mobile: '',
        pwd: '',
        rightsType: '',
        rightsTypeList: [],
        roleList: [],
        businessList: [],
        wmsDepartmentList: []
      },
      formConfig: {
        disabled: false
      },
      rules: {
        loginName: [
          {
            required: true,
            trigger: 'change',
            message: '登录名必须填写'
          },
          {
            trigger: 'change',
            validator: (rule, value, callback) => {
              validateLoginName(rule, value, callback);
            }
          }
        ],
        realName: [
          {
            required: true,
            trigger: 'change',
            message: '用户名称必须填写'
          }
        ],
        userType: [
          {
            required: true,
            trigger: 'change',
            message: '用户类别必须选择'
          }
        ],
        rightsType: [
          {
            required: true,
            trigger: 'change',
            message: '权限类别必须选择'
          }
        ],
        userStatus: [
          {
            required: true,
            trigger: 'change',
            message: '用户状态必须选择'
          }
        ],
        deptName: [
          {
            required: true,
            trigger: 'change',
            message: '所属部门必须填写'
          }
        ],
        businessList: [
          {
            required: false,
            trigger: 'change',
            message: '业务必须选择'
          }
        ],
        roleList: [
          {
            required: true,
            trigger: 'change',
            message: '角色必须选择'
          }
        ],
        pwd: [
          {
            required: true,
            trigger: 'change',
            message: '密码必须填写'
          }
        ],
        mobile: [
          {
            trigger: 'change',
            validator: (rule, value, callback) => {
              validateMoblePhone(rule, value, callback);
            }
          }
        ],
        email: [
          { required: false, message: '请输入邮箱地址', trigger: 'change' },
          { type: 'email', message: '请输入正确的邮箱地址', trigger: 'change' }
        ]
      },
      selections: {
        options: [],
        useDepartment: []
      },
      roleSelections: {
        options: []
      },
      superAdminObj: {
        isShow: true
      }
    };
  },
  metas: {
    title: '用户列表',
    titleTemplate: '%s - 兆航物流TMS后台管理系统'
  },
  methods: {
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
    searchFormMethod(currentPage) {
      if (currentPage) {
        this.tables.postParams.currentPage = currentPage;
      }
      tirmFilter(this.searchForm);
      let data = {
        ...this.searchForm,
        orderProp: this.tables.postParams.orderProp,
        orderDirection: this.tables.postParams.orderDirection,
        pageSize: this.tables.postParams.pageSize,
        pageIndex: this.tables.postParams.currentPage
      };
      this._getAllUsers(data);
    },
    rightsTypeChange() {
      this.setrightsType();
    },
    _DeleteUser(row) {
      let delData = [];
      //批量删除
      if (row.type === 'click' && this.multipleSelection.length !== 0) {
        delData = this.multipleSelection.map(v => {
          return v.userId;
        });
      }
      //单独删除
      if (row.userId) {
        delData = [];
        delData.push(row.userId);
      }
      if (delData.length === 0) {
        return Message({
          message: messages.delete.empty,
          type: 'error',
          duration: 1 * 1000
        });
      }

      deleteUser(delData).then(res => {
        if (res.data.resultCode === 1) {
          this.popoverVisible = false;
          this._getAllUsers();
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
      this.rules.pwd = []; //编辑时不需要验证初始密码
      this.dialogTableVisible = true;
      this.dialog.title = '编辑用户';
      this.formConfig.disabled = true;
      this.form.userId = row.userId;
      getUserInfo({
        userId: row.userId
      }).then(res => {
        if (res.data.resultCode === 1) {
          let data = res.data.data;
          this.form.loginName = data.loginName;
          this.form.realName = data.realName;
          this.form.deptName = data.deptName;
          this.form.userStatus = data.userStatus;
          this.form.position = data.position;
          this.form.validDate = data.validDate;
          this.form.email = data.email;
          this.form.mobile = data.mobile;
          this.form.userType = data.userType;
          this.form.rightsType = data.rightsType;
          this.form.wmsDepartmentList = data.wmsDepartmentList.map(item => {
            item.value = item.deptCode;
            item.label = item.deptName;
            return item;
          });
          this.form.businessList = data.businessList.map(item => {
            return {
              value: item.businessId,
              label: item.businessName,
              businessCode: item.businessCode,
              businessId: item.businessId,
              businessName: item.businessName
            };
          });
          this.form.roleList = data.roleList.map(item => {
            return {
              value: item.roleId,
              label: item.roleName,
              roleId: item.roleId,
              roleName: item.roleName
            };
          });
          this.setrightsType();
        }
      });
    },
    addUserMethod() {
      this.dialogTableVisible = true;
      this.dialog.title = '新增用户';
      this.formConfig.disabled = false;
      this.resetForm('forms');
      setTimeout(() => {
        this.form.userStatus = this.form.userStatusList[0].value;
        this.form.userType = this.form.userTypeList[1].value;
        this.form.rightsType = this.form.rightsTypeList[1].value;
      }, 100);
      //如果权限类别是超级管理员，取消业务列表，角色列表
      this.setrightsType();
    },
    setrightsType() {
      if (this.form.rightsType === 'SuperAdmin') {
        this.superAdminObj.isShow = false;
        this.rules.businessList = [];
        this.rules.roleList = [];
      } else {
        this.superAdminObj.isShow = true;
      }
    },
    submit(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          //提交的时候去除WMS权限的全部选项。
          let data = JSON.parse(JSON.stringify(this.form));
          if (data.wmsDepartmentList && data.wmsDepartmentList.length) {
            let wmsDepartmentList = [];
            for (let item of data.wmsDepartmentList) {
              if (item.label != '全部') {
                wmsDepartmentList.push(item);
              }
            }
            data.wmsDepartmentList = wmsDepartmentList;
          }
          data.pwd = md5(data.pwd);
          if (this.dialog.title === '编辑用户') {
            //console.log(this.form)
            return this.submitEditData(data);
          } else {
            this.submitAddData(data);
          }
        } else {
          return false;
        }
      });
    },
    submitEditData(data) {
      this.setrightsType();
      if (data.businessList.length) {
        data.businessList.map(item => {
          item.businessId = item.value;
          item.businessCode = item.value;
          item.businessName = item.label;
        });
      }
      if (data.roleList.length) {
        data.roleList.map(item => {
          item.roleId = item.value;
          item.roleName = item.label;
        });
      }
      modifyUser(data).then(res => {
        if (res.data.resultCode !== 1) {
          return Message({
            message: res.data.message,
            type: 'error',
            duration: 3 * 1000
          });
        }
        this._getAllUsers();
        this.dialogTableVisible = false;
      });
    },
    submitAddData(data) {
      this.setrightsType();

      if (data.businessList.length) {
        data.businessList.map(item => {
          item.businessId = item.value;
          item.businessCode = item.value;
          item.businessName = item.label;
        });
      }
      if (data.roleList.length) {
        data.roleList.map(item => {
          item.roleId = item.value;
          item.roleName = item.label;
        });
      }
      createUser(data).then(res => {
        if (res.data.resultCode === 1) {
          this.dialogTableVisible = false;
          return this._getAllUsers();
        }
        Message({
          message: res.data.message,
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
    _getAllUsers(data) {
      getAllUsers(
        data
          ? data
          : {
              orderProp: this.tables.postParams.orderProp,
              orderDirection: this.tables.postParams.orderDirection,
              pageSize: this.tables.postParams.pageSize,
              pageIndex: this.tables.postParams.currentPage
            }
      ).then(res => {
        if (res.data.resultCode === 1) {
          this.tables.getAllUsersData = res.data.data;
          if (res.data.pageIndex == 1) {
            this.tables.postParams.total = res.data.counts;
          }
          return;
        }
        this.tables.getAllUsersData = [];
        Message({
          message: res.data.message,
          type: 'error',
          duration: 3 * 1000
        });
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
    _getDictionaryData() {
      getDictionaryData([
        'Users_UserType',
        'Users_UserStatus',
        'Users_RightsType'
      ]).then(res => {
        if (res.data.resultCode === 1) {
          let data = res.data.data;
          this.form.userStatusList = data.Users_UserStatus.map(item => {
            item.value = item.code;
            item.label = item.name;
            return item;
          });
          this.form.userTypeList = data.Users_UserType.map(item => {
            item.value = item.code;
            item.label = item.name;
            return item;
          });
          this.form.rightsTypeList = data.Users_RightsType.map(item => {
            item.value = item.code;
            item.label = item.name;
            return item;
          });
        }
      });
    },
    //获取角色列表
    _getRoleList() {
      getRoleList({}).then(res => {
        if (res.data.resultCode === 1 && res.data.data) {
          this.roleSelections.options = res.data.data.map(item => {
            return {
              value: item.roleId,
              label: item.roleName
            };
          });
        }
      });
    },
    //获取项目数据/部门数据
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
    currentPageChange(currentPageNum) {
      this.searchFormMethod(currentPageNum);
    },
    sortChangeFunc(obj) {
      this.tables.postParams.orderDirection = obj.order;
      this.tables.postParams.orderProp = obj.prop;
      this.searchFormMethod(1);
    }
  },
  mounted() {
    this._getBaseData();
    this._getRoleList();
    this._getDictionaryData();
    this._getKpiInfo();
  },
  created() {}
};
</script>
