import request from '@/utils/request'
import { CONSOLE_API_BASE } from '@/utils/constant'

export function loadRole() {
  return request({
    url: CONSOLE_API_BASE + '/roles',
    method: 'get'
  })
}

export function addRole(data) {
  return request({
    url: CONSOLE_API_BASE + '/roles',
    method: 'post',
    data: data
  })
}

export function editRole(data) {
  return request({
    url: CONSOLE_API_BASE + '/roles',
    method: 'patch',
    data: data
  })
}

export function removeRole(id) {
  return request({
    url: CONSOLE_API_BASE + '/roles/' + id,
    method: 'delete'
  })
}

export function assignUsers(roleid, userids) {
  return request({
    url: CONSOLE_API_BASE + '/roles/' + roleid + '/assign/users',
    method: 'post',
    data: userids
  })
}

export function assignMenus(roleid, actionmap) {
  return request({
    url: CONSOLE_API_BASE + '/roles/' + roleid + '/assign/menus',
    method: 'post',
    data: actionmap
  })
}

export function roleMenus(roleid) {
  return request({
    url: CONSOLE_API_BASE + '/roles/menus/' + roleid,
    method: 'get'
  })
}

export function userMenus(userid) {
  return request({
    url: CONSOLE_API_BASE + '/roles/usermenus/' + userid,
    method: 'get'
  })
}
