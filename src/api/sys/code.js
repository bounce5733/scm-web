import request from '@/utils/request'
import { SCM_API_BASE } from '@/utils/constant'

export function loadSysCode() {
  return request({
    url: SCM_API_BASE + '/sys/codes/sysCode',
    method: 'get'
  })
}

export function loadSysPathCode() {
  return request({
    url: SCM_API_BASE + '/sys/codes/sysPathCode',
    method: 'get'
  })
}

export function loadAppCode() {
  return request({
    url: SCM_API_BASE + '/sys/codes/appCode',
    method: 'get'
  })
}

export function loadAppCascadeCode() {
  return request({
    url: SCM_API_BASE + '/sys/codes/appCascadeCode',
    method: 'get'
  })
}

export function loadAppCascadePathCode() {
  return request({
    url: SCM_API_BASE + '/sys/codes/appCascadePathCode',
    method: 'get'
  })
}

export function loadCode() {
  return request({
    url: SCM_API_BASE + '/sys/codes',
    method: 'get'
  })
}

export function addCode(data) {
  return request({
    url: SCM_API_BASE + '/sys/codes',
    method: 'post',
    data: data
  })
}

export function removeCode(code) {
  return request({
    url: SCM_API_BASE + '/sys/codes/' + code,
    method: 'delete'
  })
}

export function addItem(data) {
  return request({
    url: SCM_API_BASE + '/sys/codes/item',
    method: 'post',
    data: data
  })
}

export function editItem(data) {
  return request({
    url: SCM_API_BASE + '/sys/codes/item',
    method: 'patch',
    data: data
  })
}

export function removeItem(id) {
  return request({
    url: SCM_API_BASE + '/sys/codes/item/' + id,
    method: 'delete'
  })
}
