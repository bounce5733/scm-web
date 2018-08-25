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

export function logout() {
  return request({
    url: CONSOLE_API_BASE + '/sys/logout',
    method: 'get'
  })
}
