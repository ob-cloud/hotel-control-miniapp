// const api = require('../config/api')

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
        'X-Nideshop-Token': wx.getStorageSync('token')
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

function get(url, data = {}) {
  return request(url, data, 'GET')
}

function post(url, data = {}) {
  return request(url, data, 'POST')
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

function getUserInfo() {
  return new Promise(function (resolve, reject) {
    wx.getUserInfo({
      withCredentials: true,
      success: function (res) {
        if (res.detail.errMsg === 'getUserInfo:ok') {
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
  get,
  post,
  redirect,
  showErrorToast,
  checkSession,
  login,
  getUserInfo,
}