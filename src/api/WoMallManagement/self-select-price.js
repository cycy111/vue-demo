import request from '@/utils/request';
export function getPriceZx(data) {
  return request({
    url: '/api/twm/mall/getPriceZx',
    method: 'post',
    data,
    responseType: 'application/json'
  });
  // return axios.post('http://localhost:8017/api/twm/getPriceZx',data,{headers:{'token': getToken()}});
}

export function addPriceZx(data) {
  return request({
    url: '/api/twm/mall/addPriceZx',
    method: 'post',
    data,
    responseType: 'application/json'
  });
  // return axios.post('http://localhost:8017/api/twm/addPriceZx',data,{headers:{'token': getToken()}});
}

export function upPriceZx(data) {
  return request({
    url: '/api/twm/mall/upPriceZx',
    method: 'post',
    data,
    responseType: 'application/json'
  });
  // return axios.post('http://localhost:8017/api/twm/upPriceZx',data,{headers:{'token': getToken()}});
}

export function delPriceZx(data) {
  return request({
    url: '/api/twm/mall/delPriceZx',
    method: 'post',
    data,
    responseType: 'application/json'
  });
  // return axios.post('http://localhost:8017/api/twm/delPriceZx',data,{headers:{'token': getToken()}});
}

export function auditPriceZx(data) {
  return request({
    url: '/api/twm/mall/auditPriceZx',
    method: 'post',
    data,
    responseType: 'application/json'
  });
  // return axios.post('http://localhost:8017/api/twm/auditPriceZx',data,{headers:{'token': getToken()}});
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
