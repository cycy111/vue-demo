import request from '@/utils/request';
// import axios from 'axios';
// import { getToken } from '@/utils/auth';

export function getErpOutStorageTotal(data) {
  return request({
    url: '/api/wrp/dianwang/GetErpOutStorageTotal',
    method: 'post',
    data
  });
  // return axios.post('http://localhost:8011/api/dianwang/GetlendStorageDetl',data,{headers:{'token': getToken()}});
}
