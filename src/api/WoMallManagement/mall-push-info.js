import request from '@/utils/request';
export function getPushMsg(data) {
  return request({
    url: '/api/twm/push/getPushMsg',
    method: 'post',
    data,
    responseType: 'application/json'
  });
  // return axios.post('http://localhost:8017/api/twm/getPushMsg',data,{headers:{'token': getToken()}});
}
