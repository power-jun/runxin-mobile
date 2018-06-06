var config = require('./utils/config.js');
App({

  /* 公司信息 */
  companyInfo: {
    id: null,
    name: null
  },

  /* 公司信息（获取） */
  getCompanyInfo: function () {
    return this.companyInfo;
  },

  /* 公司信息（设置） */
  setCompanyInfo: function (data) {
    this.companyInfo = data;
  },

  /* 用户信息（获取） */
  getUserInfo: function () {
    try {
      return wx.getStorageSync('userInfo');
    } catch (e) {
      return false;
    }
  },

  /* 用户信息（设置） */
  setUserInfo: function (data) {
    try {
      wx.setStorageSync('userInfo', data);
      return true;
    } catch (e) {
      return false;
    }
  },

  globalData: {
    version: "1.0.0",
    entInfo: {}, //企业信息
    accInfo: {}, // 账号信息
    userInfo: {} // 用户信息
  },

  /**
   * 当小程序初始化完成时，会触发 onLaunch（全局只触发一次）
   */
  onLaunch: function (options) {
    
  },

  /**
   * 当小程序启动，或从后台进入前台显示，会触发 onShow
   */
  onShow: function (options) {
    var userInfo = this.getUserInfo();
    var that = this;
return;
    //获取个人信息
    // wx.request({
    //   url: config.prefix,
    //   data: {
    //     serviceCode: 'BASE0003'
    //   },
    //   method: 'POST',
    //   success: function (res) {
    //     if (res.data.respCode === '0000'){
    //       that.globalData.entInfo = res.data.entInfo;
    //     }
    //   }
    // });

    if (!userInfo.phone && options.path !== 'pages/login/index') {
      wx.showModal({
        title: '友情提醒',
        content: '登录超时，请重新登录！',
        showCancel: false,
        success: function (res) {
          if (res.confirm) {
            wx.navigateTo({
              url: '/pages/login/index',
            });
          }
        }
      });
    } else if (!this.companyInfo.id && options.path !== 'pages/index/index') {
      wx.showModal({
        title: '友情提醒',
        content: '你没有选择任何公司，请返回首页！',
        showCancel: false,
        success: function (res) {
          if (res.confirm) {
            wx.navigateTo({
              url: '/pages/index/index',
            });
          }
        }
      });
    }  
  },

  /**
   * 当小程序从前台进入后台，会触发 onHide
   */
  onHide: function () {

  },

  /**
   * 当小程序发生脚本错误，或者 api 调用失败时，会触发 onError 并带上错误信息
   */
  onError: function (msg) {

  }

})
