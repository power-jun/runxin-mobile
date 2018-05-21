var config = require('../../utils/config.js');

Component({
  /**
   * 组件的属性列表
   */
  properties: {

    /* 是否显示 */
    isShow: {
      type: Boolean,
      value: false
    }

  },

  /**
   * 组件的初始数据
   */
  data: {
    picture: config.cdnPrefix + 'img/validate.jpg',
    code: '',
  },

  /**
   * 组件的方法列表
   */
  methods: {

    setTimeoutObject: null,

    /* 输入 */
    inputCode: function (e) {
      var _this = this;
      clearTimeout(_this.setTimeoutObject);
      _this.setTimeoutObject = setTimeout(function () {
        var code = e.detail.value.trim();
        _this.setData({
          code: code
        });
      }, 200);
    },

    /* 清空 */
    clearCode: function (e) {
      this.setData({
        code: ''
      });
    },

    /* 确认 */
    ok: function (e) {
      var details = {
        code: this.data.code
      };
      this.triggerEvent('ok', details, {});
      this.setData({
        isShow: false
      });
    },

    /* 取消 */
    cancel: function (e) {
      this.setData({
        isShow: false
      });
    }
  }
})
