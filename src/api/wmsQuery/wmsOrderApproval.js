import request from '@/utils/request';
// import axios from 'axios';
// import { getToken } from '@/utils/auth';

export function applyDocList(data) {
  return request({
    url: '/api/wrp/check/applyDocList',
    method: 'post',
    data
  });
  // return axios.post('http://localhost:8011/api/check/applyDocList',data,{headers:{'token': getToken()}});
}

export function applyDoc(data) {
  return request({
    url: '/api/wrp/check/applyDoc',
    method: 'post',
    data
  });
  // return axios.post('http://localhost:8011/api/check/applyDoc',data,{headers:{'token': getToken()}});
}

export function checkflow(data) {
  return request({
    url: '/api/wrp/check/checkflow',
    method: 'post',
    data
  });
  // return axios.post('http://localhost:8011/api/check/checkflow',data,{headers:{'token': getToken()}});
}
export function leaderCheck(data) {
  return request({
    url: '/api/wrp/check/LeaderCheck',
    method: 'post',
    data
  });
  // return axios.post('http://localhost:8011/api/check/LeaderCheck',data,{headers:{'token': getToken()}});
}
