import request from '@/utils/request';
// import axios from 'axios';
// import { getToken } from '@/utils/auth';

export function findAccountReport(data) {
  return request({
    url: '/api/wrp/check/FindAccountReport',
    method: 'post',
    data
  });
  // return axios.post('http://localhost:8011/api/check/FindAccountReport',data,{headers:{'token': getToken()}});
}

export function findAccountReportDt(data) {
  return request({
    url: '/api/wrp/check/FindAccountReportDt',
    method: 'post',
    data
  });
  // return axios.post('http://localhost:8011/api/check/FindAccountReportDt',data,{headers:{'token': getToken()}});
}
