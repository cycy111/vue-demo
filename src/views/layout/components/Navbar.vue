<template>
  <el-menu class="navbar" mode="horizontal">
    <hamburger
      class="hamburger-container"
      :toggleClick="toggleSideBar"
      :isActive="sidebar.opened"
    ></hamburger>
    <breadcrumb class="breadcrumb-container"></breadcrumb>
    <div class="right-menu">
      <el-form
        :inline="true"
        size="small"
        class="search-form right-menu-item"
        v-show="isShowDept"
      >
        <el-form-item label="" :label-width="'80px'" clearable>
          <el-select
            v-model="regionCode"
            v-show="regions.length && regionDepartments.length"
            filterable
            placeholder="请选择省份"
            @change="regionChange"
          >
            <el-option
              v-for="(item, index) in regions"
              :key="index"
              :label="item.provinceName"
              :value="item.provinceCode"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="" :label-width="'80px'" clearable>
          <el-select
            v-show="regions.length && regionDepartments.length"
            v-model="deptCode"
            filterable
            placeholder="请选择项目"
            @change="deptChange"
          >
            <el-option
              v-for="(item, index) in regionDepartments"
              :key="index"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <error-log class="errLog-container right-menu-item"></error-log>
      <el-tooltip effect="dark" :content="'全屏显示'" placement="bottom">
        <screenfull class="screenfull right-menu-item"></screenfull>
      </el-tooltip>

      <!-- <lang-select class="international right-menu-item"></lang-select> -->

      <el-tooltip effect="dark" :content="'换肤'" placement="bottom">
        <theme-picker class="theme-switch right-menu-item"></theme-picker>
      </el-tooltip>
      <el-tooltip
        effect="dark"
        :content="'接口消息记录查询'"
        placement="bottom"
      >
        <i
          v-show="showMessageQueue"
          class="message-queue el-icon-message-solid right-menu-item"
          @click="messageClickFunc"
        ></i>
      </el-tooltip>

      <el-dropdown class="avatar-container right-menu-item" trigger="click">
        <div class="avatar-wrapper">
          <img class="user-avatar" :src="avatar" />
          <span>{{ name }}</span>
          <i class="el-icon-caret-bottom"></i>
        </div>
        <el-dropdown-menu slot="dropdown">
          <router-link to="/">
            <el-dropdown-item>
              {{ '首页' }}
            </el-dropdown-item>
          </router-link>
          <router-link to="/userManagement/modifyPassword">
            <el-dropdown-item>
              {{ '修改密码' }}
            </el-dropdown-item>
          </router-link>
          <el-dropdown-item divided>
            <span @click="logout" style="display:block;">{{ '注销登录' }}</span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
    <MessageQueueIcon ref="messageQueueRef"></MessageQueueIcon>
  </el-menu>
</template>

