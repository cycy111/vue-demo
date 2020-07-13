import request from '@/utils/request';
// import axios from 'axios';
// import { getToken } from '@/utils/auth';

// /api/OperatingReport/GetOperatingReportList 获取运营报表数据列表
// FindType："depart,kpi,amount,order,sAmount,plan,cbill,person,reportdes"分别对应获取部门，kpi指标，出入库金额，单据，库存金额，预约，盘点，人员，报表描述数据
// AmountType：库存金额 1.排名前10库存金额 2.超过6个月排名前10呆滞金额；3.超过2年排名前10呆滞金额
// CountType：单据类型 1.入库 2.出库 3.其他

// /api/OperatingReport/GetOperatingReportList 获取运营报表数据列表
export function getOperatingReportList(data) {
  return request({
    url: '/api/wrp/OperatingReport/GetOperatingReportList',
    method: 'post',
    data
  });
  // return axios.post('http://192.168.2.125:8011/api/OperatingReport/GetOperatingReportList', data, { headers: { 'token': getToken() } });
}

//获取月报生成项 //{"FindType":"reportItem","DeptCode":"shanxi"} 获取历史版本
export function geReportItemInfo(data) {
  return request({
    url: '/api/wrp/OperatingReport/geReportItemInfo',
    method: 'post',
    data
  });
  // return axios.post('http://192.168.2.125:8011/api/OperatingReport/geReportItemInfo', data, { headers: { 'token': getToken() } });
}

//http://192.168.2.125:8011/api/OperatingReport/AddReportItem 新增月报生成项目
export function addReportItem(data) {
  return request({
    url: '/api/wrp/OperatingReport/AddReportItem',
    method: 'post',
    data
  });
  // return axios.post('http://192.168.2.125:8011/api/OperatingReport/AddReportItem', data, { headers: { 'token': getToken() } });
}

//http://192.168.2.125:8011/api/OperatingReport/AddWhCodeAreaInfo 新增仓库区域面积
export function addWhCodeAreaInfo(data) {
  return request({
    url: '/api/wrp/OperatingReport/AddWhCodeAreaInfo',
    method: 'post',
    data
  });
  // return axios.post('http://192.168.2.125:8011/api/OperatingReport/AddWhCodeAreaInfo', data, { headers: { 'token': getToken() } });
}

// /api/OperatingReport/UpdatePersionList 更新人员信息
export function updatePersionList(data) {
  return request({
    url: '/api/wrp/OperatingReport/UpdatePersionList',
    method: 'post',
    data
  });
  // return axios.post('http://192.168.2.125:8011/api/OperatingReport/UpdatePersionList', data, { headers: { 'token': getToken() } });
}

// /api/OperatingReport/UpdatePlanDesc 更新预约状况描述
export function UpdatePlanDesc(data) {
  return request({
    url: '/api/wrp/OperatingReport/UpdatePlanDesc',
    method: 'post',
    data
  });
  // return axios.post('http://192.168.2.125:8011/api/OperatingReport/UpdatePlanDesc', data, { headers: { 'token': getToken() } });
}

// /api/OperatingReport/UpdateCheckDesc 更新盘点状况描述
export function UpdateCheckDesc(data) {
  return request({
    url: '/api/wrp/OperatingReport/UpdateCheckDesc',
    method: 'post',
    data
  });
  // return axios.post('http://192.168.2.125:8011/api/OperatingReport/UpdateCheckDesc', data, { headers: { 'token': getToken() } });
}

///api/OperatingReport/AddReportDes 新增报表说明  保存页面所有备注
export function addReportDes(data) {
  return request({
    url: '/api/wrp/OperatingReport/AddReportDes',
    method: 'post',
    data
  });
  // return axios.post('http://192.168.2.125:8011/api/OperatingReport/AddReportDes', data, { headers: { 'token': getToken() } });
}

// /api/OperatingReport/Upload pdf月报上传文件
export function uploadPdf(data) {
  return request({
    url: '/api/tf/file/UploadBase64',
    method: 'post',
    data
  });
  // return axios.post('http://192.168.2.125:8009/api/file/UploadBase64', data, { headers: { 'token': getToken() } });
}

///api/OperatingReport/AddMonReportInfo 新增运营月报表
export function addMonReportInfo(data) {
  return request({
    url: '/api/wrp/OperatingReport/AddMonReportInfo',
    method: 'post',
    data
  });
  // return axios.post('http://192.168.2.125:8011/api/OperatingReport/AddMonReportInfo', data, { headers: { 'token': getToken() } });
}

export function SaveWhCodeArea(data) {
  return request({
    url: '/api/wrp/OperatingReport/SaveWhCodeArea',
    method: 'post',
    data
  });
  // return axios.post('http://192.168.2.125:8011/api/OperatingReport/SaveWhCodeArea', data, { headers: { 'token': getToken() } });
}

///api/OperatingReport/UpdateReportDes 修改保存报表说明
export function UpdateReportDes(data) {
  return request({
    url: '/api/wrp/OperatingReport/UpdateReportDes',
    method: 'post',
    data
  });
  // return axios.post('http://192.168.2.125:8011/api/OperatingReport/UpdateReportDes', data, { headers: { 'token': getToken() } });
}

export function SaveMonthReportFile(data) {
  return request({
    url: '/api/wrp/OperatingReport/SaveMonthReportFile',
    method: 'post',
    data
  });
  // return axios.post('http://192.168.2.125:8011/api/OperatingReport/SaveMonthReportFile', data, { headers: { 'token': getToken() } });
}

export function getReportFile(reportId) {
  return request({
    url: `/api/wrp/OperatingReport/GetReportFile/${reportId}`,
    method: 'get'
  });
}
