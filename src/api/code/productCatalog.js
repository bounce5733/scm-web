import request from '@/utils/request'
import { SCM_API_BASE } from '@/utils/constant'

export function loadProductCatalog() {
  return request({
    url: SCM_API_BASE + '/code/productCatalogs',
    method: 'get'
  })
}

export function addProductCatalog(productCatalog) {
  return request({
    url: SCM_API_BASE + '/code/productCatalogs',
    method: 'post',
    data: productCatalog
  })
}

export function editProductCatalog(productCatalog) {
  return request({
    url: SCM_API_BASE + '/code/productCatalogs',
    method: 'patch',
    data: productCatalog
  })
}

export function removeProductCatalog(id) {
  return request({
    url: SCM_API_BASE + '/code/productCatalogs/' + id,
    method: 'delete'
  })
}

export function moveTopProductCatalog(id, pid) {
  return request({
    url: SCM_API_BASE + '/code/productCatalogs/moveTop/' + id,
    method: 'get',
    params: { pid: pid }
  })
}
