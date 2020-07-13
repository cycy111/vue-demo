import request from '@/utils/request';
// import axios from 'axios';
// import { getToken } from '@/utils/auth';

// POST /api/OperatingReport/GetKpiInfo 获取Kpi基础信息
// POST /api/OperatingReport/AddKpiInfo 新增Kpi数据
// POST /api/OperatingReport/UpdateKpiInfo 更新Kpi数据
// POST /api/OperatingReport/DeleteKpiInfo 删除Kpi数据

// POST /api/OperatingReport/GetKpiInfo 获取Kpi基础信息
export function getKpiInfo(data) {
  return request({
    url: '/api/wrp/OperatingReport/GetKpiInfo',
    method: 'post',
    data
  });
  //return axios.post('http://192.168.2.125:8011/api/OperatingReport/GetKpiInfo',data,{headers:{'token': getToken()}});
}

// POST /api/OperatingReport/AddKpiInfo 新增Kpi数据
export function addKpiInfo(data) {
  return request({
    url: '/api/wrp/OperatingReport/AddKpiInfo',
    method: 'post',
    data
  });
  //return axios.post('http://192.168.2.125:8011/api/OperatingReport/AddKpiInfo',data,{headers:{'token': getToken()}});
}

// POST /api/OperatingReport/UpdateKpiInfo 更新Kpi数据
export function updateKpiInfo(data) {
  return request({
    url: '/api/wrp/OperatingReport/UpdateKpiInfo',
    method: 'post',
    data
  });
  //return axios.post('http://192.168.2.125:8011/api/OperatingReport/UpdateKpiInfo',data,{headers:{'token': getToken()}});
}

// POST /api/OperatingReport/DeleteKpiInfo 删除Kpi数据
export function deleteKpiInfo(data) {
  return request({
    url: '/api/wrp/OperatingReport/DeleteKpiInfo',
    method: 'post',
    data
  });
  //return axios.post('http://192.168.2.125:8011/api/OperatingReport/DeleteKpiInfo',data,{headers:{'token': getToken()}});
}
