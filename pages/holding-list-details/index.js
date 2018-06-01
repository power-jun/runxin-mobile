var config = require('../../utils/config.js');
var util = require('../../utils/util.js');
var app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    detailsData: {},
    checkboxFlag: false,
    yesCheckboxFlag: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.requestData(options.id)
  },

  requestData: function(id) {
    let that = this;
    wx.showLoading();

    wx.request({
      url: config.prefix,
      method: 'POST',
      data: {
        serviceCode: 'BILL0018',
        xdNo: id
      },
      success: function(res) {
        wx.hideLoading();
        
        if (res.data.splitFlag == 1) {
          that.data.yesCheckboxFlag  = true;
        } else {
          that.data.checkboxFlag = true;
        }

        res.data.uppercase = util.convertCurrency(res.data.xdAmount);

        if (res.data.terminalType === 1) {
          res.data.terminalName = '电脑端WEB版';
        } else if (res.data.terminalType === 2) {
          res.data.terminalName = ' 移动端小程序';
        }

        wx.setStorage({
          key: 'holdFinancingData',
          data: res.data
        })

        if (res.data.respCode == '0000') {
          that.setData({
            detailsData: res.data,
            yesCheckboxFlag: that.data.yesCheckboxFlag,
            checkboxFlag: that.data.checkboxFlag
          })
        }
      }
    })
  },

  tabClick: function (e) {
    let id = e.currentTarget.dataset.id;
    let flag = false;
    if (id == 1) {
      flag = true;
    }

    this.setData({
      activeCategoryId: id,
      isShowList: flag
    })
  },

  gotoFinancing: function(data) {
    wx.navigateTo({
      url: '/pages/runxin-financing/index'
    });
  },

  gotoTransfer: function () {
    // wx.navigateTo({
    //   url: '/pages/runxin-financing/index'
    // });
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