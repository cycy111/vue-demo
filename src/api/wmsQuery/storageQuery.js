import request from '@/utils/request';
// import axios from 'axios';
// import { getToken } from '@/utils/auth';

export function findStorage(data) {
  return request({
    url: '/api/wrp/storage/FindStorage',
    method: 'post',
    data
  });
  // return axios.post('http://localhost:8011/api/storage/FindStorage',data,{headers:{'token': getToken()}});
}

export function downStorageSetList(data) {
  return request({
    url: '/api/wrp/storage/DownStorageSetList',
    method: 'post',
    data,
    responseType: 'arraybuffer'
  });
  // return axios.post('http://localhost:8011/api/storage/DownStorageSetList',data,{headers:{'token': getToken()},responseType:"arraybuffer"});
}

export function findWmsList(data) {
  return request({
    url: '/api/wrp/storage/findWmsList',
    method: 'post',
    data
  });
  // return axios.post('http://localhost:8011/api/storage/findWmsList',data,{headers:{'token': getToken()}});
}

export function findLoginLog(data) {
  return request({
    url: '/api/wrp/storage/findLoginLog',
    method: 'post',
    data
  });
  // return axios.post('http://localhost:8011/api/storage/findLoginLog',data,{headers:{'token': getToken()}});
}

export function findInventoryFlow(data) {
  return request({
    url: '/api/wrp/check/findInventoryFlow',
    method: 'post',
    data
  });
  // return axios.post('http://localhost:8011/api/check/findInventoryFlow',data,{headers:{'token': getToken()}});
}
