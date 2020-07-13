<template>
  <div class="app-container">
    <div class="el-container-custom">
      <el-container>
        <el-form :inline="true" ref="form" :model="form">
          <el-form-item label="">
            <el-input
              placeholder="请输入模块编号"
              v-model="searchForm.moduleNo"
              size="small"
            ></el-input>
          </el-form-item>
          <el-form-item label="">
            <el-input
              placeholder="请输入模块名称"
              v-model="searchForm.moduleName"
              size="small"
            ></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" size="small" @click="_getAllModules"
              >查询</el-button
            >
          </el-form-item>
        </el-form>
      </el-container>
      <el-container>
        <el-form :inline="true">
          <el-form-item>
            <el-button-group>
              <el-button type="primary" size="small" @click="addModuleBtn"
                ><i class="iconfont icon-Create_member">&nbsp;</i
                >新增模块</el-button
              >
              <!-- <el-button type="success" size="small" @click="_DeleteModule('1')"><i class="iconfont icon-kaiqi">&nbsp;</i>批量开启</el-button> -->
              <!-- <el-button type="info" size="small" @click="_DeleteModule('2')"><i class="iconfont icon-tingzhi">&nbsp;</i>批量停止</el-button> -->
            </el-button-group>
          </el-form-item>
        </el-form>
      </el-container>
    </div>
    <el-table
      ref="multipleTable"
      border
      :max-height="tables.tableMaxHeight"
      :data="tables.getAllModuleData"
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
        prop="moduleNo"
        label="模块编号"
        width="150"
      ></el-table-column>
      <el-table-column
        prop="moduleName"
        label="模块名称"
        width="100"
      ></el-table-column>
      <el-table-column
        prop="path"
        label="访问路径"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column
        prop="remark"
        label="备注"
        show-overflow-tooltip
        width="200"
      ></el-table-column>
      <el-table-column
        prop="modifier"
        label="操作人"
        show-overflow-tooltip
        width="80"
      ></el-table-column>
      <el-table-column
        prop="modifyDate"
        label="操作时间"
        show-overflow-tooltip
        width="150"
      ></el-table-column>
      <el-table-column
        prop="status"
        label="模块状态"
        show-overflow-tooltip
        width="80"
      >
        <template slot-scope="rows">
          <span v-if="rows.row.status === '1'" style="color:#67C23A;"
            >开启&nbsp;<el-tooltip
              content="模块开启或停止，请到菜单管理中绑定(解绑)模块后该模块将自动开启或停止！"
              placement="bottom"
              effect="light"
              ><i class="el-icon-info"></i></el-tooltip
          ></span>
          <span v-else style="color:#909399;"
            >停止&nbsp;<el-tooltip
              content="模块开启或停止，请到菜单管理中绑定(解绑)模块后该模块将自动开启或停止！"
              placement="bottom"
              effect="light"
              ><i class="el-icon-info"></i></el-tooltip
          ></span>
        </template>
      </el-table-column>
      <!-- <el-table-column prop="controller" label="控制器名称" show-overflow-tooltip></el-table-column> -->
      <el-table-column label="操作">
        <template slot-scope="caozuo">
          <el-button size="mini" @click="editMethod(caozuo.row)"
            ><i class="iconfont icon-bj"></i>编辑</el-button
          >&nbsp;&nbsp;
          <!-- <el-switch v-model="caozuo.row.status" @change="_DeleteModule(caozuo.row.status,caozuo.row)" active-text="开启" inactive-text="停止" active-value="1" inactive-value="2"></el-switch> -->
          <!-- <el-button size="mini" :type="moduleBtnStatus.class" @click="_DeleteModule(caozuo.row)"><i class="iconfont icon-bj"></i>{{moduleBtnStatus.btn}}</el-button> -->
        </template>
      </el-table-column>
    </el-table>
    <div class="pagination-box">
      <el-pagination
        background
        small
        @current-change="currentChange"
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
        :rules="form.rules"
        label-width="80px"
        :inline="true"
        label-position="right"
        size="small"
      >
        <el-form-item label="模块编号" :label-width="'80px'" prop="moduleNo">
          <el-input
            v-model="form.moduleNo"
            auto-complete="off"
            style="width:217px"
            placeholder="必填"
          ></el-input>
        </el-form-item>
        <el-form-item label="模块名称" :label-width="'80px'" prop="moduleName">
          <el-input
            v-model="form.moduleName"
            auto-complete="off"
            style="width:217px"
            placeholder="必填"
          ></el-input>
        </el-form-item>
        <el-form-item label="访问路径" :label-width="'80px'" prop="path">
          <el-input
            v-model="form.path"
            auto-complete="off"
            style="width:217px"
            placeholder="必填"
          ></el-input>
        </el-form-item>
        <el-form-item label="控制器名" :label-width="'80px'" prop="controller">
          <el-input
            v-model="form.controller"
            auto-complete="off"
            style="width:217px"
            placeholder="xxxxxController"
          >
            <template slot="append">Controller</template>
          </el-input>
        </el-form-item>
        <el-form-item label="操作方法" :label-width="'80px'" prop="action">
          <el-input
            v-model="form.action"
            auto-complete="off"
            style="width:217px"
            placeholder="xxxxxAction"
          >
            <template slot="append">Action</template>
          </el-input>
        </el-form-item>
        <el-form-item label="路径图标" :label-width="'80px'" prop="iconName">
          <el-select v-model="form.iconName" placeholder="请选择路径图标">
            <el-option
              v-for="item in form.cities"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
              <span
                style="float: left; color: #8492a6; font-size: 13px"
                v-html="item.value"
              ></span>
              <span style="float: right">{{ item.label }}</span>
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="项目名称" :label-width="'80px'" prop="projectName">
          <el-input
            v-model="form.projectName"
            auto-complete="off"
            style="width:217px"
          ></el-input>
        </el-form-item>
        <el-form-item label="备注" :label-width="'80px'" prop="remark">
          <el-input
            type="textarea"
            :rows="2"
            placeholder="请输入内容"
            v-model="form.remark"
            auto-complete="off"
            style="width:217px"
          ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="resetForm('form')">重置</el-button>
        <el-button type="primary" @click="submit('form')">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { Message } from 'element-ui';
