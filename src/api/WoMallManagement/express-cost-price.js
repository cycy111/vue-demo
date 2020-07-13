import request from '@/utils/request';
export function getCpriceKd(data) {
  return request({
    url: '/api/twm/mall/getCpriceKd',
    method: 'post',
    data,
    responseType: 'application/json'
  });
  // return axios.post('http://localhost:8017/api/twm/getCpriceKd',data,{headers:{'token': getToken()}});
}

export function addCpriceKd(data) {
  return request({
    url: '/api/twm/mall/addCpriceKd',
    method: 'post',
    data,
    responseType: 'application/json'
  });
  // return axios.post('http://localhost:8017/api/twm/addCpriceKd',data,{headers:{'token': getToken()}});
}

export function upCpriceKd(data) {
  return request({
    url: '/api/twm/mall/upCpriceKd',
    method: 'post',
    data,
    responseType: 'application/json'
  });
  // return axios.post('http://localhost:8017/api/twm/upCpriceKd',data,{headers:{'token': getToken()}});
}

export function delCpriceKd(data) {
  return request({
    url: '/api/twm/mall/delCpriceKd',
    method: 'post',
    data,
    responseType: 'application/json'
  });
  // return axios.post('http://localhost:8017/api/twm/delCpriceKd',data,{headers:{'token': getToken()}});
}

export function auditCpriceKd(data) {
  return request({
    url: '/api/twm/mall/auditCpriceKd',
    method: 'post',
    data,
    responseType: 'application/json'
  });
  // return axios.post('http://localhost:8017/api/twm/auditCpriceKd',data,{headers:{'token': getToken()}});
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

export function addAreaList(data) {
  return request({
    url: '/api/twm/mall/addAreaList',
    method: 'post',
    data,
    responseType: 'application/json'
  });
  // return axios.post('http://localhost:8017/api/twm/addAreaList',data,{headers:{'token': getToken()}});
}

export function addSpriceKd(data) {
  return request({
    url: '/api/twm/mall/addSpriceKd',
    method: 'post',
    data,
    responseType: 'application/json'
  });
  // return axios.post('http://localhost:8017/api/twm/addSpriceKd',data,{headers:{'token': getToken()}});
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
