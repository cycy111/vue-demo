import router from './router';
import store from './store';
import { Message } from 'element-ui';
import NProgress from 'nprogress'; // progress bar
import 'nprogress/nprogress.css'; // progress bar style
import { getUserInfo } from '@/utils/auth'; // getToken from cookie
import { asyncRouterMap } from '@/router';

NProgress.configure({ showSpinner: false }); // NProgress Configuration
// permissiom judge function
function hasPermission(roles, permissionRoles) {
  if (roles.indexOf('admin') >= 0) return true; // admin permission passed directly
  if (!permissionRoles) return true;
  return roles.some(role => permissionRoles.indexOf(role) >= 0);
}
const whiteList = ['/login', '/authredirect']; // no redirect whitelist

router.beforeEach((to, from, next) => {
  const userInfo = getUserInfo();
  // document.title = to.meta.title+' - 兆航物流TMS后台管理系统';
  NProgress.start();
  if (userInfo) {
    //判断是否获取了用户信息 token在用户信息中
    if (to.path === '/login') {
      next({ path: '/' });
      NProgress.done();
    } else {
      if (store.getters.addRouters.length === 0) {
        let roles = [userInfo.userType];
        store.dispatch('GenerateRoutes', { roles }).then(res => {
          // 根据roles权限生成可访问的路由表 		//userInfo.userType
          router.addRoutes(store.getters.addRouters); // 动态添加可访问路由表
          next({ ...to, replace: true }); //{ ...to, replace: true }
        });
      } else {
        next();
      }
    }
  } else {
    /* has no token*/
    if (whiteList.indexOf(to.path) !== -1) {
      // 在免登录白名单，直接进入
      next();
    } else {
      next('/login'); // 否则全部重定向到登录页
      NProgress.done(); // if current page is login will not trigger afterEach hook, so manually handle it
    }
  }
});

router.afterEach(() => {
  NProgress.done();
});
