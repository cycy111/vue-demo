import request from '@/utils/request';
// import axios from 'axios';
// import { getToken } from '@/utils/auth';

export function findInStorageDt(data) {
  return request({
    url: '/api/wrp/storage/FindInStorageDt',
    method: 'post',
    data
  });
  // return axios.post('http://localhost:8011/api/storage/FindInStorageDt',data,{headers:{'token': getToken()}});
}

export function downInStorageDt(data) {
  return request({
    url: '/api/wrp/storage/DownInStorageDt',
    method: 'post',
    data,
    responseType: 'arraybuffer'
  });
  // return axios.post('http://localhost:8011/api/storage/DownInStorageDt',data,{headers:{'token': getToken()},responseType:"arraybuffer"});
}
