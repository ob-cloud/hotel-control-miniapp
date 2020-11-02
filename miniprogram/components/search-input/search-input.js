// component/search-input.js
Component({
  options: {
    multipleSlots: true, // 在组件定义时的选项中启用多slot支持
    addGlobalClass: true  //引用全局样式
  },
  /**
   * 组件的属性列表
   */
  properties: {
    holder: String, // placeholder
    value: String, // value
    disabled: { //是否可输入
      type: Boolean,
      value: false
    },
    lefticon: { //左边的图标
      type: String,
      value: ''
    },
    righticon: { //左边的图标
      type: String,
      value: ''
    },
    valuetype: { //输入框类型password。text
      type: String,
      value: 'text'
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    isfocuse: false,
    inPassword: false,
  },

  /**
   * 组件的方法列表
   */
  methods: {
    changeData(e) {//输入框事件
      this.triggerEvent('change',  e.detail.value);
    },
    inputTap(e) {//点击输入框事件，常用在disabled时候
      this.triggerEvent('inputTap',  e);
    },
    lefticontap() {//左边图标点击事件
      this.triggerEvent('lefticontap')
    },
    righticontap() {//右边图标点击事件
      this.triggerEvent('righticontap')
    },
    clearValue() {
      this.triggerEvent('change',  '');
    },
    inputfocus() {
      this.setData({
        isfocuse: true
      })
    },
    inputblue() {
      this.setData({
        isfocuse: false
      })
    },
    changeEyes() {
      this.setData({
        inPassword: !this.data.inPassword
      })
    }
  },
  ready() {
    this.setData({
      inPassword: this.data.valuetype === 'password'
    })
  }
})
