const api = require('../../../config/api');
import $ from '../../../utils/tool'
import router from '../../../utils/router'
import { deleteAction } from '../../../utils/util'

Page({
  data: {
    userInfo: {},
  },
  onShow: function() {
    this.setData({
      userInfo: $.storage.get('userInfo'),
    });
  },
  onUserInfoClick: function() {
    !$.storage.get('token') && router.push('login')
  },

  logout: function() {
    wx.showModal({
      title: '',
      confirmColor: '#b4282d',
      content: '退出登录？',
      success: function(res) {
        if (res.confirm) {
          const token = $.storage.get('token')
          $.storage.set('token')
          $.storage.set('userInfo')
          deleteAction(api.AuthLogout, {  headers: {'X-Access-Token': token} }).then(() => {
            router.switchTab('home')
          })
        }
      }
    })

  }
})