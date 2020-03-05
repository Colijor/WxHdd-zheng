// pages/wd/busIntroduce/busIntroduce.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    current: 0,
    busInfo:{
    },
    picture: [],
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var businessId = options.id;
    console.log("businessId: " + businessId);
    this.getBusInformation(options.id);
  },
  getBusInformation: function(id){
    var that = this;
    wx.request({
      url: app.globalData.serverUrl+'/agency/business/get/information',
      method: "get",
      data: {
        "businessId":id
      },
      header: {
        "Content-Type": "application/json"
      },
      success: function(res){
        console.log(res.data);
        if(res.data.code == 0){
          if(res.data.data.picture){
            var pic = [];
            var str = res.data.data.picture;
            pic = str.split(',');
            console.log(pic);
            that.setData({ 
              picture:pic
            })
          }
          that.setData({
            busInfo: res.data.data
          });
        }
      }
    })
  },
  navigate: function() {
    var busInfo = this.data.busInfo;
    var address = busInfo.city + busInfo.area + busInfo.address;
    ////使用微信内置地图查看标记点位置，并进行导航
    wx.openLocation({
      scale: 28, // 缩放比例
      name: address,
      address: "目的地",
      latitude: app.globalData.latitude,//要去的纬度-地址
      longitude: app.globalData.longitude,//要去的经度-地址
    })
  },
  getPhoneNum: function (e) {
    var fixedPhone = this.data.busInfo.fixedPhone;
    console.log(fixedPhone);
    wx.showActionSheet({
      itemList: ['客服电话：' + fixedPhone],
      success: function (res) {
        wx.makePhoneCall({
          phoneNumber: fixedPhone,
        })
      }
    })
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