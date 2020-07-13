import request from '@/utils/request';
export function getOrderCargo(data) {
  return request({
    url: '/api/twm/push/getOrderCargo',
    method: 'post',
    data,
    responseType: 'application/json'
  });
  // return axios.post('http://localhost:8017/api/twm/getOrderCargo',data,{headers:{'token': getToken()}});
}
