/**
 * Created by jiachenpan on 16/11/18.
 */

/* 合法uri*/
export function validateURL(textval) {
  const urlregex = /^(https?|ftp):\/\/([a-zA-Z0-9.-]+(:[a-zA-Z0-9.&%$-]+)*@)*((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9][0-9]?)(\.(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])){3}|([a-zA-Z0-9-]+\.)*[a-zA-Z0-9-]+\.(com|edu|gov|int|mil|net|org|biz|arpa|info|name|pro|aero|coop|museum|[a-zA-Z]{2}))(:[0-9]+)*(\/($|[a-zA-Z0-9.,?'\\+&%$#=~_-]+))*$/
  return urlregex.test(textval)
}

/* 小写字母*/
export function validateLowerCase(str) {
  const reg = /^[a-z]+$/
  return reg.test(str)
}

/* 大写字母*/
export function validateUpperCase(str) {
  const reg = /^[A-Z]+$/
  return reg.test(str)
}

/* 大小写字母*/
export function validateAlphabets(str) {
  const reg = /^[A-Za-z]+$/
  return reg.test(str)
}

/**
 * validate email
 * @param email
 * @returns {boolean}
 */
export function validateEmail(email) {
  const re = /^(([^<>()\[\]\\.,:\s@"]+(\.[^<>()\[\]\\.,:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  return re.test(email)
}

export function validatePostcode(postcode) {
  const reg = /^[0-9]{6}$/
  return reg.test(postcode)
}

export function validateMobile(mobile) {
  const reg = /^1[3|4|5|7|8][0-9]{9}$/
  return reg.test(mobile)
}

export function validateQQ(qq) {
  const reg = /^\s*[.0-9]{5,11}\s*$/
  return reg.test(qq)
}

export function validateTel(tel) {
  const reg = /^(\(\d{3,4}\)|\d{3,4}-|\s)?\d{7,14}$/
  return reg.test(tel)
}

export function validatePassword(pwd) {
  // 判断是否为空或空字符串
  if (pwd === undefined || pwd.trim().length === 0) {
    return 0 // 密码不能为空或空字符串
  }
  const value = pwd.trim()
  const valueLength = value.length
  let codeLength = 0
  // 判断长度是否达标
  if (valueLength < 6 || valueLength > 20) {
    return 1 // 密码长度必须6-20位
  }

  // 判断是否存在其他字符
  if (/\s/.test(value) || /[^a-zA-Z0-9]/.test(value)) {
    return 2 // 密码只能包含大小写英文字符与数字
  }

  // 判断是否存在两种类型
  if (/[0-9]/.test(value)) {
    codeLength++
  }
  if (/[a-z]/.test(value)) {
    codeLength++
  }
  if (/[A-Z]/.test(value)) {
    codeLength++
  }

  if (codeLength < 2) {
    return 3 // 密码至少数字或大小写字母两种类型
  }

  // 密码复合要求，判断强度
  if (valueLength < 10) {
    return 4
  } else if (valueLength >= 10 && valueLength < 15) {
    return 5
  } else {
    return 6
  }
}

