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
  },

  /**
   * 当小程序初始化完成时，会触发 onLaunch（全局只触发一次）
   */
  onLaunch: function () {

  },

  /**
   * 当小程序启动，或从后台进入前台显示，会触发 onShow
   */
  onShow: function (options) {

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
