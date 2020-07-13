import request from '@/utils/request';
// import axios from 'axios';
// import { getToken } from '@/utils/auth';

export function getSelectData(data) {
  return request({
    url: '/api/wrp/dianwang/GetSelectData',
    method: 'post',
    data
  });
  // return axios.post('http://localhost:8011/api/dianwang/GetSelectData',data,{headers:{'token': getToken()}});
}

export function getlendStorageDetl(data) {
  return request({
    url: '/api/wrp/dianwang/GetlendStorageDetl',
    method: 'post',
    data
  });
  // return axios.post('http://localhost:8011/api/dianwang/GetlendStorageDetl',data,{headers:{'token': getToken()}});
}