<script>
import { mapGetters } from 'vuex';
import Breadcrumb from '@/components/Breadcrumb';
import Hamburger from '@/components/Hamburger';
import ErrorLog from '@/components/ErrorLog';
import Screenfull from '@/components/Screenfull';
import MessageQueueIcon from '@/components/MessageQueueIcon';
// import LangSelect from '@/components/LangSelect'
import ThemePicker from '@/components/ThemePicker';
import { debuglog } from 'util';
const _ = require('lodash');
export default {
  components: {
    Breadcrumb,
    Hamburger,
    ErrorLog,
    Screenfull,
    // LangSelect,
    ThemePicker,
    MessageQueueIcon
  },
  data() {
    return {
      isShowDept: false,
      showMessageQueue: false,
      regionCode: '',
      deptCode: '',
      userDepartments: [],
      regions: [],
      showDeptPath: [
        'wmsquery',
        'yunyingyuebao',
        'checkmangement',
        'dianwangmanagement'
      ],
      hideDeptPath: [],
      regionDepartments: []
    };
  },
  computed: {
    ...mapGetters(['sidebar', 'name', 'avatar'])
  },
  watch: {
    $route(to, from) {
      this.isShowWmsDept();
      this.isShowMessageQueue();
    }
  },
  methods: {
    toggleSideBar() {
      this.$store.dispatch('toggleSideBar');
    },
    logout() {
      this.$store.dispatch('LogOut').then(() => {
        this.$router.push({ path: '/' });
        location.reload();
      });
    },
    deptChange(deptCode) {
      this.$store.commit('SET_DEPTCODE', deptCode);
    },
    messageClickFunc() {
      this.$refs['messageQueueRef'].show();
    },
    regionChange(region) {
      //根据区域联动部门
      this.$store.commit('SET_REGIONCODE', region);
      if (!this.userDepartments) {
        this.userDepartments = [];
      }
      let depts = this.userDepartments.filter(c => {
        return c.provinceCode == region;
      });
      if (this.$route.path.indexOf('checkMangement') > -1) {
        //盘点处的部门添加全部选项
        depts.unshift({ label: '全部', value: 'all' });
      }
      this.regionDepartments = depts;
      //选中该区域部门第一项
      if (this.$store.getters.deptCode) {
        let depart = this.regionDepartments.filter(c => {
          return c.deptCode == this.$store.getters.deptCode;
        });
        if (depart.length) {
          //说明缓存中有此项目，直接显示
          this.deptCode = this.$store.getters.deptCode;
        } else {
          //否则选中第一个
          if (this.regionDepartments.length) {
            this.deptCode = this.regionDepartments[0].deptCode;
          }
        }
      } else {
        if (this.regionDepartments.length) {
          this.deptCode = this.regionDepartments[0].deptCode;
        }
      }
      this.$store.commit('SET_DEPTCODE', this.deptCode);
    },
    isShowMessageQueue() {
      if (
        _.includes(
          this.$route.path.toUpperCase(),
          'WoMallManagement'.toUpperCase()
        )
      ) {
        //显示消息队列组件
        this.showMessageQueue = true;
      } else {
        this.showMessageQueue = false;
      }
    },
    isShowWmsDept() {
      let isShow = false;
      //查看是否在显示列表
      for (let item of this.showDeptPath) {
        if (this.$route.path.toLowerCase().indexOf(item.toLowerCase()) > -1) {
          isShow = true;
        }
      }
      //查看是否在隐藏列表
      for (let item of this.hideDeptPath) {
        if (this.$route.path.toLowerCase().indexOf(item.toLowerCase()) > -1) {
          isShow = false;
        }
      }
      if (isShow) {
        let regionCode = this.$store.getters.regionCode;
        this.regionChange(regionCode);
        this.isShowDept = true;
      } else {
        this.isShowDept = false;
      }
    }
  },
  created() {
    this.userDepartments = this.$store.getters.userDepartments;
    this.regions = _.uniqBy(this.userDepartments, 'provinceCode').map(c => {
      return { provinceCode: c.provinceCode, provinceName: c.provinceName };
    });
    this.regions.sort();
    if (this.$store.getters.regionCode) {
      //查询缓存中的是否在区域列表中，如果不是的话就显示第一条
      let r = this.regions.filter(c => {
        return c.provinceCode == this.$store.getters.regionCode;
      });
      if (r && r.length) {
        this.regionCode = this.$store.getters.regionCode;
      } else {
        this.regionCode = this.regions[0].provinceCode;
      }
    } else {
      if (this.regions.length) {
        this.regionCode = this.regions[0].provinceCode;
      }
    }
    this.regionChange(this.regionCode);

    // this.$store.commit('SET_REGIONCODE',this.regionCode);
    // this.$store.commit('SET_DEPTCODE',this.deptCode);
  },
  mounted() {
    this.isShowWmsDept();
    this.isShowMessageQueue();
  }
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.navbar {
  height: 50px;
  line-height: 50px;
  border-radius: 0px !important;
  .hamburger-container {
    line-height: 58px;
    height: 50px;
    float: left;
    padding: 0 10px;
  }
  .breadcrumb-container {
    float: left;
  }
  .errLog-container {
    display: inline-block;
    vertical-align: top;
  }
  .right-menu {
    float: right;
    height: 100%;
    &:focus {
      outline: none;
    }
    .search-form {
      position: relative;
      top: -5px;
    }
    .right-menu-item {
      display: inline-block;
      margin: 0 8px;
    }
    .screenfull {
      height: 20px;
    }
    .message-queue {
      height: 20px;
      font-size: 20px;
      line-height: 20px;
      vertical-align: middle;
      top: -13px;
      position: relative;
    }
    .international {
      vertical-align: top;
    }
    .theme-switch {
      vertical-align: 15px;
    }
    .avatar-container {
      margin-right: 30px;
      .avatar-wrapper {
        cursor: pointer;
        margin-top: 5px;
        position: relative;
        height: 40px;
        vertical-align: middle;
        .user-avatar {
          width: 40px;
          height: 40px;
          border-radius: 10px;
        }
        .el-icon-caret-bottom {
          position: absolute;
          right: -20px;
          top: 25px;
          font-size: 12px;
        }
      }
    }
  }
}
</style>
