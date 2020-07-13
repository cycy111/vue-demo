import request from '@/utils/request';
export function getSubmitDelivered(data) {
  return request({
    url: '/api/twm/push/getSubmitDelivered',
    method: 'post',
    data,
    responseType: 'application/json'
  });
  // return axios.post('http://localhost:8017/api/twm/getSubmitDelivered',data,{headers:{'token': getToken()}});
}

export function addSubmitDelivered(data) {
  return request({
    url: '/api/twm/push/addSubmitDelivered',
    method: 'post',
    data,
    responseType: 'application/json'
  });
  // return axios.post('http://localhost:8017/api/twm/addSubmitDelivered',data,{headers:{'token': getToken()}});
}

export function upSubmitDelivered(data) {
  return request({
    url: '/api/twm/push/upSubmitDelivered',
    method: 'post',
    data,
    responseType: 'application/json'
  });
  // return axios.post('http://localhost:8017/api/twm/upSubmitDelivered',data,{headers:{'token': getToken()}});
}

export function delSubmitDelivered(data) {
  return request({
    url: '/api/twm/push/delSubmitDelivered',
    method: 'post',
    data,
    responseType: 'application/json'
  });
  // return axios.post('http://localhost:8017/api/twm/delSubmitDelivered',data,{headers:{'token': getToken()}});
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
