import {
  getSystemInfo,
  startWifi,
  stopWifi,
  getWifiList,
  onGetWifiList,
  authorizeWifi,
  setWifiList,
  offGetWifiList,
  getConnectedWifi,
  connectWifi,
  showErrorToast,
  postAction
} from '../../../utils/util'
import $ from '../../../utils/tool';
import { WIFI_ERROR_CODE, WIFI_SSID_PREFIX } from '../../../utils/constant'
const api = require('../../../config/api.js')

Page({
  data: {
    isAndroid: false,
    platform: '',
    wifiList: [],
    index: 0,
    ssid: '',
    password: '',
    wifi: {},
    connecting: false,
    errMsg: ''
  },
  onShow: function () {
    $.showLoading('初始化...')
    this.launchWifi()
  },
  onUnload() {
    clearTimeout(this.timer)
    this.destroy()
  },
  launchWifi () {
    if (!this.data.platform) {
      getSystemInfo().then((res) => {
        this.setData({platform: res.platform})
        if (res.platform.includes('android')) {
          this.setData({isAndroid: true})
        }
        this.initWifiList()
      })
    } else {
      this.initWifiList()
    }
  },
  // 初始化wifi列表
  initWifiList() {
    authorizeWifi().then(() => {
      startWifi().then(() => {
        if (this.data.isAndroid) {
          this.getWifiList().finally(() => $.hideLoading())
        } else this.onGetWifiList()
      })
    })
  },
  getWifiList () {
    return getWifiList()
    .then(() =>  this.onGetWifiList() )
    .catch((err) => showErrorToast(WIFI_ERROR_CODE[err.errCode] || err.errMsg))
  },
  // 监听获取wifi列表
  onGetWifiList() {
    wx.onGetWifiList((res) => {
      console.log('-=-=-= ', res)
      $.hideLoading()
      const wifiList = res.wifiList.filter(wifi => wifi.SSID && WIFI_SSID_PREFIX.find(ssid => wifi.SSID.includes(ssid)))
      this.setData({wifiList: wifiList})
    })
  },
  connectWifi() {
    const {SSID, BSSID} = this.data.wifi
    const password = this.data.password
    if (SSID && password) this.setData({connecting: true})
    connectWifi(SSID, password, BSSID)
    .then(() => {  this.setData({errMsg: '连接成功'}) })
    .catch((err) => this.setData({errMsg: WIFI_ERROR_CODE[err.errCode]}))
    .finally(() => showErrorToast(this.data.errMsg))
  },
  onWifiChange(e) {
    const index = e.detail.value
    this.setData({
      index,
      ssid: this.data.wifiList[index].SSID,
      wifi: this.data.wifiList[index]
    })
  },
  onPasswordChange(e) {
    this.setData({
      password: e.detail || ''
    })
  },
  destroy() {
    offGetWifiList()
    stopWifi()
  },
  async onPullDownRefresh() {
    await this.getWifiList()
    wx.stopPullDownRefresh()
  }
})