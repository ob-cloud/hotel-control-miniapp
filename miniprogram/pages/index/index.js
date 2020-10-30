import $ from '../../utils/tool'
import router from '../../utils/router'
Page({
  data: {
    userInfo: {},
    menuList: [{
      path: "home",
      icon: "ic_menu_me_pressed.png",
      name: "无线网关"
    }, {
      path: "home",
      icon: "ic_menu_me_pressed.png",
      name: "有线网关"
    }, {
      path: "home",
      icon: "ic_menu_me_pressed.png",
      name: "无线红外"
    }, {
      path: "home",
      icon: "ic_menu_me_pressed.png",
      name: "有线红外"
    }]
  },
  goPages: function (e) {
    router.push($.storage.get('token') ? e.currentTarget.dataset.name : 'login')
  },
  onShow: function () {
    if ($.storage.get('token')) {
      this.setData({
        userInfo: $.storage.get('userInfo')
      });
    }
  }
})