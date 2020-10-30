var util = require('../../utils/util.js');
var api = require('../../config/api.js');
import { getSystemInfo } from '../../utils/util'
var app = getApp()
Page({
    data: {
        // text:"这是一个页面"
        topicList: [],
        gatewayList: [{
            oboxName: 'Obc3eac9eca',
            oboxSerialId: '962a9b4da5f85566cd88',
            thumb: '/static/images/gateway.png'
        }, {
            oboxName: 'Obc3eac9eca',
            oboxSerialId: '962a9b4da5f85566cd88',
            thumb: '/static/images/gateway.png'
        }, {
            oboxName: 'Obc3eac9eca',
            oboxSerialId: '962a9b4da5f85566cd88',
            thumb: '/static/images/gateway.png'
        }, {
            oboxName: 'Obc3eac9eca',
            oboxSerialId: '962a9b4da5f85566cd88',
            thumb: '/static/images/gateway.png'
        }, {
            oboxName: 'Obc3eac9eca',
            oboxSerialId: '962a9b4da5f85566cd88',
            thumb: '/static/images/gateway.png'
        }, {
            oboxName: 'Obc3eac9eca',
            oboxSerialId: '962a9b4da5f85566cd88',
            thumb: '/static/images/gateway.png'
        }],
        scrollHeight: 0,
        page: 1,
        size: 10,
        count: 0,
        scrollTop: 0,
        showPage: false
    },
    onLoad: function (options) {
        // 页面初始化 options为页面跳转所带来的参数
        // this.getTopic();
        const that = this
        getSystemInfo().then(res => {
            that.setData({
                scrollHeight: res.windowHeight - 125
            })
        })
    },
    onReady: function () {
        // 页面渲染完成
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
    onChange: function(e) {
        wx.showToast({
            title: `切换到标签 ${event.detail.name}`,
            icon: 'none',
        });
    },
    nextPage: function (event) {
      console.log();
        var that = this;
        if (this.data.page+1 > that.data.count / that.data.size) {
            return true;
        }

        
        that.setData({
            "page": parseInt(that.data.page) + 1
        });

        this.getTopic();
        
    },
    getTopic: function(){
       
        let that = this;
         that.setData({
            scrollTop: 0,
            showPage: false,
            topicList: []
        });
        // 页面渲染完成
        wx.showToast({
            title: '加载中...',
            icon: 'loading',
            duration: 2000
        });

        util.request(api.TopicList, { page: that.data.page, size: that.data.size }).then(function (res) {
          if (res.errno === 0) {

            that.setData({
              scrollTop: 0,
              topicList: res.data.data,
              showPage: true,
              count: res.data.count
            });
          }
          wx.hideToast();
        });
        
    },
    prevPage: function (event) {
        if (this.data.page <= 1) {
            return false;
        }

        var that = this;
        that.setData({
            "page": parseInt(that.data.page) - 1
        });
        this.getTopic();
    }
})