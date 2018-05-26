// components/financing-mask/index.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {

    /* 显示链接 */
    showLink: {
      type: Boolean,
      value: true
    },

    /* 链接 */
    link: {
      type: String,
      value: null
    },

    /* 数据 */
    maskData: Object,
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
    
    /* 打开链接 */
    openLink: function (e) {
      if (this.data.link) {
        wx.navigateTo({
          url: this.data.link,
        });
      }
    },

    /* 选择复选框 */
    selectCheckBox: function (e) {
      var details = {
        id: this.data.maskData.xdNo,
        checked: e.detail.checked
      };
      this.triggerEvent('select', details, {});
    },
  }
})
