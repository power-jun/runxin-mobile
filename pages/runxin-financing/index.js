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
    showDynamic: false, //显示动态密码框
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
          title: '请选择保理商',
          icon: 'none'
        });
      }, 500);
      return;
    }

    let interest = (val * this.data.factoringRate * this.data.financingData.financingDate) / 360;
    
    this.setData({
      interest: interest.toFixed(2),
      financeAmount: val
    });
  },

  checkboxchange: function(e) {
    this.setData({
      checkboxFlag: e.detail.checked
    });
  },

  submitPrompt: function() {
    wx.showToast({
      title: 'erro',
    })
    this.setData({
      showPrompt: false
    });
    wx.switchTab({
      url: '/pages/runxin-manage/index'
    });
  },

  cancelPrompt: function() {
    try {
      wx.showToast({
        title: 'erro',
      })
    } catch(erro) {
      wx.showToast({
        title: erro,
      })
    }
   
    this.setData({
      showPrompt: false
    });
    wx.switchTab({
      url: '/pages/runxin-manage/index'
    });
  },

  passwordSubmit: function() { //动态码提交验证
    this.setData({
      showDynamic: false
    })
  },

  submitFinancing: function() {
    let that = this;
    let params = {};
    
    this.setData({
      showDynamic: true
    });
    return;

    params.receEntNo = this.data.drawentno;
    params.xdNo = this.data.financingData.xdNo;
    params.financeAmount = this.data.financeAmount;
    params.expireDate = this.data.financingData.expireDate;
    params.serviceCode = 'BILL0014';
    if (!params.receEntNo) {
      wx.showToast({
        title: '请选择保理商',
        icon: 'none'
      });
      return;
    }

    if (!params.financeAmount) {
      wx.showToast({
        title: '请输入申请金额',
        icon: 'none'
      });
      return;
    }

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