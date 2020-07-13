import request from '@/utils/request';
// import axios from 'axios';
// import { getToken } from '@/utils/auth';

//获取路由数据
export function getRouters(data) {
  // return axios.post('/api/us/Menu/PostMenu',data,{headers:{'token': getToken()}});
  return request({
    url: '/api/us/Menu/PostMenu',
    method: 'post',
    data
  });
}
