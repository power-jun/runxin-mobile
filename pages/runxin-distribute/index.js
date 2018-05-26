var config = require('../../utils/config.js');
var util = require('../../utils/util.js');
var app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgArry: [],
    imgArryId: [],
    receivingData: [],
    receivingNameArry: [],
    receivingCodeArry: [],
    receivingName: '请选择',
    creditagency:[],
    creditagencyNameArry: [],
    creditagencyCode: [],
    creditagencyName: '请选择',
    dateSelectV: '请选择',
    receivingCode: '',
    accNo: '',
    bankName: '',
    branchName: '',
    openDate: '',
    expireDate: '',
    deadlineDate: 0
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
    let deadline = new Date(expireDateTime - openDateTime);

    this.setData({
      expireDate: val,
      deadlineDate: deadline.getDate()
    });
  },

  bindCreditChange: function() {

  },

  uploadImg: function () {
    if (this.data.imgArry.length == 5) {
      wx.showToast({ title: '最多只可以上传5张' });
      return;
    }

    let that = this;
    wx.chooseImage({
      count: 5,  //最多可以选择的图片总数  
      sizeType: ['compressed'], // 可以指定是原图还是压缩图，默认二者都有  
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有  
      success: function (res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片  
        var tempFilePaths = res.tempFilePaths;
        //启动上传等待中...  
        wx.showToast({
          title: '正在上传...',
          icon: 'loading',
          mask: true,
          duration: 10000
        });
        var uploadImgCount = 0;
        for (var i = 0, h = tempFilePaths.length; i < h; i++) {
          wx.uploadFile({
            url: config.prefix,
            filePath: tempFilePaths[i],
            name: 'file',
            formData: {
              'serviceCode': 'BILL0025',
              'imgIndex': i,
              'bizType': '1',
              'contractType': '1'
            },
            header: {
              "Content-Type": "multipart/form-data"
            },
            success: function (res) {
              uploadImgCount++;
              var data = JSON.parse(res.data);

              var contractFileId = data.contractFileId;
              var imgArryId = that.data.imgArryId;
              imgArryId.push(contractFileId);

              that.setData({
                imgArryId: imgArryId
              });

              //如果是最后一张,则隐藏等待中  
              if (uploadImgCount == tempFilePaths.length) {
                wx.hideToast();
              }
            },
            fail: function (res) {
              wx.hideToast();
              wx.showModal({
                title: '错误提示',
                content: '上传图片失败',
                showCancel: false,
                success: function (res) { }
              })
            }
          });
        }
      }
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
      success: function (res) {
        if (res.data.respCode === '0000') {
          let datas = res.data.receEntList;
          let receivingNameArry = [];
          let receivingCodeArry = [];

          for (let i = 0, len = datas.length; i < len; i++) {
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
    });

    wx.request({
      url: config.prefix,
      method: 'POST',
      data: {
        serviceCode: 'BASE0005',
        bizType: '1'
      },
      success: function (res) {
        if (res.data.respCode !== '0000') {
          let datas = res.data.creditagency;
          let creditagencyNameArry = [];
          let creditagencyCode = [];

          for (let i = 0, len = datas.length; i < len; i++) {
            creditagencyNameArry.push(datas[i].entName);
            creditagencyCode.push(datas[i].accNo);
          }

          that.setData({
            creditagency: datas,
            receivingNameArry: creditagencyNameArry,
            creditagencyCode: creditagencyCode
          });
        }
      }
    });
  }
})