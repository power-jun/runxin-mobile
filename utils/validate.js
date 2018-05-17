module.exports = {

  /* 检测手机号码 */
  phone: function (phone) {
    var reg = /^1\d{10}$/;
    if (!reg.test(phone)) {
      return false;
    } else {
      return true;
    }
  },

  /* 检测短信验证码 */
  note: function (note) {
    var reg = /^\d{6}$/;
    if (!reg.test(note)) {
      return false;
    } else {
      return true;
    }
  }

}