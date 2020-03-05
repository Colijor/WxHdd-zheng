// pages/wd/wdjq/jq/shuru/shuru.js
const app = getApp()
Page({
  /**
   * 页面的初始数据
   */
  data: {
    id:"",
    poster: [],
    current: 0,
    oldPoster: '',
  },
  submitBtn:function(){
    var global_url = app.globalData.serverUrl;
    var id = this.data.id;
    console.log(id);
    wx.request({
      url: global_url + '/wxbackstage/coupon/useCoupon',//兑换代金券
      data: {
        "couponId": id
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
          });
          setTimeout(function () {
            wx.reLaunch({
              url: '../../wdjq',
            });
          }, 1500);
        }else{
          wx.showToast({
            title: res.data.message,
            icon: 'none',
            duration: 2000,
            mask: true
          })
        };
      }
    });
  },
  /**
   * 轮播滑动时，获取当前的轮播id
   */
  swiperChange(e) {
    const that = this;
    that.setData({
      current: e.detail.current,
    });
  },
  //预览图片
  previewImg: function (e) {
    var currentUrl = e.currentTarget.dataset.currenturl
    var previewUrls = e.currentTarget.dataset.previewurl
    wx.previewImage({
      current: currentUrl, //必须是http图片，本地图片无效
      urls: previewUrls, //必须是http图片，本地图片无效
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options);
    this.setData({id: options.id});
    // 获取奖品详情
    this.getPrizeInfo(options.prizeid);
  },
  getPrizeInfo: function(id){
    var global_url = app.globalData.serverUrl;
    var that = this;
    wx.request({
      url: global_url + '/agency/good/get/' + id,
      method: "get",
      header: {
        'content-type': 'application/json' 
      },
      success: function(res){
        console.log(res);
        if(res.data.code == 0){
          var picList = [];
          var picstr = res.data.data.poster;
          picList = picstr?picstr.split(','):['../../../../../images/noPoster.png'];
          console.log(picList);
          that.setData({
            poster: picList,
            oldPoster: picstr
          })
        }
      }
    })
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