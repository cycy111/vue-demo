import axios from 'axios';
import { Message, Loading } from 'element-ui';
import store from '@/store';
import { getToken } from '@/utils/auth';
import router from '@/router';

// create an axios instance
/*
//process.env.BASE_API 
http://192.168.1.180:8017 马学君
login http://120.77.205.81:8003 
http://192.168.1.13:82 
http://localhost 生产环境
*/
let loadingInstance;
console.log(process.env.VUE_APP_BASE_URL);
let baseUrl = process.env.VUE_APP_BASE_URL || 'http://localhost:8000';
const service = axios.create({
  baseURL: baseUrl,
  timeout: 1000 * 60 * 2, // request timeout
  headers: { 'Content-Type': 'application/json; charset=utf-8' }
});
service.interceptors.request.use(
  config => {
    loadingInstance = Loading.service({
      fullscreen: true,
      background: 'rgba(0, 0, 0, .5)',
      customClass: 'myLoading',
      text: '加载中...',
      lock: true
    });

    // Do something before request is sent
    if (store.getters.token) {
      config.headers['token'] = getToken();
    }
    // if (config.method === 'post' && config.data) {
    // 	config.data.pageSize = config.data.pageSize ? config.data.pageSize : 10;
    // 	config.data.pageIndex = config.data.pageIndex ? config.data.pageIndex : 1;
    // }
    return config;
  },
  error => {
    // Do something with request error
    //console.log(error) // for debug
    Promise.reject(error);
  }
);

// respone interceptor
service.interceptors.response.use(
  response => {
    loadingInstance.close();
    if (response.status == 200) {
      if (response.data.message == '无权限访问') {
        router.push('/login');
      }
    }
    return response;
  },
  /**
	 * 下面的注释为通过response自定义code来标示请求状态，当code返回如下情况为权限有问题，登出并返回到登录页
	 * 如通过xmlhttprequest 状态码标识 逻辑可写在下面error中
	 
	 const res = response.data;
	    if (res.code !== 20000) {
	      Message({
	        message: res.message,
	        type: 'error',
	        duration: 5 * 1000
	      });
	      // 50008:非法的token; 50012:其他客户端登录了;  50014:Token 过期了;
	      if (res.code === 50008 || res.code === 50012 || res.code === 50014) {
	        MessageBox.confirm('你已被登出，可以取消继续留在该页面，或者重新登录', '确定登出', {
	          confirmButtonText: '重新登录',
	          cancelButtonText: '取消',
	          type: 'warning'
	        }).then(() => {
	          store.dispatch('FedLogOut').then(() => {
	            location.reload();// 为了重新实例化vue-router对象 避免bug
	          });
	        })
	      }
	      return Promise.reject('error');
	    } else {
	      return response.data;
	    }
	*/
  error => {
    loadingInstance.close();
    if (error.response) {
      switch (error.response.status) {
        case 401:
          Message({
            message:
              '权限验证失败,请重新登录!' +
              `错误代码：(${error.response.status})`,
            type: 'error',
            duration: 3 * 1000
          });
          setTimeout(() => {
            sessionStorage.removeItem('userInfo');
            location.reload();
          }, 1 * 1000);
          break;
        case 404:
          Message({
            message: '获取数据失败。' + `错误代码：(${error.response.status})`,
            type: 'error',
            duration: 3 * 1000
          });
          console.error(
            '接口：' +
              error.response.request.responseURL +
              `[${error.response.status}]`
          );
          break;
        default:
          Message({
            message: error.message,
            type: 'error',
            duration: 2 * 1000
          });
      }
    }
    return Promise.reject(error);
  }
);

export default service;
