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
    creditagencyCodeArry: [],
    creditagencyCode: '',
    creditagencyName: '请选择',
    dateSelectV: '请选择',
    receivingCode: '',
    accNo: '',
    bankName: '',
    branchName: '',
    xdAmount: '', //签发金额
    availableAmount: '', // 可用额度
    openDate: '',
    expireDate: '',
    deadlineDate: 0,
    guarantorName: '', //担保人
    checkboxFlag: false,
    showDynamic: false, //显示动态密码框
    showPrompt: false,
    promptTitle: '签发成功',
    promptMessage: '将签发成功的消息转发给收信人，让他快点签收润信！',
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
      dateSelectV: val,
      deadlineDate: deadline.getDate()
    });
  },

  bindCreditChange: function (event) {
    let index = event.detail.value;
    let creditagencyName = this.data.creditagencyNameArry[index];
    let creditagencyCode = this.data.creditagencyCodeArry[index];

    let currentCreditagency = this.data.creditagency.filter(function (v, n) {
      return v.entNo === creditagencyCode
    });
    console.log(app)

    if (currentCreditagency[0].confirmFlag === '1') {
      this.setData({
        creditagencyName: creditagencyName,
        creditagencyCode: creditagencyCode,
        availableAmount: currentCreditagency[0].availableAmount,
        guarantorName: currentCreditagency[0].entName
      })
    } else {
      this.setData({
        creditagencyName: creditagencyName,
        creditagencyCode: creditagencyCode,
        availableAmount: currentCreditagency[0].availableAmount,
        guarantorName: app.companyInfo.name
      })
    }
  },

  uploadImg: function () {
    if (this.data.imgArry.length == 5) {
      wx.showToast({
        title: '最多只可以上传5张', 
        icon: 'none'
      });
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
        that.data.imgArry.push(tempFilePaths);
        
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
                imgArryId: imgArryId,
                imgArry: that.data.imgArry
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
        if (res.data.respCode === '0000') {
          let datas = res.data.authEntList;
          let creditagencyNameArry = [];
          let creditagencyCodeArry = [];

          for (let i = 0, len = datas.length; i < len; i++) {
            creditagencyNameArry.push(datas[i].entName);
            creditagencyCodeArry.push(datas[i].entNo);
          }

          that.setData({
            creditagency: datas,
            creditagencyNameArry: creditagencyNameArry,
            creditagencyCodeArry: creditagencyCodeArry
          });
        }
      }
    });
  },

  keyInputAmt: function(e) {
    let val = e.detail.value;
    this.setData({
      xdAmount: val
    });
  },

  checkboxchange: function (e) {
    this.setData({
      checkboxFlag: e.detail.checked
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
        bizType: '1',
        dyCode: datas.detail.randomMathVal,
        dyPasswd: datas.detail.inputV,
        serviceCode: 'BILL0016'
      },
      method: 'POST',
      success: function (res) {
        if (res.data.respCode === '0000') {

          wx.request({
            url: config.prefix,
            method: 'POST',
            data: that.params,
            success: function (res) {
              wx.hideLoading()
              if (res.data.respCode === '0000') {
                that.setData({
                  showPrompt: true
                });
              }
            }
          })

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

  bindFormSubmit: function() {
    let that = this;

    if (!this.data.creditagencyCode) {
      wx.showToast({
        title: '请选择授信机构',
        icon: 'none'
      });
      return;
    }

    if (!this.data.receivingCode) {
      wx.showToast({
        title: '请选择收信企业',
        icon: 'none'
      });
      return;
    }

    if (!this.data.xdAmount) {
      wx.showToast({
        title: '请输入签发金额',
        icon: 'none'
      });
      return;
    }

    if (!this.data.expireDate) {
      wx.showToast({
        title: '请输选择到期日',
        icon: 'none'
      });
      return;
    }

    if (!this.data.checkboxFlag) {
      wx.showToast({
        title: '请阅读润信签发协议',
        icon: 'none'
      });
      return;
    }

    this.params = {
      creditagencyCode: this.data.creditagencyCode,
      receEntNo: this.data.receivingCode,
      xdAmount: this.data.xdAmount,
      openDate: this.data.openDate,
      expireDate: this.data.expireDate,
      contractFileId: this.data.imgArryId.join(','),
      serviceCode: 'BILL0003'
    }

    this.setData({
      showDynamic: true
    });
  }
})