import request from '@/utils/request';
          export function getOutStorageList(data) {
              return request({
                url: '/api/wrp/storage/getOutStorageList',
                method: 'post',
                data,
                responseType:'application/json'
              });
              // return axios.post('http://localhost:8017/api/twm/getOutStorageList',data,{headers:{'token': getToken()}});
            }
          
          export function updateApply(data) {
              return request({
                url: '/api/wrp/storage/updateApply',
                method: 'post',
                data,
                responseType:'application/json'
              });
              // return axios.post('http://localhost:8017/api/twm/updateApply',data,{headers:{'token': getToken()}});
            }
          
          export function updateReject(data) {
              return request({
                url: '/api/wrp/storage/updateReject',
                method: 'post',
                data,
                responseType:'application/json'
              });
              // return axios.post('http://localhost:8017/api/twm/updateReject',data,{headers:{'token': getToken()}});
            }
          
          export function getApplyer(data) {
              return request({
                url: '/api/wrp/storage/getApplyer',
                method: 'post',
                data,
                responseType:'application/json'
              });
              // return axios.post('http://localhost:8017/api/twm/getApplyer',data,{headers:{'token': getToken()}});
            }
          
          export function getOutStorageDt(data) {
              return request({
                url: '/api/wrp/storage/getOutStorageDt',
                method: 'post',
                data,
                responseType:'application/json'
              });
              // return axios.post('http://localhost:8017/api/twm/getOutStorageDt',data,{headers:{'token': getToken()}});
            }
          
          export function getCheckHistory(data) {
              return request({
                url: '/api/wrp/storage/getCheckHistory',
                method: 'post',
                data,
                responseType:'application/json'
              });
              // return axios.post('http://localhost:8017/api/twm/getCheckHistory',data,{headers:{'token': getToken()}});
            }
          
          export function getSelectData(data) {
              return request({
                url: '/api/wrp/dianwang/getSelectData',
                method: 'post',
                data,
                responseType:'application/json'
              });
              // return axios.post('http://localhost:8017/api/twm/getSelectData',data,{headers:{'token': getToken()}});
            }
          