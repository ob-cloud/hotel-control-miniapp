import router from './utils/router'
import { checkLogin, updateManager } from './utils/util'
import websocket from './utils/websocket'
const api = require('./config/api.js')
//app.js
App({
  onLaunch: function () {
    updateManager()
    this.websocket = new websocket({
      url: api.SocketRootUrl,
      heartCheck: true,
      isReconnect: false
    })
    this.websocket.initWebSocket()
    this.websocket.onSocketClosed()
    this.websocket.onNetworkChange()
    this.websocket.onReceivedMessage().then(res => {
      console.log('WebSocket 收到内容: ' + res.data)
    })
  },
  onShow: function() {
    checkLogin().catch(() => router.redirectTo('login'))
    this.websocket.initWebSocket()
  },
  onHide: function() {
    this.websocket.closeWebSocket()
  },
  getWebSocket() {
    return this.websocket
  }
})
