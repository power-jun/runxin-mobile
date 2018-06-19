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
        res.data.xdAmount = util.formatNumberRgx(res.data.xdAmount);

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

  gotoHonour: function() {
    wx.navigateTo({
      url: '/pages/runxin-honour/index'
    });
  },

  gotoFinancing: function(data) {
    wx.navigateTo({
      url: '/pages/runxin-financing/index'
    });
  },

  gotoTransfer: function () {
    wx.setStorage({
      key: 'receiverData',
      data: []
    });

    wx.setStorage({
      key: 'transferCurrentIndex',
      data: ''
    });

    wx.setStorage({
      key: 'receiverAmountArry',
      data: []
    });

    wx.setStorage({
      key: 'receiverxdDescArry',
      data: []
    });

    wx.navigateTo({
      url: '/pages/runxin-transfer/index'
    });
  }
})