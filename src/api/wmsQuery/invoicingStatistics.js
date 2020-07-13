import request from '@/utils/request';
// import axios from 'axios';
// import { getToken } from '@/utils/auth';

export function getInvoicingReport(data) {
  return request({
    url: '/api/wrp/storage/GetInvoicingReport',
    method: 'post',
    data
  });
  // return axios.post('http://localhost:8011/api/storage/GetInvoicingReport',data,{headers:{'token': getToken()}});
}
