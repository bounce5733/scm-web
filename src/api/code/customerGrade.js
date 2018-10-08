import request from '@/utils/request'
import { SCM_API_BASE } from '@/utils/constant'

export function loadCustomerGrade() {
  return request({
    url: SCM_API_BASE + '/code/customergrades',
    method: 'get'
  })
}

export function addCustomerGrade(customerGrade) {
  return request({
    url: SCM_API_BASE + '/code/customergrades',
    method: 'post',
    data: customerGrade
  })
}

export function editCustomerGrade(customerGrade) {
  return request({
    url: SCM_API_BASE + '/code/customergrades',
    method: 'patch',
    data: customerGrade
  })
}

export function removeCustomerGrade(id) {
  return request({
    url: SCM_API_BASE + '/code/customergrades/' + id,
    method: 'delete'
  })
}

export function moveTopCustomerGrade(id) {
  return request({
    url: SCM_API_BASE + '/code/customergrades/moveTop/' + id,
    method: 'get'
  })
}

