import request from '@/utils/request';
// import axios from 'axios';
// import { getToken } from '@/utils/auth';

// POST /api/Account/Create/loginName 创建用户。
// POST /api/Account/UpdateUser 更新用户的信息。
// POST /api/Account/DeleteUser 删除用户信息。
// POST /api/Account/UpdatePwd 修改密码。
// GET /api/Account/GetUserInfo/{loginNameOrUserId} 根据用户名或用户ID获取用户信息
// GET /api/Account/GetList 获取所有账号信息。

//获取用户列表
export function getAllUsers(data) {
  // return axios.get('/api/us/Account/GetList', { headers: { 'token': getToken() } });
  return request({
    url: '/api/us/Account/GetList',
    method: 'post',
    data
  });
}

//根据用户名或用户ID获取用户信息
export function getUserInfo(data) {
  // return axios.get('/api/us/Account/GetUserInfo/' + data.userId, { headers: { 'token': getToken() } });
  return request({
    url: '/api/us/Account/GetUserInfo/' + data.userId,
    method: 'get'
  });
}

//删除用户
export function deleteUser(data) {
  // return axios.post('/api/us/Account/DeleteUser', data, { headers: { 'token': getToken() } });
  return request({
    url: '/api/us/Account/DeleteUser',
    method: 'post',
    data
  });
}

//修改密码
//---/api/Account/UpdatePwd
export function modifyPassword(data) {
  // return axios.post('/api/Account/UpdatePwd', data, { headers: { 'token': getToken() } });
  return request({
    url: '/api/us/Account/UpdatePwd',
    method: 'post',
    data
  });
}

// POST /api/Account/UpdateUser 更新用户的信息。
export function modifyUser(data) {
  // return axios.post('/api/Account/UpdateUser', data, { headers: { 'token': getToken() } });
  return request({
    url: '/api/us/Account/UpdateUser',
    method: 'post',
    data
  });
}

//POST /api/Account/Create/loginName 创建用户。
/*{
	"loginName": "string",
	"pwd": "string",
	"nickName": "string",
	"realName": "string",
	"mobile": "string",
	"isMobileVerified": 0,
	"email": "string",
	"isEmailVerified": 0,
	"portrait": "string",
	"loginDate": "string",
	"lastLoginDate": "string",
	"loginCount": 0,
	"createDate": "string",
	"updateDate": "string",
	"userType": "string",
	"validDate": "string",
	"deptName": "string",
	"position": "string",
	"userStatus": "string",
	"rightsType": "string",
	"businessList": [
	  {
		"businessId": 0,
		"businessCode": "string",
		"businessName": "string"
	  }
	],
	"roleList": [
	  {
		"roleId": 0,
		"roleName": "string"
	  }
	]
  }*/

export function createUser(data) {
  // return axios.post('/api/us/Account/Create/loginName', data, { headers: { 'token': getToken() } });
  return request({
    url: '/api/us/Account/Create/loginName',
    method: 'post',
    data
  });
}
