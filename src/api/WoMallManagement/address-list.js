import request from '@/utils/request';
export function getAreaList(data) {
  return request({
    url: '/api/twm/mall/getAreaList',
    method: 'post',
    data,
    responseType: 'application/json'
  });
  // return axios.post('http://localhost:8017/api/twm/getAreaList',data,{headers:{'token': getToken()}});
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
