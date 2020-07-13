import request from '@/utils/request';
          export function GetPushMsg(data) {
              return request({
                url: '/api/twm/push/GetPushMsg',
                method: 'post',
                data,
                responseType:'application/json'
              });
              // return axios.post('http://localhost:8017/api/twm/GetPushMsg',data,{headers:{'token': getToken()}});
            }
          