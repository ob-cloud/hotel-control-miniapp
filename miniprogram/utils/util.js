// const api = require('../config/api')
import $ from './tool'
function dateFormat(fmt = 'YYYY-mm-dd HH:MM:SS', date = new Date()) {
  let ret
  const opt = {
    'Y+': date.getFullYear().toString(), // 年
    'm+': (date.getMonth() + 1).toString(), // 月
    'd+': date.getDate().toString(), // 日
    'H+': date.getHours().toString(), // 时
    'M+': date.getMinutes().toString(), // 分
    'S+': date.getSeconds().toString() // 秒
  }
  for (const k in opt) {
    ret = new RegExp('(' + k + ')').exec(fmt)
    if (ret) {
      fmt = fmt.replace(ret[1], (ret[1].length === 1) ? (opt[k]) : (opt[k].padStart(ret[1].length, '0')))
    }
  }
  return fmt
}

function request(url, data = {}, method = "GET") {
  return new Promise(function (resolve, reject) {
    wx.request({
      url: url,
      data: data,
      method: method,
      header: {
        'Content-Type': 'application/json',
        'X-Nideshop-Token': $.storage.get('token')
      },
      success: function (res) {
        console.log("success");

        if (res.statusCode == 200) {
          resolve(res.data);
          // if (res.data.errno == 401) {
          //   //需要登录后才可以操作

          //   let code = null;
          //   return login().then((res) => {
          //     code = res.code;
          //     return getUserInfo();
          //   }).then((userInfo) => {
          //     //登录远程服务器
          //     // request(api.AuthLogin, { code: code, userInfo: userInfo }, 'POST').then(res => {
          //     //   if (res.errno === 0) {
          //     //     //存储用户信息
          //     //     wx.setStorageSync('userInfo', res.data.userInfo);
          //     //     wx.setStorageSync('token', res.data.token);

          //     //     resolve(res);
          //     //   } else {
          //     //     reject(res);
          //     //   }
          //     // }).catch((err) => {
          //     //   reject(err);
          //     // });
          //   }).catch((err) => {
          //     reject(err);
          //   })
          // } else {
          //   resolve(res.data);
          // }
        } else {
          reject(res.errMsg);
        }

      },
      fail: function (err) {
        reject(err)
        console.log("failed")
      }
    })
  });
}

function getAction(url, data = {}) {
  return request(url, data, 'GET')
}

function postAction(url, data = {}) {
  return request(url, data, 'POST')
}
function putAction(url, data = {}) {
  return request(url, data, 'PUT')
}

function deleteAction(url, data = {}) {
  return request(url, data, 'DELETE')
}

function login() {
  return new Promise(function (resolve, reject) {
    wx.login({
      success: function (res) {
        if (res.code) {
          resolve(res.code);
        } else {
          reject(res);
        }
      },
      fail: function (err) {
        reject(err);
      }
    });
  });
}

/**
 * 检查微信会话是否过期
 */
function checkSession() {
  return new Promise(function (resolve, reject) {
    wx.checkSession({
      success: function () {
        resolve(true);
      },
      fail: function () {
        reject(false);
      }
    })
  });
}

function checkLogin() {
  return new Promise(function(resolve, reject) {
    if ($.storage.get('token')) {
      checkSession().then(() => {
        resolve(true);
      }).catch(() => {
        reject(false);
      });
    } else {
      reject(false);
    }
  });
}

function getUserInfo() {
  return new Promise(function (resolve, reject) {
    wx.getUserInfo({
      withCredentials: true,
      success: function (res) {
        if (res.errMsg === 'getUserInfo:ok') {
          resolve(res);
        } else {
          reject(res)
        }
      },
      fail: function (err) {
        reject(err);
      }
    })
  });
}

function updateManager() {
  const updateManager = wx.getUpdateManager()
  wx.getUpdateManager().onUpdateReady(function() {
    wx.showModal({
      title: '更新提示',
      content: '新版本已经准备好，是否重启应用',
      success: function(res) {
        if (res.confirm) updateManager.applyUpdate()
      }
    })
  })
}

function getSystemInfo() {
  return new Promise(function (resolve, reject) {
    wx.getSystemInfo({
      success: function (res) {
        resolve(res);
      },
      fail: function (err) {
        reject(err);
      }
    })
  });
}

function redirect(url) {
  //判断页面是否需要登录
  if (!wx.getStorageSync('token')) {
    wx.redirectTo({
      url: '/pages/auth/login/login'
    });
    return false;
  } else {
    wx.redirectTo({
      url: url
    });
  }
}

function showErrorToast(msg) {
  wx.showToast({
    title: msg,
    image: '/static/images/icon_error.png'
  })
}

module.exports = {
  dateFormat,
  request,
  getAction,
  postAction,
  putAction,
  deleteAction,
  redirect,
  showErrorToast,
  checkSession,
  checkLogin,
  login,
  getUserInfo,
  updateManager,
  getSystemInfo
}