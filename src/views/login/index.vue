<template>
  <div class="login-container">
    <div class="sys-title">
      <h3>仓配项目信息管理系统</h3>
      <i class="line"></i>
    </div>
    <el-form
      class="login-form"
      autoComplete="on"
      :model="loginForm"
      :rules="loginRules"
      ref="loginForm"
      label-position="left"
    >
      <div class="title-container">
        <h3 class="title">{{ '登录' }}</h3>
        <!--<lang-select class="set-language"></lang-select>-->
      </div>

      <el-form-item prop="loginName">
        <div class="icon-container">
          <span class="iconfont icon-icon-user"></span>
        </div>
        <el-input
          name="username"
          type="text"
          v-model="loginForm.loginName"
          autoComplete="on"
          placeholder="用户名/手机号码"
        />
      </el-form-item>

      <el-form-item prop="pwd">
        <div class="icon-container">
          <span class="iconfont icon-mima"></span>
        </div>
        <el-input
          name="password"
          :type="passwordType"
          @keyup.enter.native="handleLogin"
          v-model="loginForm.pwd"
          autoComplete="on"
          placeholder="密码"
        />
        <span class="iconfont icon-chakan" @click="showPwd"></span>
      </el-form-item>

      <el-button
        type="primary"
        style="width:100%;margin-bottom:30px;"
        :loading="loading"
        @click.native.prevent="handleLogin"
        title="点击登录系统"
        >{{ '登录' }}</el-button
      >
    </el-form>
    <!-- <el-dialog :title="'login.thirdparty'" :visible.sync="showDialog" append-to-body>{{'登录提示'}}<social-sign /></el-dialog> -->
    <!-- <loading :isshowLoading="false"></loading> -->
    <div class="icp">
      Copyright © 1999-2018 668tms.com, All Rights Reserved
      深圳市兆航物流有限公司<br /><a
        href="http://www.miitbeian.gov.cn"
        target="_blank"
        >粤ICP备18057492号</a
      >
    </div>
  </div>
</template>

<script>
import md5 from 'md5';
import { validateUsername, validatePassword } from '@/utils/validate';
//import LangSelect from '@/components/LangSelect'
// import Loading from "@/components/Loading/Loading";
import { Message } from 'element-ui';
import '@/styles/custom.scss';

export default {
  name: 'login',
  data() {
    return {
      loginForm: {
        loginName: '',
        pwd: ''
      },
      loginRules: {
        loginName: [
          {
            required: true,
            trigger: 'change',
            message: '用户名必须填写'
          }
        ],
        pwd: [
          {
            required: true,
            trigger: 'change',
            message: '密码必须填写'
          }
        ]
      },
      passwordType: 'password',
      loading: false
      //   showDialog: false
    };
  },
  methods: {
    showPwd() {
      if (this.passwordType === 'password') {
        this.passwordType = '';
      } else {
        this.passwordType = 'password';
      }
    },
    handleLogin() {
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          this.loading = true;
          var data = {
            loginName: this.loginForm.loginName,
            pwd: md5(this.loginForm.pwd).trim()
          };
          this.$store
            .dispatch('LoginByUsername', data)
            .then(res => {
              this.loading = false;
              if (res.data.resultCode !== 1) {
                Message({
                  message: res.data.message,
                  type: 'error',
                  duration: 3 * 1000
                });
              } else {
                this.$router.push({ path: '/' });
              }
            })
            .catch(err => {
              this.loading = false;
              Message({
                message: err.data.message,
                type: 'error',
                duration: 3 * 1000
              });
            });
          return;
        }
        return false;
      });
    }
    // afterQRScan() {}
  },
  created() {
    // window.addEventListener('hashchange', this.afterQRScan)
  },
  destroyed() {
    // window.removeEventListener('hashchange', this.afterQRScan)
  }
};
</script>

<style lang="scss">
@media screen and (max-width: 1980px) {
  .login-container {
    .sys-title {
      position: absolute;
      top: 28%;
      left: 5%;
      h3 {
        font-size: 80px;
        letter-spacing: 8px;
        color: #03004c;
        margin: 0 auto;
      }
      .line {
        font-size: 80px;
        display: inline-block;
        width: 2em;
        height: 5px;
        background: #f85408;
      }
    }
  }
}
@media screen and (max-width: 1366px) {
  .login-container {
    .sys-title {
      position: absolute;
      top: 28%;
      left: 7%;
      h3 {
        font-size: 60px;
        color: #03004c;
        margin: 0 auto;
      }
      .line {
        font-size: 60px;
        display: inline-block;
        width: 2em;
        height: 5px;
        background: #f85408;
      }
    }
  }
}
@media screen and (max-width: 1024px) {
  .login-container {
    .sys-title {
      position: absolute;
      top: 28%;
      left: 7%;
      h3 {
        font-size: 50px;
        color: #03004c;
        margin: 0 auto;
      }
      .line {
        font-size: 60px;
        display: inline-block;
        width: 2em;
        height: 5px;
        background: #f85408;
      }
    }
  }
}
</style>
