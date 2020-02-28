// pages/wd/prizePoster/prizePoster.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    swiperImgUrls: [
      '../../../images/s1.jpg',
      '../../../images/s2.jpg',
      '../../../images/s3.jpg'
    ],
    swiperIndex: 0
  },
  /**
   * 轮播滑动时，获取当前的轮播id
   */
  swiperChange(e) {
    const that = this;
    that.setData({
      swiperIndex: e.detail.current,
    });
    console.log(e.detail.current);
  },
  usePic: function () {
    console.log(this.data.swiperIndex);
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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