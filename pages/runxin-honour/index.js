// pages/runxin-honour/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    honourAmt: 100,
    receiveAmt: 89,
    feesAmt: 10,
    honourAmt: 0, //兑付金额
    afterHonourData: {},
    overHonourData: {},
    checkboxFlag: false,
    honourConfirm: false,
    showDynamic: false, //显示动态密码框
    showPrompt: false, // 显示成功提示
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.getStorage({
      key: 'holdFinancingData',
      success: function (res) {
        that.xdNo = res.data.xdNo;
        res.data.status = 'green';
        
        that.setData({
          honourData: res.data
        });
      },
    });  
  },

  checkboxchange: function (e) {
    this.setData({
      checkboxFlag: e.detail.checked
    });
  },

  honourAmtInput: function(e){
    let val = e.detail.value;
    this.setData({
      honourAmt: val
    });
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  
  },

  submitHonour: function() {
    let that = this;
    if (!datas.detail.honourAmt) {
      wx.showToast({
        title: '请输入兑付金额',
        icon: 'none'
      });
      return;
    }


    this.submitParams = {};

    this.submitParams.receEntNo = this.data.drawentno;
    this.submitParams.xdNo = this.data.honourData.xdNo;
    this.submitParams.discountEntNo = this.data.financeAmount;
    this.submitParams.discountAmount = this.data.honourAmt;
    this.submitParams.expireDate = this.data.honourData.expireDate;
    this.submitParams.serviceCode = 'BILL0021';

    this.data.afterHonourData = JSON.stringify(this.data.honourData);
    this.data.afterHonourData = JSON.parse(this.data.afterHonourData);
    this.data.afterHonourData.uppercase = util.convertCurrency(this.data.honourAmt);
    this.data.afterHonourData.xdAmount = util.formatNumberRgx(this.data.honourAmt);
    this.data.afterHonourData.status = 'red';

    let overAmt = this.data.honourData.xdAmount - this.data.honourAmt;

    if(overAmt > 0) {
      this.data.overHonourData = JSON.stringify(this.data.honourData);
      this.data.overHonourData.uppercase = util.convertCurrency(overAmt);
      this.data.overHonourData.xdAmount = util.formatNumberRgx(overAmt);
      this.data.overHonourData.status = 'red';
    }

    this.setData({
      honourConfirm: true,
      afterHonourData: this.data.afterHonourData,
      overHonourData: this.data.overHonourData
    });

  },

  honourConfirm: function() {
    this.setData({
      honourConfirm: false,
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