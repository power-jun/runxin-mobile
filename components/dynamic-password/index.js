// components/dynamic-password/index.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    showDynamic: {
      type: Boolean,
      value: false
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    randomMathArry: [],
    randomMathRedArry:  [],
    randomMathVal: '',
    inputLength: 6,
    isFocus: true,
    inputV: ''
  },

  ready: function(){
    let randomMathString = '';
    let randomMathVal = '';

    let randomMathRed1 = this.rndNum(1);
    this.data.randomMathRedArry.push(randomMathRed1)
    let randomMathRed2 = this.rndNum(2);
    this.data.randomMathRedArry.push(randomMathRed2)
    let randomMathRed3 = this.rndNum(2);
    this.data.randomMathRedArry.push(randomMathRed3)
    let randomMathRed4 = this.rndNum(3);
    this.data.randomMathRedArry.push(randomMathRed4)

    let randomMath1 = this.rndNum(3);
    this.data.randomMathArry.push(randomMath1)
    let randomMath2 = this.rndNum(4);
    this.data.randomMathArry.push(randomMath2)
    let randomMath3 = this.rndNum(1);
    this.data.randomMathArry.push(randomMath3)
    let randomMath4 = this.rndNum(5);
    this.data.randomMathArry.push(randomMath4)
    
    randomMathVal= randomMathRed1 + randomMath1 + randomMathRed2 + randomMath2 + randomMathRed3 + randomMath3 + randomMathRed4 + randomMath4;    

    this.setData({
      randomMathArry: this.data.randomMathArry,
      randomMathRedArry: this.data.randomMathRedArry,
      randomMathVal: randomMathVal
    })
  },

  /**
   * 组件的方法列表
   */
  methods: {
    submit: function () {
      this.triggerEvent('submit', { inputV: this.data.inputV, randomMathVal: this.data.randomMathVal}, {});
    },
    
    rndNum: function (n) {
      var rnd = "";
      for (var i = 0; i < n; i++)
        rnd += Math.floor(Math.random() * 10);
      return rnd;
    },

    focusInput: function() {
      this.setData({
        isFocus: true //隐藏input 获取焦点
      })
    },

    passwordInput: function(e) {
      let val = e.detail.value;
      this.setData({
        inputV: val
      })
    }
  }
})
