<template>
  <div class="app-container">
    <el-card class="box-card" shadow="never">
      <div slot="header">
        <el-button-group>
          <el-button
            type="primary"
            icon="el-icon-edit-outline"
            @click="openDialog('新增顶级菜单')"
            >新增顶级菜单</el-button
          >
          <el-button
            type="primary"
            icon="el-icon-edit-outline"
            @click="openDialog('新增二级菜单')"
            >新增二级菜单</el-button
          >
          <el-button
            type="success"
            icon="el-icon-edit-outline"
            @click="sortTree"
            >应用菜单树排序</el-button
          >
          <el-button type="info" icon="el-icon-delete" @click="reloadTree"
            >重置</el-button
          >
        </el-button-group>
      </div>
      <el-container>
        <el-tree
          empty-text="..."
          :data="menuTreeData"
          ref="tree"
          node-key="id"
          default-expand-all
          :expand-on-click-node="false"
          :check-on-click-node="true"
          :draggable="draggable"
          :allow-drop="allowDrop"
        >
          <span class="custom-tree-node" slot-scope="{ node, data }">
            <span>{{ node.label }}</span>
            <span>
              <el-button
                type="text"
                size="mini"
                @click="modify(node, data)"
                v-if="node.level === 1"
                ><i class="el-icon-edit-outline"></i
              ></el-button>
              <el-button type="text" size="mini" @click="remove(node, data)"
                ><i class="iconfont icon-shanchu"></i
              ></el-button>
              <!-- v-if="node.level!==1" -->
            </span>
          </span>
        </el-tree>
      </el-container>
      <div class="textInfo">
        注意：拖动菜单排序、新增、删除菜单，需要退出系统重新登录生效！
      </div>
    </el-card>
    <!-- dialogs.title==='新增顶级菜单'?form.rules:form.rules2 -->
    <el-dialog
      :title="dialogs.title"
      :visible.sync="dialogs.dialog"
      v-dialogDrag
      v-dialogDragWidth
      :close-on-click-modal="false"
    >
      <el-form :model="form" ref="form" :rules="form.rules" size="small">
        <el-form-item
          label="上级菜单"
          :label-width="'80px'"
          v-if="dialogs.title !== '新增顶级菜单'"
          prop="parentNo"
        >
          <el-select
            v-model="form.parentNo"
            filterable
            placeholder="请选择"
            style="width:100%;"
          >
            <el-option
              v-for="item in topMeunOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
              <span style="float: left">{{ item.label }}</span>
              <span style="float: right; color: #8492a6; font-size: 13px">{{
                item.value
              }}</span>
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="菜单名称" :label-width="'80px'" prop="menuName">
          <el-input
            v-model="form.menuName"
            auto-complete="off"
            :disabled="dialogs.title !== '新增顶级菜单'"
            :placeholder="
              dialogs.title === '新增顶级菜单' ? '' : '根据模块编号自动生成'
            "
          ></el-input>
        </el-form-item>
        <el-form-item
          label="菜单目录"
          :label-width="'80px'"
          v-if="dialogs.title === '新增顶级菜单'"
          prop="menuDirectory"
        >
          <el-input
            v-model="form.menuDirectory"
            auto-complete="off"
            placeholder="请输入菜单目录"
          ></el-input>
        </el-form-item>
        <el-form-item
          label="绑定模块"
          :label-width="'80px'"
          v-if="dialogs.title !== '新增顶级菜单'"
          prop="menuNo"
        >
          <el-select
            v-model="form.menuNo"
            multiple
            filterable
            placeholder="请选择"
            style="width:100%;"
          >
            <el-option
              v-for="(item, index) in modulesBindMenu"
              :value-key="item.value"
              :key="index"
              :label="item.value"
              :value="item"
            >
              <span style="float: left">{{ item.label }}</span>
              <span style="float: right; color: #8492a6; font-size: 13px">{{
                item.value
              }}</span>
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="resetForm('form')">重 置</el-button>
        <el-button type="primary" @click="addMenu('form')">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { Message } from 'element-ui';
