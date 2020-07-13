import request from '@/utils/request';
// import axios from 'axios';
// import { getToken } from '@/utils/auth';

export function getWmsAccount(data) {
  return request({
    url: '/api/ac/wmsAccount/getWmsAccount',
    method: 'post',
    data
  });
  // return axios.post('http://localhost:8011/api/dianwang/GetlendStorageDetl',data,{headers:{'token': getToken()}});
}
export function getWmsAccountById(data, params) {
  return request({
    url: '/api/ac/wmsAccount/getWmsAccountById',
    method: 'post',
    data,
    params
  });
  // return axios.post('http://localhost:8011/api/dianwang/GetlendStorageDetl',data,{headers:{'token': getToken()}});
}
export function getDeptment(data) {
  return request({
    url: '/api/ac/wmsAccount/getDeptment',
    method: 'post',
    data
  });
  // return axios.post('http://localhost:8011/api/dianwang/GetlendStorageDetl',data,{headers:{'token': getToken()}});
}
export function getPortDeptment(data) {
  return request({
    url: '/api/ac/wmsAccount/getPortDeptment',
    method: 'post',
    data
  });
  // return axios.post('http://localhost:8011/api/dianwang/GetlendStorageDetl',data,{headers:{'token': getToken()}});
}
export function addUser(data) {
  return request({
    url: '/api/ac/wmsAccount/addUser',
    method: 'post',
    data
  });
  // return axios.post('http://localhost:8011/api/dianwang/GetlendStorageDetl',data,{headers:{'token': getToken()}});
}
export function updateLock(data) {
  return request({
    url: '/api/ac/WmsAccount/UpdateLock',
    method: 'post',
    data
  });
  // return axios.post('http://localhost:8011/api/dianwang/GetlendStorageDetl',data,{headers:{'token': getToken()}});
}
export function updateUser(data) {
  return request({
    url: '/api/ac/WmsAccount/UpdateUser',
    method: 'post',
    data
  });
  // return axios.post('http://localhost:8011/api/dianwang/GetlendStorageDetl',data,{headers:{'token': getToken()}});
}
