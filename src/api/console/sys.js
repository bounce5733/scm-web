import request from '@/utils/request'
import { CONSOLE_API_BASE } from '@/utils/constant'

export function loginByAccount(account, password) {
  const data = {
    account: account,
    pwd: password
  }
  return request({
    url: CONSOLE_API_BASE + '/sys/login',
    method: 'post',
    data
  })
}

export function cacheAction(actions) {
  return request({
    url: CONSOLE_API_BASE + '/sys/action',
    method: 'post',
    data: actions
  })
}

export function register(info) {
  return request({
    url: CONSOLE_API_BASE + '/sys/register',
    method: 'post',
    data: info
  })
}

export function logout() {
  return request({
    url: CONSOLE_API_BASE + '/sys/logout',
    method: 'get'
  })
}
