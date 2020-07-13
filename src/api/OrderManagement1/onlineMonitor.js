// import request from '@/utils/request';
import axios from 'axios';
import { getToken } from '@/utils/auth';

export function getPathData(data) {
  return axios.post(
    'http://apizh.668tms.com:8004/api/ditu/getPathData/',
    data,
    { headers: { token: getToken() } }
  );
  // return request({
  // 	url: '/api/cs/Dictionary/Get',
  // 	method: 'post',
  // 	data
  // })
}

export function getVehicleData(data) {
  return axios.post(
    'http://apizh.668tms.com:8004/api/ditu/getVehicleData/',
    data,
    { headers: { token: getToken() } }
  ); //120.77.205.81:8019
  // return request({
  // 	url: '/api/cs/Dictionary/Get',
  // 	method: 'post',
  // 	data
  // })
}
