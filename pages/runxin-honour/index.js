var util = require('../../utils/util.js');
var config = require('../../utils/config.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    receiveAmt: 89,
    feesAmt: '',
    interestRate: '',
    honourDate: '',
    honourDay: '',
    actualAmount: '',
    honourName: '',
    honourAmt: '', //兑付金额
    afterHonourData: {},
    overHonourData: {},
    checkboxFlag: false,
    honourConfirmFlag: false,
    showDynamic: false, //显示动态密码框
    showPrompt: false, // 显示成功提示
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    let newDate = new Date();
    
    wx.getStorage({
      key: 'holdFinancingData',
      success: function (res) {
        that.xdNo = res.data.xdNo;
        res.data.status = 'green';
        res.data.caseAmount = res.data.uppercase;
        
        let honourDayTime = new Date(res.data.expireDate) - +newDate;
        let honourDay = Math.round(honourDayTime / (1000 * 3600 * 24));

        that.setData({
          honourData: res.data,
          honourDate: util.formatTime(newDate),
          honourDay: honourDay
        });
      }
    });

    if (options.rate) {
      this.data.honourName = options.name;
      this.data.interestRate = options.rate;
    }
  },

  checkboxchange: function (e) {
    this.setData({
      checkboxFlag: e.detail.checked
    });
  },

  selectFactoring: function () {
    wx.navigateTo({
      url: '/pages/runxin-factoring/index?bizType=4'
    });
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  onUnload: function () {
    wx.switchTab({
      url: '/pages/holding-list-details/index'
    });
  },

  submitHonour: function () {
    let that = this;
    if (!this.data.honourAmt) {
      wx.showToast({
        title: '请输入兑付金额',
        icon: 'none'
      });
      return;
    }

    if (!this.data.checkboxFlag) {
      wx.showToast({
        title: '润信提前兑付协议',
        icon: 'none'
      });
      return;
    }    

    this.submitParams = {};

    this.submitParams.receEntNo = this.data.honourData.receEntNo;
    this.submitParams.xdNo = this.data.honourData.xdNo;
    this.submitParams.discountEntNo = '';
    this.submitParams.discountAmount = this.data.honourAmt;
    this.submitParams.expireDate = this.data.honourData.expireDate;
    this.submitParams.serviceCode = 'BILL0021';

    this.data.afterHonourData = JSON.stringify(this.data.honourData);
    this.data.afterHonourData = JSON.parse(this.data.afterHonourData);
    this.data.afterHonourData.uppercase = util.convertCurrency(this.data.honourAmt);
    this.data.afterHonourData.xdAmount = util.formatNumberRgx(this.data.honourAmt);
    this.data.afterHonourData.status = 'red';

    let overAmt = Number(this.data.honourData.xdAmount.replace(',', '')) - this.data.honourAmt;

    if (overAmt < 0) {
      wx.showToast({
        title: '兑付金额不能大于总金额',
        icon: 'none'
      });
      return;
    }

    if (overAmt > 0) {
      this.data.overHonourData = JSON.stringify(this.data.honourData);
      this.data.overHonourData = JSON.parse(this.data.overHonourData);
      this.data.overHonourData.uppercase = util.convertCurrency(overAmt);
      this.data.overHonourData.xdAmount = util.formatNumberRgx(overAmt);
      this.data.overHonourData.status = 'green';
    }

    this.setData({
      honourConfirmFlag: true,
      afterHonourData: this.data.afterHonourData,
      overHonourData: this.data.overHonourData
    });

  },

  calculateInterest: function(e) {
    if(!this.data.interestRate) {
      wx.showToast({
        title: '请选择兑付企业',
        icon: 'none'
      });

      this.setData({
        honourAmt: ''
      });
      return;
    }

    let val = e.detail.value;
    let feesAmt = Math.round((val * this.data.interestRate * this.data.honourDay)/360);
    let actualAmount = val - feesAmt

    this.setData({
      honourAmt: val,
      feesAmt: feesAmt,
      actualAmount: actualAmount
    });
  },

  honourConfirm: function () {
    this.setData({
      honourConfirmFlag: false,
      showDynamic: true
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
        bizType: '4',
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
})