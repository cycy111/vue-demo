import request from '@/utils/request';
export function getMsgQueHis(data) {
  return request({
    url: '/api/twm/mall/getMsgQueHis',
    method: 'post',
    data
  });
  // return axios.post('http://localhost:8017/api/twm/getMsgQueHis',data,{headers:{'token': getToken()}});
}
