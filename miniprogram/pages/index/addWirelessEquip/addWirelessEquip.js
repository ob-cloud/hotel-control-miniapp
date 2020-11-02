import {
  getSystemInfo,
  startWifi,
  getWifiList,
  onGetWifiList,
  authorizeWifi,
  setWifiList,
  offGetWifiList,
  connectWifi,
} from '../../../utils/util'
const wifiBehavior = require('../../../utils/wifiBehavior.js')
let app = getApp();
Page({
  behaviors: [wifiBehavior],
  data: {
    wifiName: '',//wifi名称
    wifiPassword: '',//wifi密码
    // wifiList: [],//wifi列表
    index: 0,//wifi选择piker选中的index
    selectWifi: {},//选中的wifi
    canSend: true,
    timer: null,
    isAndroid: false
  },
  onShow: function () {
    // if(app.globalData.wifiList.length) {
    //   this.setData({
    //     wifiList: app.globalData.wifiList
    //   })
    //   this.setWifiInfo();
    // } else {
    //   this.selectWifi()
    // }

    // getSystemInfo().then((res) => {
    //   if (res.platform.includes('android')) {
    //     this.setData({isAndroid: true})
    //   }
    //   this.initWifi()
    // })

  },
  // initWifi() {
  //   authorizeWifi().then(() => {
  //     startWifi().then(() => {
  //       if (this.data.isAndroid) {
  //         getWifiList().then((res1) => {
  //           console.log('getWifiList: ', res1)
  //         }).catch((err) => {
  //           console.log('catch  ', err)
  //         })
  //       }
  //       wx.onGetWifiList((res) => {
  //         console.log('-=-=-= ', res)
  //         this.setData({wifiList: res.wifiList})
  //       })
  //     })
  //   })
  // },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {
    clearTimeout(this.timer)
    // wx.stopWifi()
  },
  getWifiNumber(val) {
    this.setData({
      wifiPassword: val.detail || ''
    })
  },
  addWifi() {
    //deviceSecret 设备连接密钥
    // deviceName   设备名称
    // kitCenter    连接域名
    // productKey   产品key
    // ssid 路由
    // pwd 路由密码
    const that = this;
    that.setData({
      canSend: false
    })
    console.log('发送wifi数据',{
      ssid: that.data.wifiName,
      password: that.data.wifiPassword,
      token: app.globalData.token
    })
    wx.request({
      url: app.globalData.wifiIP,
      method: 'POST',
      timeout: 5000,
      data: {
        ssid: that.data.wifiName,
        kitCenter: 'https://aliiot.on-bright.com',
        password: that.data.wifiPassword,
        token: app.globalData.token
      },
      success (res) {
        console.log('发送密码回包', res)
        let tarId = res.data.id
        wx.setStorageSync('wifiName', that.data.wifiName)
        wx.setStorageSync('wifiPassword', that.data.wifiPassword)
        wx.redirectTo({
          url:`/pages/wifiLockStep/wifiLockStep?id=${tarId}`
        })
      },
      fail (err) {
        wx.showToast({
          title: `发送失败请重试`,
          icon: 'none',
          duration: 2000
        })
        that.setData({
          canSend: true
        })
      }
    })
  },
  selectWifi() {
    // 判断wifi列表，为[]则重新获取，否则打开选择页面
    if(this.data.wifiList.length) {

    } else {
      wx.showModal({
        title: '提示',
        content: '请刷新wifi列表',
        success (res) {
          console.log('请刷新wifi列表res',res)
          if(res.confirm) {
            wx.getWifiList();
          }
        }
      })
    }
  },
  lefticonTap() {
    this.setData({
      wifi: this.data.wifi.slice(1)
    })
  },
  bindPickerChange: function(e) {
    const index = e.detail.value
    this.setData({
      index,
      wifiName: this.data.wifiList[index].SSID,
      selectWifi: this.data.wifiList[index]
    })
  },
  hideKeyboard(){
    wx.hideKeyboard()
  },
  setWifiInfo() {
    const wifiName = wx.getStorageSync('wifiName')
    const wifiPassword = wx.getStorageSync('wifiPassword')
    console.log('wifiName', wifiName)
    if(wifiName && wifiPassword && this.data.wifiList.find(ele => ele.SSID === wifiName)) {
      this.setData({
        wifiName,
        wifiPassword
      })
    }
  },
})