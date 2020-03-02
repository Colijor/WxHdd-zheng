//app.js
App({
  onLaunch: function () {
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    // 获取手机系统信息
    wx.getSystemInfo({
      success: res => {
        //导航高度
        this.globalData.navHeight = res.statusBarHeight + 46;
      }, fail(err) {
        console.log(err);
      }
    })
  },
  globalData: {
    isSwitchTab: false,//是否是从我的页面跳转过来的
    loadSuccess: false,//是否加载游戏
    src: "",//跳转的游戏页面
    navHeight:"",
    userInfo: null,
    openId: "",
    id: "",
    boxId: "",
    code: "",
    ip: "",
    serverUrl: 'https://h5.hdiandian.com', // 测试地址
    // 用户当前位置经纬度
    latitude: 23.099994,
    longitude: 113.324520,
  }
})