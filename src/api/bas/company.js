import request from '@/utils/request'
import { CONSOLE_API_BASE } from '@/utils/constant'
import _ from 'lodash/lang'

export function getCompany() {
  return request({
    url: CONSOLE_API_BASE + '/bas/companys',
    method: 'get'
  })
}

export function editCompany(company) {
  const data = _.cloneDeep(company)
  data.industryCategory = company.industryCategory[0]
  data.area = company.area[company.area.length - 1]
  return request({
    url: CONSOLE_API_BASE + '/bas/companys',
    method: 'patch',
    data: data
  })
}
