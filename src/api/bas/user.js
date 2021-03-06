import request from '@/utils/request'
import { SCM_API_BASE } from '@/utils/constant'

export function loadAllUser() {
  return request({
    url: SCM_API_BASE + '/bas/users/load',
    method: 'get'
  })
}

export function queryUserByPage(params) {
  return request({
    url: SCM_API_BASE + '/bas/users',
    method: 'get',
    params: {
      orderField: params.orderField === null ? '' : params.orderField,
      param: params.param,
      status: params.status,
      deptid: params.deptid,
      order: params.order,
      pageNum: params.pageNum,
      pageSize: params.pageSize
    }
  })
}

export function getUserInfo() {
  return request({
    url: SCM_API_BASE + '/bas/users/userinfo',
    method: 'get'
  })
}

export function addUser(user) {
  return request({
    url: SCM_API_BASE + '/bas/users',
    method: 'post',
    data: user
  })
}

export function editUser(user) {
  return request({
    url: SCM_API_BASE + '/bas/users',
    method: 'patch',
    data: user
  })
}

export function enableUser(user) {
  return request({
    url: SCM_API_BASE + '/bas/users/enable',
    method: 'patch',
    data: user
  })
}

export function removeUser(id) {
  return request({
    url: SCM_API_BASE + '/bas/users/' + id,
    method: 'delete'
  })
}

export function matchUserWithAccountOrName(params) {
  return request({
    url: SCM_API_BASE + '/bas/users/matchWithAccountOrName',
    method: 'get',
    params: params
  })
}

export function roleUsers(roleid) {
  return request({
    url: SCM_API_BASE + '/bas/users/role/' + roleid,
    method: 'get'
  })
}

export function resetPwd(user) {
  return request({
    url: SCM_API_BASE + '/bas/users/resetPwd',
    method: 'patch',
    data: user
  })
}
