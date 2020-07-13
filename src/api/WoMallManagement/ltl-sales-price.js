import request from '@/utils/request';
export function getSpriceLd(data) {
  return request({
    url: '/api/twm/mall/getSpriceLd',
    method: 'post',
    data,
    responseType: 'application/json'
  });
  // return axios.post('http://localhost:8017/api/twm/getSpriceLd',data,{headers:{'token': getToken()}});
}

export function addSpriceLdNew(data) {
  return request({
    url: '/api/twm/mall/addSpriceLdNew',
    method: 'post',
    data,
    responseType: 'application/json'
  });
  // return axios.post('http://localhost:8017/api/twm/addSpriceLdNew',data,{headers:{'token': getToken()}});
}

export function upSpriceLd(data) {
  return request({
    url: '/api/twm/mall/upSpriceLd',
    method: 'post',
    data,
    responseType: 'application/json'
  });
  // return axios.post('http://localhost:8017/api/twm/upSpriceLd',data,{headers:{'token': getToken()}});
}

export function delSpriceLd(data) {
  return request({
    url: '/api/twm/mall/delSpriceLd',
    method: 'post',
    data,
    responseType: 'application/json'
  });
  // return axios.post('http://localhost:8017/api/twm/delSpriceLd',data,{headers:{'token': getToken()}});
}

export function auditSpriceLd(data) {
  return request({
    url: '/api/twm/mall/auditSpriceLd',
    method: 'post',
    data,
    responseType: 'application/json'
  });
  // return axios.post('http://localhost:8017/api/twm/auditSpriceLd',data,{headers:{'token': getToken()}});
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

export function exportPrices(data) {
  return request({
    url: '/api/twm/mall/exportPrices',
    method: 'post',
    data,
    responseType: 'arraybuffer'
  });
  // return axios.post('http://localhost:8017/api/twm/exportPrices',data,{headers:{'token': getToken()}});
}

export function importPricesLdNew(data) {
  return request({
    url: '/api/twm/mall/importPricesLdNew',
    method: 'post',
    data,
    responseType: 'application/json'
  });
  // return axios.post('http://localhost:8017/api/twm/importPricesLdNew',data,{headers:{'token': getToken()}});
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
