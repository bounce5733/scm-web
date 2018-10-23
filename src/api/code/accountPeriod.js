import request from '@/utils/request'
import { SCM_API_BASE } from '@/utils/constant'

export function loadAccountPeriod() {
  return request({
    url: SCM_API_BASE + '/code/accountPeriods',
    method: 'get'
  })
}

export function addAccountPeriod(accountPeriod) {
  return request({
    url: SCM_API_BASE + '/code/accountPeriods',
    method: 'post',
    data: accountPeriod
  })
}

export function editAccountPeriod(accountPeriod) {
  return request({
    url: SCM_API_BASE + '/code/accountPeriods',
    method: 'patch',
    data: accountPeriod
  })
}

export function removeAccountPeriod(id) {
  return request({
    url: SCM_API_BASE + '/code/accountPeriods/' + id,
    method: 'delete'
  })
}

export function moveTopAccountPeriod(id) {
  return request({
    url: SCM_API_BASE + '/code/accountPeriods/moveTop/' + id,
    method: 'get'
  })
}

