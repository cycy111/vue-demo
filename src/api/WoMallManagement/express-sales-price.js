import request from '@/utils/request';
export function getSpriceKd(data) {
  return request({
    url: '/api/twm/mall/getSpriceKd',
    method: 'post',
    data,
    responseType: 'application/json'
  });
  // return axios.post('http://localhost:8017/api/twm/getSpriceKd',data,{headers:{'token': getToken()}});
}

export function upSpriceKd(data) {
  return request({
    url: '/api/twm/mall/upSpriceKd',
    method: 'post',
    data,
    responseType: 'application/json'
  });
  // return axios.post('http://localhost:8017/api/twm/upSpriceKd',data,{headers:{'token': getToken()}});
}

export function delSpriceKd(data) {
  return request({
    url: '/api/twm/mall/delSpriceKd',
    method: 'post',
    data,
    responseType: 'application/json'
  });
  // return axios.post('http://localhost:8017/api/twm/delSpriceKd',data,{headers:{'token': getToken()}});
}

export function auditSpriceKd(data) {
  return request({
    url: '/api/twm/mall/auditSpriceKd',
    method: 'post',
    data,
    responseType: 'application/json'
  });
  // return axios.post('http://localhost:8017/api/twm/auditSpriceKd',data,{headers:{'token': getToken()}});
}

export function addAreaList(data) {
  return request({
    url: '/api/twm/mall/addAreaList',
    method: 'post',
    data,
    responseType: 'application/json'
  });
  // return axios.post('http://localhost:8017/api/twm/addAreaList',data,{headers:{'token': getToken()}});
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
