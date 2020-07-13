/**
 * Created by caihua on 2018.8.14
 */

export function validateUsername(rule, value, callback) {
  //   const valid_map = ['admin', 'editor']
  //   return valid_map.indexOf(str.trim()) >= 0
  const reg = /^[_a-zA-Z0-9]{6,30}$/;
  if (!reg.test(value)) {
    return callback(new Error('格式:6-30位字母、数字、_'));
  }
  return callback();
}

export function validatePassword(rule, value, callback) {
  if (value.length < 6) {
    callback(new Error('密码不能少于6位数'));
  } else {
    callback();
  }
}

/* 合法uri*/
export function validateURL(textval) {
  const urlregex = /^(https?|ftp):\/\/([a-zA-Z0-9.-]+(:[a-zA-Z0-9.&%$-]+)*@)*((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9][0-9]?)(\.(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])){3}|([a-zA-Z0-9-]+\.)*[a-zA-Z0-9-]+\.(com|edu|gov|int|mil|net|org|biz|arpa|info|name|pro|aero|coop|museum|[a-zA-Z]{2}))(:[0-9]+)*(\/($|[a-zA-Z0-9.,?'\\+&%$#=~_-]+))*$/;
  return urlregex.test(textval);
}

/* 小写字母*/
export function validateLowerCase(str) {
  const reg = /^[a-z]+$/;
  return reg.test(str);
}

/* 大写字母*/
export function validateUpperCase(str) {
  const reg = /^[A-Z]+$/;
  return reg.test(str);
}

/* 大小写字母*/
export function validatAlphabets(str) {
  const reg = /^[A-Za-z]+$/;
  return reg.test(str);
}

/**
 * validate email
 * @param email
 * @returns {boolean}
 */
export function validateEmail(email) {
  // eslint-disable-next-line no-useless-escape
  const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(email);
}

/*登录用户名校验 */
export function validateLoginName(rule, value, callback) {
  const reg = /^[_a-zA-Z0-9]{3,30}$/;
  value = value && value.trim();
  if (!reg.test(value)) {
    return callback(new Error('格式:3-30位字母、数字、_'));
  }
  return callback();
}

/*登录手机号码校验 */
export function validateMoblePhone(rule, value, callback) {
  const reg = /^(13[0-9]|14[579]|15[0-3,5-9]|16[6]|17[0135678]|18[0-9]|19[89])\d{8}$/;
  if (!value) {
    return callback();
  }
  if (!reg.test(value)) {
    return callback(new Error('不是正确的手机号码'));
  }
  return callback();
}

//仅匹配中文，英文大小写 数字 位数自定义

export function validateChinese(rule, value, callback) {
  const reg = /^[\u4e00-\u9fa5a-zA-Z0-9]{1,10}$/;
  if (!value) {
    return callback();
  }
  if (!reg.test(value)) {
    return callback(new Error('格式：汉字、英文大小写、数字、5-10位'));
  }
  return callback();
}

export function validateNumber(rule, value, callback) {
  const reg = /^(-?\d+)(\.\d+)?$/;
  if (!value) {
    return callback();
  }
  if (!reg.test(value)) {
    return callback(new Error('请输入合法的数字'));
  }
  return callback();
}
