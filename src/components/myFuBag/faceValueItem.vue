<template>
  <div class="body-wrap">
    <div class="hauto">
      <van-nav-bar
        title="充值"
        left-text="返回"
        left-arrow
        @click-left="onClickLeft"
      />
      <div class="face-value-list flex">
        <div
          class="face-value-item clearflex"
          @click="goToPayment(500)"
        >
          <div class="fu"><span class="number">560</span><span>福币</span></div>
          <div class="price">售价500.00元</div>
        </div>
        <div
          class="face-value-item clearflex"
          @click="goToPayment(300)"
        >
          <div class="fu"><span class="number">330</span><span>福币</span></div>
          <div class="price">售价300.00元</div>
        </div>
        <div
          class="face-value-item clearflex"
          @click="goToPayment(200)"
        >
          <div class="fu"><span class="number">215</span><span>福币</span></div>
          <div class="price">售价200.00元</div>
        </div>
        <div
          class="face-value-item clearflex"
          @click="goToPayment(100)"
        >
          <div class="fu"><span class="number">105</span><span>福币</span></div>
          <div class="price">售价100.00元</div>
        </div>
        <div
          class="face-value-item clearflex"
          @click="goToPayment(50)"
        >
          <div class="fu"><span class="number">50</span><span>福币</span></div>
          <div class="price">售价50.00元</div>
        </div>
        <div
          class="face-value-item clearflex"
          @click="goToPayment(0.01)"
        >
          <div class="fu"><span class="number">0.01</span><span>福币</span></div>
          <div class="price">售价0.01元</div>
        </div>
        <div
          class="face-value-item clearflex"
          style="border: 1px solid transparent;"
        ></div>
        <div
          class="face-value-item clearflex"
          style="border: 1px solid transparent;"
        ></div>
      </div>
    </div>
  </div>
</template>

<script>
import "../../../static/css/public.css";
import bus from "../../assets/js/eventBus";
export default {
  name: "faceValueItem",
  data() {
    return {
      id: null,
      type: "",
      openId: null,
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
      /*sessionStorage.setItem('TARGET_PAGE_INFO',JSON.stringify({'name':'faceValueItem'}));
        window.location.href = 'https://pay.chhtf.com/store/redirectwx';
        return;*/
      this.code = this.getQueryString("code");
      if (this.code) {
        this.getOpenId();
      } else {
        this.mygets();
      }
    }
    this.id = this.$route.query.id || 0;
    this.type = this.$route.query.type || "bag";
  },
  
  methods: {
    onClickLeft() {
      this.$router.go(-1);
    },
    goToPayment(number) {
      //this.$toast('暂时不能充值');
      this.$axios
        .post({ url: "/rechargerecord/createRechargeNumber" })
        .then(res => {
          var self = this;
          var params = {};
          var curDate = new Date();
          params.rechargeRecord = {};
          params.rechargeRecord.openid = this.openId;
          params.rechargeRecord.rechargeValue = number;
          params.rechargeRecord.rechargeNumber = res.data.rechargeNumber;
          params.rechargeRecord.rechargeType = this.type == "card" ? 1 : 0;
          params.rechargeRecord.correlationId = this.id;

          self.$axios
            .post({
              url: self.API_KEY.URL_WXPAY_RECHARGE_RECORD,
              data: params
            })
            .then(function(json) {
              var data = json.data;
              if (typeof WeixinJSBridge == "undefined") {
                if (document.addEventListener) {
                  document.addEventListener(
                    "WeixinJSBridgeReady",
                    self.onBridgeReady(
                      data,
                      params.rechargeRecord.rechargeNumber
                    ),
                    false
                  );
                } else if (document.attachEvent) {
                  document.attachEvent(
                    "WeixinJSBridgeReady",
                    self.onBridgeReady(
                      data,
                      params.rechargeRecord.rechargeNumber
                    )
                  );
                  document.attachEvent(
                    "onWeixinJSBridgeReady",
                    self.onBridgeReady(
                      data,
                      params.rechargeRecord.rechargeNumber
                    )
                  );
                }
              } else {
                self.onBridgeReady(data, params.rechargeRecord.rechargeNumber);
              }
            })
            .catch(function(error) {});
        });
    },
    onBridgeReady(data, orderNumber) {
      var self = this;
      WeixinJSBridge.invoke("getBrandWCPayRequest", data, function(res) {
        if (res.err_msg == "get_brand_wcpay_request:ok") {
          self.$toast("支付成功");
          self.confirmRecharge(orderNumber);
        } else {
          self.$toast("支付失败");
          self.deleteOrder(orderNumber);
        }
      });
    },
    deleteOrder(orderNumber) {
      var self = this;
      var params = {};
      var curDate = new Date();
      params.rechargeRecord = {};
      params.rechargeRecord.openid = this.openId;
      params.rechargeRecord.rechargeNumber = orderNumber;

      self.$axios
        .post({
          url: self.API_KEY.URL_DELETERECHARGERECCORDBYRECHARGENUMBER,
          data: params
        })
        .then(function(json) {})
        .catch(function(error) {});
    },
    confirmRecharge(orderNumber) {
      var self = this;
      var params = {};
      var curDate = new Date();
      params.rechargeRecord = {};
      params.rechargeRecord.openid = this.openId;
      params.rechargeRecord.rechargeNumber = orderNumber;

      self.$axios
        .post({
          url: self.API_KEY.URL_RECHARGE_CONFIRM,
          data: params
        })
        .then(function(json) {
          /*if(self.type == 'card'){
          self.$router.push({name:'myCard'});
        }else{
          self.$router.push({name:'myFuBag'});
        }*/
          self.$toast("充值成功");
        })
        .catch(function(error) {});
    },
    mygets() {
      let redirect_urls = encodeURIComponent(
        "http://wap.chhtf.com/#/faceValueItem"
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
.face-value-list {
  margin-top: 1.3125rem;
  align-items: center;
  justify-content: center;
  margin-left: 0.3125rem;
  margin-right: 0.3125rem;
  flex-wrap: wrap;
}
.face-value-item {
  width: 6.5625rem;
  background-color: transparent;
  border: 1px solid rgb(211, 55, 42);
  border-radius: 2px;
  margin: 0.325rem 0.325rem;
}
.face-value-item .fu {
  font-size: 0.9325rem;
  text-align: center;
  margin: 0.825rem 0.625rem 0.325rem 0.625rem;
  color: rgb(211, 55, 42);
}
.face-value-item .number {
  font-size: 1.25rem;
  font-weight: 700;
}
.face-value-item .price {
  font-size: 0.8125rem;
  text-align: center;
  color: rgb(211, 55, 42);
  padding-bottom: 0.9125rem;
}
/deep/.van-nav-bar__text {
  color: rgb(211, 55, 42);
  position: relative;
  top: 1px;
}
/deep/.van-nav-bar .van-icon {
  color: rgb(211, 55, 42);
}
</style>
