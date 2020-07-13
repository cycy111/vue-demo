import request from '@/utils/request';
export function getOrderTrack(data) {
  return request({
    url: '/api/twm/push/getOrderTrack',
    method: 'post',
    data,
    responseType: 'application/json'
  });
  // return axios.post('http://localhost:8017/api/twm/getOrderTrack',data,{headers:{'token': getToken()}});
}

export function addOrderTrack(data) {
  return request({
    url: '/api/twm/push/addOrderTrack',
    method: 'post',
    data,
    responseType: 'application/json'
  });
  // return axios.post('http://localhost:8017/api/twm/addOrderTrack',data,{headers:{'token': getToken()}});
}

export function upOrderTrack(data) {
  return request({
    url: '/api/twm/push/upOrderTrack',
    method: 'post',
    data,
    responseType: 'application/json'
  });
  // return axios.post('http://localhost:8017/api/twm/upOrderTrack',data,{headers:{'token': getToken()}});
}

export function delOrderTrack(data) {
  return request({
    url: '/api/twm/push/delOrderTrack',
    method: 'post',
    data,
    responseType: 'application/json'
  });
  // return axios.post('http://localhost:8017/api/twm/delOrderTrack',data,{headers:{'token': getToken()}});
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
