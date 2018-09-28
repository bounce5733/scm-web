import request from '@/utils/request'
import { SCM_API_BASE } from '@/utils/constant'

export function loginByAccount(account, password) {
  const data = {
    account: account,
    pwd: password
  }
  return request({
    url: SCM_API_BASE + '/sys/login',
    method: 'post',
    data
  })
}

export function cacheAction(actions) {
  return request({
    url: SCM_API_BASE + '/sys/login/action',
    method: 'post',
    data: actions
  })
}

export function register(info) {
  return request({
    url: SCM_API_BASE + '/sys/login/register',
    method: 'post',
    data: info
  })
}

export function logout() {
  return request({
    url: SCM_API_BASE + '/sys/login/logout',
    method: 'get'
  })
}
