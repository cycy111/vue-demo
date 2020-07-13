import Vue from 'vue';
import Vuex from 'vuex';
import app from './modules/app';
import errorLog from './modules/errorLog';
import permission from './modules/permission';
import tagsView from './modules/tagsView';
import user from './modules/user';
import blankPage from './modules/blankPage';

Vue.use(Vuex);

const store = new Vuex.Store({
  modules: {
    app,
    errorLog,
    permission,
    tagsView,
    user,
    blankPage
  },
  getters: {
    sidebar: state => state.app.sidebar,
    language: state => state.app.language,
    // visitedViews: state => state.tagsView.visitedViews,
    cachedViews: state => state.tagsView.cachedViews,
    token: state => state.user.token,
    avatar: state => state.user.avatar,
    name: state => state.user.name,
    introduction: state => state.user.introduction,
    status: state => state.user.status,
    usersInfo: state => state.user.usersInfo,
    roles: state => state.user.roles,
    setting: state => state.user.setting,
    blankPages: state => state.blankPage.blankPagePrames,
    permission_routers: state => state.permission.routers,
    addRouters: state => state.permission.addRouters,
    errorLogs: state => state.errorLog.logs
  }
});

export default store;
