import request from '@/utils/request';
export function getCpriceLd(data) {
  return request({
    url: '/api/twm/mall/getCpriceLd',
    method: 'post',
    data,
    responseType: 'application/json'
  });
  // return axios.post('http://localhost:8017/api/twm/getCpriceLd',data,{headers:{'token': getToken()}});
}

export function addCpriceLd(data) {
  return request({
    url: '/api/twm/mall/addCpriceLd',
    method: 'post',
    data,
    responseType: 'application/json'
  });
  // return axios.post('http://localhost:8017/api/twm/addCpriceLd',data,{headers:{'token': getToken()}});
}

export function upCpriceLd(data) {
  return request({
    url: '/api/twm/mall/upCpriceLd',
    method: 'post',
    data,
    responseType: 'application/json'
  });
  // return axios.post('http://localhost:8017/api/twm/upCpriceLd',data,{headers:{'token': getToken()}});
}

export function delCpriceLd(data) {
  return request({
    url: '/api/twm/mall/delCpriceLd',
    method: 'post',
    data,
    responseType: 'application/json'
  });
  // return axios.post('http://localhost:8017/api/twm/delCpriceLd',data,{headers:{'token': getToken()}});
}

export function auditCpriceLd(data) {
  return request({
    url: '/api/twm/mall/auditCpriceLd',
    method: 'post',
    data,
    responseType: 'application/json'
  });
  // return axios.post('http://localhost:8017/api/twm/auditCpriceLd',data,{headers:{'token': getToken()}});
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

export function addSpriceLd(data) {
  return request({
    url: '/api/twm/mall/addSpriceLd',
    method: 'post',
    data,
    responseType: 'application/json'
  });
  // return axios.post('http://localhost:8017/api/twm/addSpriceLd',data,{headers:{'token': getToken()}});
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

export function importPricesLd(data) {
  return request({
    url: '/api/twm/mall/importPricesLd',
    method: 'post',
    data,
    responseType: 'application/json'
  });
  // return axios.post('http://localhost:8017/api/twm/importPricesLd',data,{headers:{'token': getToken()}});
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
