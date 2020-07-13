// import request from '@/utils/request';
import axios from 'axios';
import { getToken } from '@/utils/auth';

export function getRoadVehicleTrack(data) {
  return axios.post(
    'http://apizh.668tms.com:8004/api/ditu/GetRoadVehicleTrack/',
    data,
    { headers: { token: getToken() } }
  );
  // return request({
  // 	url: '/api/cs/Dictionary/Get',
  // 	method: 'post',
  // 	data
  // })
}
