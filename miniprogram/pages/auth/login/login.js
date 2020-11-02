var api = require('../../../config/api.js');
import { postAction, getUserInfo } from '../../../utils/util';
import $ from '../../../utils/tool';
import router from '../../../utils/router';
// var app = getApp();
const md5 = require('md5')
Page({
  data: {
    username: 'cc',
    password: 'Iltwao!1',
    code: '',
    loginErrorCount: 0
  },
  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数
    // 页面渲染完成

  },
  onReady: function () {

  },
  onShow: function () {
    // 页面显示
  },
  onHide: function () {
    // 页面隐藏

  },
  onUnload: function () {
    // 页面关闭

  },
  startLogin: function () {
    var that = this;

    if (that.data.password.length < 1 || that.data.username.length < 1) {
      wx.showModal({
        title: '错误信息',
        content: '请输入用户名和密码',
        showCancel: false
      });
      return false;
    }
    $.showLoading('')
    getUserInfo().then(res => {
      const nickName = res.userInfo.nickName
      const avatarUrl = res.userInfo.avatarUrl
      return { nickName, avatarUrl }
    }).then(({nickName, avatarUrl}) => {
      postAction(api.AuthLogin, {
        username: that.data.username,
        password: md5(that.data.password)
      }).then((res) => {
        $.hideLoading()
        if (res.code === 'OK') {
          that.setData({
            'loginErrorCount': 0
          });
          if (!res.result.userInfo.username) res.result.userInfo.username = nickName
          if (!res.result.userInfo.avatar) res.result.userInfo.avatar = avatarUrl
          $.storage.set('token', res.result.token)
          $.storage.set('userInfo', res.result.userInfo)
          router.switchTab('home')
        }
      })
    })
  },
  bindUsernameInput: function (e) {
    this.setData({
      username: e.detail.value
    });
  },
  bindPasswordInput: function (e) {
    this.setData({
      password: e.detail.value
    });
  },
  bindCodeInput: function (e) {
    this.setData({
      code: e.detail.value
    });
  },
  clearInput: function (e) {
    switch (e.currentTarget.id) {
      case 'clear-username':
        this.setData({
          username: ''
        });
        break;
      case 'clear-password':
        this.setData({
          password: ''
        });
        break;
      case 'clear-code':
        this.setData({
          code: ''
        });
        break;
    }
  }
})