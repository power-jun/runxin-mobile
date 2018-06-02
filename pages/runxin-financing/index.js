var util = require('../../utils/util.js');
var config = require('../../utils/config.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    financingData: {},
    factoringName: '',
    factoringRate: '',
    drawentno: '',
    interest: '',
    financeAmount: '',
    checkboxFlag: false,
    showPrompt: false, // 显示成功提示
    promptTitle: '融资成功',
    promptMessage: '将融资成功的消息转发给收信人，让他快点签收润信！',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;

    if (options.name) {
      this.data.factoringName = options.name;
      this.data.factoringRate = options.rate;
      this.data.drawentno = options.drawentno;
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
          factoringRate: that.data.factoringRate,
          drawentno: that.data.drawentno
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
      interest: val * this.data.factoringRate * this.data.financingData.financingDate,
      financeAmount: val
    });
  },

  checkboxchange: function(e) {
    this.setData({
      checkboxFlag: e.detail.checked
    });
  },

  submitPrompt: function() {
    wx.switchTab({
      url: '/pages/runxin-manage/index'
    });
  },

  cancelPrompt: function() {
    wx.switchTab({
      url: '/pages/runxin-manage/index'
    });
  },

  submitFinancing: function() {
    let that = this;
    let params = {};
    params.receEntNo = this.data.drawentno;
    params.xdNo = this.data.financingData.xdNo;
    params.financeAmount = this.data.financeAmount;
    params.expireDate = this.data.financingData.expireDate;
    params.serviceCode = 'BILL0014';
    if (!params.receEntNo) {
      wx.showToast({
        title: '请选择保理商'
      });
      return;
    }

    if (!params.financeAmount) {
      wx.showToast({
        title: '请输入申请金额'
      });
      return;
    }

    if (!this.data.checkboxFlag) {
      wx.showToast({
        title: '请阅读润信签发协议'
      });
      return;
    }

    wx.showLoading();
    wx.request({
      url: config.prefix,
      data: params,
      method: 'POST',
      success: function(res){
        wx.hideLoading();
        if (res.data.respCode === '0000') {
          that.setData({
            showPrompt: true
          });
        }
      }
    })
  }
})