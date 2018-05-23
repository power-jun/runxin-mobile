var config = require('../../utils/config.js');
var app = getApp();

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
    this.requestData(options.id)
  },

  requestData: function (id) {
    let that = this;
    wx.showLoading();

    wx.request({
      url: config.prefix,
      method: 'POST',
      data: {
        serviceCode: 'BILL0002', //润信签发详情
        xdNo: id
      },
      success: function (res) {
        wx.hideLoading();

        if (res.data.respCode == '0000') {
          that.setData({
            detailsData: res.data
          })
        }
      }
    })
  }
})