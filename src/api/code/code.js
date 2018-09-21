import request from '@/utils/request'
import { CONSOLE_API_BASE } from '@/utils/constant'

export function loadCode() {
  return request({
    url: CONSOLE_API_BASE + '/code/codes',
    method: 'get'
  })
}

export function cacheMap() {
  return request({
    url: CONSOLE_API_BASE + '/code/codes/cacheMap',
    method: 'get'
  })
}

export function cachePathMap() {
  return request({
    url: CONSOLE_API_BASE + '/code/codes/cachePathMap',
    method: 'get'
  })
}

export function addCode(data) {
  return request({
    url: CONSOLE_API_BASE + '/code/codes',
    method: 'post',
    data: data
  })
}

export function removeCode(code) {
  return request({
    url: CONSOLE_API_BASE + '/code/codes/' + code,
    method: 'delete'
  })
}

export function addItem(data) {
  return request({
    url: CONSOLE_API_BASE + '/code/codes/item',
    method: 'post',
    data: data
  })
}

export function editItem(data) {
  return request({
    url: CONSOLE_API_BASE + '/code/codes/item',
    method: 'patch',
    data: data
  })
}

export function removeItem(id) {
  return request({
    url: CONSOLE_API_BASE + '/code/codes/item/' + id,
    method: 'delete'
  })
}
