var config = require('../../utils/config.js');
var util = require('../../utils/util.js');
var app = getApp();
var timer = null;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    financingData: {},
    availableCredits: 0,
    receEntList: [],
    receiverData: [],
    transAmountArry: [],
    xdDescArry: [],
    receiverSingle: {
      entName: '', //收信人
      accNo: '', // 银行账户
      bankName: '', //银行名称
      branchName: '' //银行支行
    },
    showDynamic: false, //显示动态密码框
    showPrompt: false, // 显示成功提示
    promptTitle: '转让成功',
    promptMessage: '将转让成功的消息转发给收信人，让他快点签收润信！',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    this.xdNo = '';

    wx.getStorage({
      key: 'holdFinancingData',
      success: function (res) {
        that.xdNo = res.data.xdNo;
        that.setData({
          financingData: res.data,
          expireDate: res.data.expireDate,
          availableCredits: res.data.xdAmount
        });
      },
    });

    let receEntList = wx.getStorageSync('receEntListTransfer') || [];
    let receiverData = wx.getStorageSync('receiverData') || [];
    let currentIndex = wx.getStorageSync('transferCurrentIndex');
    let receiverAmountArry = wx.getStorageSync('receiverAmountArry');
    let receiverxdDescArry = wx.getStorageSync('receiverxdDescArry');

    if (options.index && receiverData.length && receEntList.length) {
      receiverData[currentIndex].entName = receEntList[options.index].entName;
      receiverData[currentIndex].accNo = receEntList[options.index].accNo;
      receiverData[currentIndex].bankName = receEntList[options.index].bankName;
      receiverData[currentIndex].branchName = receEntList[options.index].branchName;

      this.setData({
        receiverData: receiverData,
        transAmountArry: receiverAmountArry,
        xdDescArry: receiverxdDescArry
      });
    }

    if (!receiverData.length) {
      this.requestData(); // 查询收信企业
    }
  },

  requestData: function (id) {
    let that = this;
    wx.showLoading();

    wx.request({
      url: config.prefix,
      method: 'POST',
      data: {
        serviceCode: 'BASE0008',
        bizType: '2'
      },
      success: function (res) {
        wx.hideLoading();

        if (res.data.respCode == '0000') {
          let receEntList = res.data.receEntList;
          that.data.receiverData.push({
            entName: receEntList[0].entName,
            accNo: receEntList[0].accNo,
            bankName: receEntList[0].bankName,
            branchName: receEntList[0].branchName
          });

          wx.setStorage({
            key: 'receEntListTransfer',
            data: receEntList,
          });

          that.setData({
            receEntList: receEntList,
            receiverData: that.data.receiverData
          });
        }
      }
    })
  },

  selectTransfer: function (e) {
    this.currentIndex = e.currentTarget.dataset.currentindex; // 收信人数组下标
    wx.navigateTo({
      url: '/pages/transer-receiver-select/index'
    });

    wx.setStorage({
      key: 'transferCurrentIndex',
      data: this.currentIndex
    });
  },

  increaseCompany: function () {
    if (this.data.availableCredits <= 0) {
      wx.showToast({
        title: '可用额度不够',
        icon: 'none'
      });
      return;
    }

    this.data.receiverData.push(this.data.receiverSingle);
    this.setData({
      receiverData: this.data.receiverData
    });

    wx.setStorage({
      key: 'receiverData',
      data: this.data.receiverData
    });

  },

  calculateAvailable: function (e) {
    let that = this;
    let availableAmt = 0;
    let index = e.currentTarget.dataset.index
    let val = e.detail.value;

    if (e.detail.value == '') {
      this.data.transAmountArry[index] = 0;
    }

    let restCalculate = function () {
      availableAmt = Number(that.data.financingData.xdAmount.replace(',', ''));

      if (that.data.transAmountArry.length) {
        for (let i = 0; i < that.data.transAmountArry.length; i++) {
          availableAmt -= that.data.transAmountArry[i];
        }
      }
    }

    restCalculate();

    let resultAmt = availableAmt - val;

    if (resultAmt < 0) {
      wx.showToast({
        title: '余额不够',
        icon: 'none'
      });

      this.data.transAmountArry[index] = 0;
      restCalculate();

      this.setData({
        transAmountArry: this.data.transAmountArry,
        availableCredits: util.formatNumberRgx(availableAmt)
      });

      return;
    }

    this.data.transAmountArry[index] = val;

    this.setData({
      availableCredits: util.formatNumberRgx(resultAmt),
      transAmountArry: this.data.transAmountArry
    });

    wx.setStorage({
      key: 'receiverAmountArry',
      data: this.data.transAmountArry
    });
  },

  inputDesc: function (e) {
    let that = this;
    let index = e.currentTarget.dataset.index
    let val = e.detail.value;

    this.data.xdDescArry[index] = val;

    this.setData({
      xdDescArry: this.data.xdDescArry
    });

    wx.setStorage({
      key: 'receiverxdDescArry',
      data: this.data.xdDescArry
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

    let paramArry = this.paramArry;

    wx.showLoading();
    wx.request({
      url: config.prefix,
      data: {
        xdNo: that.submitParams.xdNo,
        bizType: '2',
        dyCode: datas.detail.randomMathVal,
        dyPasswd: datas.detail.inputV,
        serviceCode: 'BILL0016'
      },
      method: 'POST',
      success: function (res) {
        if (res.data.respCode === '0000') {

          wx.request({
            url: config.prefix,
            data: { paramArry, serviceCode: 'BILL0010' },
            method: 'POST',
            success: function (res) {
              wx.hideLoading();
              if (res.data.respCode === '0000') {
                that.setData({
                  showPrompt: true
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

  submitTransfer: function () {
    let receiverData = this.data.receiverData;
    let transAmountArry = this.data.transAmountArry;
    let xdDescArry = this.data.xdDescArry;
    let flag = true;
    let that = this;

    this.paramArry = [];

    for (let i = 0; i < receiverData.length; i++) {
      if (!receiverData[i].entName) {
        wx.showToast({
          title: '请选择收信人',
          icon: 'none'
        });
        flag = false;
        break;
      } else if (!transAmountArry[i]) {
        wx.showToast({
          title: '请输入金额',
          icon: 'none'
        });
        flag = false;
        break;
      }

      this.paramArry.push({
        xdNo: that.xdNo,
        receEntNo: receiverData[i].accNo,
        transAmount: transAmountArry[i],
        xdDesc: xdDescArry[i]
      })
    }

    if (!flag) {
      return;
    }

    this.setData({
      showDynamic: true
    });
  },

  submitPrompt: function () {
    wx.switchTab({
      url: '/pages/runxin-manage/index'
    });
  },

  cancelPrompt: function () {
    wx.switchTab({
      url: '/pages/runxin-manage/index'
    });
  },
})