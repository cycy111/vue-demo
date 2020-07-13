import request from '@/utils/request';
// import axios from 'axios';
// import { getToken } from '@/utils/auth';

export function getHistoryLendList(data) {
  return request({
    url: '/api/wrp/dianwang/GetHistoryLendList',
    method: 'post',
    data
  });
  // return axios.post('http://localhost:8011/api/dianwang/GetHistoryLendList',data,{headers:{'token': getToken()}});
}

export function updateHistoryLend(data) {
  return request({
    url: '/api/wrp/dianwang/updateHistoryLend',
    method: 'post',
    data
  });
  // return axios.post('http://localhost:8011/api/dianwang/updateHistoryLend',data,{headers:{'token': getToken()}});
}
