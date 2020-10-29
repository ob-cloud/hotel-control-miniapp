//app.js
App({
  onLaunch: function () {
    
    const token = wx.getStorageSync('token')
    if (!token) wx.redirectTo({
      url: '/pages/auth/login/login',
    })
  }
})
