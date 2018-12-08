import request from '@/utils/request'
import { SCM_API_BASE } from '@/utils/constant'

export function addCustomer(company, personal, account, financial) {
  return request({
    url: SCM_API_BASE + '/cus/customers',
    method: 'post',
    data: {
      company: company,
      personal: personal,
      account: account,
      financial: financial
    }
  })
}
