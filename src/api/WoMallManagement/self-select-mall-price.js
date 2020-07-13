import request from '@/utils/request';
export function getPriceApplyZX(data) {
  return request({
    url: '/api/twm/mall/getPriceApplyZX',
    method: 'post',
    data,
    responseType: 'application/json'
  });
  // return axios.post('http://localhost:8017/api/twm/getPriceApplyZX',data,{headers:{'token': getToken()}});
}

export function getFleetList(data) {
  return request({
    url: '/api/twm/mall/getFleetList',
    method: 'post',
    data,
    responseType: 'application/json'
  });
  // return axios.post('http://localhost:8017/api/twm/getFleetList',data,{headers:{'token': getToken()}});
}
