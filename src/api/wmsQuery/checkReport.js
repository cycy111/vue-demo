import request from '@/utils/request';
// import axios from 'axios';
// import { getToken } from '@/utils/auth';

export function findCheckReport(data) {
  return request({
    url: '/api/wrp/check/FindCheckReport',
    method: 'post',
    data
  });
  // return axios.post('http://localhost:8011/api/check/FindCheckReport',data,{headers:{'token': getToken()}});
}

export function findCheckReportDt(data) {
  return request({
    url: '/api/wrp/check/findCheckReportDt',
    method: 'post',
    data
  });
  // return axios.post('http://localhost:8011/api/check/findCheckReportDt',data,{headers:{'token': getToken()}});
}
