const util = require('../../../utils/util.js');
const app = getApp();

// pages/index/zhifu/zhifu.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userId:"",
    sections: "",
    navH:"",
    userInfo: app.globalData.userInfo,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    isExit:"false",
    info:true,
    countdown:"一段时间",
    page1:true,
    page2:false,
    page3:false,
    page4: false,
    page5:false,
    pageEnd:false,
    surveyIsShow:"",
    message: "不习惯这种操作方式,太难,赞",
  },
  wxpay: function (event) {
    var isExit=this.data.isExit;
    console.log("isExit:" + isExit);
    if(isExit==true){
      wx.showModal({
        title: '提示',
        content: '您已退出游戏，请重新扫码进入',
        success: function (res) {
          if (res.confirm) {
            console.log('用户点击确定')
          } else {
            console.log('用户点击取消')
          }
        }
      });
    }else{
      var global_url = app.globalData.serverUrl;
      var code = app.globalData.code;
      var memberId = app.globalData.id;
      var boxId = app.globalData.boxId;
      var openId = app.globalData.openId;
      var totalFee = event.currentTarget.dataset.money;
      var nickName = this.data.userInfo.nickName;

      if (memberId != undefined && boxId != undefined) {
        wx.request({
          url: global_url + '/wxbackstage/wechat/createOrder', //这里填写后台给的请求支付的地址
          data: {
            "memberId": memberId,
            "boxId": boxId, //暂时为空
            "gameCode": code,
            "openId": openId,
            "totalFee": totalFee, //数字类型 不能为字符串  金额
            "body": "红点点互动充值",
            "nickName": nickName
          },
          header: {
            'content-type': 'application/json' // 默认值
          },
          method: "POST",
          success: function (res) {
            console.log(res);
              var data = res.data.data;
              wx.requestPayment({
                'timeStamp': data.timeStamp,
                'nonceStr': data.nonceStr,
                'package': 'prepay_id=' + data.prepareId,
                'signType': 'MD5',
                'paySign': data.paySign,
                'success': function (res) {
                  console.log("支付成功");
                  var url = '../../index/index';
                  wx.switchTab({
                    url: url,
                    success: function (e) {
                      console.log("跳转成功", e);
                      var page = getCurrentPages().pop();
                      if (page == undefined || page == null) return;
                      page.onShow();
                    }
                  })
                },
                'fail': function (res) {
                  console.log("支付失败");
                  return;
                }
              })
          }
        })
      } else {
        if (memberId == undefined) {
          wx.showToast({
            title: 'memberId为undefined',
            icon: 'none',
            duration: 1500,
            mask: true
          })
        };
        if (boxId == "") {
          setTimeout(function () {
            wx.showToast({
              title: 'boxId为空',
              icon: 'none',
              duration: 1500,
              mask: true
            })
          }, 1000)
        };
      };
    }
   
  },
  description() {
    wx.navigateTo({
      url: '../../wd/description/description',
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (o) {
    this.setData({
      navH: app.globalData.navHeight
    });
    //显示倒计时
    var that = this;
    var countdown = 30;
    var during = countdown * 1000;
    console.log(during);
    setTimeout(function () {
      console.log("计时结束");
      clearInterval(t);
      that.setData({ isExit: true, info: false });

    }, during);

    var t = setInterval(function () {
      countdown--;
      console.log(countdown)
      that.setData({ countdown: countdown + "秒" });
    }, 1000); 
    
    //获取用户信息
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo
      })
    } else if (this.data.canIUse) {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo
          })
        }
      })
    };
  },
  back: function () {
    // wx.navigateBack();
    wx.switchTab({
      url: '../../index/index'
    });
  },
  toWdjq:function(){
    wx.redirectTo({
      url: '../../wd/wdjq/wdjq'
    }); 
  },
  handle: function () {
    wx.switchTab({
      url: '../../index/index'
    });
  },
  my: function () {
    wx.switchTab({
      url: '../../wd/wd'
    });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    var that=this;
    var global_url=app.globalData.serverUrl;
    var global_code = app.globalData.code;
    console.log(global_code);
    var boxId = app.globalData.boxId;
    console.log(boxId);
    // var global_code = 2;
    wx.request({
      url: global_url + '/wxbackstage/payItem/get/',
      data: {
        "boxId": boxId, 
        "gameCode": global_code
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      method: "get",
      success: function (res) {
        that.setData({sections:res.data.data});
        console.log(res.data)
      }
    });

    //用户体验调查是否显示
    // wx.request({
    //   url: global_url + '/wxbackstage/feedback/canFeedBack',
    //   data: {
    //     "memberId": memberId,
    //     "gameCode": global_code
    //   },
    //   header: {
    //     'content-type': 'application/json' // 默认值
    //   },
    //   method: "get",
    //   success: function (res) {
    //     console.log("是否展示问卷调查："+res.data.code);
    //     if (res.data.code==0){
    //       that.setData({ surveyIsShow: true });
    //     };
    //     if (res.data.code == -1) {
    //       that.setData({ surveyIsShow: false });
    //     }
    //   }
    // });
    },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    
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

  },
  gameIsFun:function(){   //游戏好玩
    var global_url = app.globalData.serverUrl;
    var global_code = app.globalData.code;
    var memberId = app.globalData.id;
    var boxId = app.globalData.boxId;
    wx.request({
      url: global_url + '/wxbackstage/feedback/post',
      data: {
        "memberId": memberId,
        "gameCode": global_code,
        "feedBackCode":0,
        "boxId": boxId
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      method: "post",
      success: function (res) {
        console.log(res);
      }
    });

    var that = this;
    this.setData({ page1: false, page2: false, page3: false, page4: false, page5: false, pageEnd: true });
    setInterval(function () {
      that.setData({ surveyIsShow: false });
    }, 2000);
  },
  gameIsNotFun:function(){ //游戏不好玩
    // var global_url = app.globalData.serverUrl;
    // var global_code = app.globalData.code;
    // var memberId = app.globalData.memberId;
    // var boxId = app.globalData.boxId;
    // var that = this;
    // wx.request({
    //   url: global_url + '/wxbackstage/feedback/post',
    //   data: {
    //     "memberId": memberId,
    //     "gameCode": global_code,
    //     "feedBackCode": 1,
    //     "boxId": boxId
    //   },
    //   header: {
    //     'content-type': 'application/json' // 默认值
    //   },
    //   method: "post",
    //   success: function (res) {
    //     console.log(res);
    //     var feedbackIdBox = res.data.data;
    //     console.log(feedbackIdBox);
    //     if (feedbackIdBox){
    //       var feedbackId = res.data.data.id;
    //       console.log(feedbackId);
    //       that.setData({ feedbackId: feedbackId })
    //     }else{
    //       console.log("后台传过来的id为：" + feedbackIdBox);
    //     }
    //   }
    // });

    this.setData({ page1: false, page2: true, page3: false, page4: false, page5: false, pageEnd: false});
  },
  nextTo3:function(e){   //不好玩原因一
    var eData = e.currentTarget.dataset.message;
    var msg = eData;
    console.log(msg);
    this.setData({message:msg});
    
    this.setData({ page1: false, page2: false, page3: true, page4: false, page5: false, pageEnd: false});
  }, 
  nextTo4:function(e){  //不好玩原因二
    var eData = e.currentTarget.dataset.message;
    var beforeMsg=this.data.message;
    var msg = beforeMsg + "," + eData;
    console.log(msg);
    this.setData({ message: msg });
    this.setData({ page1: false, page2: false, page3: false, page4: true, page5: false, pageEnd: false});
  },
  nextTo5: function (e) {  //不好玩原因三
    var eData = e.currentTarget.dataset.message;
    var beforeMsg = this.data.message;
    var msg = beforeMsg + "," + eData;
    console.log(msg);
    this.setData({ message: msg });
    this.setData({ page1: false, page2: false, page3: false, page4: false, page5: true, pageEnd: false });
    
  },
  nextToEnd:function(){
    var global_url = app.globalData.serverUrl;
    var global_code = app.globalData.code;
    var memberId = app.globalData.id;
    var boxId = app.globalData.boxId;
    var message = this.data.message;
    var that = this;
    var feedbackId;
    //游戏不好玩提交
    wx.request({
      url: global_url + '/wxbackstage/feedback/post',
      data: {
        "memberId": memberId,
        "gameCode": global_code,
        "feedBackCode": 1,
        "boxId": boxId
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      method: "post",
      success: function (res) {
        console.log(res);
        var feedbackIdBox = res.data.data;
        console.log(feedbackIdBox);
        if (feedbackIdBox) {
          feedbackId = res.data.data.id;
          console.log(feedbackId);
          //问卷详情提交
          wx.request({
            url: global_url + '/wxbackstage/feedback/detail/post',
            data: {
              "feedbackId": feedbackId,
              "message": message
            },
            header: {
              'content-type': 'application/json' // 默认值
            },
            method: "post",
            success: function (res) {
              console.log(res);
              console.log(message);
            }
          });
        } else {
          console.log("后台传过来的id为：" + feedbackIdBox);
        }
      }
    });

    
    this.setData({ page1: false, page2: false, page3: false, page4: false, page5: false, pageEnd: true });
    setInterval(function () {
      that.setData({ surveyIsShow: false });
    }, 2000);
  }
});
