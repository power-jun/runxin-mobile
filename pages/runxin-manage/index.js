var config = require('../../utils/config.js');
var util = require('../../utils/util.js');
var app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    activeCategoryId: 0,
    typeId: 0,
    holdingList: [], // 持有列表数据
    distributeData: [], // 签发交易
    transactionData: [], // 交易查询
    loadingMoreHidden: true,
    noDataHidden: true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.page = 1;
    this.totalPage = 1;
    this.serviceCode = 'BILL0017';
    this.requestData(this.serviceCode);
  },

  onTabItemTap: function() {
    debugger
  },


  tabClick: function (e) {
    let id = e.currentTarget.dataset.id;
    
    this.setData({
      activeCategoryId: id
    });

    if (id === '2') {
      wx.navigateTo({
        url: '/pages/runxin-distribute/index',
      });
    } else {
      this.page = 1;
      this.totalPage = 1;
      this.serviceCode = e.currentTarget.dataset.servicecode;
      this.requestData(this.serviceCode); 
    }
  },

  requestData(serviceCode) {
    let that = this;
    wx.showLoading();

    wx.request({
      url: config.prefix,
      method: 'POST',
      data: {
        serviceCode: serviceCode,
        row: 10,
        page: that.page
      },
      success: function (res) {
        wx.hideLoading();
        
        if (res.data.respCode == '0000') {
          let dataType = null;
          let billList = res.data.billList;

          if (serviceCode == 'BILL0017') {
            dataType = 'holdingList';
          } else if (serviceCode == 'BILL0001' || serviceCode == 'BILL0008' || serviceCode == 'BILL0012' || serviceCode == 'BILL0019') {
            dataType = 'transactionData';
          }

          for (var i = 0, len = billList.length; i < billList.length; i++) {
            billList[i].caseAmount = util.convertCurrency(billList[i].xdAmount);
            billList[i].xdAmount = util.formatNumberRgx(billList[i].xdAmount);
          }

          that.totalPage = res.data.totalPage;

          that.setData({
            loadingMoreHidden: true,
            noDataHidden: true,
            [dataType]: billList
          });
        } else {
          that.setData({
            loadingMoreHidden: true,
            noDataHidden: false
          });

          wx.showModal({
            content: res.data.respDesc,
            showCancel: false
          });
        }
      }
    });
  },

  tabTypeClick: function (e) {
    let id = e.currentTarget.dataset.id;
    this.setData({
      typeId: id
    });

    this.page = 1;
    this.totalPage = 1;
    this.serviceCode = e.currentTarget.dataset.servicecode;
    this.requestData(this.serviceCode);
  },

  goDetail: function(data) {
    wx.navigateTo({
      url: '/pages/holding-list-details/index?id=' + data.detail.id
    });
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
    if (this.page && (this.page >= this.totalPage) && this.totalPage != 0) {
      this.setData({
        loadingMoreHidden: false,
        noDataHidden: true
      })
      return;
    }

    this.page++;

    this.requestData(this.serviceCode);
  }
})