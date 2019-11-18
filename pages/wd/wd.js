var app = getApp();
const util = require('../../utils/util.js');
Page({
  data: {
    show: "",//扫码
    userInfo: {
      avatarUrl: "",//用户头像
      nickName: ""//用户昵称
    },
    navH: ""
  },
  wdjqFunc() {
    wx.navigateTo({
      url: 'wdjq/wdjq',
    })
  },
  wdpmFunc() {
    // wx.navigateTo({
    //   url: 'wdpm/wdpm',
    // })
  },
  description() {
    wx.navigateTo({
      url: 'description/description',
    })
  },
  bindmessage: function (e) {
    console.log(e.detail);
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      navH: app.globalData.navHeight
    });
  },
  click: function () {
    var that = this;
    var show;
    wx.scanCode({
      success: (res) => {
        this.show = { "path": "pages/index?query=1", "width": 430 }
        that.setData({
          show: this.show
        })
        wx.showToast({
          title: '成功',
          icon: 'success',
          duration: 2000
        })
      },
      fail: (res) => {
        wx.showToast({
          title: '失败',
          icon: 'none',
          duration: 2000
        })
      },
      complete: (res) => {

      }
    })
  },
  bing: function () {
    wx.request({
      url: '',
      header: {

      },
      success: function (res) {
        console.log(res.data);
      }
    })
  },
  /**
   * 输入游戏码
   */
  bindinput: function (e) {
    this.setData({
      screenCode: e.detail.value
    })
  },

  /**
   * 提交游戏码
   */
  iconTap: function () {
    var that = this;
    var global_url = app.globalData.serverUrl;
    if(this.data.screenCode){
      wx.request({
        url: global_url + '/wxbackstage/first_page/gamePadUrl/get/' + this.data.screenCode,
        data: '',
        header: {
          'content-type': 'application/json' // 默认值
        },
        success(res) {
          if (res.data.code != -1) {
            var src = res.data.data.padUrl + "?boxNumber=" + that.data.screenCode + "&id=" + app.globalData.id;//获得从后台发来的游戏链接
            console.log("从后台发来的游戏链接：");
            console.log(src);
            app.globalData.src = src;
            app.globalData.loadSuccess = true;
            app.globalData.code = res.data.data.gameCode;
            app.globalData.boxId = that.data.screenCode;
            app.globalData.isSwitchTab = true;
            wx.reLaunch({
              url: "../index/index",
            })
          } else {
            that.setData({
              screenCode: ''
            })
            wx.showModal({
              content: res.data.message
            })
          }
        }
      })
    } else {
      wx.showToast({
        title: '请输入屏幕码',
        icon: "none",
        duration: 2000
      })
    }
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    console.log(app.globalData.id);
    console.log("wdonShow");
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    console.log("wdonHide");
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
}) 