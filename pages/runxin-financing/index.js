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
    actualAmount: '', //实际到账金额
    afterFinancingData: {}, // 融资后
    overFinancingData: {}, // 剩余
    checkboxFlag: false,
    financingConfirm: false,
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
      success: function (res) {
        let nowDate = util.formatTime(new Date());
        res.data.nowDate = nowDate;
        res.data.financingDate = Math.floor((+new Date(res.data.expireDate) - +new Date(nowDate)) / (24 * 60 * 60 * 1000));

        res.data.status = 'green';

        that.setData({
          financingData: res.data,
          factoringName: that.data.factoringName,
          factoringRate: that.data.factoringRate,
          drawentno: that.data.drawentno
        });
      },
    })
  },

  onUnload: function () {
    wx.switchTab({
      url: '/pages/runxin-manage/index'
    });
  },

  selectFactoring: function () {
    wx.navigateTo({
      url: '/pages/runxin-factoring/index'
    });
  },

  calculateInterest: function (e) {
    let val = e.detail.value;
    if (!this.data.factoringRate) {
      wx.showToast({
        title: '请选择保理商',
        icon: 'none'
      });
      return;
    }

    this.xdAmount = Number(this.data.financingData.xdAmount.replace(',', ''));
    let interest = (val * this.data.factoringRate * this.data.financingData.financingDate) / 360;
    let actualAmount = this.xdAmount - interest - val;

    if (actualAmount < 0) {
      wx.showToast({
        title: '申请金额不能大于融资金额',
        icon: 'none'
      });
      return;
    }

    this.setData({
      interest: interest.toFixed(2),
      financeAmount: val,
      actualAmount: actualAmount.toFixed(2),
      applicationAmount: val
    });
  },

  checkboxchange: function (e) {
    this.setData({
      checkboxFlag: e.detail.checked
    });
  },

  submitPrompt: function () {
    this.setData({
      showPrompt: false
    });
    wx.switchTab({
      url: '/pages/runxin-manage/index'
    });
  },

  cancelPrompt: function () {
    this.setData({
      showPrompt: false
    });
    wx.switchTab({
      url: '/pages/runxin-manage/index'
    });
  },

  passwordSubmit: function (datas) { //动态码提交验证
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
      success: function (res) {
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

  submitFinancing: function () {
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

    this.data.afterFinancingData = JSON.stringify(this.data.financingData);
    this.data.afterFinancingData = JSON.parse(this.data.afterFinancingData);
    this.data.afterFinancingData.receEntName = this.data.factoringName;
    this.data.afterFinancingData.uppercase = util.convertCurrency(this.data.applicationAmount);
    this.data.afterFinancingData.xdAmount = util.formatNumberRgx(this.data.applicationAmount);
    this.data.afterFinancingData.status = 'red';
    
    if (this.data.applicationAmount < this.xdAmount) {
      this.data.overFinancingData = JSON.stringify(this.data.financingData);
      this.data.overFinancingData = JSON.parse(this.data.overFinancingData);

      this.data.overFinancingData.xdAmount = util.formatNumberRgx(this.xdAmount - this.data.applicationAmount);
      this.data.overFinancingData.status = 'green';
    }

    this.setData({
      financingConfirm: true,
      afterFinancingData: this.data.afterFinancingData,
      overFinancingData: this.data.overFinancingData
    });
  },

  financingConfirm: function () {
    this.setData({
      financingConfirm: false,
      showDynamic: true
    });
  }
})