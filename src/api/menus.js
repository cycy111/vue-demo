import request from '@/utils/request';
// import axios from 'axios';
// import { getToken } from '@/utils/auth';

// GET /api/us/Menu/Get 获取菜单信息GET
// POST /api/us/Menu/PostGet 获取菜单信息POST
// POST /api/us/Menu/Create 新增菜单
// POST /api/us/Menu/Update 更新菜单
// POST /api/us/Menu/Delete 删除菜单

export function getMenuInfo(data) {
  // data.pageSize=1000;
  // data.pageIndex=1;
  // return axios.post('/api/us/Menu/PostGet',data,{headers:{'token': getToken()}});
  return request({
    url: '/api/us/Menu/PostGet',
    method: 'post',
    data
  });
}

export function createMenu(data) {
  // return axios.post('/api/us/Menu/Create',data,{headers:{'token': getToken()}});
  return request({
    url: '/api/us/Menu/Create',
    method: 'post',
    data
  });
}

export function menuLevelGet(data) {
  // return axios.get('/api/us/Menu/Get',{params:data,headers:{'token': getToken()}});
  return request({
    url: '/api/us/Menu/Get',
    method: 'get',
    params: data
  });
}

export function deleteMenu(data) {
  // return axios.post('/api/us/Menu/Delete',data,{headers:{'token': getToken()}});
  return request({
    url: '/api/us/Menu/Delete',
    method: 'post',
    data
  });
}

/*
{
  "moduleNo": "string",
  "moduleName": "string",
  "parentNo": "string",
  "levels": 0,
  "isdirecory": 0,
  "orderId": 0,
  "status": 0,
  "token": "string",
  "pagesize": "string",
  "pageindex": "string"
}
*/
export function updateMenu(data) {
  // return axios.post('/api/us/Menu/Update',data,{headers:{'token': getToken()}});
  return request({
    url: '/api/us/Menu/Update',
    method: 'post',
    data
  });
}

export function upOrder(data) {
  // return axios.post('/api/us/Menu/UpOrder',data,{headers:{'token': getToken()}});
  return request({
    url: '/api/us/Menu/UpOrder',
    method: 'post',
    data
  });
}
