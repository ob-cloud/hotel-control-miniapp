import {
  getSystemInfo,
  startWifi,
  stopWifi,
  getWifiList,
  onGetWifiList,
  authorizeWifi,
  setWifiList,
  offGetWifiList,
  connectWifi,
  showErrorToast,
  postAction
} from '../../../utils/util'
import $ from '../../../utils/tool';
const api = require('../../../config/api.js')
const WIFI_ERROR_CODE = {
  12000:"未先调用 startWifi 接口",
  12001:"当前系统不支持相关能力",
  12002:"Wi-Fi:密码错误",
  12003:"连接超时",
  12004:"重复连接 Wi-Fi",
  12005:"未打开 Wi-Fi 开关",
  12006:"未打开 GPS 定位开关",
  12007:"用户拒绝授权链接 Wi-Fi",
  12008:"无效 SSID",
  12009:"系统运营商配置拒绝连接 Wi-Fi",
  12010:"系统其他错误，需要在 errmsg 打印具体的错误原因",
  12011:"应用在后台无法配置 Wi-Fi"
}
// wifi名称前缀
const WIFI_SSID_PREFIX = ['OBOX', 'IOT']
module.exports = Behavior({
  behaviors: [],
  properties: {
  },
  data: {
    isAndroid: false,
    wifiList: [],
    index: 0,
    ssid: '',
    password: '',
    wifi: {}
  },
  attached: function(){
    this.launchWifi()
  },
  detached: function () {
    this.destroy()
  },
  methods: {
    launchWifi () {
      $.showLoading('初始化...')
      getSystemInfo().then((res) => {
        if (res.platform.includes('android')) {
          this.setData({isAndroid: true})
        }
        this.initWifiList()
      })
    },
    // 初始化wifi列表
    initWifiList() {
      authorizeWifi().then(() => {
        startWifi().then(() => {
          if (this.data.isAndroid) {
            getWifiList().then(res => {
              this.onGetWifiList()
            }).catch((err) => {
              $.hideLoading()
              showErrorToast(WIFI_ERROR_CODE[err.errCode] || err.errMsg)
            })
          } else this.onGetWifiList()
        })
      })
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
    // connectToEquip() {
    //   const param = {
    //     ssid: this.data.ssid,
    //     kitCenter: 'https://aliiot.on-bright.com',
    //     password: that.data.wifiPassword,
    //     token: app.globalData.token
    //   }
    //   postAction(api.WifiRootUrl, )
    // },
    connectWifi() {
      const {SSID, BSSID} = this.data.wifi
      const password = this.data.password
      connectWifi(SSID, password, BSSID).then(res => {
        console.log('success', res)
      }).catch((err) => {
        console.log('err ', err)
      })
    },
    onWifiChange(e) {
      this.setData({
        index: e.detail.value,
        ssid: this.data.wifiList[index].SSID,
        wifi: this.data.wifiList[index]
      })
    },
    onPasswordChange() {
      this.setData({
        password: val.detail || ''
      })
    },
    destroy() {
      offGetWifiList()
      stopWifi()
    }
  }
})