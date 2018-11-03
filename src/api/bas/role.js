import request from '@/utils/request'
import { SCM_API_BASE } from '@/utils/constant'

export function loadRole() {
  return request({
    url: SCM_API_BASE + '/bas/roles',
    method: 'get'
  })
}

export function addRole(data) {
  return request({
    url: SCM_API_BASE + '/bas/roles',
    method: 'post',
    data: data
  })
}

export function editRole(data) {
  return request({
    url: SCM_API_BASE + '/bas/roles',
    method: 'patch',
    data: data
  })
}

export function removeRole(id) {
  return request({
    url: SCM_API_BASE + '/bas/roles/' + id,
    method: 'delete'
  })
}

export function assignUsers(roleid, userids) {
  return request({
    url: SCM_API_BASE + '/bas/roles/' + roleid + '/assign/users',
    method: 'post',
    data: userids
  })
}

export function assignMenus(roleid, actionmap) {
  return request({
    url: SCM_API_BASE + '/bas/roles/' + roleid + '/assign/menus',
    method: 'post',
    data: actionmap
  })
}

export function roleMenus(roleid) {
  return request({
    url: SCM_API_BASE + '/bas/roles/menus/' + roleid,
    method: 'get'
  })
}

export function userMenus(userid) {
  return request({
    url: SCM_API_BASE + '/bas/roles/userMenus/' + userid,
    method: 'get'
  })
}

export function userRoles(userid) {
  return request({
    url: SCM_API_BASE + '/bas/roles/userRoles/' + userid,
    method: 'get'
  })
}
