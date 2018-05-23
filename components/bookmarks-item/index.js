// components/bookmarks-item/index.js
var util = require('../../utils/util.js');
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    itemData: Object
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
    goItemDetails: function(e) {
      let id = e.currentTarget.dataset.id;
      this.triggerEvent('change', { id: id}, {});
    }
  },

  ready: function() {
    let itemData = this.data.itemData;
    itemData.xdAmount = util.formatNumberRgx(itemData.xdAmount);
    itemData.caseAmount = util.convertCurrency(itemData.xdAmount);
    this.setData({
      itemData: itemData
    });
  }
})
