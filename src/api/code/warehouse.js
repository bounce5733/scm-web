import request from '@/utils/request'
import { CONSOLE_API_BASE } from '@/utils/constant'

export function loadWarehouse() {
  return request({
    url: CONSOLE_API_BASE + '/code/warehouses',
    method: 'get'
  })
}

export function addWarehouse(warehouse) {
  return request({
    url: CONSOLE_API_BASE + '/code/warehouses',
    method: 'post',
    data: warehouse
  })
}

export function editWarehouse(warehouse) {
  return request({
    url: CONSOLE_API_BASE + '/code/warehouses',
    method: 'patch',
    data: warehouse
  })
}

export function removeWarehouse(id) {
  return request({
    url: CONSOLE_API_BASE + '/code/warehouses/' + id,
    method: 'delete'
  })
}

export function setDefaultWarehouse(id) {
  return request({
    url: CONSOLE_API_BASE + '/code/warehouses/setDefault/' + id,
    method: 'get'
  })
}

