var config = require('../../utils/config.js');
var app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    bizType: ''
  },

  userInfo: null,

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.bizType = options.bizType;
    this.userInfo = app.getUserInfo();
    if(this.bizType == 4) {
      wx.setNavigationBarTitle({
        title: '兑付企业'
      });
    }

    this.setData({
      bizType: this.bizType
    });

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
        bizType: that.bizType,
        sessionToken: that.userInfo.sessionToken
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
    if (this.bizType == 4) {
      wx.navigateTo({
        url: '/pages/runxin-honour/index?name=' + datas.name + '&rate=' + datas.rate + '&drawentno=' + datas.drawentno
      })
    } else {
      wx.navigateTo({
        url: '/pages/runxin-financing/index?name=' + datas.name + '&rate=' + datas.rate + '&drawentno=' + datas.drawentno
      })
    }
    
  }
})