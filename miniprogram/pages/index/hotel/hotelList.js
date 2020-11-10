import $ from '../../../utils/tool'
import router from '../../../utils/router'
const APP = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    hotels: []
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    // wx.getLocation({
    //   type: 'wgs84', //wgs84 返回 gps 坐标，gcj02 返回可用于 wx.openLocation 的坐标
    //   success: (res) => {
    //     this.data.latitude = res.latitude
    //     this.data.longitude = res.longitude
    //     this.fetchShops(res.latitude, res.longitude, '')
    //   },
    //   fail(e){
    //     console.error(e)
    //     AUTH.checkAndAuthorize('scope.userLocation')
    //   }
    // })
    this.fetchHotels() 
  },
  async fetchHotels(latitude, longitude, kw){
    const hotels = [{
      name: '哈哈哈酒店',
      openingHours: '08:00 - 23:00',
      contact: '020-86028198',
      address: '科学城'
    }, {
      name: '快快快酒店',
      openingHours: '08:00 - 23:00',
      contact: '020-86028198',
      address: '科学城'
    }, {
      name: '嗯嗯嗯酒店',
      openingHours: '08:00 - 23:00',
      contact: '020-86028198',
      address: '科学城'
    }, {
      name: '哎哎哎酒店',
      openingHours: '08:00 - 23:00',
      contact: '020-86028198',
      address: '科学城'
    }, {
      name: '不不不酒店',
      openingHours: '08:00 - 23:00',
      contact: '020-86028198',
      address: '科学城'
    }, {
      name: '哈哈哈酒店',
      openingHours: '08:00 - 23:00',
      contact: '020-86028198',
      address: '科学城'
    }]
    this.setData({
      hotels: hotels
    })
    // const res = await WXAPI.fetchShops({
    //   curlatitude: latitude,
    //   curlongitude: longitude,
    //   nameLike: kw
    // })
    // if (res.code == 0) {
    //   res.data.forEach(ele => {
    //     ele.distance = ele.distance.toFixed(3) // 距离保留3位小数
    //   })
    //   this.setData({
    //     shops: res.data
    //   })
    // } else {
    //   this.setData({
    //     shops: null
    //   })
    // }
  },
  searchChange(event){
    this.setData({
      searchValue: event.detail.value
    })
  },
  search(event){
    console.log('search')
    this.setData({
      searchValue: event.detail.value
    })
    this.fetchHotels(this.data.latitude, this.data.longitude, event.detail.value)
  },
  goHotel(e){
    const idx = e.currentTarget.dataset.idx
    $.storage.set('hotelInfo', this.data.hotels[idx])
    // router.toHome()
    router.switchTab('home')
    // wx.setStorageSync('shopInfo', this.data.shops[idx])
    // wx.switchTab({
    //   url: '/pages/index/index'
    // })
  },
  async onPullDownRefresh() {
    await this.fetchHotels()
    wx.stopPullDownRefresh()
  }
})