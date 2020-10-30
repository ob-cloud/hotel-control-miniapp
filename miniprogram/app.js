import router from './utils/router'
import { checkLogin, updateManager } from './utils/util'
//app.js
App({
  onLaunch: function () {
    updateManager()
  },
  onShow: function() {
    checkLogin().catch(() => router.redirectTo('login'))
  }
})
