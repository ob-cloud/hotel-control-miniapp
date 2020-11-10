export default class websocket {
  constructor({ heartCheck, isReconnect, url }) {
    if (!url) throw new Error('url 不能空!')
    // 是否连接
    this._isLogin = false;
    // 当前网络状态
    this._netWork = true;
    // 是否人为退出
    this._isClosed = false;
    // 心跳检测频率
    this._timeout = 3000;
    this._timeoutObj = null;
    // 当前重连次数
    this._connectCount = 0;
    // 心跳检测和断线重连开关，true为启用，false为关闭
    this._heartCheck = heartCheck;
    this._isReconnect = isReconnect;
    this.url = url
    this._onSocketOpened();
  }
  // 心跳重置
  _reset() {
    clearTimeout(this._timeoutObj);
    return this;
  }
  // 心跳开始
  _start() {
    this._timeoutObj = setInterval(() => {
      // TODO key value
      this.sendWebSocketMessage(JSON.stringify({"key": "value"}))
      .then(() => console.log("发送心跳成功"))
      .catch(() => this._reset())
    }, this._timeout);
  }
  // 监听websocket连接关闭
  onSocketClosed(options) {
    wx.onSocketClose(err => {
      console.log('当前websocket连接已关闭,错误信息为:' + JSON.stringify(err));
      // 停止心跳连接
      if (this._heartCheck) this._reset();
      // 关闭已登录开关
      this._isLogin = false;
      // 检测是否是用户自己退出小程序, 进行重连
      if (!this._isClosed && this._isReconnect) {
        this._reConnect(options)
      }
    })
  }
  // 检测网络变化
  onNetworkChange(options) {
    wx.onNetworkStatusChange(res => {
      console.log('当前网络状态:' + res.isConnected);
      if (!this._netWork) {
        this._isLogin = false;
        // 进行重连
        if (this._isReconnect) {
          this._reConnect(options)
        }
      }
    })
  }
  _onSocketOpened() {
    wx.onSocketOpen(() => {
      console.log('websocket已打开');
      // 打开已登录开关
      this._isLogin = true;
      // 发送心跳
      if (this._heartCheck) {
        this._reset()._start();
      }
      // TODO 发送登录信息 key value
      this.sendWebSocketMessage(JSON.stringify({"key": "value"}))
      // 打开网络开关
      this._netWork = true;
    })
  }
  // 接收服务器返回的消息
  onReceivedMessage() {
    return new Promise(resolve => {
      wx.onSocketMessage(resolve)
    })
  }
  // 建立websocket连接
  initWebSocket() {
    let _this = this;
    return new Promise((resolve, reject) => {
      if (this._isLogin) {
        console.log("您已经登录了");
        resolve()
      } else {
        // 检查网络
        wx.getNetworkType({
          success(result) {
            if (result.networkType != 'none') {
              // 开始建立连接
              wx.connectSocket({
                url: _this.url,
                success: resolve,
                fail: reject
              })
            } else {
              console.log('网络已断开');
              _this._netWork = false;
              // 网络断开后显示model
              wx.showModal({
                title: '网络错误',
                content: '请重新打开网络',
                showCancel: false,
                success: function (res) {
                  if (res.confirm) {
                    console.log('用户点击确定')
                  }
                }
              })
            }
          }
        })
      }
    })
  }
  sendWebSocketMessage(data) {
    return new Promise((resolve, reject) => {
      wx.sendSocketMessage({
        data: data,
        success: resolve,
        fail: reject
      })
    })
  }
  // 重连方法，会根据时间频率越来越慢
  _reConnect() {
    const timeout = this._connectCount < 20 ? 3000 : this._connectCount < 50 ? 10000 : 450000
    setTimeout(() => {
      this.initWebSocket()
    }, timeout)
    this._connectCount += 1
  }
  // 关闭websocket连接
  closeWebSocket(){
    wx.closeSocket();
    this._isClosed = true;
  }
}