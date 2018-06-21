var config = require('../../utils/config.js');
var util = require('../../utils/util.js');
var app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    xdStatus: 1,
    clientName: '',
    dateType: 'date',
    dateV: '',
    monthV: '',
    marchV: '',
    startDate: '',
    authEntList: [], // 授信机构
    entno: '',//授信机构ID
  },

  userInfo: null,

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.userInfo = app.getUserInfo();
    this.requestData();

    this.setData({
      dateV: this.setDate('date'),
      monthV: this.setDate('month'),
      marchV: this.setDate('march')
    })
  },

  setDate: function (type) {
    let newDate = new Date();

    this.endOpenDate = util.formatTime(newDate); // 交易的开始时间

    let month = newDate.getMonth();
    let year = newDate.getFullYear();
    let day = newDate.getDate();

    if (type === 'date') {
      let dateV = newDate.setDate(day - 10);
      return util.formatTime(newDate);
    }

    if (type === 'month') {
      let dateV = newDate.setMonth(month - 1); //最近一个月
      return util.formatTime(newDate);
    }

    if (type === 'march') {
      let dateV = newDate.setMonth(month - 3); //最近十天
      return util.formatTime(newDate);
    }
  },

  requestData: function () {
    let that = this;
    wx.showLoading();

    wx.request({
      url: config.prefix,
      method: 'POST',
      data: {
        serviceCode: 'BASE0005', // 授信机构
        sessionToken: that.userInfo.sessionToken
      },
      success: function (res) {
        wx.hideLoading();
        if (res.data.respCode == '0000') {
          that.setData({
            authEntList: res.data.authEntList,
            entno: res.data.authEntList[0].entNo
          });
        }
      }
    });
  },

  entNoSelect: function (e) {
    this.setData({
      entno: e.currentTarget.dataset.entno
    });
  },

  dateSelect: function (e) {
    this.setData({
      dateType: e.currentTarget.dataset.type,
      startDate: e.currentTarget.dataset.datev
    });
  },

  transactionClick: function (e) {
    let id = e.currentTarget.dataset.id;
    this.setData({
      xdStatus: id
    });
  },

  confirm: function () {
    let params = JSON.stringify({
      entno: this.data.entno,
      startDate: this.data.startDate,
      endOpenDate: this.endOpenDate,
      xdStatus: this.data.xdStatus
    });

    wx.setStorage({
      key: 'advanceParams',
      data: params
    })

    wx.switchTab({
      url: '/pages/runxin-manage/index'
    });
  },

  reset: function () {
    this.setData({
      transactionId: '',
      clientName: '',
      dateType: '',
      entno: '',
      startDate: '',
      xdStatus:''
    });

    wx.removeStorage({
      key: 'advanceParams'
    });
  }
});