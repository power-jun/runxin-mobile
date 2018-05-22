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
        url: '../visa-harvest/index',
        text: '润信签收',
        tip: 99
      },
      {
        icon: config.cdnPrefix + 'img/icon-menu7.png',
        url: '../quota-list/index',
        text: '额度审批',
        tip: 0
      }
    ]
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
    this.requestCountData();
  },


  /* 获取待办事项的记录数据 */
  requestCountData: function () {
    var _this = this;
    // var companyID = app.getCompanyInfo().id;
    // if (!companyID) {
    //   wx.redirectTo({
    //     url: '../index/index'
    //   });
    //   return false;
    // }
    // wx.request({
    //   url: config.prefix,
    //   data: {
    //     serviceCode: 'BASE0007',
    //     entNo: companyID
    //   },
    //   success: function (res) {
    //     if (res.statusCode === 200 && res.data.respCode === '0000') {
    //       console.log(res.data)
    //     }
    //   }
    // });
  }

})