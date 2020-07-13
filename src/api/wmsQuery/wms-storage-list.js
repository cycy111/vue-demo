import request from '@/utils/request';
export function findStorageDetl(data) {
  return request({
    url: '/api/wrp/storage/findStorageDetl',
    method: 'post',
    data,
    responseType: 'application/json'
  });
  // return axios.post('http://localhost:8017/api/twm/findStorageDetl',data,{headers:{'token': getToken()}});
}

export function downStorageDetl(data) {
  return request({
    url: '/api/wrp/storage/downStorageDetl',
    method: 'post',
    data,
    responseType: 'application/json'
  });
  // return axios.post('http://localhost:8017/api/twm/downStorageDetl',data,{headers:{'token': getToken()}});
}
