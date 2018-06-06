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

  passwordSubmit: function(datas) { //动态码提交验证
    let that = this;
    if (!datas.detail.inputV) {
      wx.showToast({
        title: '请输入动态码',
        icon: 'none'
      });
      return;
    }

    wx.showLoading();
    wx.request({
      url: config.prefix,
      data: {
        xdNo: that.submitParams.xdNo,
        bizType: '3',
        dyCode: datas.detail.randomMathVal,
        dyPasswd: datas.detail.inputV,
        serviceCode: 'BILL0016'
      },
      method: 'POST',
      success: function(res) {
        if (res.data.respCode === '0000') {
          wx.request({
            url: config.prefix,
            data: that.submitParams,
            method: 'POST',
            success: function (res) {
              wx.hideLoading();
              if (res.data.respCode === '0000') {
                that.setData({
                  showPrompt: true,
                  showDynamic: false
                });
              }
            }
          });
        } else {
          wx.showToast({
            title: res.data.respDesc,
            icon: 'none'
          });

          wx.hideLoading();
        }
      }
    });
  },

  submitFinancing: function() {
    let that = this;
    this.submitParams = {};
    
    this.submitParams.receEntNo = this.data.drawentno;
    this.submitParams.xdNo = this.data.financingData.xdNo;
    this.submitParams.financeAmount = this.data.financeAmount;
    this.submitParams.expireDate = this.data.financingData.expireDate;
    this.submitParams.serviceCode = 'BILL0014';
    if (!this.submitParams.receEntNo) {
      wx.showToast({
        title: '请选择保理商',
        icon: 'none'
      });
      return;
    }

    if (!this.submitParams.financeAmount) {
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

    this.setData({
      showDynamic: true
    });
  }
})