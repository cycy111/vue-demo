import request from '@/utils/request';
// import axios from 'axios';
// import { getToken } from '@/utils/auth';

//模块
export function getAllModules(data) {
  // data.pagesize=10;
  // data.pageindex=1;
  // return axios.post('/api/us/Module/PostGet', data, { headers: { 'token': getToken() } });
  return request({
    url: '/api/us/Module/PostGet',
    method: 'post',
    data
  });
}

//新增模块
//---/api/us/Module/Create
export function addModule(data) {
  // data.pagesize=10;
  // data.pageindex=1;
  // return axios.post('/api/us/Module/Create',data, { headers: { 'token': getToken() } });
  return request({
    url: '/api/us/Module/Create',
    method: 'post',
    data
  });
}

//新增模块
//---/api/us/Module/Create
export function delModule(data) {
  // return axios.post('/api/us/Module/Delete',data, { headers: { 'token': getToken() } });
  return request({
    url: '/api/us/Module/Delete',
    method: 'post',
    data
  });
}
//新增模块
//----/api/us/Module/Update
// {
// 	"id": 0,
// 	"moduleNo": "string",
// 	"moduleName": "string",
// 	"path": "string",
// 	"iconName": "string",
// 	"controller": "string",
// 	"action": "string",
// 	"projectName": "string",
// 	"status": "string", //0新建 1启用 2停用
// 	"remark": "string",
// 	"token": "string",
// 	"pagesize": "string",
// 	"pageindex": "string"
//   }
export function updateModule(data) {
  // return axios.post('/api/us/Module/Update',data, { headers: { 'token': getToken() } });
  return request({
    url: '/api/us/Module/Update',
    method: 'post',
    data
  });
}
