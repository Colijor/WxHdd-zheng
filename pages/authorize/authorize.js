//获取应用实例
const app = getApp()
const util = require('../../utils/util.js');

Page({
  data: {
    //判断小程序的API，回调，参数，组件等是否在当前版本可用。
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    isHide: false
  },
  onLoad: function (options) {
    var that = this;
    // 获取公众号跳小程序传递的参数screenCode
    console.log("screenCode: " + options.screenCode);
    if (options.screenCode != 0) {
      var screenCode = options.screenCode;
      wx.setStorageSync("screenCode", screenCode);
    }
    // 扫码获取boxNumber和code
    console.log("lalala" + options.scene);
    if (options.scene != 0) {
      var scene = options.scene;
    }
    if (scene) {
      scene = decodeURIComponent(scene);
      console.log(scene);
      if (scene.indexOf(",") != -1) {
        console.log("scene.indexOf");
        var params = scene.split(",");
        if (params && params.length > 1) {
          wx.setStorageSync("boxNumber", params[0]);
          wx.setStorageSync("code", params[1]);
        }
      } else {
        wx.setStorageSync("boxNumber", scene);
      }
    }
    console.log("aaaaaaaaa");
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          wx.getUserInfo({
            success: res => {
              console.log(res);
              app.globalData.userInfo = res.userInfo;
              wx.login({
                success: res => {
                  console.log(res.code);
                  // 获取到用户的 code 之后：res.code
                  // 可以传给后台，再经过解析获取用户的 openid
                  wx.request({
                    url: app.globalData.serverUrl + '/wxbackstage/wechat/getOpenId',
                    data: {
                      code: res.code
                    },
                    header: {
                      "Content-Type": "application/json"
                    },
                    success: res => {
                      app.globalData.openId = res.data.data.openId;
                      console.log(res);
                      this.getUserId();
                    }
                  });
                }
              });
            }
          })
        } else {
          // 用户没有授权
          // 改变 isHide 的值，显示授权页面
          that.setData({
            isHide: true
          });
          console.log("没有授权")
        }
      }
    });
  },
  onShow: function() {
  },
  bindGetUserInfo: function (e) {
    if (e.detail.userInfo) {
      //用户按了允许授权按钮
      var that = this;
      console.log("用户的信息如下：");
      console.log(e.detail.userInfo);
      app.globalData.userInfo = e.detail.userInfo;
      //授权成功后,通过改变 isHide 的值，让实现页面显示出来，把授权页面隐藏起来
      that.setData({
        isHide: false
      });
      if (app.globalData.userInfo) {
        wx.login({
          success: res => {
            // 获取到用户的 code 之后：res.code
            // 可以传给后台，再经过解析获取用户的 openid
            wx.request({
              url: app.globalData.serverUrl + '/wxbackstage/wechat/getOpenId',
              data: {
                code: res.code
              },
              header: {
                "Content-Type": "application/json"
              },
              success: res => {
                app.globalData.openId = res.data.data.openId;
                console.log(res.data.data.openId);
                this.getUserId();
              }
            });
          }
        });
      }
    } else {
      //用户按了拒绝按钮
      wx.showModal({
        title: '警告',
        content: '您点击了拒绝授权，将无法进入小程序，请授权之后再进入!!!',
        showCancel: false,
        confirmText: '返回授权',
        success: function (res) {
          // 用户没有授权成功，不需要改变 isHide 的值
          if (res.confirm) {
            console.log('用户点击了“返回授权”');
          }
        }
      });
    }
  },
  getUserId: function(e){
    if(app.globalData.openId != ""){
      wx.request({
        url: app.globalData.serverUrl + '/wxbackstage/wechat/member/login',
        method: "post",
        data: {
          "openId": app.globalData.openId,
          "avatarUrl": app.globalData.userInfo.avatarUrl,
          "name": app.globalData.userInfo.nickName,
          "gender": app.globalData.userInfo.gender,
          "country": app.globalData.userInfo.country,
          "province": app.globalData.userInfo.province,
          "city": app.globalData.userInfo.city
        },
        header: {
          'content-type': 'application/json'
        },
        success: function (res) {
          console.log(res);
          app.globalData.id = res.data.data.id;
          console.log("获取用户appid:" + app.globalData.id);
          //app.globalData.id = 25;
          //用户已经授权过
          wx.switchTab({
            url: '/pages/index/index'
          })
        }
      });
    }else{
      console.log("openId为空");
    }
  }
})
