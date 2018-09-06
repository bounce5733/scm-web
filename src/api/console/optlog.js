import request from '@/utils/request'
import { CONSOLE_API_BASE } from '@/utils/constant'

export function queryByPage(optType, isme, startTime, endTime, params) {
  return request({
    url: CONSOLE_API_BASE + '/optlogs',
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
