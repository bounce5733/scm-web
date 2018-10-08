import request from '@/utils/request'
import { SCM_API_BASE } from '@/utils/constant'

export function loadUnit() {
  return request({
    url: SCM_API_BASE + '/code/units',
    method: 'get'
  })
}

export function addUnit(unit) {
  return request({
    url: SCM_API_BASE + '/code/units',
    method: 'post',
    data: unit
  })
}

export function removeUnit(id) {
  return request({
    url: SCM_API_BASE + '/code/units/' + id,
    method: 'delete'
  })
}

export function moveTopUnit(id) {
  return request({
    url: SCM_API_BASE + '/code/units/moveTop/' + id,
    method: 'get'
  })
}

