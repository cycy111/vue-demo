import request from '@/utils/request';
export function getConfirmSend(data) {
  return request({
    url: '/api/twm/push/getConfirmSend',
    method: 'post',
    data,
    responseType: 'application/json'
  });
  // return axios.post('http://localhost:8017/api/twm/getConfirmSend',data,{headers:{'token': getToken()}});
}

export function addConfirmSend(data) {
  return request({
    url: '/api/twm/push/addConfirmSend',
    method: 'post',
    data,
    responseType: 'application/json'
  });
  // return axios.post('http://localhost:8017/api/twm/addConfirmSend',data,{headers:{'token': getToken()}});
}

export function upConfirmSend(data) {
  return request({
    url: '/api/twm/push/upConfirmSend',
    method: 'post',
    data,
    responseType: 'application/json'
  });
  // return axios.post('http://localhost:8017/api/twm/upConfirmSend',data,{headers:{'token': getToken()}});
}

export function delConfirmSend(data) {
  return request({
    url: '/api/twm/push/delConfirmSend',
    method: 'post',
    data,
    responseType: 'application/json'
  });
  // return axios.post('http://localhost:8017/api/twm/delConfirmSend',data,{headers:{'token': getToken()}});
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
