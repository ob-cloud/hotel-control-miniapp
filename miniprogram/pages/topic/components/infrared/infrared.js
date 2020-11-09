let height = wx.getSystemInfoSync().windowHeight
let itemCount = 20
let items = [...new Array(itemCount)].map((v, i) => i)
import { dateFormat } from '../../../../utils/util'
Component({
  options: {
    addGlobalClass: true //引用全局样式
  },
  properties: {
  },
  lifetimes: {
    attached() {
      this.loadData()
    },
    detached() {
    }
  },
  data: {
    height,
    list: []
  },
  methods: {
    getList() {
      return [...new Array(itemCount)].map((v, i) => {
        return {
          oboxName: Math.random() * 100000000000 + '' + i,
          oboxSerialId: Math.random() * 100000000000 + '' + i,
          createTime: dateFormat()
        }
      })
    },
    loadData() {
      wx.showLoading()
      setTimeout(() => {
        items = [...this.getList()]
        this.setData({
          list: [...this.data.list, ...items]
        })
        wx.hideLoading()
        wx.stopPullDownRefresh()
      }, 1000)
      console.log('loadData')
    },
    lower() {
      this.loadData()
      console.log('onReachBottom')
    }
  }
})