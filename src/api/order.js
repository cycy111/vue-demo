import request from '@/utils/request';
// import axios from 'axios';

//订单轨迹table 订单
export function orderList(data) {
  return request({
    url: '/api/tms/ReportOr/orderList',
    method: 'post',
    data
  });
  //return axios.post('http://192.168.2.128:8004/api/ReportOr/orderList', data)
}

//订单轨迹table 订单轨迹
export function orderMapList(data) {
  return request({
    url: '/api/tms/ReportOr/orderMap',
    method: 'post',
    data
  });
  //return axios.post('http://192.168.2.128:8004/api/ReportOr/orderMap', data)
}

//订单轨迹table 订单详情
export function orderDetall(data) {
  return request({
    url: '/api/tms/ReportOr/orderDetall',
    method: 'post',
    data
  });
  //return axios.post('http://192.168.2.128:8004/api/ReportOr/orderDetall', data)
}

/*------------------------------------------------------*/

//订单回单table
export function getReturnOrders(data) {
  return request({
    url: '/api/tms/order/getReturnOrders',
    method: 'post',
    data
  });
  //return axios.post('http://192.168.2.128:8004/api/getReturnOrders', data)
}

//订单回单附件
export function getOrderFile(data) {
  return request({
    url: '/api/tms/order/getOrderFile',
    method: 'post',
    data
  });
}
//订单回单 获取产品信息，子表格
/*
 *   post {"Id":"string","token":"string"}
 */
export function getOrderProduct(data) {
  return request({
    url: '/api/tms/order/getOrderProduct',
    method: 'post',
    data
  });
}
