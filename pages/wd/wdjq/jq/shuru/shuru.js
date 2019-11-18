// pages/wd/wdjq/jq/shuru/shuru.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // input:""
    couponId:"",
    phoneNum:"",
    worth:"",
    name:"",
    // description:""
  },
  getPhone: function (e) {
    var phone = e.detail.value;
    if (!(/^1[34578]\d{9}$/.test(phone))) {
      this.setData({ajxtrue: false});
      if (phone.length >=11) {
        wx.showToast({
          title: '手机号有误',
          icon: 'none',
          duration: 2000
        })
      };
    } else {
      console.log(this.data.phoneNum)
      this.setData({phoneNum:phone});
    }  
  },
  submitBtn:function(){
    var global_url = app.globalData.serverUrl;
    console.log(global_url);
    var businessAccount = this.data.phoneNum;
    console.log(businessAccount);
    var couponId = this.data.couponId;
    if (businessAccount==""){
      wx.showModal({
        title: '温馨提示',
        content: '手机号码输入有误',
        success: function (res) {
          if (res.confirm) {
            console.log('用户点击确定')
          } else {
            console.log('用户点击取消')
          }
        }
      });
    }else{
      wx.request({
        url: global_url + '/xcx_backstage/business/validBusinessAccount/' + businessAccount,//点击发送后台检查是否绑定
        data: {
          "couponId": couponId,
          "businessAccount": businessAccount
        },
        header: {
          'content-type': 'application/json' 
        },
        method: "get",
        success: function (res) {
          console.log(res.data);
          if(res.data.code==0){
            wx.request({
              url: global_url + '/wxbackstage/coupon/useCoupon',//兑换代金券
              data: {
                "couponId": couponId,
                "businessAccount": businessAccount
              },
              header: {
                'content-type': 'application/json' 
              },
              method: "post",
              success: function (res) {
                console.log("兑换代金券");
                console.log(res);
                if (res.data.code == 0) {
                  wx.showToast({
                    title: '兑换成功',
                    icon: 'succes',
                    duration: 2000,
                    mask: true
                  })
                }else{
                  wx.showToast({
                    title: res.data.message,
                    icon: 'none',
                    duration: 2000,
                    mask: true
                  })
                };
                setTimeout(function () {
                  wx.reLaunch({
                    url: '../../wdjq',
                  });
                }, 1500)
              }
            });
          }else{
            wx.showToast({
              title: res.data.message,
              icon: 'none',
              duration: 2000,
              mask: true
            })
          }
        }
      });
    };
   
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let _this = this
    console.log(options.id);
    _this.setData({
      couponId: options.id,
      worth: options.worth,
      name: options.name,
      // description: options.description
    });
    console.log("couponId")
    console.log(_this.data.couponId);
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

  }
})