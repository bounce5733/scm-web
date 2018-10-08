import request from '@/utils/request'
import { SCM_API_BASE } from '@/utils/constant'

export function loadProductCatalog() {
  return request({
    url: SCM_API_BASE + '/code/productcatalogs',
    method: 'get'
  })
}

export function addProductCatalog(productCatalog) {
  return request({
    url: SCM_API_BASE + '/code/productcatalogs',
    method: 'post',
    data: productCatalog
  })
}

export function editProductCatalog(productCatalog) {
  return request({
    url: SCM_API_BASE + '/code/productcatalogs',
    method: 'patch',
    data: productCatalog
  })
}

export function removeProductCatalog(id) {
  return request({
    url: SCM_API_BASE + '/code/productcatalogs/' + id,
    method: 'delete'
  })
}

export function moveTopProductCatalog(id, pid) {
  return request({
    url: SCM_API_BASE + '/code/productcatalogs/moveTop/' + id,
    method: 'get',
    params: { pid: pid }
  })
}
