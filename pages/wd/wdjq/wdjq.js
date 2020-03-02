const util = require('../../../utils/util.js');
const app = getApp();
var ss = require('../../../utils/util.js');
var network = require('../../../utils/network.js')
// pages/wd/wdjq/wdjq.js
Page({
  data: {
    code: '',
    bbb: '',
    selected: true,
    selected1: false,
    selected2: false,
    uhide:0,
    current: 1,
    size: 10,
    hasMoreData: true,
    contentlist: [],
    //used0:未使用,1:已使用,2:已过期
    used: 0,
  },
  // 导航
  navigate: function (e) {
    var address = e.currentTarget.dataset.addr;
    ////使用微信内置地图查看标记点位置，并进行导航
    wx.openLocation({
      scale: 28, // 缩放比例
      name: address,
      address: "目的地",
      latitude: app.globalData.latitude,//要去的纬度-地址
      longitude: app.globalData.longitude,//要去的经度-地址
    })
  },
  selected: function (e) {
    var that = this;
    this.setData({
      selected: true,
      selected1: false,
      selected2: false,
      used: 0
    });
    this.getCouponsInfo('正在加载数据...');
  },
  selected1: function (e) {
    var that = this;
    this.setData({
      selected: false,
      selected1: true,
      selected2: false,
      used: 1
    });
    this.getCouponsInfo('正在加载数据...');
  },
  selected2: function (e) {
    this.setData({
      selected: false,
      selected1: false,
      selected2: true,
      used: 0
    });
    this.getCouponsInfo('正在加载数据...');
  },
  showMask1: function (e) {
    console.log(e);
    var that = this;
    var worth = e.currentTarget.dataset.worth;
    var name = e.currentTarget.dataset.name;
    var description = e.currentTarget.dataset.description;
    var id = e.currentTarget.dataset.id;
    var createTime = e.currentTarget.dataset.time;
    var usedTime = new Date(createTime).getTime();
    var clickTime = (new Date()).getTime();
    var couponId = e.currentTarget.dataset.couponid;
    var indx = e.currentTarget.dataset.indx;
    if (name == undefined) {
      name = "恭喜获得抵扣代金券";
    };

    if (clickTime >= usedTime) {
      wx.navigateTo({
        url: 'jq/shuru/shuru?id=' + id + "&worth=" + worth + "&name=" + name + "&description=" + description,
      });
    } else {
      wx.showToast({
        title: '此券还不能使用',
        icon: 'none',
        duration: 2000,
        mask: true
      })
    }

  },
  //立即使用
  showMask2: function(e) {
    console.log(e);
    var that = this;
    var worth = e.currentTarget.dataset.worth;
    var name = e.currentTarget.dataset.name;
    var description = e.currentTarget.dataset.description;
    var createTime = e.currentTarget.dataset.time;
    var usedTime = new Date(createTime).getTime();
    var clickTime=(new Date()).getTime();
    console.log(new Date(createTime).getTime());
    console.log(clickTime);
    var id = e.currentTarget.dataset.id;
    var couponId = e.currentTarget.dataset.couponid;
    // var scenecode = e.currentTarget.dataset.scenecode;
    var used = e.currentTarget.dataset.used;
    if(name==undefined){
      name ="恭喜获得抵扣代金券";
    };

    if (clickTime >= usedTime){
      wx.navigateTo({
        url: 'jq/shuru/shuru?id=' + id + "&worth=" + worth + "&name=" + name + "&description=" + description,
      });
    }else{
      wx.showToast({
        title: '此券还不能使用',
        icon: 'none',
        duration: 2000,
        mask: true
      })
    }
   
  },
  //点击提示
  toggleBtn:function(event){
    var that = this;
    var toggleBtnVal = that.data.uhide;
    var itemId = event.currentTarget.id; 
    if (toggleBtnVal == itemId) {
      that.setData({
        uhide: 0
      })
    } else {
      that.setData({
        uhide: itemId
      })
    }
    
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function () {
    console.log("wdjqLoad");
    var that=this;
    setTimeout(function () {
      that.getCouponsInfo('正在加载数据...');
    }, 2000);
    //获取当前位置
    wx.getLocation({
      type: 'gcj02',
      success: (res) => {
        console.log(res)
        app.globalData.latitude = res.latitude;
        app.globalData.longitude = res.longitude;
      }
    });
  },
  back:function(){
    wx.switchTab({
      url: '../wd'
    });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
   
  },
  getCouponsInfo: function (message) {
    var that = this;
    var global_url = app.globalData.serverUrl;
    var userId = app.globalData.id;
    console.log("userId:"+userId);
    if (userId == "" || userId==null){
      var data = {
        current: that.data.current,
        size: that.data.size,
        used: that.data.used
      };
    }else{
      var data = {
        userId: userId,
        current: that.data.current,
        size: that.data.size,
        used: that.data.used
      };
    };
    console.log(data);
    network.requestLoading(global_url + '/wxbackstage/coupon/coupons', data, message, function (res) {
      console.log(res)
      var contentlistTem = that.data.contentlist
      if (res.code == 0) {
        if (that.data.current == 1) {
          contentlistTem = [];
        };
        var contentlist = res.data.data;
        console.log(contentlist);
        if (contentlist.length == 0 || res.data.totalCount == 0){
          var totalPages = 0;
        }else{
          var totalPages = res.data.totalCount / contentlist.length;
        }
        if (totalPages <= 1) {
          that.setData({
            contentlist: contentlistTem.concat(contentlist),
            hasMoreData: false
          });
        } else {
          that.setData({
            contentlist: contentlistTem.concat(contentlist),
            hasMoreData: true,
            current: that.data.current + 1
          });
        };
        if (that.data.contentlist!= undefined) {
          var coupons = that.data.contentlist;
          var nowDate = new Date();
          nowDate = Date.parse(nowDate);//现在时间时间戳
          for (let j = 0; j < coupons.length; j++) {
            coupons[j].bg = "";
            coupons[j]["createTime"]=coupons[j]["createTime"].replace(/-/g, '/');
            coupons[j]["deadline"] = coupons[j]["deadline"].replace(/-/g, '/');

            var newObtain = nowDate - Date.parse(coupons[j].createTime)
            var days = Date.parse(coupons[j].deadline) - nowDate;
            if (newObtain <= 1000 * 60 * 60 * 24 * 3) {//离获得时间五天显示新获得状态
              if (coupons[j].type > 0){
                coupons[j].markImg = '../../../images/used0.png';
              }else{
                coupons[j].markImg = '../../../images/used.png';
              }
            } else {
              if (days <= 1000 * 60 * 60 * 24 * 30) {//离过期时间一个月显示快过期状态
                coupons[j].markImg = '../../../images/unused.png';
              } else {
                coupons[j].markImg = '';
              }
            };
            if (days < 0 && coupons[j].used == 0) {
              coupons[j].used = -1;//过期状态
            }
          };
          that.setData({
            contentlist: coupons,
          })
        }else{ 
          console.log("userId为空") 
          };
      }
    }, function (res) {
      wx.showToast({
        title: '加载数据失败',
        icon: 'none',
        duration: 2000,
        mask: true
      })

    })
  },
  copy: function (e) {
    var that = this;
    var secretWords = e.currentTarget.dataset.secretwords;
    console.log(secretWords);
    wx.setClipboardData({
      data: secretWords,
      success: function (res) {
        console.log("复制成功");
      }
    });
  },
  toIntroduce: function (e) {
    var businessId = e.currentTarget.dataset.id;
    console.log(businessId);
    wx.navigateTo({
      url: '../businessInfor/businessInfor?id='+businessId,
    })
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    //console.log("wdjqShow");
    //this.getCouponsInfo('正在加载数据...');
    //wx.startPullDownRefresh();
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
    console.log("执行下拉");
    this.getCouponsInfo('正在刷新数据');
    wx.stopPullDownRefresh();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    if (this.data.hasMoreData) {
      this.getCouponsInfo('加载更多数据')
    } else {
      wx.showToast({
        title: '没有更多数据',
        icon: 'none',
        duration: 2000,
        mask: true
      });
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
})
