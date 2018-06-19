var config = require('../../utils/config.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    receiverList: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    wx.getStorage({
      key: 'receEntListTransfer',
      success: function(res) {
        that.setData({
          receiverList: res.data
        });
      },
    })
  },

  receiverSelect: function (e) {
    let datas = e.currentTarget.dataset;
    wx.navigateTo({
      url: '/pages/runxin-transfer/index?index=' + datas.index
    })
  },

  onUnload: function () {
    wx.switchTab({
      url: '/pages/runxin-manage/index'
    });
  }
})