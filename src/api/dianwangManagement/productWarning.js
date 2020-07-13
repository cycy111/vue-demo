import request from '@/utils/request';
// import axios from 'axios';
// import { getToken } from '@/utils/auth';

export function getWarnStorage(data) {
  return request({
    url: '/api/wrp/dianwang/GetWarnStorage',
    method: 'post',
    data
  });
  // return axios.post('http://localhost:8011/api/dianwang/GetWarnStorage',data,{headers:{'token': getToken()}});
}
