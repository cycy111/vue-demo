import { constantRouterMap, localRouter } from '@/router';
//ajax router
import { getRouters } from '@/api/router';
import Layout from '@/views/layout/Layout';
import { Message } from 'element-ui';
import NProgress from 'nprogress'; // progress bar
const _ = require('lodash');

let keepAliveRouter = ['logisticsOrderList', 'WmsOrderApproval'];

/**
 * 通过meta.role判断是否与当前用户权限匹配
 * @param roles
 * @param route
 */
function hasPermission(roles, route) {
  if (route.meta && route.meta.roles) {
    return roles.some(role => route.meta.roles.indexOf(role) >= 0);
  } else {
    return true;
  }
}

/**
 * 递归过滤异步路由表，返回符合用户角色权限的路由表
 * @param asyncRouterMap
 * @param roles
 */
function filterAsyncRouter(asyncRouterMap, roles) {
  const accessedRouters = asyncRouterMap.filter(route => {
    if (hasPermission(roles, route)) {
      if (route.children && route.children.length) {
        route.children = filterAsyncRouter(route.children, roles);
      }
      return true;
    }
    return false;
  });
  return accessedRouters;
}

const permission = {
  state: {
    routers: constantRouterMap,
    addRouters: []
  },
  mutations: {
    SET_ROUTERS: (state, routers) => {
      state.addRouters = routers;
      state.routers = constantRouterMap.concat(routers);
    }
  },
  actions: {
    GenerateRoutes({ commit }, data) {
      return new Promise((resolve, reject) => {
        // const { roles } = data
        // let accessedRouters
        // if (roles.indexOf('admin') >= 0) {
        //   accessedRouters = asyncRouterMap
        // } else {
        //   accessedRouters = filterAsyncRouter(asyncRouterMap, roles)
        // }
        let asyncRouterMapData = [];
        if (sessionStorage.asyncRouterMapData) {
          asyncRouterMapData = JSON.parse(sessionStorage.asyncRouterMapData);
          asyncRouterMapData.forEach((val, ind) => {
            val.component = Layout;
            //设置是否缓存
            // if (
            //   _.filter(keepAliveRouter, c => {
            //     return _.toUpper(c) == _.toUpper(val.name);
            //   }).length
            // ) {
            //   val.meta.keepAlive = true;
            // }
            // val.meta.keepAlive = true;
            if (typeof val.children === 'object' && val.children !== 0) {
              val.children.forEach((value, index) => {
                try {
                  //设置是否缓存
                  if (
                    _.filter(keepAliveRouter, c => {
                      return _.toUpper(c) == _.toUpper(value.name);
                    }).length
                  ) {
                    value.meta.keepAlive = true;
                  }
                  // value.meta.keepAlive = true;
                  value.component = require('@/views' +
                    value.component +
                    '.vue').default;
                } catch (error) {
                  value.component = require('@/views/defaultPage/defaultPage.vue').default;
                }
                value.path = value.path.slice(1);
              });
            }
          });
          asyncRouterMapData = asyncRouterMapData.concat(localRouter);
          commit('SET_ROUTERS', asyncRouterMapData);
          resolve();
          return;
        }
        getRouters({})
          .then(res => {
            if (res.data.resultCode === 1) {
              asyncRouterMapData = [];
              let data = res.data;
              asyncRouterMapData = data.data.MenuList;
              sessionStorage.asyncRouterMapData = (function() {
                return JSON.stringify(asyncRouterMapData);
              })();
              asyncRouterMapData.forEach((val, ind) => {
                val.component = Layout;
                //设置是否缓存
                // if (
                //   _.filter(keepAliveRouter, c => {
                //     return _.toUpper(c) == _.toUpper(val.name);
                //   }).length
                // ) {
                //   val.meta.keepAlive = true;
                // }
                // val.meta.keepAlive = true;
                if (typeof val.children === 'object' && val.children !== 0) {
                  val.children.forEach((value, index) => {
                    try {
                      //设置是否缓存
                      if (
                        _.filter(keepAliveRouter, c => {
                          return _.toUpper(c) == _.toUpper(value.name);
                        }).length
                      ) {
                        value.meta.keepAlive = true;
                      }
                      // value.meta.keepAlive = true;
                      value.component = require('@/views' +
                        value.component +
                        '.vue').default;
                    } catch (error) {
                      value.component = require('@/views/defaultPage/defaultPage.vue').default;
                    }
                    value.path = value.path.slice(1);
                  });
                }
              });
              asyncRouterMapData = asyncRouterMapData.concat(localRouter);
              commit('SET_ROUTERS', asyncRouterMapData);
              resolve();
            } else {
              asyncRouterMapData = [];
              Message({
                message: '获取路由数据失败，请稍后再试！',
                type: 'error',
                duration: 3 * 1000
              });
              NProgress.done();
              asyncRouterMapData.push(localRouter[0]);
              commit('SET_ROUTERS', asyncRouterMapData);
              resolve();
            }
          })
          .catch(error => {
            asyncRouterMapData = [];
            Message({
              message: '获取路由数据失败，请稍后再试！',
              type: 'error',
              duration: 3 * 1000
            });
            NProgress.done();
            asyncRouterMapData.push(localRouter[0]);
            commit('SET_ROUTERS', asyncRouterMapData);
            resolve();
          });
      });
    }
  }
};

export default permission;
