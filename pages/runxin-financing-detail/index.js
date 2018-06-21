var config = require('../../utils/config.js');
var util = require('../../utils/util.js');
var app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    xdno: '',
    beforeFinancingData: {},
    afterFinancingData: {}
  },

  userInfo: null,

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.userInfo = app.getUserInfo();
    this.requestData(options.xdno)
  },

  requestData: function (id) {
    let that = this;
    wx.showLoading();

    wx.request({
      url: config.prefix,
      method: 'POST',
      data: {
        serviceCode: 'BILL0013', //润信融资详情
        xdNo: id,
        sessionToken: that.userInfo.sessionToken
      },
      success: function (res) {
        if (res.data.respCode == '0000') {
          
          res.data.uppercase = util.convertCurrency(res.data.xdAmount);
          res.data.xdAmount = util.formatNumberRgx(res.data.xdAmount);
          res.data.status = 'green';
          res.data.financeAmount = util.formatNumberRgx(res.data.financeAmount);
          res.data.actualAmount = util.formatNumberRgx(res.data.actualAmount);
          res.data.financeProfit = util.formatNumberRgx(res.data.financeProfit);
          
          that.setData({
            beforeFinancingData: res.data,
            xdno: id
          });

          wx.request({
            url: config.prefix,
            method: 'POST',
            data: {
              serviceCode: 'BILL0013', //润信融资详情
              xdNo: res.data.mXdNo,
              sessionToken: that.userInfo.sessionToken
            },
            success: function(data) {
              wx.hideLoading();
              if (res.data.respCode == '0000') {
                data.data.uppercase = util.convertCurrency(data.data.xdAmount);
                data.data.xdAmount = util.formatNumberRgx(data.data.xdAmount);
                data.data.status = 'red';

                that.setData({
                  afterFinancingData: data.data
                });
              }
            }
          })
        }
      }
    })
  }
})