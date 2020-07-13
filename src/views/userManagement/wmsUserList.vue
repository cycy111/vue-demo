<template>
  <div class="app-container">
    <div class="el-container-custom">
      <el-form
        :inline="true"
        :model="searchForm"
        ref="searchFormRef"
        size="small"
      >
        <el-form-item label prop="loginName">
          <el-input
            v-model="searchForm.userCode"
            placeholder="请输入用户编号"
            style="width:150px;"
            clearable
          ></el-input>
        </el-form-item>
        <el-form-item label prop="realName" clearable>
          <el-input
            v-model="searchForm.userName"
            placeholder="请输入用户名称"
            style="width:150px;"
            clearable
          ></el-input>
        </el-form-item>
        <el-form-item label :label-width="'80px'" prop="userType" clearable>
          <el-select
            v-model="searchForm.dftDept"
            filterable
            placeholder="请选择部门"
            clearable
          >
            <el-option
              v-for="(item, index) in useDepartmentData"
              :value-key="item.value"
              :key="index"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <!-- <el-form-item label="">
						<el-input placeholder="请输入用户角色"  style="width:150px;"></el-input>
        </el-form-item>-->
        <el-form-item label :label-width="'80px'" prop="userType" clearable>
          <el-select
            v-model="searchForm.port"
            filterable
            placeholder="请选择端口"
            clearable
          >
            <el-option
              v-for="(item, index) in portDept"
              :value-key="item.portCode"
              :key="index"
              :label="item.portCode"
              :value="item.portCode"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label :label-width="'80px'" prop="userType" clearable>
          <el-select
            v-model="searchForm.locked"
            filterable
            placeholder="请选择启用状态"
            clearable
          >
            <el-option
              v-for="(item, index) in lockStatus"
              :value-key="item.value"
              :key="index"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>

        <!-- <el-form-item label="" prop="userType">
						<el-input v-model="searchForm.userType" placeholder="请选择用户类别"   style="width:150px;"></el-input>
        </el-form-item>-->

        <el-form-item>
          <el-button type="primary" size="small" @click="searchFormMethod(1)"
            >查询</el-button
          >
        </el-form-item>
        <el-form-item>
          <el-button type="default" size="small" @click="resetSearchForm"
            >清空</el-button
          >
        </el-form-item>
        <el-form-item>
          <el-button type="success" size="small" @click="downStorageSetList"
            >导出</el-button
          >
        </el-form-item>
      </el-form>
      <el-container>
        <el-form :inline="true">
          <el-form-item>
            <el-button type="success" size="small" @click="addUserMethod">
              <i class="iconfont icon-Create_member"></i>新增用户
            </el-button>
          </el-form-item>
          <el-form-item>
            <el-popover placement="bottom" width="160" v-model="popoverVisible">
              <p>{{ messages.enableUser.enable }}</p>
              <div style="text-align: right; margin: 0">
                <el-button
                  size="mini"
                  type="text"
                  @click="popoverVisible = false"
                  >取消</el-button
                >
                <el-button
                  type="primary"
                  size="mini"
                  @click="batchChangeLock('N')"
                  >确定</el-button
                >
              </div>
              <el-button type="danger" size="small" slot="reference">
                <i class="iconfont icon-shanchu"></i>批量启用
              </el-button>
            </el-popover>
          </el-form-item>
          <el-form-item>
            <el-popover
              placement="bottom"
              width="160"
              v-model="popoverVisible2"
            >
              <p>{{ messages.enableUser.disable }}</p>
              <div style="text-align: right; margin: 0">
                <el-button
                  size="mini"
                  type="text"
                  @click="popoverVisible2 = false"
                  >取消</el-button
                >
                <el-button
                  type="primary"
                  size="mini"
                  @click="batchChangeLock('Y')"
                  >确定</el-button
                >
              </div>
              <el-button type="danger" size="small" slot="reference">
                <i class="iconfont icon-shanchu"></i>批量禁用
              </el-button>
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
      <el-table-column type="index" label="序号" width="45"></el-table-column>
      <el-table-column
        prop="userCode"
        label="用户编号"
        width="100"
      ></el-table-column>
      <el-table-column
        prop="userName"
        label="用户名称"
        width="120"
      ></el-table-column>
      <el-table-column
        prop="deptName"
        label="默认部门"
        width="100"
      ></el-table-column>
      <el-table-column
        prop="mobilePhone"
        label="移动电话"
        width="150"
      ></el-table-column>
      <el-table-column
        prop="position"
        label="职位"
        width="100"
      ></el-table-column>
      <el-table-column
        label="端口号"
        prop="port"
        show-overflow-tooltip
        width="150"
      ></el-table-column>
      <!-- <el-table-column prop="mobile" label="移动电话" show-overflow-tooltip></el-table-column>
      <el-table-column prop="email" label="电子邮件" show-overflow-tooltip></el-table-column>-->
      <!-- <el-table-column prop="" label="备注" show-overflow-tooltip></el-table-column> -->
      <!-- <el-table-column prop="modifierName" label="操作人" show-overflow-tooltip width="80"></el-table-column> -->
      <el-table-column
        prop="updateTime"
        label="更新时间"
        width="200"
      ></el-table-column>
      <el-table-column
        prop="lastLoginTime"
        label="最后登陆时间"
        width="200"
      ></el-table-column>
      <el-table-column label="操作">
        <template slot-scope="caozuo">
          <el-button size="mini" @click="editMethod(caozuo.row)">
            <i class="iconfont icon-bj"></i>编辑
          </el-button>
          <el-popover
            placement="bottom"
            width="160"
            v-model="caozuo.row.visible"
          >
            <p>
              {{
                caozuo.row.locked == 'Y'
                  ? messages.enableUser.enable
                  : messages.enableUser.disable
              }}
            </p>
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
                @click="
                  changeLock(
                    [caozuo.row.userSign],
                    caozuo.row.locked == 'Y' ? 'N' : 'Y'
                  )
                "
                >确定</el-button
              >
            </div>
            <el-button
              v-if="caozuo.row.locked == 'Y'"
              size="mini"
              slot="reference"
            >
              <i class="iconfont icon-shanchu"></i>启用
            </el-button>
            <el-button
              v-if="caozuo.row.locked != 'Y'"
              size="mini"
              slot="reference"
            >
              <i class="iconfont icon-shanchu"></i>禁用
            </el-button>
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
        ref="addUserForm"
        status-icon
        :rules="rules"
        label-width="80px"
        :inline="true"
        label-position="right"
        size="small"
      >
        <el-form-item label="用户编号" :label-width="'80px'" prop="userCode">
          <el-input
            v-model="form.userCode"
            auto-complete="off"
            style="width:217px"
            placeholder="字母与数字组合"
            :disabled="formConfig.disabled"
          ></el-input>
        </el-form-item>
        <el-form-item label="用户名称" :label-width="'80px'" prop="userName">
          <el-input
            v-model="form.userName"
            auto-complete="off"
            placeholder="请输入真实姓名"
            style="width:217px"
          ></el-input>
        </el-form-item>
        <el-form-item label="初始密码" :label-width="'80px'" prop="password">
          <el-input
            v-model="form.password"
            type="password"
            auto-complete="off"
            style="width:217px"
            placeholder="请输入初始密码"
          ></el-input>
        </el-form-item>
        <el-form-item label="手机号码" :label-width="'80px'" prop="mobilePhone">
          <el-input
            v-model="form.mobilePhone"
            auto-complete="off"
            style="width:217px"
            placeholder="请输入手机号码"
          ></el-input>
        </el-form-item>
        <el-form-item label="职位" :label-width="'80px'" prop="position">
          <el-input
            v-model="form.position"
            auto-complete="off"
            style="width:217px"
            placeholder="请输入职位"
          ></el-input>
        </el-form-item>

        <el-form-item label="电子邮件" :label-width="'80px'" prop="email">
          <el-input
            v-model="form.email"
            auto-complete="off"
            placeholder="请输入电子邮件"
            style="width:217px"
          ></el-input>
        </el-form-item>
        <el-form-item label="固定电话" :label-width="'80px'" prop="tel">
          <el-input
            v-model="form.tel"
            auto-complete="off"
            style="width:217px"
            placeholder="请输入固定电话"
          ></el-input>
        </el-form-item>
        <el-form-item label="分机号" :label-width="'80px'" prop="extNum">
          <el-input
            v-model="form.extNum"
            auto-complete="off"
            placeholder="请输入分机号"
            style="width:217px"
          ></el-input>
        </el-form-item>
        <el-form-item label="传真" :label-width="'80px'" prop="fax">
          <el-input
            v-model="form.fax"
            auto-complete="off"
            placeholder="请输入传真号"
            style="width:217px"
          ></el-input>
        </el-form-item>
        <el-form-item label="其他设置" :label-width="'80px'" prop="fax">
          <el-checkbox
            v-show="rightsType == 'SuperAdmin'"
            v-model="form.superUser"
            >超级用户</el-checkbox
          >
          <el-checkbox v-model="form.locked">锁定</el-checkbox>
          <el-checkbox v-model="form.u_pwdNoChange">密码不自动修改</el-checkbox>
        </el-form-item>
      </el-form>
      <div class="port-de">
        <h3>选择端口和默认部门</h3>
        <el-table
          ref="portDeptTable"
          border
          :data="portDept"
          tooltip-effect="dark"
          @selection-change="
            val => {
              return (this.selectPortDept = val);
            }
          "
          size="mini"
          :max-height="'250px'"
        >
          <el-table-column
            label="选择"
            type="selection"
            width="80"
          ></el-table-column>
          <el-table-column
            type="index"
            label="序号"
            width="45"
          ></el-table-column>
          <el-table-column
            prop="portCode"
            label="端口号"
            width="100"
          ></el-table-column>
          <el-table-column
            prop="portName"
            label="端口名称"
            width="150"
          ></el-table-column>

          <el-table-column label="默认部门">
            <template slot-scope="scope">
              <el-select
                @change="onDeptChange"
                v-model="scope.row.selectDeptList"
                size="mini"
                placeholder="请选择"
              >
                <el-option
                  v-for="item in scope.row.deptList"
                  :key="item.deptCode"
                  :label="item.deptName"
                  :value="item.deptCode"
                ></el-option>
              </el-select>
            </template>
          </el-table-column>
          <el-table-column label="角色名称">
            <template slot-scope="scope">
              <el-select
                @change="onDeptChange"
                v-model="scope.row.selectRoleList"
                :multiple="true"
                size="mini"
                placeholder="请选择"
              >
                <el-option
                  v-for="item in scope.row.roleList"
                  :key="item.roleId"
                  :label="item.roleName"
                  :value="item.roleId"
                ></el-option>
              </el-select>
            </template>
          </el-table-column>
          <el-table-column label="APP查询部门">
            <template slot-scope="scope">
              <el-select
                @change="onDeptChange"
                v-model="scope.row.selectAppList"
                :multiple="true"
                size="mini"
                placeholder="请选择"
              >
                <el-option
                  v-for="item in scope.row.appList"
                  :key="item.deptCode"
                  :label="item.deptName"
                  :value="item.deptCode"
                ></el-option>
              </el-select>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div slot="footer" class="dialog-footer">
        <!-- <el-button v-if="dialog.title=='新增用户'" @click="resetAddForm">重置</el-button> -->
        <el-button @click="dialogTableVisible = false">取消</el-button>
        <el-button type="primary" @click="submit('addUserForm')"
          >确 定</el-button
        >
      </div>
    </el-dialog>
  </div>
