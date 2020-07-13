// import request from '@/utils/request';
import axios from 'axios';
import { getToken } from '@/utils/auth';

export function getAlarmList(data) {
  return axios.post(
    'http://apizh.668tms.com:8004/api/ditu/getAlarmList/',
    data,
    { headers: { token: getToken() } }
  );
  // return request({
  // 	url: '/api/cs/Dictionary/Get',
  // 	method: 'post',
  // 	data
  // })
}

export function getOrderAlarmList(data) {
  return axios.post(
    'http://apizh.668tms.com:8004/api/ditu/getOrderAlarmList/',
    data,
    { headers: { token: getToken() } }
  );
  // return request({
  // 	url: '/api/cs/Dictionary/Get',
  // 	method: 'post',
  // 	data
  // })
}

export function saveOrderAlarmHandle(data) {
  return axios.post(
    'http://apizh.668tms.com:8004/api/ditu/saveOrderAlarmHandle/',
    data,
    { headers: { token: getToken() } }
  );
  // return request({
  // 	url: '/api/cs/Dictionary/Get',
  // 	method: 'post',
  // 	data
  // })
}
