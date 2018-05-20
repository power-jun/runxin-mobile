var config = require('../../utils/config.js');
var app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    navigatorArray: []
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

  /* 初始化 */
  init: function () {
    this.isLogin();
    this.requestCompanyData();
  },

  /* 是否已登录 */
  isLogin: function () {
    var userInfo = app.getUserInfo();
    if (!userInfo.phone) {
      wx.redirectTo({
        url: '../login/index',
      });
    }
  },

  /* 获取公司数据 */
  requestCompanyData: function () {
    var _this = this;
    wx.request({
      url: config.prefix,
      data: {
        serviceCode: 'BASE0004'
      },
      success: function (res) {
        if (res.statusCode === 200 && res.data.respCode === '0000') {
          res.data.entList.map(function (v, i) {
            _this.data.navigatorArray.push({
              id: v.entNo,
              name: v.entName,
              icon: config.cdnPrefix + 'img/icon' + (i + 1) + '.png'
            });
          });
          _this.setData(_this.data);
        }
      }
    });
  },

  /* 选择公司 */
  selectCompany: function (e) {
    var index = e.currentTarget.dataset.index;
    app.setCompanyInfo({
      id: this.data.navigatorArray[index].id,
      name: this.data.navigatorArray[index].name
    });
    wx.switchTab({
      url: '../upcoming-task/index'
    });
  }

})