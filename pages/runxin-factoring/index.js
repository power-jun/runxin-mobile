var config = require('../../utils/config.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
  
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.requestData();
  },

  requestData: function() {
    let that = this;
    wx.showLoading();
    wx.request({
      url: config.prefix,
      method: 'POST',
      data: {
        serviceCode: 'BASE0015',
       bizType: '3'
      },
      success: function(res) {
        wx.hideLoading();
        if (res.data.respCode === '0000') {
          that.setData({
            rateList: res.data.rateList
          })
        }
      }
    })
  },

  factoringSelect: function(e) {
    let datas = e.currentTarget.dataset;
    wx.navigateTo({
      url: '/pages/runxin-financing/index?name=' + datas.name + '&rate=' + datas.rate
    })
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