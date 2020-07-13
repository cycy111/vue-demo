<template>
  <div class="app-container">
    <el-card class="box-card" shadow="never">
      <div slot="header">
        <span>修改密码</span>
      </div>
      <el-form ref="form" :model="form" label-width="100px">
        <el-form-item label="旧密码">
          <el-input
            type="password"
            v-model="form.oldPwd"
            style="width:317px"
            size="small"
          ></el-input>
        </el-form-item>
        <el-form-item label="新密码">
          <el-input
            type="password"
            v-model="form.newPwd"
            style="width:317px"
            size="small"
          ></el-input>
        </el-form-item>
        <el-form-item label="确认新密码">
          <el-input
            type="password"
            v-model="form.enterNewPwd"
            style="width:317px"
            size="small"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button
            type="primary"
            @click="_modifyPassword"
            :loading="form.modifyPasswordLoad"
            >修改密码</el-button
          >
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
import { Message } from 'element-ui';
import { modifyPassword } from '@/api/users';
import md5 from 'md5';
export default {
  data() {
    return {
      form: {
        modifyPasswordLoad: false,
        oldPwd: '',
        newPwd: '',
        enterNewPwd: ''
      }
    };
  },
  metas: {
    title: '修改密码',
    titleTemplate: '%s - 兆航物流TMS后台管理系统'
  },
  methods: {
    _modifyPassword() {
      if (!this.form.oldPwd) {
        return Message({
          message: '旧密码必须填写!',
          type: 'error',
          duration: 2 * 1000
        });
      }
      if (!this.form.newPwd || !this.form.enterNewPwd) {
        return Message({
          message: '新密码或确认新密码必须填写!',
          type: 'error',
          duration: 2 * 1000
        });
      }
      if (this.form.newPwd !== this.form.enterNewPwd) {
        return Message({
          message: '新密码与确认新密码不一致!',
          type: 'error',
          duration: 2 * 1000
        });
      }
      if (!/^[a-zA-Z\d_]{6,18}$/.test(this.form.newPwd)) {
        return Message({
          message: '密码格式不正确，请输入至少6-18位字母或数字',
          type: 'error',
          duration: 3 * 1000
        });
      }

      //md5(this.loginForm.pwd)
      this.form.modifyPasswordLoad = true;
      modifyPassword({
        oldPwd: md5(this.form.oldPwd),
        newPwd: md5(this.form.newPwd)
      }).then(res => {
        this.form.modifyPasswordLoad = false;
        if (res.data.resultCode === 1) {
          return Message({
            message: res.data.message,
            type: 'success',
            duration: 2 * 1000
          });
        }
        Message({
          message: res.data.message,
          type: 'error',
          duration: 2 * 1000
        });
      });
    }
  },
  mounted() {}
};
</script>
