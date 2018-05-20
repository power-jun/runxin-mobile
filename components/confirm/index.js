// components/ confirm/index.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    showConfirm: {
      type: Boolean,
      value: false
    },
    icon: {
      type: String,
      value: ''
    },
    title: {
      type: String,
      value: ''
    },
    message: {
      type: String,
      value: ''
    },
    showCancel: {
      type: Boolean,
      value: true
    },
    cancelText: {
      type: String,
      value: '不了'
    },
    okText: {
      type: String,
      value: '好的'
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    color: '#4fb63e'
  },

  ready: function () {
    switch (this.data.icon) {
      case 'info': this.data.color = '#10aeff'; break;
      case 'warn': this.data.color = '#f76260'; break;
      case 'success':
      default: this.data.color = '#4fb63e'; break;
    }
    this.setData({
      color: this.data.color
    });
  },

  /**
   * 组件的方法列表
   */
  methods: {

    /* 确定 */
    submit: function (e) {
      this.triggerEvent('submit', {}, {});
      this.setData({
        showConfirm: false
      });
    },

    /* 取消 */
    cancel: function (e) {
      this.setData({
        showConfirm: false
      });
    }

  }
})
