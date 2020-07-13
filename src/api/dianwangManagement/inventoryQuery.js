import request from '@/utils/request';
// import axios from 'axios';
// import { getToken } from '@/utils/auth';

export function getStorageList(data) {
  return request({
    url: '/api/wrp/dianwang/GetStorageList',
    method: 'post',
    data
  });
  // return axios.post('http://localhost:8011/api/dianwang/GetStorageList',data,{headers:{'token': getToken()}});
}
