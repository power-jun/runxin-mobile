var config = require('../../utils/config.js');
var util = require('../../utils/util.js');
var app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    options: null, // 页面参数
    showConfirm: false, // 显示提示层
    confirmTitle: '登录超时，请重新登录！', // 提示文本
    showPrompt: false, // 显示成功提示
    promptTitle: '复核成功',
    promptMessage: '将复核成功的消息转发给收信人，让他快点签收润信！',
    pageData: null, // 页面数据
    protocolChecked: false, // 是否同意协议
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (options && options.id) {
      this.data.options = options;
    } else {
      wx.redirectTo({
        url: '../visa-list/index',
      });
    }
    this.init();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },

  /* 用户信息 */
  userInfo: null,

  /* 公司信息 */
  companyInfo: null,

  /* 初始化 */
  init: function () {
    this.userInfo = app.getUserInfo();
    this.companyInfo = app.getCompanyInfo();
    var loginStatus = this.isLogin();
    var companyStatus = this.isCompany();
    if (loginStatus && companyStatus) {
      this.requestPageData();
    }
  },

  /* 是否已登录 */
  isLogin: function () {
    if (this.userInfo.phone) {
      return true;
    } else {
      this.setData({
        showConfirm: true
      });
      return false;
    }
  },

  /* 是否选好了公司 */
  isCompany: function () {
    if (this.companyInfo.id) {
      return true;
    } else {
      wx.redirectTo({
        url: '../index/index'
      });
      return false;
    }
  },

  /* 返回登录页面 */
  gotoLoginPage: function () {
    wx.redirectTo({
      url: '../login/index',
    });
  },

  /* 获取页面数据 */
  requestPageData: function () {
    var _this = this;
    wx.request({
      url: config.prefix,
      method: 'POST',
      data: {
        serviceCode: 'BILL0002',
        sessionToken: _this.userInfo.sessionToken,
        xdNo: _this.options.id,
      },
      success: function (res) {
        if (res.statusCode === 200 && res.data.respCode === '0000') {
          _this.data.pageData = _this.dealPageData(res.data);
        }
      },
      fail: function () {
        wx.showToast({
          title: '网络异常，请检查网络是否连接',
          icon: 'none',
          mask: true
        });
      },
      complete: function () {
        _this.setData(_this.data);
      }
    })
  },

  /* 处理列表数据 */
  dealPageData: function (data) {
    var uppercase = util.convertCurrency(data.xdAmount);
    var xdAmount = util.formatNumberRgx(data.xdAmount);
    return {
      credEntNo: data.credEntNo,
      credEntName: data.credEntName,
      contractFsskey: data.contractFsskey,
      xdAmount: xdAmount,
      maskData: {
        receEntNo: data.receEntNo,
        receEntName: data.receEntName,
        credEntNo: data.credEntNo,
        tradeDate: data.tradeDate,
        credEntName: data.credEntName,
        xdStatus: data.xdStatus,
        xdNo: data.xdNo,
        openEntNo: data.openEntNo,
        guaranteeEntName: data.guaranteeEntName,
        xdDay: data.xdDay,
        openEntName: data.openEntName,
        expireDate: data.expireDate,
        guaranteeEntNo: data.guaranteeEntNo,
        openDate: data.openDate,
        uppercase: uppercase,
        xdAmount: xdAmount,
      }
    };
  },

  /* 同意\取消（协议） */
  agreeProtocol: function (e) {
    this.setData({
      protocolChecked: e.detail.checked
    });
  },

  /* 复核 */
  submitOk: function (e) {
    this.submitData(1);
  },

  /* 驳回 */
  submitCancel: function (e) {
    this.submitData(2);
  },

  /* 复核数据 */
  submitData: function (status) {
    var _this = this;
    if (!_this.data.protocolChecked) {
      wx.showToast({
        title: '未同意润信协议',
        icon: 'none',
        mask: true
      });
      return false;
    }
    wx.request({
      url: config.prefix,
      method: 'POST',
      data: {
        serviceCode: 'BILL0004',
        sessionToken: _this.userInfo.sessionToken,
        xdNo: _this.data.options.id,
        checkStatus: status,
      },
      success: function (res) {
        if (res.statusCode === 200 && res.data.respCode === '0000') {
          _this.setData({
            showPrompt: true
          });
        }
      },
      fail: function () {
        wx.showToast({
          title: '网络异常，请检查网络是否连接',
          icon: 'none',
          mask: true
        });
      }
    })
  },

  /* 确定 */
  submitPrompt: function (e) {
    // 发送信息
    this.setData({
      showPrompt: false
    });
    this.reloadPage();
  },

  /* 取消 */
  cancelPrompt: function (e) {
    this.setData({
      showPrompt: false
    });
    this.reloadPage();
  },

  /* 刷新页面 */
  reloadPage() {
    this.requestPageData();
  },

})