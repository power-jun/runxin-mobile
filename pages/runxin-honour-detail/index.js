var config = require('../../utils/config.js');
var util = require('../../utils/util.js');
var app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    options: null, // 页面参数
    pageData: null, // 页面数据
  },
  
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (options && options.id) {
      this.data.options = options;
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

  /* 用户信息 */
  userInfo: null,

  /* 公司信息 */
  companyInfo: null,

  /* 初始化 */
  init: function () {
    this.userInfo = app.getUserInfo();
    this.companyInfo = app.getCompanyInfo();
    this.requestPageData();
  },

  /* 获取页面数据 */
  requestPageData: function () {
    var _this = this;
    wx.request({
      url: config.prefix,
      method: 'POST',
      data: {
        serviceCode: 'BILL0020',
        sessionToken: _this.userInfo.sessionToken,
        xdNo: _this.options.xdno,
      },
      success: function (res) {
        if (res.statusCode === 200 && res.data.respCode === '0000') {
          _this.data.pageData = _this.dealPageData(res.data);
          _this.requestTradeBeforeData(res.data.mXdNo);
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

  /* 获取交易之前数据 */
  requestTradeBeforeData: function (id) {
    var _this = this;
    wx.request({
      url: config.prefix,
      method: 'POST',
      data: {
        serviceCode: 'BILL0018',
        sessionToken: _this.userInfo.sessionToken,
        xdNo: id,
      },
      success: function (res) {
        if (res.statusCode === 200 && res.data.respCode === '0000') {
          _this.data.pageData.maskData1 = _this.dealTradeBeforeData(res.data);
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
    var uppercase2 = util.convertCurrency(data.discountAmount);
    var xdAmount2 = util.formatNumberRgx(data.discountAmount);
    return {
      discountRate: data.discountRate, // 融资利率
      discountAmount: data.discountAmount, // 申请融资金额
      discountProfit: data.discountProfit, // 支付利息
      actualAmount: data.actualAmount, // 实际到账金额
      discountDate: data.discountDate, // 融资时间
      auditName: data.auditName, // 经办人
      auditTime: data.auditTime, // 办理时间
      terminal: data.terminalType == 1 ? '电脑端' : '移动端', // 终端类型
      maskData1: null, // 兑付前的数据
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

  /* 处理兑付之前的数据 */
  dealTradeBeforeData: function (data) {
    var uppercase1 = util.convertCurrency(data.xdAmount);
    var xdAmount1 = util.formatNumberRgx(data.xdAmount);
    return {
      status: 'green', // 状态
      xdNo: data.xdNo,  // 单号
      xdAmount: xdAmount1, // 金额
      uppercase: uppercase1, // 大写金额
      xdDay: data.xdDay,  // 天数
      tradeDate: data.tradeDate, // 交易时间
      openDate: data.openDate, // 开始时间
      expireDate: data.expireDate, // 结束时间
      openEntNo: data.openEntNo, // 签发人id
      openEntName: data.openEntName, // 签发人
      receEntNo: data.receEntNo, // 签收人id
      receEntName: data.receEntName, // 签收人
      guaranteeEntNo: data.guaranteeEntNo, // 担保人id
      guaranteeEntName: data.guaranteeEntName, // 担保人
    }
  }
})