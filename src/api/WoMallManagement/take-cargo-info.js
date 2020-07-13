import request from '@/utils/request';
export function getTakeCargo(data) {
  return request({
    url: '/api/twm/push/getTakeCargo',
    method: 'post',
    data,
    responseType: 'application/json'
  });
  // return axios.post('http://localhost:8017/api/twm/getTakeCargo',data,{headers:{'token': getToken()}});
}

export function addTakeCargo(data) {
  return request({
    url: '/api/twm/push/addTakeCargo',
    method: 'post',
    data,
    responseType: 'application/json'
  });
  // return axios.post('http://localhost:8017/api/twm/addTakeCargo',data,{headers:{'token': getToken()}});
}

export function upTakeCargo(data) {
  return request({
    url: '/api/twm/push/upTakeCargo',
    method: 'post',
    data,
    responseType: 'application/json'
  });
  // return axios.post('http://localhost:8017/api/twm/upTakeCargo',data,{headers:{'token': getToken()}});
}

export function delTakeCargo(data) {
  return request({
    url: '/api/twm/push/delTakeCargo',
    method: 'post',
    data,
    responseType: 'application/json'
  });
  // return axios.post('http://localhost:8017/api/twm/delTakeCargo',data,{headers:{'token': getToken()}});
}

export function genTmsShipment(data) {
  return request({
    url: '/api/twm/push/genTmsShipment',
    method: 'post',
    data,
    responseType: 'application/json'
  });
  // return axios.post('http://localhost:8017/api/twm/genTmsShipment',data,{headers:{'token': getToken()}});
}

export function getOrderCargo(data) {
  return request({
    url: '/api/twm/push/getOrderCargo',
    method: 'post',
    data,
    responseType: 'application/json'
  });
  // return axios.post('http://localhost:8017/api/twm/getOrderCargo',data,{headers:{'token': getToken()}});
}

export function getOrderUser(data) {
  return request({
    url: '/api/twm/push/getOrderUser',
    method: 'post',
    data,
    responseType: 'application/json'
  });
  // return axios.post('http://localhost:8017/api/twm/getOrderUser',data,{headers:{'token': getToken()}});
}

export function getLogisticsOrder(data) {
  return request({
    url: '/api/twm/push/getLogisticsOrder',
    method: 'post',
    data,
    responseType: 'application/json'
  });
  // return axios.post('http://localhost:8017/api/twm/getLogisticsOrder',data,{headers:{'token': getToken()}});
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

export function getAreaList(data) {
  return request({
    url: '/api/twm/mall/getAreaList',
    method: 'post',
    data,
    responseType: 'application/json'
  });
  // return axios.post('http://localhost:8017/api/twm/getAreaList',data,{headers:{'token': getToken()}});
}
