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
    noDataHidden: true,
    countTrade: {}
  },

  /**
  * 生命周期函数--监听页面显示
  */
  onShow: function (options) {
    this.page = 1;
    this.totalPage = 1;

    let advanceParams = wx.getStorageSync('advanceParams');
    if (advanceParams) {
      this.requestData(this.serviceCode, JSON.parse(advanceParams));
    } else {
      this.serviceCode = 'BILL0017';
      this.requestData(this.serviceCode);
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setStorage({
      key: 'advanceParams',
      data: ''
    });
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
      if (id === '1') {
        this.countTrade();
      }
    }
  },

  countTrade: function() {
    let that = this;
    wx.request({
      url: config.prefix,
      method: 'POST',
      data: {
        serviceCode: 'BASE0019'
      },
      success: function(res) {
        if (res.data.respCode == '0000') {
          that.setData({
            countTrade: {
              billSIgnAmountTotal: util.formatNumberRgx(res.data.billSIgnAmountTotal),
              transferAmountTotal: util.formatNumberRgx(res.data.transferAmountTotal),
              financeAmountTotal: util.formatNumberRgx(res.data.financeAmountTotal),
            }
          })
        }
      }
    })
  },

  requestData(serviceCode, advanceParams) {
    let that = this;
    let params = {};
    wx.showLoading();

    params = Object.assign({
      serviceCode: serviceCode,
      row: 10,
      page: that.page
    }, advanceParams || {})

    wx.request({
      url: config.prefix,
      method: 'POST',
      data: params,
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

  listDetails: function(e) {
    if (this.data.typeId === '0') { // 签发详情
      wx.navigateTo({
        url: '/pages/runxin-distribute-detials/index?xdno=' + e.currentTarget.dataset.xdno
      });
    } else if (this.data.typeId === '1') {
      wx.navigateTo({
        url: '/pages/runxin-transfer-detail/index?xdno=' + e.currentTarget.dataset.xdno
      });
    } else if (this.data.typeId === '2') {
      wx.navigateTo({
        url: '/pages/runxin-financing-detail/index?xdno=' + e.currentTarget.dataset.xdno
      });
    }
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