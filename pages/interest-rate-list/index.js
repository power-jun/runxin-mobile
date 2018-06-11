var config = require('../../utils/config.js');
var util = require('../../utils/util.js');
var app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    showPrompt: false, // 显示成功提示
    promptTitle: '复核成功',
    promptMessage: '将复核成功的消息转发给收信人，让他快点签收润信！',
    listData: null, // 列表数据
    showNoData: false, // 显示没有数据
    showPagesLoading: false, // 显示分页加载
    pagesLoadingText: '数据加载中...', // 分页加载文本
  },

  /* 全选组件 */
  allCheckBox: null,

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
    this.allCheckBox = this.selectComponent('#allCheckBox');
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
    this.requestListData(false);
  },

  /* 参数 */
  params: {
    serviceCode: 'BASE0009',
    sessionToken: '',
    page: 1,
    row: 10,
  },

  /* 获取列表数据 */
  requestListData: function (flag) {
    var _this = this;
    if (flag) {
      _this.params.page++;
    } else {
      _this.params.page = 1;
      _this.params.sessionToken = _this.userInfo.sessionToken;
    }
    wx.request({
      url: config.prefix,
      method: 'POST',
      data: _this.params,
      success: function (res) {
        if (res.statusCode === 200 && res.data.respCode === '0000') {
          if (flag) {
            if (res.data.billList && res.data.billList.length) {
              _this.data.listData = _this.data.listData.concat(_this.dealListData(res.data.billList));
              _this.data.showPagesLoading = false;
            } else {
              _this.data.showPagesLoading = true;
              _this.data.pagesLoadingText = '没有更多数据了';
            }
          } else {
            if (res.data.billList && res.data.billList.length) {
              _this.data.listData = _this.dealListData(res.data.billList);
              _this.data.showNoData = false;
            } else {
              _this.data.showNoData = true;
            }
            if (_this.params.page < res.data.totalPage) {
              _this.data.showPagesLoading = false;
            } else {
              _this.data.showPagesLoading = true;
              _this.data.pagesLoadingText = '没有更多数据了';
            }
          }
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
  dealListData: function (data) {
    var listData = [];
    data && data.map(function (v, i) {
      var status = v.rateType == 1 ? 'red' : 'green';
      var statusText = v.rateType == 1 ? '融资' : '贴现';
      var maskData = {
        status: status, // 状态
        seqNo: v.seqNo,  // 流水号
        operTime: v.operTime, // 经办时间
        rateType: statusText, // 类型
        drawEntNo: v.drawEntNo, // 企业id
        drawEntName: v.drawEntName,  // 企业名称
        rateOld: v.rateOld, // 旧利率
        rateNew: v.rateNew, // 新利率
        checked: false, // 是否选中
      }
      listData.push(maskData);
    });
    return listData;
  },

  /* 下拉加载更新数据 */
  scrollToLower: function (e) {
    if (!this.data.showPagesLoading) {
      this.setData({
        showPagesLoading: true,
        pagesLoadingText: '数据加载中...'
      });
      this.requestListData(true);
    }
  },

  /* 选择列表项 */
  selectListItem: function (e) {
    var status = true;
    this.data.listData && this.data.listData.map(function (v, i) {
      if (e.detail.id === v.seqNo) {
        v.checked = e.detail.checked;
      }
      if (!v.checked) {
        status = false;
      }
    });
    this.allCheckBox.select(status);
    this.setData(this.data);
  },

  /* 全选 */
  checkAll: function (e) {
    this.data.listData && this.data.listData.map(function (v, i) {
      v.checked = e.detail.checked;
    });
    this.setData(this.data);
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
    var seqNo = '';
    _this.data.listData && _this.data.listData.map(function (v, i) {
      if (v.checked) {
        seqNo += v.seqNo + ',';
      }
    });
    seqNo = seqNo.substr(0, seqNo.length - 1);
    if (seqNo === '') {
      wx.showToast({
        title: '请先选择要处理的数据',
        icon: 'none',
        mask: true
      });
      return false;
    }
    wx.request({
      url: config.prefix,
      method: 'POST',
      data: {
        serviceCode: 'BASE0011',
        sessionToken: _this.userInfo.sessionToken,
        seqNo: seqNo,
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
    this.requestListData(false);
    this.allCheckBox.select(false);
  },

})