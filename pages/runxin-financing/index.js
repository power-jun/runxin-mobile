var util = require('../../utils/util.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    financingData: {},
    factoringName: '',
    factoringRate: '',
    interest: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;

    if (options.name) {
      this.data.factoringName = options.name;
      this.data.factoringRate = options.rate
    }
    wx.getStorage({
      key: 'holdFinancingData',
      success: function(res) {
        let nowDate = util.formatTime(new Date());
        res.data.nowDate = nowDate;
        res.data.financingDate = Math.floor((+new Date(res.data.expireDate) - +new Date(nowDate)) / (24 * 60 * 60 * 1000));

        that.setData({
          financingData: res.data,
          factoringName: that.data.factoringName,
          factoringRate: that.data.factoringRate
        });
      },
    })
  },

  selectFactoring: function() {
    wx.navigateTo({
      url: '/pages/runxin-factoring/index'
    });
  },

  calculateInterest: function(e) {
    let val = e.detail.value;
    if (!this.data.factoringRate) {
      setTimeout(() => {
        wx.showToast({
          title: '请选择保理商'
        });
      }, 500);
      return;
    }
    
    this.setData({
      interest: val * this.data.factoringRate * this.data.financingData.financingDate
    });
  },

  submitFinancing: function() {
    
  }
})