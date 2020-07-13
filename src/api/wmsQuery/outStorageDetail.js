import request from '@/utils/request';
// import axios from 'axios';
// import { getToken } from '@/utils/auth';

export function findOutStorageDt(data) {
  return request({
    url: '/api/wrp/storage/FindOutStorageDt',
    method: 'post',
    data
  });
  // return axios.post('http://localhost:8011/api/storage/FindOutStorageDt',data,{headers:{'token': getToken()}});
}

export function downOutStorageDt(data) {
  return request({
    url: '/api/wrp/storage/DownOutStorageDt',
    method: 'post',
    data,
    responseType: 'arraybuffer'
  });
  // return axios.post('http://localhost:8011/api/storage/DownOutStorageDt',data,{headers:{'token': getToken()},responseType:"arraybuffer"});
}
