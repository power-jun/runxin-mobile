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
    showIcon: {
      type: Boolean,
      value: false
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

  },

  /**
   * 组件的方法列表
   */
  methods: {

  }
})
