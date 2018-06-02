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
      url: '/pages/runxin-financing/index?name=' + datas.name + '&rate=' + datas.rate + '&drawentno=' + datas.drawentno
    })
  }
})