</template>

<script>
import md5 from 'md5';
import { Message } from 'element-ui';
import {
  getWmsAccount,
  getWmsAccountById,
  getDeptment,
  getPortDeptment,
  addUser,
  updateUser,
  updateLock
} from '@/api/UserManagement/wms-userlist';
import { getKpiInfo } from '@/api/yuebao/kpiBase';
import { tableToExcel } from '@/utils/cmn';

import { getRoleList } from '@/api/roles';
// import { getBaseData, getDictionaryData } from '@/api/baseData';
import { validateLoginName, validateMoblePhone } from '@/utils/validate';

import messages from '@/utils/messages';
import { tirmFilter } from '@/utils/tools';

// import * as screenfull from "screenfull";
import '@/directives/dialogCtrl.js';
const _ = require('lodash');
export default {
  data() {
    return {
      popoverVisible: false,
      popoverVisible2: false,
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
        userCode: '',
        userName: '',
        dftDept: '',
        port: '',
        locked: ''
      },
      form: {
        userSign: 0,
        userCode: '',
        userName: '', //登录名
        password: '', //用户名称
        mobilePhone: '', //所属部门
        position: '', //用户类别
        email: '',
        tel: '',
        extNum: '', //职位
        fax: '', //截止日期
        superUser: '',
        locked: '',
        u_pwdNoChange: '',
        info: [] //端口信息
      },
      formConfig: {
        disabled: false
      },
      oldPortDept: [],
      prevForm: {},
      prevPortDept: [],
      prevSelectPortDept: [],
      portDept: [],
      selectPortDept: [],
      rules: {
        userCode: [
          {
            required: true,
            trigger: 'blur',
            message: '用户编号不能为空'
          },
          {
            trigger: 'blur',
            validator: (rule, value, callback) => {
              validateLoginName(rule, value, callback);
            }
          }
        ],
        userName: [
          {
            required: true,
            trigger: 'blur',
            message: '用户名称不能为空'
          }
        ],
        password: [
          {
            required: true,
            trigger: 'blur',
            message: '密码不能为空'
          }
        ],
        mobilePhone: [
          {
            required: true,
            trigger: 'blur',
            message: '手机号不能为空'
          },
          {
            trigger: 'blur',
            validator: (rule, value, callback) => {
              validateMoblePhone(rule, value, callback);
            }
          }
        ],
        email: [
          { required: false, message: '请输入邮箱地址', trigger: 'blur' },
          { type: 'email', message: '请输入正确的邮箱地址', trigger: 'blur' }
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
      },
      lockStatus: [
        { label: '启用', value: 'N' },
        { label: '禁用', value: 'Y' }
      ]
    };
  },
  computed: {
    useDepartmentData() {
      return this.$store.getters.userDepartments;
    },
    rightsType() {
      return this.$store.getters.userInfo.rightsType;
    }
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
    // wmsDepartChangeEvent(val) {
    //   let allValues = [];
    //   //保留所有值
    //   for (let item of this.selections.useDepartment) {
    //     allValues.push(item);
    //   }
    //   // 用来储存上一次的值，可以进行对比
    //   const oldVal = this.oldOptions.length === 1 ? [] : this.oldOptions;

    //   // 若是全部选择
    //   if (this.isIncludeAll(val)) this.form.wmsDepartmentList = allValues;

    //   // 取消全部选中  上次有 当前没有 表示取消全选
    //   if (this.isIncludeAll(oldVal) && !this.isIncludeAll(val))
    //     this.form.wmsDepartmentList = [];

    //   // 点击非全部选中  需要排除全部选中 以及 当前点击的选项
    //   // 新老数据都有全部选中
    //   if (this.isIncludeAll(oldVal) && this.isIncludeAll(val)) {
    //     // const index = val.indexOf('1')
    //     val.splice(0, 1); // 排除全选选项
    //     this.form.wmsDepartmentList = val;
    //   }

    //   //全选未选 但是其他选项全部选上 则全选选上 上次和当前 都没有全选
    //   if (!this.isIncludeAll(oldVal) && !this.isIncludeAll(val)) {
    //     if (val.length === allValues.length - 1)
    //       this.form.wmsDepartmentList = [{ label: '全部', value: '1' }].concat(
    //         val
    //       );
    //   }

    //   //储存当前最后的结果 作为下次的老数据
    //   this.oldOptions = this.form.wmsDepartmentList;
    // },
    searchFormMethod(currentPage) {
      if (currentPage) {
        this.tables.postParams.currentPage = currentPage;
      }
      tirmFilter(this.searchForm);
      let data = {
        userCode: this.searchForm.userCode,
        userName: this.searchForm.userName,
        dftDept: this.searchForm.dftDept,
        port: this.searchForm.port,
        locked: this.searchForm.locked,
        pageSize: this.tables.postParams.pageSize,
        pageIndex: this.tables.postParams.currentPage
      };
      this._getAllUsers(data);
    },
    rightsTypeChange() {
      this.setrightsType();
    },
    batchChangeLock(toLock) {
      let userIds = [];
      for (let item of this.multipleSelection) {
        userIds.push(item.userSign);
      }
      if (!userIds.length) {
        return Message({
          message: '请选择一条数据',
          type: 'error',
          duration: 1 * 1000
        });
      }
      this.changeLock(userIds, toLock);
    },
    changeLock(userids, toLock) {
      let data = {
        userId: userids,
        isLocked: toLock
      };
      updateLock(data).then(res => {
        if (res.data.resultCode === 1) {
          this.popoverVisible = false;
          this.popoverVisible2 = false;
          this.searchFormMethod();
          Message({
            message: toLock == 'Y' ? '禁用成功!' : '启用成功',
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
            this.popoverVisible2 = false;
          }, 1000);
        }
      });
    },
    downStorageSetList() {
      tirmFilter(this.searchForm);
      let data = {
        userCode: this.searchForm.userCode,
        userName: this.searchForm.userName,
        dftDept: this.searchForm.dftDept,
        port: this.searchForm.port,
        locked: this.searchForm.locked,
        pageSize: 20000,
        pageIndex: 1
      };
      getWmsAccount(data).then(res => {
        if (res.data.resultCode === 1) {
          let data = res.data.data;
          //let cols = "物资编号,物资名称,单位,库存数量,借料已领数量,ERP出库未领数量"
          let cols =
            '用户编号,用户名称,默认部门,移动电话,职位,端口号,更新时间,最后登陆时间';
          let fields =
            'userCode,userName,deptName,mobilePhone,position,port,updateTime,lastLoginTime';
          tableToExcel(data, cols, fields);
        }
        this.tables.getAllUsersData = [];
        Message({
          message: res.data.message,
          type: 'error',
          duration: 3 * 1000
        });
      });
    },
    editMethod(row) {
      this.rules.pwd = []; //编辑时不需要验证初始密码
      this.dialogTableVisible = true;
      this.dialog.title = '编辑用户';
      this.formConfig.disabled = true;
      this.form.userSign = row.userSign;

      getWmsAccountById(null, {
        userId: row.userSign
      }).then(res => {
        this.resetAddForm();
        if (res.data.resultCode === 1) {
          let data = res.data.data;
          let obj = {};
          obj.userSign = data.userSign;
          obj.userCode = data.userCode;
          obj.userName = data.userName;
          obj.password = 'chushimima';
          obj.mobilePhone = data.mobilePhone;
          obj.position = data.position;
          obj.email = data.email;
          obj.tel = data.tel;
          obj.extNum = data.extNum;
          obj.fax = data.fax;
          obj.superUser = data.superUser == 'Y' ? true : false;
          obj.locked = data.locked == 'Y' ? true : false;
          obj.u_pwdNoChange = data.u_pwdNoChange == 'Y' ? true : false;
          this.form = obj;
          data.info = data.info || [];
          //设置用户端口

          for (let item of data.info) {
            for (let item2 of this.portDept) {
              if (item.portCode == item2.portCode) {
                //设置

                if (Array.isArray(item.deptList)) {
                  item2.selectDeptList = '';
                  if (item.deptList.length) {
                    item2.selectDeptList = item.deptList[0].deptCode;
                  }
                }
                if (Array.isArray(item.roleList)) {
                  item2.selectRoleList = [];
                  for (let item of item.roleList) {
                    item2.selectRoleList.push(item.roleId);
                  }
                }
                if (Array.isArray(item.appList)) {
                  item2.selectAppList = [];
                  for (let item of item.appList) {
                    item2.selectAppList.push(item.deptCode);
                  }
                }

                //选中该行
                let t = setTimeout(() => {
                  this.$refs.portDeptTable.toggleRowSelection(item2, true);
                  clearTimeout(t);
                }, 10);
              }
            }
          }
        }
      });
    },
    addUserMethod() {
      this.dialogTableVisible = true;
      this.dialog.title = '新增用户';
      this.formConfig.disabled = false;
      setTimeout(() => {
        // this.form.userStatus = this.form.userStatusList[0].value;
        // this.form.userType = this.form.userTypeList[1].value;
        // this.form.rightsType = this.form.rightsTypeList[1].value;
        this.resetAddForm();
      }, 10);
      //如果权限类别是超级管理员，取消业务列表，角色列表
      // this.setrightsType();
    },
    // setrightsType() {
    //   if (this.form.rightsType === 'SuperAdmin') {
    //     this.superAdminObj.isShow = false;
    //     this.rules.businessList = [];
    //     this.rules.roleList = [];
    //   } else {
    //     this.superAdminObj.isShow = true;
    //   }
    // },
    getUserPortDept() {},
    submit(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          //提交的时候去除WMS权限的全部选项。
          let data = JSON.parse(JSON.stringify(this.form));
          // if (data.wmsDepartmentList && data.wmsDepartmentList.length) {
          //   let wmsDepartmentList = [];
          //   for (let item of data.wmsDepartmentList) {
          //     if (item.label != '全部') {
          //       wmsDepartmentList.push(item);
          //     }
          //   }
          //   data.wmsDepartmentList = wmsDepartmentList;
          // }
          //获取选中的端口号
          //清楚左右空格
          data.userCode = data.userCode && data.userCode.trim();
          data.userName = data.userName && data.userName.trim();
          data.mobilePhone = data.mobilePhone && data.mobilePhone.trim();
          data.position = data.position && data.position.trim();
          data.email = data.email && data.email.trim();
          data.tel = data.tel && data.tel.trim();
          data.extNum = data.extNum && data.extNum.trim();
          data.fax = data.fax && data.fax.trim();
          let userPort = [];
          for (let item of this.selectPortDept) {
            console.log(item);
            debugger;
            let deptList = [];
            if (item.selectDeptList) {
              deptList = [{ deptCode: item.selectDeptList }];
            }
            userPort.push({
              userSign: this.form.userSign,
              portCode: item.portCode,
              deptList: deptList,
              roleList: _.map(item.selectRoleList, function(c) {
                return { roleId: c };
              }),
              appList: _.map(item.selectAppList, function(c) {
                return { deptCode: c };
              })
            });
          }
          if (userPort.length == 0) {
            //必须要选择一个端口
            return Message({
              message: '请至少选择一个端口',
              type: 'error',
              duration: 3 * 1000
            });
          }
          data.info = userPort;
          data.locked = data.locked ? 'Y' : 'N';
          data.superUser = data.superUser ? 'Y' : 'N';
          data.u_pwdNoChange = data.u_pwdNoChange ? 'Y' : 'N';

          if (this.dialog.title === '编辑用户') {
            //console.log(this.form)
            if (data.password == 'chushimima') {
              data.password = '';
            } else {
              data.password = md5(data.password && data.password.trim());
            }
            return this.submitEditData(data);
          } else {
            data.password = md5(data.password && data.password.trim());
            this.submitAddData(data);
          }
        } else {
          return false;
        }
      });
    },
    submitEditData(data) {
      updateUser(data).then(res => {
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
    submitAddData(data) {
      addUser(data).then(res => {
        if (res.data.resultCode === 1) {
          // this.dialogTableVisible = false;
          this.searchFormMethod();
          this.form.userSign = res.data.data;
          //this.resetAddForm();
          this.dialog.title = '编辑用户';
          this.formConfig.disabled = true;
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
    resetSearchForm() {
      this.searchForm.userCode = '';
      this.searchForm.userName = '';
      this.searchForm.dftDept = '';
      this.searchForm.port = '';
      this.searchForm.locked = '';

      this.resetForm('searchFormRef');
    },
    resetAddForm() {
      this.resetForm('addUserForm');
      var form = {
        userSign: 0,
        userCode: '',
        userName: '', //登录名
        password: '', //用户名称
        mobilePhone: '', //所属部门
        position: '', //用户类别
        email: '',
        tel: '',
        extNum: '', //职位
        fax: '', //截止日期
        superUser: '',
        locked: '',
        u_pwdNoChange: '',
        info: [] //端口信息
      };
      this.form = form;
      this.selectPortDept = [];
      this.$refs.portDeptTable.clearSelection();
      this.portDept = JSON.parse(JSON.stringify(this.oldPortDept));
    },
    resetForm(formName) {
      if (this.$refs[formName]) {
        this.$refs[formName].resetFields();
      }
    },
    _getAllUsers(data) {
      getWmsAccount(
        data
          ? data
          : {
              // orderProp: this.tables.postParams.orderProp,
              // orderDirection: this.tables.postParams.orderDirection,
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
    _getPortDepartments(data) {
      // this.portDept = [{"portCode":"8018","portName":"西藏","deptList":[{"deptCode":"5401","deptName":"东三西藏移动"}]},{"portCode":"8008","portName":"四川标准版","deptList":[{"deptCode":"ABA","deptName":"东四四川阿坝"},{"deptCode":"GANZI","deptName":"东四四川甘孜"},{"deptCode":"qinghai","deptName":"东三青海"},{"deptCode":"SCLZ","deptName":"东四四川泸州"},{"deptCode":"SCNJ","deptName":"东四四川内江"},{"deptCode":"SCYB","deptName":"东四四川宜宾"},{"deptCode":"SCZG","deptName":"东四四川自贡"},{"deptCode":"SCZY","deptName":"东四四川资阳"}]},{"portCode":"8092","portName":"广东批量导入版","deptList":[{"deptCode":"chaozhou","deptName":"南一广东潮州"},{"deptCode":"DGyidong","deptName":"南一广东东莞"},{"deptCode":"gdyj","deptName":"东二广东阳江"},{"deptCode":"HYYD","deptName":"南一广东河源"},{"deptCode":"jm","deptName":"东二广东江门"},{"deptCode":"jy","deptName":"南一广东揭阳"},{"deptCode":"meizhou","deptName":"南一广东梅州"},{"deptCode":"QingYuan","deptName":"东二广东清远"},{"deptCode":"shantou","deptName":"南一广东汕头"},{"deptCode":"shanwei","deptName":"南一广东汕尾"},{"deptCode":"shaoguan","deptName":"韶关移动2"},{"deptCode":"shenzhen","deptName":"东一广东深圳"},{"deptCode":"yangjsg","deptName":"东二广东阳江施工队"},{"deptCode":"YFYD","deptName":"东二广东云浮"},{"deptCode":"zhanjiang","deptName":"东二广东湛江"},{"deptCode":"zhaoqin","deptName":"东二广东肇庆"},{"deptCode":"ZHONGSHAN","deptName":"东二广东中山"}]},{"portCode":"8000","portName":"石家庄","deptList":[{"deptCode":"CHD_ZW","deptName":"南二河北承德"},{"deptCode":"HD_ZW","deptName":"南二河北邯郸市库"},{"deptCode":"HDS_ZW","deptName":"南二河北邯郸省库"},{"deptCode":"HSS_ZW","deptName":"南二河北衡水省库"},{"deptCode":"HSSIZW","deptName":"南二河北衡水市库"},{"deptCode":"QHD_ZW","deptName":"南二河北秦皇岛"},{"deptCode":"SJZ_ZW","deptName":"南二河北石家庄"},{"deptCode":"TSR_ZW","deptName":"南二河北唐山RDC"},{"deptCode":"TSS_ZW","deptName":"南二河北唐山省库"},{"deptCode":"TSSK_ZW","deptName":"南二河北唐山市库"},{"deptCode":"XTS_ZW","deptName":"南二河北邢台省库"},{"deptCode":"XTSI_ZW","deptName":"南二河北邢台市库"}]},{"portCode":"8900","portName":"云南","deptList":[{"deptCode":"chuxiong","deptName":"东一云南楚雄"},{"deptCode":"dali","deptName":"东一云南大理"},{"deptCode":"dehong","deptName":"东一云南德宏"},{"deptCode":"diqing","deptName":"东一云南迪庆"},{"deptCode":"guigang","deptName":"东一广西贵港"},{"deptCode":"guizhou","deptName":"东一贵州省库"},{"deptCode":"GXNN","deptName":"东一广西南宁"},{"deptCode":"honghe","deptName":"东一云南红河"},{"deptCode":"lijiang","deptName":"东一云南丽江"},{"deptCode":"nujiang","deptName":"东一云南怒江"},{"deptCode":"QINZ_Z2W","deptName":"东一广西钦州"},{"deptCode":"qujing","deptName":"东一云南曲靖"},{"deptCode":"YNWENSHAN","deptName":"东一云南文山"},{"deptCode":"yuxi","deptName":"东一云南玉溪"},{"deptCode":"zhaotong","deptName":"东一云南昭通"}]},{"portCode":"8502","portName":"广西","deptList":[{"deptCode":"cuongzuo","deptName":"东一广西崇左"}]},{"portCode":"3371","portName":"揭阳铁塔","deptList":[{"deptCode":"CZTT","deptName":"南一郴州铁塔"},{"deptCode":"JYTT","deptName":"南一揭阳铁塔"},{"deptCode":"LDTT","deptName":"南一娄底铁塔"},{"deptCode":"STTT","deptName":"南一汕头铁塔"},{"deptCode":"YZTT","deptName":"南一永州铁塔"}]},{"portCode":"9050","portName":"电网","deptList":[{"deptCode":"DW_HUIAN","deptName":"电网惠安"},{"deptCode":"DW_YONGCH","deptName":"电网永春主业"},{"deptCode":"YCJT","deptName":"电网永春集体-租赁-节能"}]},{"portCode":"8800","portName":"湖南","deptList":[{"deptCode":"fj-nd","deptName":"南一福建宁德"},{"deptCode":"fj-pt","deptName":"南一福建莆田"},{"deptCode":"hbdq","deptName":"南二天津华北大区"},{"deptCode":"hn-ld","deptName":"南一湖南娄底"},{"deptCode":"hn-xt","deptName":"南一湖南湘潭"},{"deptCode":"hn-xx","deptName":"南一湖南湘西"},{"deptCode":"hn-yy","deptName":"南一湖南益阳"},{"deptCode":"hn-zjj","deptName":"南一湖南张家界"},{"deptCode":"hn-zy","deptName":"南一湖南邵阳"},{"deptCode":"SY","deptName":"南二沈阳"},{"deptCode":"TJ","deptName":"南二天津市仓"}]},{"portCode":"8814","portName":"赣州","deptList":[{"deptCode":"GAZ_ZW","deptName":"东二江西赣州"}]},{"portCode":"8070","portName":"广州标准版","deptList":[{"deptCode":"gdfs190108","deptName":"南一广东佛山"},{"deptCode":"gz10086","deptName":"东二广州夏茅"},{"deptCode":"GZHDZSB","deptName":"东二广州花都"},{"deptCode":"GZXXM0430","deptName":"东二广东人和省仓"},{"deptCode":"HNDQ","deptName":"东二广东华南大区"},{"deptCode":"MMSHEC","deptName":"东二广东茂名省仓"},{"deptCode":"MMSHIC","deptName":"东二广东茂名市仓"},{"deptCode":"szyd","deptName":"东一深圳移动"}]},{"portCode":"8090","portName":"广东清远","deptList":[{"deptCode":"gdyj_old","deptName":"阳江中兴通讯项目"},{"deptCode":"梅州","deptName":"梅州移动"}]},{"portCode":"8072","portName":"吉林","deptList":[{"deptCode":"JLYD","deptName":"南二吉林移动"}]},{"portCode":"8080","portName":"联通","deptList":[{"deptCode":"LT_ZW","deptName":"南一深圳联通"}]},{"portCode":"8202","portName":"宁夏版本","deptList":[{"deptCode":"NX_5401","deptName":"东三宁夏本部（实物帐）"}]},{"portCode":"8866","portName":"泉州","deptList":[{"deptCode":"QZ_ZW","deptName":"南一泉州移动"}]},{"portCode":"3344","portName":"陕西数据库","deptList":[{"deptCode":"SX_ZW","deptName":"东三陕西移动"}]},{"portCode":"8050","portName":"河南驻马店","deptList":[{"deptCode":"zhumadian","deptName":"东一河南驻马店"}]}];
      // return;
      getPortDeptment(data ? data : { pageSize: 1000, pageIndex: 1 }).then(
        res => {
          if (res.data.resultCode === 1) {
            let portDept = res.data.data;
            for (let item of portDept) {
              if (item.deptList && item.deptList.length) {
                item.dftDept = item.deptList[0].deptCode;
              }
              item.selectDeptList = '';
              item.selectRoleList = [];
              item.selectAppList = [];
            }
            this.oldPortDept = JSON.parse(JSON.stringify(portDept));
            this.portDept = portDept;
          } else {
            Message({
              message: res.data.message,
              type: 'error',
              duration: 3 * 1000
            });
          }
        }
      );
    },
    onDeptChange(event) {
      console.log(event);
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
  created() {
    //this._getAllUsers();
    // this._getBaseData();
    //this._getRoleList();
    // this._getDictionaryData();
    // this._getKpiInfo();
  },
  mounted() {
    this._getPortDepartments();
  }
};
</script>

<style scoped>
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
</style>
