//index.js
//获取应用实例
const app = getApp()
const util = require('../../utils/util.js');
var websocket = require('../../utils/websocket.js');
Page({
  data: {
    boxNumber: '',
    code: '',
    src: '',
    title: '',
    memberId: '',
    loadSuccess: false,
    screenCode: ''
  },
  onLoad: function(options) {
    // websocket.connect(function (res) {
    //   console.log("返回的消息：");
    //   console.log(res);
    // }, function (res){
    //   console.log("发送的消息：hello Websocket");
    //   websocket.send("hello Websocket");
    // });
    var boxNumber = wx.getStorageSync("boxNumber") || '';
    var code = wx.getStorageSync("code") || '';
    var screenCode = wx.getStorageSync("screenCode") || '';
    this.setData({
      boxNumber: boxNumber,
      code: code,
      screenCode: screenCode
    });
    app.globalData.boxId = app.globalData.boxId || this.data.boxNumber;
    app.globalData.code = app.globalData.code || this.data.code;
    console.log("app.globalData.boxId:" + app.globalData.boxId);
    console.log("执行index onLoad");
    if (app.globalData.isSwitchTab) {
      this.setData({
        loadSuccess: app.globalData.loadSuccess,
        src: app.globalData.src
      })
      app.globalData.isSwitchTab = false;
    } else {
      var that = this;
      var global_url = app.globalData.serverUrl;
      var src = '';
      // wx.showToast({
      //   title: '请扫码进入！',
      //   icon: 'none'
      // });
      if (this.data.screenCode != '') {
        this.iconTap();
      }
      else if (this.data.boxNumber) {
        if (this.data.code) {
          this.setData({
            //0：四国坦克，1：雷霆战车，2：坦克争霸战，3：摇色子
            boxNumber: this.data.boxNumber,
            code: this.data.code
          });
          wx.request({
            url: global_url + '/wxbackstage/game/getGamePadUrl/' + this.data.code,
            data: {
              gameCode: this.data.code,
            },
            header: {
              'content-type': 'application/json' // 默认值
            },
            success(res) {
              console.log(res.data);
              src = res.data.data.gamePadUrl + "?boxNumber=" + that.data.boxNumber + "&id=" + app.globalData.id; //获得从后台发来的游戏链接
              // src = "http://192.168.0.91:8080/h5/game_lp.html?boxNumber=138a4689dc5ab14"
              console.log("从后台发来的游戏链接：");
              console.log(src);
              that.setData({
                src: src
              });
              //判断是否加载本地首页
              if (that.data.src == '') {
                console.log("src的值为1：" + that.data.src);
                that.setData({
                  loadSuccess: false
                })
              } else {
                console.log("src的值为2：" + that.data.src);
                that.setData({
                  loadSuccess: true
                })
              }
            }
          });
        } else {
          this.setData({
            boxNumber: scene,
            src: global_url + "/tank/index.html?boxNumber=" + scene + "&id=" + app.globalData.id + "&redirectUrl=/tank/index.html&specialCode=228901"
          })
        }
      };
    }
    console.log("boxNumber:" + this.data.boxNumber + ",code:" + this.data.code + ",src:" + this.data.src);
  },
  getUserInfo: function(e) {

  },
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },
  bindmessage: function(e) {
    this.setData({ //存储状态
      title: e.detail
    })
  },
  // 请求数据
  getData: function() {

  },
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },
  //将数据保存到缓存
  setValue: function(page) {
    //获取缓存的信息
    wx.setStorageSync('');
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {
    console.log(this.data.title)
    this.data.title = memberId
  },
  /**
   * 输入游戏码
   */
  bindinput: function(e) {
    this.setData({
      screenCode: e.detail.value
    })
  },

  /**
   * 提交游戏码
   */
  iconTap: function() {
    var that = this;
    var global_url = app.globalData.serverUrl;
    if (this.data.screenCode){
      wx.request({
        url: global_url + '/wxbackstage/first_page/gamePadUrl/get/' + this.data.screenCode,
        data: '',
        header: {
          'content-type': 'application/json' // 默认值
        },
        success(res) {
          console.log(res);
          if (res.data.code != -1) {
            var src = res.data.data.padUrl + "?boxNumber=" + that.data.screenCode + "&id=" + app.globalData.id; //获得从后台发来的游戏链接
            console.log("从后台发来的游戏链接：");
            console.log(src);
            that.setData({
              src: src,
              loadSuccess: true,
            });
            app.globalData.code = res.data.data.gameCode;
            app.globalData.boxId = that.data.screenCode;
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
    }else{
      wx.showToast({
        title: '请输入屏幕码',
        icon: "none",
        duration: 2000
      })
    }
  }
})