var config = require('../../utils/config.js');
var app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    navigatorArray: [
      {
        icon: config.cdnPrefix + 'img/icon-menu1.png',
        url: '../visa-list/index',
        text: '签发复核',
        tip: 0
      },
      {
        icon: config.cdnPrefix + 'img/icon-menu2.png',
        url: '../financing-list/index',
        text: '融资复核',
        tip: 0
      },
      {
        icon: config.cdnPrefix + 'img/icon-menu3.png',
        url: '../assignment-list/index',
        text: '转让复核',
        tip: 0
      },
      {
        icon: config.cdnPrefix + 'img/icon-menu4.png',
        url: '../interest-rate-list/index',
        text: '利率复核',
        tip: 0
      },
      {
        icon: config.cdnPrefix + 'img/icon-menu5.png',
        url: '../dynamic-cash-list/index',
        text: '动态兑付复核',
        tip: 0
      },
      {
        icon: config.cdnPrefix + 'img/icon-menu6.png',
        url: '../sign-list/index',
        text: '润信签收',
        tip: 0
      },
      {
        icon: config.cdnPrefix + 'img/icon-menu7.png',
        url: '../quota-list/index',
        text: '额度审批',
        tip: 0
      }
    ],
    showConfirm: false, // 显示提示层
    confirmTitle: '登录超时，请重新登录！', // 提示文本
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.init();
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

  /* 用户信息 */
  userInfo: null,

  /* 公司信息 */
  companyInfo: null,

  /* 初始化 */
  init: function () {
    this.userInfo = app.getUserInfo();
    this.companyInfo = app.getCompanyInfo();
    var loginStatus = this.isLogin();
    var companyStatus = this.isCompany();
    if (loginStatus && companyStatus) {
      this.requestCountData();
    }
  },

  /* 是否已登录 */
  isLogin: function () {
    if (this.userInfo.phone) {
      return true;
    } else {
      this.setData({
        showConfirm: true
      });
      return false;
    }
  },

  /* 是否选好了公司 */
  isCompany: function () {
    if (this.companyInfo.id) {
      return true;
    } else {
      wx.redirectTo({
        url: '../index/index'
      });
      return false;
    }
  },

  /* 返回登录页面 */
  gotoLoginPage: function () {
    wx.redirectTo({
      url: '../login/index',
    });
  },

  /* 获取待办事项的记录数据 */
  requestCountData: function () {
    var _this = this;
    wx.request({
      url: config.prefix,
      method: 'POST',
      data: {
        serviceCode: 'BASE0007',
        sessionToken: _this.userInfo.sessionToken,
        entNo: _this.companyInfo.id,
      },
      success: function (res) {
        if (res.statusCode === 200 && res.data.respCode === '0000') {
          _this.data.navigatorArray[0].tip = res.data.signReviewCount;
          _this.data.navigatorArray[1].tip = res.data.financeReviewCount;
          _this.data.navigatorArray[2].tip = res.data.transferReviewCount;
          _this.data.navigatorArray[3].tip = res.data.rateReviewCount;
          _this.data.navigatorArray[4].tip = res.data.discountReviewCount;
          _this.data.navigatorArray[5].tip = res.data.signConfirmCount;
          _this.data.navigatorArray[6].tip = res.data.limitReviewCount;
          _this.setData(_this.data);
        }
      },
      fail: function () {
        wx.showToast({
          title: '网络异常，请检查网络是否连接',
          icon: 'none',
          mask: true
        });
      }
    });
  }

})