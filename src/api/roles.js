import request from '@/utils/request';
// import axios from 'axios';
// import { getToken } from '@/utils/auth';

//Role
// POST /api/us/Role/Create 创建角色
// GET /api/us/Role/GetRoleInfo/{roleId}
// POST /api/us/Role/Delete/{roleId} 删除角色
// POST /api/us/Role/Update 更新角色
// GET /api/us/Role/GetList 获取角色列表

//获取角色列表
export function getRoleList(data) {
  // return axios.get('/api/us/Role/GetList',{params:data,headers:{'token': getToken()}});
  return request({
    url: '/api/us/Role/GetList',
    method: 'post',
    data
  });
}

export function createRole(data) {
  // return axios.post('/api/us/Role/Create',data,{headers:{'token': getToken()}});
  return request({
    url: '/api/us/Role/Create',
    method: 'post',
    data
  });
}

export function deleteRole(data) {
  // return axios.post('/api/us/Role/Delete',data,{headers:{'token': getToken()}});
  return request({
    url: '/api/us/Role/Delete',
    method: 'post',
    data
  });
}

export function updateRole(data) {
  // return axios.post('/api/us/Role/Update',data,{headers:{'token': getToken()}});
  return request({
    url: '/api/us/Role/Update',
    method: 'post',
    data
  });
}

export function getRoleInfo(data) {
  // return axios.get('/api/us/Role/GetRoleInfo/'+data,{headers:{'token': getToken()}});
  return request({
    url: '/api/us/Role/GetRoleInfo/' + data,
    method: 'get'
  });
}
