import request from '@/utils/request'
import { CONSOLE_API_BASE } from '@/utils/constant'

export function editCompany(data) {
  return request({
    url: CONSOLE_API_BASE + '/companys',
    method: 'patch',
    data: data
  })
}