import {
  getAllModules,
  addModule,
  delModule,
  updateModule
} from '@/api/modules';
import icons from '@/utils/icons';
import '@/directives/dialogCtrl.js';
export default {
  data() {
    let moduleNoChecked = (rule, value, callback) => {
      if (!/^[a-z0-9A-Z_]{5,50}$/.test(value)) {
        return callback(new Error('格式:5-50位大小写字母、数字、_'));
      }
      callback();
    };
    let modulePath = (rule, value, callback) => {
      if (!/^(\/[a-z0-9A-Z]{1,})+$/.test(value)) {
        return callback(new Error('例:/aBc,必须以/开头,大小写字母结尾'));
      }
      callback();
    };
    return {
      dialog: {
        title: '新增模块'
      },
      dialogTableVisible: false,
      multipleSelection: [],
      tables: {
        tableMaxHeight: document.body.clientHeight - 230,
        getAllModuleData: [],
        dialogVisible: false,
        dialogVisibleDetails: false,
        pageSizes: [10, 20, 30, 40],
        rows: null,
        postParams: {
          currentPage: 1,
          pageSize: 10,
          total: 0
        }
      },
      searchForm: {
        moduleNo: '',
        moduleName: ''
      },
      form: {
        moduleId: '',
        moduleNo: '',
        moduleName: '',
        path: '',
        iconName: '<i class="iconfont icon-mokuai"></i>', //用户类别
        controller: '',
        action: '',
        remark: '',
        projectName: '',
        cities: icons,
        subordinateDepartment: '',
        region: '',
        date1: '',
        date2: '',
        delivery: false,
        type: [],
        resource: '',
        desc: '',
        rules: {
          moduleNo: [
            {
              required: true,
              trigger: 'change',
              message: '模块编号必须填写'
            },
            {
              trigger: 'change',
              validator: moduleNoChecked
            }
          ],
          moduleName: [
            {
              required: true,
              trigger: 'change',
              message: '模块名称必须填写'
            }
          ],
          path: [
            {
              required: true,
              trigger: 'change',
              message: '访问路径必须填写'
            },
            {
              trigger: 'change',
              validator: modulePath
            }
          ],
          projectName: [
            {
              required: true,
              trigger: 'change',
              message: '项目名称必须填写'
            }
          ],
          controller: [
            {
              required: true,
              trigger: 'change',
              message: '控制器名必须填写'
            },
            {
              trigger: 'change',
              validator: (rule, value, callback) => {
                if (!/^[a-zA-Z]{3,50}$/.test(value)) {
                  return callback(new Error('格式:3-50位大小写字母'));
                }
                callback();
              }
            }
          ],
          action: [
            {
              required: true,
              trigger: 'change',
              message: '操作方法必须填写'
            },
            {
              trigger: 'change',
              validator: (rule, value, callback) => {
                if (!/^[a-zA-Z]{3,50}$/.test(value)) {
                  return callback(new Error('格式:3-50位大小写字母'));
                }
                callback();
              }
            }
          ]
        }
      }
    };
  },
  metas: {
    title: '模块管理',
    titleTemplate: '%s - 兆航物流TMS后台管理系统'
  },
  methods: {
    currentChange(currentPage) {
      this._getAllModules({ pageIndex: currentPage });
    },
    _DeleteModule(val, row) {
      //批量开启停止
      let delData = [];
      if (row === undefined) {
        delData = this.multipleSelection.map(v => {
          return v.id;
        });
        //单独开启停止
      } else {
        //   delData = [];
        //   delData.push(row.id);
        // Message({
        //     message: '此处无法开启模块，请到菜单管理中绑定模块后该模块自动开启！',
        //     type: "error",
        //     duration: 3 * 1000
        //   });
        return;
      }
      if (delData.length === 0) return;
      delModule({ id: delData, statuts: val }).then(res => {
        if (res.data.resultCode === 1) {
          this._getAllModules();
        }
      });
    },
    editMethod(row) {
      this.dialogTableVisible = true;
      this.dialog.title = '编辑模块';
      this.form.moduleId = row.id;
      //getAllModules 传id获取单个模块信息
      getAllModules({
        id: row.id
      }).then(res => {
        if (res.data.resultCode === 1) {
          let data = res.data.data[0];
          this.form.moduleNo = data.moduleNo;
          this.form.moduleName = data.moduleName;
          this.form.iconName = data.iconName;
          this.form.projectName = data.projectName;
          this.form.remark = data.remark;
          this.form.controller = data.controller;
          this.form.action = data.action;
          this.form.path = data.path;
          if (this.form.controller.indexOf('Controller') !== -1) {
            this.form.controller = this.form.controller.replace(
              /Controller/g,
              ''
            );
          }
          if (this.form.action.indexOf('Action') !== -1) {
            this.form.action = this.form.action.replace(/Action/g, '');
          }
        }
      });
    },
    addModuleBtn() {
      this.dialogTableVisible = true;
      this.dialog.title = '新增模块';
    },
    _addModule() {
      addModule({
        moduleNo: this.form.moduleNo,
        moduleName: this.form.moduleName,
        path: this.form.path,
        iconName: this.form.iconName,
        controller: this.form.controller + 'Controller',
        action: this.form.action + 'Action',
        projectName: this.form.projectName,
        remark: this.form.remark
      }).then(res => {
        if (res.data.resultCode === 1) {
          Message({
            message: res.data.message,
            type: 'success',
            duration: 2 * 1000
          });
          setTimeout(() => {
            this.dialogTableVisible = false;
            this._getAllModules();
          }, 1 * 1000);
        } else {
          Message({
            message: res.data.message,
            type: 'error',
            duration: 2 * 1000
          });
        }
      });
    },
    _updateModule() {
      if (this.form.controller.indexOf('Controller') !== -1) {
        this.form.controller = this.form.controller.replace(/Controller/g, '');
      }
      if (this.form.action.indexOf('Action') !== -1) {
        this.form.action = this.form.action.replace(/Action/g, '');
      }
      updateModule({
        id: this.form.moduleId,
        moduleNo: this.form.moduleNo,
        moduleName: this.form.moduleName,
        path: this.form.path,
        iconName: this.form.iconName,
        controller: this.form.controller + 'Controller',
        action: this.form.action + 'Action',
        projectName: this.form.projectName,
        remark: this.form.remark
      }).then(res => {
        if (res.data.resultCode === 1) {
          this._getAllModules();
          return (this.dialogTableVisible = false);
        }
        Message({
          message: res.data.message,
          type: 'error',
          duration: 2 * 1000
        });
      });
    },
    submit(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          if (this.dialog.title === '新增模块') {
            return this._addModule();
          }
          this._updateModule();
        } else {
          return false;
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    _getAllModules(params) {
      let data = {
        moduleNo: this.searchForm.moduleNo ? this.searchForm.moduleNo : '',
        moduleName: this.searchForm.moduleName
          ? this.searchForm.moduleName
          : '',
        pageIndex: params ? params.pageIndex : 1
      };
      getAllModules(data).then(res => {
        if (res.data.resultCode === 1) {
          this.tables.postParams.total = res.data.counts;
          this.tables.getAllModuleData = res.data.data;
        } else {
          Message({
            message: res.data.message,
            type: 'error',
            duration: 2 * 1000
          });
          this.tables.getAllModuleData = [];
          this.tables.postParams.total = 0;
        }
      });
    }
  },
  mounted() {
    this._getAllModules();
  }
};
</script>
