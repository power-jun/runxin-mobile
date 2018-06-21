var config = require('../../utils/config.js');
var util = require('../../utils/util.js');
var app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    xdno:'',
    checkboxFlag: false,
    promptTitle: '复核成功',
    promptMessage: '将复核成功的消息转发给收信人，让他快点签收润信！',
    showPrompt: false
  },

  userInfo: null,

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.userInfo = app.getUserInfo();
    this.requestData(options.xdno);
  },

  requestData: function (id) {
    let that = this;
    wx.showLoading();

    wx.request({
      url: config.prefix,
      method: 'POST',
      data: {
        serviceCode: 'BILL0002', //润信签发详情
        xdNo: id,
        sessionToken: that.userInfo.sessionToken
      },
      success: function (res) {
        wx.hideLoading();

        if (res.data.respCode == '0000') {
          
          res.data.xdAmount = util.formatNumberRgx(res.data.xdAmount);
          if (res.data.terminalType == '1') {
            res.data.terminalName = '电脑端WEB版';
          } else if (res.data.terminalType == '2') {
            res.data.terminalName = '移动端小程序';
          }

          that.setData({
            detailsData: res.data,
            xdno: id
          })
        }
      }
    })
  },

  checkboxchange: function (e) {
    this.setData({
      checkboxFlag: e.detail.checked
    });
  },

  reviewTap: function(e) {
    let that = this;

    if (!this.data.checkboxFlag) {
      wx.showToast({
        title: '请阅读润信签发协议',
        icon: 'none'
      });
      return;
    }

    wx.showLoading();

    wx.request({
      url: config.prefix,
      method: 'POST',
      data: {
        serviceCode: 'BILL0004',
        checkStatus: '1',
        xdno: that.data.xdno,
        sessionToken: that.userInfo.sessionToken
      },
      success: function(res) {
        wx.hideLoading();

        if (res.data.respCode == '0000') {
          that.setData({
            showPrompt: true
          });
        }
      }
    })
  },

  submitPrompt: function () {
    wx.switchTab({
      url: '/pages/runxin-manage/index'
    });
  },

  cancelPrompt: function () {
    wx.switchTab({
      url: '/pages/runxin-manage/index'
    });
  },

  rejectTap: function(e){
    let that = this;
    if (!this.data.checkboxFlag) {
      wx.showToast({
        title: '请阅读润信签发协议',
        icon: 'none'
      });
      return;
    }

    wx.showLoading();

    wx.request({
      url: config.prefix,
      method: 'POST',
      data: {
        serviceCode: 'BILL0004',
        checkStatus: '2',
        xdno: that.data.xdno,
        sessionToken: userInfo.sessionToken
      },
      success: function (res) {
        wx.hideLoading();

        if (res.data.respCode == '0000') {
         wx.showToast({
           title: '驳回成功',
           icon: 'none'
         });

         setTimeout(() => {
           wx.switchTab({
             url: '/pages/runxin-manage/index'
           });
         }, 500);
        }
      }
    })
  }
})