import request from '@/utils/request';
// import axios from 'axios';
// import { getToken } from '@/utils/auth';

//获取基础数据  业务列表  组织列表
export function getBaseData() {
  return request({
    url: '/api/us/Scmp/GetBaseData',
    method: 'get'
  });
}

//Dictionary 字典数据
/*
Users_UserType 用户类型 类别
Users_UserStatus 用户状态
Users_RightsType 权限类别
Role_RoleType 角色类型
Role_Status 角色状态
*/
export function getDictionaryData(data) {
  // return axios.post('/api/cs/Dictionary/Get',data,{headers: { 'token': getToken()} });
  return request({
    url: '/api/cs/Dictionary/Get',
    method: 'post',
    data
  });
}
