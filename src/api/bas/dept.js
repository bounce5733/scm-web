import request from '@/utils/request'
import { SCM_API_BASE } from '@/utils/constant'

export function loadDept() {
  return request({
    url: SCM_API_BASE + '/bas/depts',
    method: 'get'
  })
}

export function addDept(dept) {
  return request({
    url: SCM_API_BASE + '/bas/depts',
    method: 'post',
    data: dept
  })
}

export function editDept(dept) {
  return request({
    url: SCM_API_BASE + '/bas/depts',
    method: 'patch',
    data: dept
  })
}

export function removeDept(id) {
  return request({
    url: SCM_API_BASE + '/bas/depts/' + id,
    method: 'delete'
  })
}

export function moveTopDept(id, pid) {
  return request({
    url: SCM_API_BASE + '/bas/depts/moveTop/' + id,
    method: 'get',
    params: { pid: pid }
  })
}
