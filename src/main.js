import Vue from 'vue';

import './plugins/element.js';

import '@/styles/index.scss';
import 'animate.css';

import Bus from './utils/bus.js';
import './errorLog';
import './permission';

import App from './App.vue';
import router from './router';
import store from './store';
import Meta from 'vue-meta';
import * as utils from './utils';
//兄弟组件通信
Vue.prototype.Bus = Bus;

Vue.prototype.$util = utils;

//注册全局过滤器
import * as filters from './filters';
Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key]);
});

Vue.config.productionTip = false;

Vue.use(Meta, {
  keyName: 'metas', // the component option name that vue-meta looks for meta info on.
  attribute: 'data-meta', // the attribute name vue-meta adds to the tags it observes
  ssrAttribute: 'data-meta-server', // the attribute name that lets vue-meta know that meta info has already been server-rendered
  tagIDKeyName: 'mid' // the property name that vue-meta uses to determine whether to overwrite or append a tag
});

var vm = new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app');
