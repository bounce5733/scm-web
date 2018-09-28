import request from '@/utils/request'
import { SCM_API_BASE } from '@/utils/constant'

export function queryOptlogByPage(optType, isme, startTime, endTime, params) {
  return request({
    url: SCM_API_BASE + '/sys/optlogs',
    method: 'get',
    params: {
      optType: optType,
      isme: isme,
      startTime: startTime,
      endTime: endTime,
      orderField: params.orderField,
      order: params.order,
      pageNum: params.pageNum,
      pageSize: params.pageSize
    }
  })
}
