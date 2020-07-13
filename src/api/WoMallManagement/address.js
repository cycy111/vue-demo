import request from '@/utils/request';
// import axios from 'axios';
// import { getToken } from '@/utils/auth';

export function getAreaList(data) {
  return request({
    url: '/api/twm/mall/GetAreaList',
    method: 'post',
    data
  });
  // return axios.post('http://localhost:8011/api/twm/GetAreaList',data,{headers:{'token': getToken()}});
}
