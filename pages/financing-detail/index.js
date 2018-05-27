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
        url: '../financing-list/index',
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
        serviceCode: 'BILL0013',
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
    var uppercase1 = util.convertCurrency(data.xdAmount);
    var uppercase2 = util.convertCurrency(data.xdAmount - data.financeAmount);
    var xdAmount1 = util.formatNumberRgx(data.xdAmount);
    var xdAmount2 = util.formatNumberRgx(data.xdAmount - data.financeAmount);
    return {
      financeAmount: data.financeAmount, // 融资金额
      financeDate: data.financeDate, // 融资时间
      financeProfit: data.financeProfit, // 融资成本
      financeRate: data.financeRate, // 融资利率
      actualAmount: data.actualAmount, // 实收金额
      auditName: data.auditName, // 经办人
      openDate: data.openDate, // 办理时间
      xdDesc: data.xdDesc, // 描述
      maskData1: {
        status: 'green', // 状态
        xdNo: data.xdNo,  // 单号
        xdAmount: xdAmount1, // 金额
        uppercase: uppercase1, // 大写金额
        xdDay: data.xdDay,  // 天数
        openDate: data.openDate, // 开始时时
        expireDate: data.expireDate, // 结束时间
        openEntNo: data.openEntNo, // 签发人id
        openEntName: data.openEntName, // 签发人
        receEntNo: data.receEntNo, // 签收人id
        receEntName: data.receEntName, // 签收人
        guaranteeEntNo: data.guaranteeEntNo, // 担保人id
        guaranteeEntName: data.guaranteeEntName, // 担保人
      },
      maskData2: {
        status: 'red', // 状态
        xdNo: data.xdNo,  // 单号
        xdAmount: xdAmount2, // 金额
        uppercase: uppercase2, // 大写金额
        xdDay: data.xdDay,  // 天数
        openDate: data.openDate, // 开始时时
        expireDate: data.expireDate, // 结束时间
        openEntNo: data.openEntNo, // 签发人id
        openEntName: data.openEntName, // 签发人
        receEntNo: data.receEntNo, // 签收人id
        receEntName: data.receEntName, // 签收人
        guaranteeEntNo: data.guaranteeEntNo, // 担保人id
        guaranteeEntName: data.guaranteeEntName, // 担保人
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
        serviceCode: 'BILL0015',
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