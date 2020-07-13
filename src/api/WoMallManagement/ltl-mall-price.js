import request from '@/utils/request';
export function getPriceApplyLd(data) {
  return request({
    url: '/api/twm/mall/getPriceApplyLd',
    method: 'post',
    data,
    responseType: 'application/json'
  });
  // return axios.post('http://localhost:8017/api/twm/getPriceApplyLd',data,{headers:{'token': getToken()}});
}

export function addQueueList(data) {
  return request({
    url: '/api/twm/mall/addQueueList',
    method: 'post',
    data,
    responseType: 'application/json'
  });
  // return axios.post('http://localhost:8017/api/twm/addQueueList',data,{headers:{'token': getToken()}});
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
