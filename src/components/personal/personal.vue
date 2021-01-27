<template>
  <div class="body-wrap">
    <div class="hauto">
      <div class="personal-header flex">
        <div class="image clearflex">
          <img
            v-show="userInfo.headimgurl"
            :src="userInfo.headimgurl"
            alt=""
          >
        </div>
        <div class="name">
          {{userInfo.nickname}}
        </div>
      </div>
      <div class="my-order-wrap">
        <div class="header clearfix">
          <div class="title">我的订单</div>
          <div
            class="all"
            @click="goToOrderList(0)"
          ><span>查看全部订单</span>
            <van-icon name="arrow" />
          </div>
        </div>
        <div class="order-list flex">
          <div
            class="order-item"
            @click="goToOrderList(1)"
          >
            <p class="icon"><img
                src="../../assets/images/pay.png"
                alt=""
              ></p>
            <span class="title">待付款</span>
          </div>
          <div
            class="order-item"
            @click="goToOrderList(2)"
          >
            <p class="icon"><img
                src="../../assets/images/car.png"
                alt=""
              ></p>
            <span class="title">待发货</span>
          </div>
          <div
            class="order-item"
            @click="goToOrderList(3)"
          >
            <p class="icon"><img
                src="../../assets/images/log.png"
                alt=""
              ></p>
            <span class="title">待收货</span>
          </div>
          <div
            class="order-item"
            @click="goToOrderList(4)"
          >
            <p class="icon"><img
                src="../../assets/images/money.png"
                alt=""
              ></p>
            <span class="title">待评价</span>
          </div>
        </div>
      </div>
      <div class="personal-setting">
        <!-- <div @click="goToFuBag">
          <p class="icon"><van-icon :name="bag" /></p>
          <span class="title">福包</span>
        </div>
        <div @click="goToCard">
          <p class="icon"><van-icon :name="card" /></p>
          <span class="title">福利券</span>
        </div> -->
        <div
          @click="goToAddress"
          style="width:5.5rem"
        >
          <p class="icon">
            <van-icon name="location-o" />
          </p>
          <span class="title">收货地址</span>
        </div>
        <div
          @click="showKF"
          style="width:5.5rem"
        >
          <p class="icon">
            <img
              src="../../assets/images/客服.png"
              alt=""
            >
          </p>
          <span class="title">联系客服</span>
        </div>
        <div></div>
      </div>
    </div>
  </div>
</template>

