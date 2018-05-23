var config = require('../../utils/config.js');
var app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    listData: null, // 列表数据
    showConfirm: false, // 显示提示层
    confirmTitle: '登录超时，请重新登录！', // 提示文本
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
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
      this.requestListData();
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

  /* 参数 */
  params: {
    serviceCode: 'BILL0001',
    ssessionToken: 'this.userInfo.sessionToken',
    page: 1,
    row: 1,
  },

  /* 获取列表数据 */
  requestListData: function () {
    var _this = this;
    wx.request({
      url: config.prefix,
      method: 'POST',
      data: _this.params,
      success: function (res) {
        if (res.statusCode === 200 && res.data.respCode === '0000') {
          _this.data.listData = res.data.billList;

          console.log(res.data.billList)
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

  /* 选择列表项 */
  selectListItem: function (e) {
    console.log(e.detail)
  },


})