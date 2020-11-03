const ApiRootUrl = 'https://aliiot.on-bright.com/control/';
const WifiRootUrl = 'http://aliiot.on-bright.com/control/wifi/'
const SocketRootUrl = 'wss://aliiot.on-bright.com/control/socket'
module.exports = {
  ApiRootUrl,
  WifiRootUrl,
  SocketRootUrl,
  AuthLogin: ApiRootUrl + 'auth/login', // 登录
  AuthLogout: ApiRootUrl + 'auth/logout', // 登出
  ConnectWifi: WifiRootUrl + ''
}