<script>
import "../../../static/css/public.css";
import bus from "../../assets/js/eventBus";
import bagImg from "../../assets/images/bag.png";
import cardImg from "../../assets/images/card.png";
import { Dialog } from "vant";
export default {
  name: "personal",
  data() {
    return {
      userInfo: {
        nickname: "",
        headimgurl: ""
      },
      openId: null,
      bag: bagImg,
      card: cardImg,
      pageName: "",
      targetParams: {},
      code: ""
    };
  },
  mounted: function() {
    this.openId = localStorage.getItem("openId");

    this.openId = this.openId == "null" ? null : this.openId;
    this.openId = this.openId == "undefined" ? undefined : this.openId;
    if (!this.openId) {
      /*sessionStorage.setItem('TARGET_PAGE_INFO',JSON.stringify({'name':'personal'}));
        window.location.href = 'https://pay.chhtf.com/store/redirectwx';
        return;*/
      this.code = this.getQueryString("code");
      if (this.code) {
        this.getOpenId();
      } else {
        this.mygets();
      }
    }
    this.getUserInfo(this.openId);
    this.getOrderListByStatus(0);
  },
  methods: {
    getOrderListByStatus(status) {
      var self = this;
      var params = {};
      params.page = {};
      params.page.start = 1;
      params.page.count = 100;
      params.orderInfo = {};
      params.orderInfo.orderStatus = parseInt(status);
      params.orderInfo.openid = this.openId;

      self.$axios
        .post({
          url: self.API_KEY.URL_ORDER_FINDBYPAGE,
          data: params
        })
        .then(json => {
          if (json.data.list && json.data.list.length > 0) {
            for (let item of json.data.list) {
              if (
                item.endTime &&
                new Date(item.endTime).getTime() - new Date().getTime() <= 0
              ) {
                let par = {};
                par.orderInfo = {};
                par.orderInfo.openid = this.openId;
                par.orderInfo.id = item.id;
                par.orderInfo.orderStatus = 5;

                self.$axios
                  .post({
                    url: self.API_KEY.URL_ORDER_UPDATE,
                    data: par
                  })
                  .then(function(json) {})
                  .catch(function(error) {});
              }
            }
          } else {
          }
        })
        .catch(function(error) {});
    },
    showKF() {
      Dialog.alert({
        title: "联系客服",
        message: "电话：13507991098  \n 邮箱：5023934@qq.com"
      }).then(() => {
        // on close
      });
    },
    goToAddress() {
      sessionStorage.setItem("ADDRESS_PAGE_SOURCE", "personal");
      this.$router.push({ name: "addressList" });
    },
    goToOrderList(value) {
      bus.$emit("setActiveEmpty", "");
      sessionStorage.setItem("ORDER_ACTIVE_TAB", value);
      this.$router.push({ name: "orderList", query: { orderStatus: value } });
    },
    getWeiXinInfo(openid) {
      if (!openid) {
        return;
      }
      var self = this;
      var params = {};
      params.openid = openid;

      self.$axios
        .post({
          url: "https://pay.chhtf.com/store/getWxuserInfo",
          data: params
        })
        .then(function(json) {})
        .catch(function(error) {});
    },
    getUserInfo(openid) {
      var self = this;
      var params = {};
      params.openid = openid;

      this.$axios
        .post({
          url: self.API_KEY.URL_USER_INFO_BYOPENID,
          data: params
        })
        .then(function(json) {
          if (json.data.record) {
            self.userInfo = json.data.record;
            localStorage.setItem("user_id", json.data.record.id);
            if (!self.userInfo.nickname) {
              self.getWeiXinInfo(self.openId);
            }
          } else {
            self.getWeiXinInfo(self.openId);
          }
        })
        .catch(function(error) {});
    },
    goToCard() {
      this.$router.push({ name: "myCard" });
    },
    goToFuBag() {
      this.$router.push({ name: "myFuBag" });
    },
    mygets() {
      let redirect_urls = encodeURIComponent(
        "http://wap.chhtf.com/#/navContainer/personal"
      );
      let urls =
        "https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx93b723928c7e335b&redirect_uri=" +
        redirect_urls +
        "&response_type=code&scope=snsapi_userinfo&state=STATE#wechat_redirect";
      window.location.href = urls;
    },
    getQueryString(name) {
      var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
      var r = window.location.search.substr(1).match(reg);
      if (r != null) return unescape(r[2]);
      return null;
    },
    getOpenId() {
      var self = this;
      var params = {};
      params.code = this.code;
      self.$axios
        .post({
          baseURL: "",
          url: self.API_KEY.URL_GET_OPENID,
          data: params,
          needLoading: false
        })
        .then(function(json) {
          localStorage.setItem("openId", json.data.openid);
          self.openId = json.data.openid;
          if (sessionStorage.getItem("TARGET_PAGE_INFO")) {
            self.pageName =
              JSON.parse(sessionStorage.getItem("TARGET_PAGE_INFO")).name ||
              null;
            self.targetParams =
              JSON.parse(sessionStorage.getItem("TARGET_PAGE_INFO")).params ||
              null;
          }
          if (self.openId) {
            if (self.pageName) {
              if (self.targetParams) {
                self.$router.push({
                  name: self.pageName,
                  query: self.targetParams
                });
              } else {
                self.$router.push({ name: self.pageName });
              }
            } else {
              self.$router.push({ name: "index" });
            }
          } else {
            self.$router.push({ name: "error" });
          }
        })
        .catch(function(error) {});
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.body-wrap {
  /* background: rgb(245,245,245); */
  overflow-y: auto;
  overflow-x: hidden;
  -webkit-overflow-scrolling: touch;
  height: 35rem;
  padding-bottom: 4rem;
}
.hauto {
  height: auto;
}
.personal-header {
  width: 100%;
  height: 8.125rem;
  background: url("../../assets/images/personalBg.png") no-repeat center center;
  background-size: 100% 100%;
  align-items: center;
  padding: 0 15px;
  text-align: left;
}
.personal-header .image img {
  width: 4.125rem;
  height: 4.125rem;
  border-radius: 50%;
  margin: 0 10px;
}
.personal-header .name {
  font-size: 16px;
  color: #fff;
}
.my-order-wrap {
  margin: 10px 15px;
  background-color: #fff;
  border-radius: 5px;
}
.my-order-wrap .header {
  padding: 8px 10px;
  border-radius: 5px 5px 0px 0px;
  border-bottom: 1px solid #e6e6e6;
}
.my-order-wrap .header .title {
  font-size: 16px;
  color: #222;
  width: 40%;
  float: left;
  text-align: left;
}
.my-order-wrap .header .all {
  color: #999;
  font-size: 14px;
  width: 40%;
  float: right;
  text-align: right;
}
.my-order-wrap .header .all i {
  position: relative;
  top: 1px;
}
.order-list {
  border-radius: 0px 0px 5px 5px;
  padding: 10px 0px;
  align-items: center;
  justify-content: center;
}
.order-item .icon {
  width: 22px;
  height: 19px;
  margin: 8px auto;
}
.order-item .icon img {
  width: 100%;
  height: 100%;
}
.order-item .title {
  font-size: 14px;
  color: #222;
}
.personal-setting {
  margin: 10px 15px;
  background-color: #fff;
  border-radius: 5px;
  padding: 10px 0;
  align-items: center;
  display: flex;
  justify-content: start;
}
.personal-setting .icon {
  margin: 3px auto;
  width: 22px;
}
.personal-setting .icon i {
  font-size: 24px;
}
.personal-setting .icon img {
  width: 100%;
}
.personal-setting .title {
  font-size: 14px;
  color: #222;
}
</style>
