import request from '@/utils/request';
export function getExpenseDetail(data) {
  return request({
    url: '/api/twm/push/getExpenseDetail',
    method: 'post',
    data,
    responseType: 'application/json'
  });
  // return axios.post('http://localhost:8017/api/twm/getExpenseDetail',data,{headers:{'token': getToken()}});
}

export function addExpenseDetail(data) {
  return request({
    url: '/api/twm/push/addExpenseDetail',
    method: 'post',
    data,
    responseType: 'application/json'
  });
  // return axios.post('http://localhost:8017/api/twm/addExpenseDetail',data,{headers:{'token': getToken()}});
}

export function upExpenseDetail(data) {
  return request({
    url: '/api/twm/push/upExpenseDetail',
    method: 'post',
    data,
    responseType: 'application/json'
  });
  // return axios.post('http://localhost:8017/api/twm/upExpenseDetail',data,{headers:{'token': getToken()}});
}

export function delExpenseDetail(data) {
  return request({
    url: '/api/twm/push/delExpenseDetail',
    method: 'post',
    data,
    responseType: 'application/json'
  });
  // return axios.post('http://localhost:8017/api/twm/delExpenseDetail',data,{headers:{'token': getToken()}});
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
