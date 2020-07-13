import request from '@/utils/request';
export function getEleContract(data) {
  return request({
    url: '/api/twm/push/getEleContract',
    method: 'post',
    data,
    responseType: 'application/json'
  });
  // return axios.post('http://localhost:8017/api/twm/getEleContract',data,{headers:{'token': getToken()}});
}

export function addEleContract(data) {
  return request({
    url: '/api/twm/push/addEleContract',
    method: 'post',
    data,
    responseType: 'application/json'
  });
  // return axios.post('http://localhost:8017/api/twm/addEleContract',data,{headers:{'token': getToken()}});
}

export function upEleContract(data) {
  return request({
    url: '/api/twm/push/upEleContract',
    method: 'post',
    data,
    responseType: 'application/json'
  });
  // return axios.post('http://localhost:8017/api/twm/upEleContract',data,{headers:{'token': getToken()}});
}

export function delEleContract(data) {
  return request({
    url: '/api/twm/push/delEleContract',
    method: 'post',
    data,
    responseType: 'application/json'
  });
  // return axios.post('http://localhost:8017/api/twm/delEleContract',data,{headers:{'token': getToken()}});
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
