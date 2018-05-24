var config = require('../../utils/config.js');
var util = require('../../utils/util.js');
var app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    receivingData: [],
    receivingNameArry: [],
    receivingCodeArry :  [],
    receivingName : '请选择',
    dateSelectV: '请选择',
    receivingCode:  '',
    accNo: '',
    bankName: '',
    branchName:'',
    openDate: '',
    expireDate:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let nowDate = new Date();
    this.openDate = util.formatTime(nowDate);
    this.requestData();
  },

  bindPickerChange: function (event) {
    let index = event.detail.value;
    let receivingName = this.data.receivingNameArry[index];
    let receivingCode = this.data.receivingCodeArry[index];

    let currentReceiving = this.data.receivingData.filter(function (v, n) {
      return v.accNo === receivingCode
    });

    this.setData({
      receivingName: receivingName,
      receivingCode: receivingCode,
      bankName: currentReceiving[0].bankName,
      branchName: currentReceiving[0].branchName,
      accNo: currentReceiving[0].accNo
    })
  },

  bindDateChange: function (event) {
    let val = event.detail.value;
    let openDateTime = +(new Date(this.data.openDate));
    let expireDateTime = +(new Date(val));

    debugger
    this.setData({
      expireDate: val
    });
  },

  requestData() {
    let that = this;

    wx.request({
      url: config.prefix,
      method: 'POST',
      data: {
        serviceCode: 'BASE0008',
        bizType: '1'
      },
      success: function(res) {
        if (res.data.respCode === '0000') {
          let datas = res.data.receEntList;
          let receivingNameArry = [];
          let receivingCodeArry = [];
          
          for (let i = 0, len = datas.length; i <len; i++) {
            receivingNameArry.push(datas[i].entName);
            receivingCodeArry.push(datas[i].accNo);
          }

          that.setData({
            receivingData: datas,
            receivingNameArry: receivingNameArry,
            receivingCodeArry: receivingCodeArry,
            openDate: that.openDate
          });
        }
      }
    })
  }
})