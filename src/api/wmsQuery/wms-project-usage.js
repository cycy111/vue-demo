import request from '@/utils/request';
export function getWMSsUsage(data) {
  return request({
    url: '/api/wrp/storage/getWMSsUsage',
    method: 'post',
    data,
    responseType: 'application/json'
  });
  // return axios.post('http://localhost:8017/api/twm/getWMSsUsage',data,{headers:{'token': getToken()}});
}
