/**
 *手机号验证
 * @param str
 * @returns {boolean}
 */
export function isPhone(str) {
  const reg = /^1[3|4|5|6|7|8|9][0-9]\d{8}$/
  return reg.test(str)
}
