
var config = require('../../utils/config.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    navigatorArray: [
      {
        icon: config.cdnPrefix + 'img/icon3.png',
        text: '签发复核',
        tip: 0
      },
      {
        icon: config.cdnPrefix + 'img/icon4.png',
        text: '融资复核',
        tip: 0
      },
      {
        icon: config.cdnPrefix + 'img/icon5.png',
        text: '转让复核',
        tip: 5
      },
      {
        icon: config.cdnPrefix + 'img/icon6.png',
        text: '利率复核',
        tip: 0
      },
      {
        icon: config.cdnPrefix + 'img/icon7.png',
        text: '动态兑付复核',
        tip: 0
      },
      {
        icon: config.cdnPrefix + 'img/icon8.png',
        text: '利率复核',
        tip: 99
      },
      {
        icon: config.cdnPrefix + 'img/icon9.png',
        text: '额度审批',
        tip: 0
      }
    ]
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

  }
})