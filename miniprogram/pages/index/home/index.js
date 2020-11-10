import $ from '../../../utils/tool'
import router from '../../../utils/router'
Page({
  data: {
    hotelName: '',
    userInfo: {},
    menuList: [{
      id: 1,
      type: 1,
      path: "addWirelessEquip",
      icon: "ic_menu_me_pressed.png",
      name: "无线网关"
    }, {
      id: 2,
      type: 2,
      path: "addWireEquip",
      icon: "ic_menu_me_pressed.png",
      name: "有线网关"
    }, {
      id: 3,
      type: 1,
      path: "addWirelessEquip",
      icon: "ic_menu_me_pressed.png",
      name: "无线红外"
    }, {
      id: 4,
      type: 2,
      path: "addWireEquip",
      icon: "ic_menu_me_pressed.png",
      name: "有线红外"
    }]
  },
  goPages: function (e) {
    router.push($.storage.get('token') ? e.currentTarget.dataset.name : 'login', {type: e.currentTarget.dataset.type})
  },
  onShow: function () {
    if ($.storage.get('token')) {
      this.setData({
        userInfo: $.storage.get('userInfo')
      });
    }
    const hotelInfo = $.storage.get('hotelInfo')
    if (hotelInfo) {
      this.setData({
        hotelName: hotelInfo.name
      })
    }
  }
})