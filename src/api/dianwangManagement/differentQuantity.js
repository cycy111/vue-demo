import request from '@/utils/request';
// import axios from 'axios';
// import { getToken } from '@/utils/auth';

export function getDelDiffList(data) {
  return request({
    url: '/api/wrp/dianwang/GetDelDiffList',
    method: 'post',
    data
  });
  // return axios.post('http://localhost:8011/api/dianwang/GetDelDiffList',data,{headers:{'token': getToken()}});
}
