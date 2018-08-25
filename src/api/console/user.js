import request from '@/utils/request'
import { CONSOLE_API_BASE } from '@/utils/constant'

export function getUserInfo() {
  return request({
    url: CONSOLE_API_BASE + '/users/userinfo',
    method: 'get'
  })
}

export function loadUser() {
  return request({
    url: CONSOLE_API_BASE + '/users',
    method: 'get'
  })
}

export function addUser(data) {
  return request({
    url: CONSOLE_API_BASE + '/users',
    method: 'post',
    data: data
  })
}

export function editUser(data) {
  return request({
    url: CONSOLE_API_BASE + '/users',
    method: 'patch',
    data: data
  })
}

export function removeUser(id) {
  return request({
    url: CONSOLE_API_BASE + '/users/' + id,
    method: 'delete'
  })
}

export function matchUserWithAccountOrName(params) {
  return request({
    url: CONSOLE_API_BASE + '/users/matchWithAccountOrName',
    method: 'get',
    params: params
  })
}

export function roleUsers(roleid) {
  return request({
    url: CONSOLE_API_BASE + '/users/role/' + roleid,
    method: 'get'
  })
}