// import Sortable from "sortablejs";
import {
  getMenuInfo,
  createMenu,
  menuLevelGet,
  deleteMenu,
  updateMenu,
  upOrder
} from '@/api/menus';
import { getAllModules } from '@/api/modules';
// import { stringToJson } from '@/utils/tools';
import '@/directives/dialogCtrl.js';
export default {
  data() {
    //中文，英文字母和数字及_
    let menuNameChecked = (rule, value, callback) => {
      if (!/^[\u4e00-\u9fa5_a-zA-Z0-9]{2,10}$/.test(value)) {
        return callback(new Error('格式:2-10位字母、数字、_、中文'));
      }
      callback();
    };
    let menuDirectoryChecked = (rule, value, callback) => {
      if (!/^[a-zA-Z]{6,30}$/.test(value)) {
        return callback(new Error('菜单目录格式：大小写字母(6-30)字符'));
      }
      callback();
    };
    return {
      dialogs: {
        dialog: false,
        title: ''
      },
      draggable: true,
      menuTreeData: [],
      form: {
        menuNo: '',
        menuName: '',
        parentNo: '',
        menuDirectory: '',
        levels: '',
        isdirecory: '', //0非目录 1目录
        orderId: '',
        status: '',
        rules: [],
        rules1: {
          menuName: [
            {
              required: true,
              trigger: 'change',
              message: '菜单名称必须填写'
            },
            {
              trigger: 'change',
              validator: menuNameChecked
            }
          ],
          menuDirectory: [
            {
              required: true,
              trigger: 'change',
              message: '菜单目录必须填写'
            },
            {
              trigger: 'change',
              validator: menuDirectoryChecked
            }
          ]
        },
        rules2: {
          menuName: [
            {
              required: true,
              trigger: 'change',
              message: '二级菜单名称必须填写'
            }
          ],
          parentNo: [
            {
              required: true,
              trigger: 'change',
              message: '上级菜单必须选择'
            }
          ],
          menuNo: [
            {
              required: true,
              trigger: 'change',
              message: '菜单编号必须选择'
            }
          ]
        }
      },
      topMeunOptions: [],
      modulesBindMenu: []
    };
  },
  metas: {
    title: '菜单管理',
    titleTemplate: '%s - 兆航物流TMS后台管理系统'
  },
  methods: {
    handleNodeClick(e) {
      //console.log(e);
    },
    allowDrop(draggingNode, dropNode, type) {
      if (draggingNode.parent.key !== dropNode.parent.key) {
        return (dropNode.data.indeterminate = false);
      }
      if (type === 'inner') {
        return (dropNode.data.indeterminate = false);
      }
      return (dropNode.data.indeterminate = true);
    },
    sortTree() {
      let data = this.$refs.tree.data;
      upOrder({
        response: data
      }).then(res => {
        if (res.data.resultCode === 1) {
          Message({
            message: res.data.message,
            type: 'success',
            duration: 2 * 1000
          });
          setTimeout(() => {
            location.reload();
          }, 2001);
          return;
        }
        Message({
          message: '操作失败！服务器错误，请稍后再试。',
          type: 'error',
          duration: 2 * 1000
        });
      });
    },
    reloadTree() {
      this._menuLevelGet();
      //   this.$nextTick(() => {});
    },
    modify(node) {
      this.openDialog('编辑二级菜单').then(() => {
        //渲染模态框
        menuLevelGet({ id: node.data.id }).then(res => {
          if (res.data.resultCode !== 1) {
            return Message({
              message: res.data.message,
              type: 'error',
              duration: 2 * 1000
            });
          }
          let menu = res.data.data.MenuList.filter(c => {
            return c.id == node.data.id;
          });
          if (!menu) {
            return;
          }
          this.form.parentNo = menu[0].id;
          this.form.menuNo = menu[0].children.map(val => {
            val.value = val.id;
            this.modulesBindMenu.push(val);
            return val;
          });

          this.form.menuName = menu[0].children
            .map(val => {
              val.value = val.id;
              return val.label;
            })
            .join(',');
        });
      });
    },
    remove(node, data) {
      deleteMenu({ moduleNo: [data.id], levels: node.level }).then(res => {
        if (res.data.resultCode === 1) {
          this._menuLevelGet({});
          return;
        }
        Message({
          message: res.data.message,
          type: 'error',
          duration: 2 * 1000
        });
      });
    },
    openDialog(title) {
      this.dialogs.title = title;
      this.form.parentNo = '';
      this.form.menuName = '';
      if (title !== '新增顶级菜单') {
        this.form.rules = this.form.rules2;
      } else {
        this.form.rules = this.form.rules1;
      }
      this.dialogs.dialog = true;
      if (title !== '编辑二级菜单') {
        setTimeout(() => {
          this.resetForm('form');
        }, 100);
      }

      return new Promise((resolve, reject) => {
        this._getMenuList({ levels: 1 });
        this._getAllModules({ status: 2 });
        resolve();
      });
    },
    addMenu(formName) {
      //校验通过
      this.$refs[formName].validate(valid => {
        if (valid) {
          if (this.dialogs.title === '新增顶级菜单') {
            this.form.menuNo = this.form.menuDirectory; //如果新增顶级菜单，菜单编号UUID
            this.form.isdirecory = 1;
            this.form.parentNo = 0;
            this.form.orderId = 0;
            this.form.status = 1;
            this.form.levels = 1;
            return createMenu({
              moduleNo: [this.form.menuNo],
              moduleName: [this.form.menuName],
              parentNo: this.form.parentNo,
              levels: this.form.levels,
              isdirecory: this.form.isdirecory, //0非目录 1目录
              orderId: this.form.orderId,
              status: this.form.status
            }).then(res => {
              if (res.data.resultCode !== 1) {
                return Message({
                  message: res.data.message,
                  type: 'error',
                  duration: 2 * 1000
                });
              }
              this._menuLevelGet();
              this.dialogs.dialog = false;
              this.modulesBindMenu = [];
            });
          } else if (this.dialogs.title === '编辑二级菜单') {
            updateMenu({
              moduleNo: this.form.menuNo.map(val => {
                return val.value;
              }),
              moduleName: this.form.menuName.split(','),
              parentNo: this.form.parentNo,
              levels: 2,
              isdirecory: 0,
              orderId: 0,
              status: 0
            }).then(res => {
              if (res.data.resultCode !== 1) {
                return Message({
                  message: res.data.message,
                  type: 'error',
                  duration: 2 * 1000
                });
              }
              this._menuLevelGet();
              this.dialogs.dialog = false;
              this.modulesBindMenu = [];
            });
          } else {
            //新增二级菜单
            let data = {
              moduleNo: this.form.menuNo.map(val => {
                return val.moduleNo;
              }),
              moduleName: this.form.menuNo.map(val => {
                return val.moduleName;
              }),
              parentNo: this.form.parentNo,
              levels: 2,
              isdirecory: 0,
              orderId: 0,
              status: 1
            };
            createMenu(data).then(res => {
              if (res.data.resultCode !== 1) {
                return Message({
                  message: res.data.message,
                  type: 'error',
                  duration: 2 * 1000
                });
              }
              this._menuLevelGet();
              this.dialogs.dialog = false;
              this.modulesBindMenu = [];
            });
          }
        } else {
          return false;
        }
      });
    },
    resetForm(formName) {
      if (this.dialogs.title !== '新增顶级菜单') {
        this.form.rules = this.form.rules2;
      } else {
        this.form.rules = this.form.rules1;
      }
      if (this.$refs[formName]) {
        this.$refs[formName].resetFields();
      }
    },
    uuid(len, radix) {
      var chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split(
        ''
      );
      var uuid = [],
        i;
      radix = radix || chars.length;
      if (len) {
        for (i = 0; i < len; i++) uuid[i] = chars[0 | (Math.random() * radix)];
      } else {
        var r;
        uuid[8] = uuid[13] = uuid[18] = uuid[23] = '-';
        uuid[14] = '4';
        for (i = 0; i < 36; i++) {
          if (!uuid[i]) {
            r = 0 | (Math.random() * 16);
            uuid[i] = chars[i == 19 ? (r & 0x3) | 0x8 : r];
          }
        }
      }
      return uuid.join('');
    },
    _getMenuList(data) {
      //获取顶级菜单
      getMenuInfo(data).then(res => {
        if (res.data.resultCode === 1) {
          let result = res.data.data;
          result.forEach(val => {
            val.value = val.moduleNo;
            val.label = val.moduleName;
          });
          this.topMeunOptions = result;
        } else {
          this.topMeunOptions = [];
        }
      });
    },
    //获取模块接口
    _getAllModules(data) {
      getAllModules(data).then(res => {
        if (res.data.resultCode === 1) {
          let result = res.data.data;
          result.forEach(val => {
            val.value = val.moduleNo;
            val.label = val.moduleName;
          });

          this.modulesBindMenu = result;
        } else {
          this.modulesBindMenu = [];
        }
      });
    },
    //获取菜单树，并渲染
    _menuLevelGet(data) {
      menuLevelGet(data).then(res => {
        if (res.data.resultCode === 1) {
          this.menuTreeData = res.data.data.MenuList;
        } else {
          this.menuTreeData = [];
          Message({
            message: res.data.message,
            type: 'error',
            duration: 2 * 1000
          });
        }
      });
    }
  },
  created() {
    this._menuLevelGet({}); //获取层级菜单
  },
  watch: {
    'form.menuNo'(val) {
      if (typeof val === 'object') {
        this.form.menuName = val
          .map(v => {
            return v.label;
          })
          .join(',');
      }
    }
  }
};
</script>
<style scoped>
.iconfont {
  font-size: 12px;
}
.custom-tree-node {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
  padding-right: 8px;
}
.custom-tree-node span:nth-child(2) {
  margin-left: 20px;
}
.textInfo {
  color: #f56c6c;
  border-top: 1px solid #ebeef5;
  padding-top: 10px;
  margin-top: 10px;
  font-size: 13px;
}
.el-tree {
  max-height: 600px;
  overflow-y: scroll;
}
</style>
