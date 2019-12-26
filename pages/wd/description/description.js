// pages/wd/description/description.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    className: "copy-btn copy-btn-up",
    content: "一键复制"
  },

  copy: function (e) {
    var that = this;
    wx.setClipboardData({
      data: "http://ttk.gzvip66.cn/api/index/login?pid=11826",
      success: function (res) {
        that.setData({
          className: "copy-btn copy-btn-down",
          content: "复制成功，请粘贴到浏览器打开领取"
        });
        setTimeout(function(){
          that.setData({
            className: "copy-btn copy-btn-up",
            content: "一键复制"
          });
        },3000)
      }
    });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // var pid = "11826";
    // var url = encodeURI("http://ttk.gzvip66.cn/api/index/login?pid=11826");
    // console.log(url);
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