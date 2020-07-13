import request from '@/utils/request';
export function getCancelResult(data) {
  return request({
    url: '/api/twm/push/getCancelResult',
    method: 'post',
    data
  });
  // return axios.post('http://localhost:8017/api/twm/getCancelResult',data,{headers:{'token': getToken()}});
}

export function addCancelResult(data) {
  return request({
    url: '/api/twm/push/addCancelResult',
    method: 'post',
    data
  });
  // return axios.post('http://localhost:8017/api/twm/addCancelResult',data,{headers:{'token': getToken()}});
}

export function upCancelResult(data) {
  return request({
    url: '/api/twm/push/upCancelResult',
    method: 'post',
    data
  });
  // return axios.post('http://localhost:8017/api/twm/upCancelResult',data,{headers:{'token': getToken()}});
}

export function delCancelResult(data) {
  return request({
    url: '/api/twm/push/delCancelResult',
    method: 'post',
    data
  });
  // return axios.post('http://localhost:8017/api/twm/delCancelResult',data,{headers:{'token': getToken()}});
}

export function addQueueList(data) {
  return request({
    url: '/api/twm/push/addQueueList',
    method: 'post',
    data
  });
  // return axios.post('http://localhost:8017/api/twm/addQueueList',data,{headers:{'token': getToken()}});
}
