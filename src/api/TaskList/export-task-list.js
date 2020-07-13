import request from '@/utils/request';
export function getTaskTb(data) {
  return request({
    url: '/api/wrp/storage/getTaskTb',
    method: 'post',
    data,
    responseType: 'application/json'
  });
  // return axios.post('http://localhost:8017/api/twm/getTaskTb',data,{headers:{'token': getToken()}});
}
