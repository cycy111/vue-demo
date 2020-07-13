import request from '@/utils/request';
import axios from 'axios';

export function loginByUsername(data) {
  // return request({
  // 	url: '/api/us/login/loginname',
  // 	method: 'post',
  // 	data
  // })
  //特例，因ocelot暂时没有实现x-forwarded-for功能
  let loginBaseUrl = process.env.VUE_APP_LOGIN_URL || 'http://localhost:8003';

  let loginUrl = loginBaseUrl + '/api/login/loginname';
  
  return axios.post(loginUrl, data, {
    timeout: 1000 * 60 * 2, // request timeout
    headers: { 'Content-Type': 'application/json; charset=utf-8' }
  });
  // return axios.post('http://localhost:8003/api/login/loginname',data,{
  // 	timeout: 1000 * 60 * 2, // request timeout
  // 	headers: { 'Content-Type': 'application/json; charset=utf-8' }
  // });
}

export function logout() {
  return request({
    url: '/login/logout',
    method: 'post'
  });
}

export function getUserInfo(token) {
  return request({
    url: '/user/info',
    method: 'get',
    params: { token }
  });
}
