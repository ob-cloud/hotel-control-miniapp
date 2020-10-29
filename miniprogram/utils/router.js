const pages = {
  home: '/pages/index/index',
  login: '/pages/auth/login/login',
  register: '/pages/auth/register/register',
  reset: '/pages/auth/reset/reset',
  device: '/pages/topic/topic',
  ucenter: '/ages/ucenter/index/index'
}

function to(page, data) {
  if (!pages[page]) throw new Error(`${page} is not exist!`)
  const _result = []
  for (const key in data) {
    const value = data[key];
    if (!value) continue
    if (value.constructor === Array) {
      value.forEach(_value => {
        _result.push(encodeURIComponent(key) + '[]=' + encodeURIComponent(_value))
      })
    } else {
      _result.push(encodeURIComponent(key) + '=' + encodeURIComponent(value))
    }
  }
  const url = pages[page] + (_result.length ? `?${_result.join('&')}` : '')
  return url
}

class Router {
  push(page, param = {}, events = {}, callback = () => {}) {
    wx.navigateTo({
      url: to(page, param),
      events,
      success: callback
    })
  }
  pop(delta) {
    wx.navigateBack({ delta })
  }
  redirectTo(page, param) {
    wx.redirectTo({
      url: to(page, param),
    })
  }
  switchTab(page, param) {
    wx.switchTab({
      url: to(page, param),
    })
  }
  reLaunch() {
    wx.reLaunch({
      url: pages.home,
    })
  }
  toHome() {
    getCurrentPages().length > 1 ? this.pop() : this.reLaunch()
  }
}

export default new Router()