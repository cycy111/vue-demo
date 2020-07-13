import request from '@/utils/request';
// import axios from 'axios';
// import { getToken } from '@/utils/auth';

export function addCheckNo(data) {
  return request({
    url: '/api/wrp/check/addCheckNo',
    method: 'post',
    data
  });
  //return axios.post('http://localhost:8011/api/check/addCheckNo',data,{headers:{'token': getToken()}});
}

export function findCheckNo(data) {
  return request({
    url: '/api/wrp/check/findCheckNoNew',
    method: 'post',
    data
  });
  // return axios.post('http://localhost:8011/api/check/findCheckNoNew',data,{headers:{'token': getToken()}});
}

export function findCheckNoDt(data) {
  return request({
    url: '/api/wrp/check/FindCheckNoNewDt',
    method: 'post',
    data
  });
  // return axios.post('http://localhost:8011/api/check/FindCheckNoNewDt',data,{headers:{'token': getToken()}});
}

export function sendCheckNo(data) {
  return request({
    url: '/api/wrp/check/sendCheckNo',
    method: 'post',
    data
  });
  //return axios.post('http://localhost:8011/api/check/sendCheckNo',data,{headers:{'token': getToken()}});
}

export function deleteCheckNo(data) {
  return request({
    url: '/api/wrp/check/deleteCheckNo',
    method: 'post',
    data
  });
  //return axios.post('http://localhost:8011/api/check/deleteCheckNo',data,{headers:{'token': getToken()}});
}

export function downloadCheckList(data) {
  return request({
    url: '/api/wrp/check/downloadCheckList',
    method: 'post',
    data,
    responseType: 'arraybuffer'
  });
  //return axios.post('http://localhost:8011/api/check/DownloadCheckList',data,{headers:{'token': getToken()},responseType:"arraybuffer"});
}
