// import { $wuxLoading } from 'wux-weapp/index.js'
const { $wuxLoading } = require('wux-weapp/index.js')
function getLoader() {
  const page = getCurrentPages()
  return page[page.length - 1].selectComponent('#loading')
}

export default {
  get store() {
    const store = getApp().store
    return {
      set: (key, value = '') => {
        if (key) {
          store[key] = value
        }
      },
      get: (key) => {
        return store[key]
      }
    }
  },
  get storage() {
    return {
      set: (key, value = '') => {
        if (key) {
          return wx.setStorageSync(key, value)
        }
      },
      get: (key) => {
        return wx.getStorageSync(key)
      }
    }
  },
  loading(text = '加载中...', mask = true) {
    const loader = getLoader()
    if (loader) loader.show(text, mask)
  },
  hideLoading(id = '#wux-loading') {
    const loader = $wuxLoading(id) || getLoader()
    if (loader) loader.hide()
  },
  showLoading (text = '数据加载中...', mask = true, id = '#wux-loading') {
    const wuxLoader = $wuxLoading(id)
    wuxLoader && wuxLoader.show({text, mask})
  }
}