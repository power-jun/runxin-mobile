var config = require('../../utils/config.js');
var validate = require('../../utils/validate.js');
var app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    phone: '', // 手机
    note: '', // 短信
    codeText: '获取验证码', // 获取短信文本
    timer: 0, // 计时器
    disable: true, // 禁用
    showValidateLayer: false, // 显示图片验证层
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },

  /* 验证手机号 */
  validatePhone: function (phone) {
    var status = validate.phone(phone);
    if (phone === '') {
      wx.showToast({
        title: '请输入手机号',
        icon: 'none',
        mask: true
      });
      return false;
    } else if (!status) {
      wx.showToast({
        title: '手机格式错误',
        icon: 'none',
        mask: true
      });
      return false;
    } else {
      return true;
    }
  },

  /* 短信验证码 */
  validateNote: function (note) {
    var status = validate.note(note);
    if (note === '') {
      wx.showToast({
        title: '请输入验证码',
        icon: 'none',
        mask: true
      });
      return false;
    } else if (!status) {
      wx.showToast({
        title: '验证码格式错误',
        icon: 'none',
        mask: true
      });
      return false;
    } else {
      return true;
    }
  },

  /* setTimeout 对象 */
  setTimeoutPhoneObject: null,
  setTimeoutNoteObject: null,

  /* 输入手机号 */
  inputPhone: function (e) {
    var _this = this;
    clearTimeout(_this.setTimeoutPhoneObject);
    _this.setTimeoutPhoneObject = setTimeout(function () {
      var phone = e.detail.value.trim();
      _this.setData({
        disable: !(phone && _this.data.note),
        phone: phone
      });
    }, 200);
  },

  /* 手机框失去焦点 */
  blurPhone: function (e) {
    var phone = e.detail.value.trim();
    this.validatePhone(phone);
  },

  /* 清空手机号 */
  clearPhone: function () {
    this.setData({
      disable: true,
      phone: ''
    });
  },

  /* 输入短信码 */
  inputNote: function (e) {
    var _this = this;
    clearTimeout(_this.setTimeoutNoteObject);
    _this.setTimeoutNoteObject = setTimeout(function () {
      var note = e.detail.value.trim();
      _this.setData({
        disable: !(_this.data.phone && note),
        note: note
      });
    }, 200);
  },

  /* 验证框失去焦点 */
  blurNote: function (e) {
    var note = e.detail.value.trim();
    this.validateNote(note);
  },

  /* 清空短信码 */
  clearNote: function () {
    this.setData({
      disable: true,
      note: ''
    });
  },

  /* 获取验证码 */
  getCode: function () {
    var _this = this;
    if (_this.data.timer) { // 倒计时不为0
      return false;
    }
    var status = _this.validatePhone(this.data.phone);
    if (!status) {
      return false;
    }
    _this.setData({
      showValidateLayer: true
    });
  },

  /* 倒数计时 */
  countdown: function () {
    var _this = this;
    var timer = 60;
    var intervalObject = setInterval(function () {
      if (timer >= 0) {
        _this.setData({
          timer: timer,
          codeText: '重新发送' + (timer ? '(' + timer + ')' : '')
        });
        timer--;
      } else {
        clearInterval(intervalObject);
      }
    }, 1000);
  },

  /* 验证图片（确认） */
  validateOk: function (e) {
    var _this = this;
    wx.request({
      url: config.prefix,
      data: {
        serviceCode: 'BASE0002',
        mobilePhone: _this.data.phone,
        imgKey: '',
        imgCode: e.detail.code
      },
      success: function (res) {
        _this.countdown();
      }
    });
  },

  /* 提交 */
  submit: function () {
    var _this = this;
    if (_this.data.disable) {
      return false;
    }
    var phoneStatus = _this.validatePhone(_this.data.phone);
    var noteStatus = _this.validateNote(_this.data.note);
    if (!phoneStatus || !noteStatus) {
      return false;
    }
    wx.request({
      url: config.prefix,
      data: {
        serviceCode: 'BASE0001',
        mobilePhone: _this.data.phone,
        smsCode: _this.data.note,
      },
      success: function (res) {
        if (res.statusCode === 200 && res.data.respCode === '0000') {
          var status = app.setUserInfo({
            phone: _this.data.phone
          });
          if (status) {
            wx.redirectTo({
              url: '../index/index',
            });
          }
        } else {
          wx.showToast({
            title: '手机或密码错误',
            icon: 'none',
            mask: true
          });
        }
      },
      fail: function () {
        wx.showToast({
          title: '手机或密码错误',
          icon: 'none',
          mask: true
        });
      }
    });
  }

});
