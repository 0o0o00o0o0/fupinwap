<template>
  <div class="body-wrap" ref="bodyDom" :style="'height:' + bodyHeight + 'rem'">
    <div class="hauto">
      <div class="order-list" v-if="haveData">
        <ListItem
          v-for="(item, index) in list"
          :item="item"
          :key="index"
          :openId="openId"
        />
        <div class="bottom-prompt">没有更多啦</div>
      </div>
      <div v-else>
        <p>暂无订单</p>
      </div>
      <van-popup v-model="payMoneyPopup" position="bottom">
        <Pay
          @close="payMoneyPopup = false"
          :orderId="orderId"
          :totalPrice="totalPrice"
          :originPrice="originPrice"
          :orderType="orderType"
        />
      </van-popup>
    </div>
  </div>
</template>

<script>
import "../../../static/css/public.css";
import bus from "../../assets/js/eventBus";
import ListItem from "./listItem";
import Pay from "./payComponent";
export default {
  name: "navContainer",
  components: {
    Pay,
    ListItem,
  },
  data() {
    return {
      useedCard: true,
      conf: {},
      haveData: true,
      list: [],
      imgServer: this.API_KEY.IMG_SERVER,
      cardSelectedValue: "",
      isShowCard: false,
      cardList: [],
      userCardNumber: "",
      haveCardData: true,
      payMethodPopup: 2,
      accountInfo: {
        accountBalance: 0.0,
      },
      payMoneyPopup: false,
      totalPrice: "",
      orderId: null,
      openId: null,
      bodyHeight: 35,
      pageName: "",
      targetParams: {},
      code: "",
      originPrice: 0,
      orderType: 0,
    };
  },
  watch: {
    userCardNumber(val) {
      this.$nextTick(() => {
        const strNums = String(this.userCardNumber).split(" ").join("");
        this.compute();
        let str = String(this.userCardNumber).split(" ").join("");
        if (str.length > 4)
          str = str.replace(str.slice(0, 4), str.slice(0, 4) + " ");
        if (str.length > 9)
          str = str.replace(str.slice(0, 9), str.slice(0, 9) + " ");
        if (str.length > 14)
          str = str.replace(str.slice(0, 14), str.slice(0, 14) + " ");
        this.userCardNumber = str;
      });
    },
    payMoneyPopup(v) {
      if (v) {
        this.compute();
      }
    },
    payMethodPopup(val) {
      if (this.originPrice && val == 1) {
        this.totalPrice = this.originPrice;
        this.originPrice = 0;
      } else {
        this.compute();
      }
    },
  },
  computed: {
    canIsubmit() {
      const t = String(this.userCardNumber).split(" ").join("");
      // if (t.indexOf("6229065") > -1 && t.length == 16) {
      //   return true;
      // }
      // if (t.indexOf("6229061") > -1 && t.length == 16) {
      //   return true;
      // }
      // if (t == "6221558812340000") {
      if (t.length == 16 || t.length == 19) {
        return true;
      }
      return false;
    },
  },
  mounted: function () {
    this.userCardNumber = localStorage.getItem("ylCard") || "";
    this.bodyHeight = (window.innerHeight + 180) / 16;
    this.conf = this.listConf;
    this.openId = localStorage.getItem("openId");
    this.openId = this.openId == "null" ? null : this.openId;
    this.openId = this.openId == "undefined" ? undefined : this.openId;
    if (!this.openId) {
      /*sessionStorage.setItem('TARGET_PAGE_INFO',JSON.stringify({'name':'orderList'}));
        window.location.href = 'https://pay.chhtf.com/store/redirectwx';
        return;*/
      this.code = this.getQueryString("code");
      if (this.code) {
        this.getOpenId();
      } else {
        this.mygets();
      }
    }
    this.getOrderListByStatus(this.conf.orderStatus);
  },
  filters: {
    orderStatusFilter: function (value) {
      switch (parseInt(value)) {
        case 0:
          return "未支付";
          break;
        case 1:
          return "已支付";
          break;
        case 2:
          return "已发货";
          break;
        case 3:
          return "已收货";
          break;
        case 4:
          return "交易成功";
          break;
        case 5:
          return "订单失效";
          break;
        default:
          return "";
      }
    },
    toFixedFilter: function (value) {
      return value == "无" ? "元" : value.toFixed(2);
    },
  },
  methods: {
    compute() {
      const strNums = String(this.userCardNumber).split(" ").join("");
      if (
        (strNums.length === 16 || strNums.length == 19) &&
        this.payMoneyPopup
      ) {
        this.$axios
          .post({
            url: "/discountslist/conformDiscountsByCardNumber",
            data: {
              discountsList: {
                cardNumber: strNums,
                orderPayment: this.totalPrice,
              },
            },
            needLoading: false,
          })
          .then((json) => {
            if (json.data.record) {
              this.originPrice = this.totalPrice;
              this.totalPrice = json.data.record;
            }
          });
      } else {
        if (this.originPrice) {
          this.totalPrice = this.originPrice;
          this.originPrice = 0;
        }
      }
    },
  


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
          data: params,
        })
        .then(function (json) {
          if (json.data.list && json.data.list.length > 0) {
            self.list = json.data.list;
            for (let i = 0; i < self.list.length; i++) {
              var totalNumber = 0;
              var fourCountPro = [];
              self.list[i].shoppingItemList.forEach(function (
                item,
                index,
                arr
              ) {
                totalNumber += parseInt(item.commoditySize);
                if (index < 4) {
                  fourCountPro.push(item);
                }
              });

              self.$set(self.list[i], "sendGoods", true); //添加是否已提醒发货属性

              /*记录没有商品的情况*/
              if (self.list[i].shoppingItemList.length <= 0) {
                self.$set(self.list[i], "haveProduct", false);
              } else {
                self.$set(self.list[i], "haveProduct", true);
                self.$set(self.list[i], "totalNumber", totalNumber); //添加订单商品总数属性
                self.$set(self.list[i], "fourCountPro", fourCountPro); //添加订单商品总数属性
              }
              /*记录没有商品的情况 结束*/
            }
            self.haveData = true;
          } else {
            self.haveData = false;
          }
        })
        .catch(function (error) {
          self.haveData = false;
        });
    },

    goToAddCard() {
      this.$router.push({ name: "addCard" });
    },

    // confirmPay(){
    //   var self = this;
    //   var params = {};
    //   params.orderInfo = {};
    //   params.orderInfo.openid = this.openId;
    //   params.orderInfo.actualPayment = this.totalPrice || 0.00;
    //   if(this.payMethodPopup == 2){
    //     params.orderInfo.cardId = this.cardSelectedValue;
    //   }
    //   params.orderInfo.paymentWay = this.payMethodPopup == 1 ? 0 : 1;
    //   params.orderInfo.id = this.orderId || 0;

    //   self.$axios.post({
    //       url:self.API_KEY.URL_ORDER_PAYFORORDER,
    //       data: params
    //   }).then(function(json) {
    //     if(json.data.paySuccessFlag){
    //       self.payMoneyPopup = false;
    //       bus.$emit('setActiveEmpty','');
    //       self.$router.go(0)
    //       //self.$router.push({name:'orderDetail',query:{orderId:self.orderId}});
    //     }
    //   }).catch(function(error) {

    //   });
    // },
    confirmPay() {
      this.$axios
        .post({ url: "/rechargerecord/createRechargeNumber" })
        .then((res) => {
          var params = {};
          var curDate = new Date();
          params.rechargeRecord = {};
          params.rechargeRecord.openid = this.openId;
          params.rechargeRecord.rechargeValue = this.totalPrice || 0.0;
          params.rechargeRecord.rechargeNumber = res.data.rechargeNumber;
          params.rechargeRecord.rechargeType = 2;
          params.rechargeRecord.correlationId = this.orderId || 0;

          this.$axios
            .post({
              url: this.API_KEY.URL_WXPAY_RECHARGE_RECORD,
              data: params,
            })
            .then((json) => {
              var data = json.data;
              if (typeof WeixinJSBridge == "undefined") {
                if (document.addEventListener) {
                  document.addEventListener(
                    "WeixinJSBridgeReady",
                    this.onBridgeReady(
                      data,
                      params.rechargeRecord.rechargeNumber
                    ),
                    false
                  );
                } else if (document.attachEvent) {
                  document.attachEvent(
                    "WeixinJSBridgeReady",
                    this.onBridgeReady(
                      data,
                      params.rechargeRecord.rechargeNumber
                    )
                  );
                  document.attachEvent(
                    "onWeixinJSBridgeReady",
                    this.onBridgeReady(
                      data,
                      params.rechargeRecord.rechargeNumber
                    )
                  );
                }
              } else {
                this.onBridgeReady(data, params.rechargeRecord.rechargeNumber);
              }
            })
            .catch(function (error) {});
        });
    },
    // onBridgeReady(data, orderNumber) {
    //   var self = this;
    //   WeixinJSBridge.invoke("getBrandWCPayRequest", data, res => {
    //     if (res.err_msg == "get_brand_wcpay_request:ok") {
    //       this.$toast("支付成功");
    //      self.payMoneyPopup = false;
    //       bus.$emit('setActiveEmpty','');
    //       self.$router.go(0)
    //     } else {
    //       self.$toast("支付失败");
    //     }
    //   });
    // },
    onBridgeReady(data, orderNumber) {
      var self = this;
      WeixinJSBridge.invoke("getBrandWCPayRequest", data, (res) => {
        if (res.err_msg == "get_brand_wcpay_request:ok") {
          var params = {};
          params.orderInfo = {};
          params.orderInfo.openid = this.openId;
          params.orderInfo.actualPayment = this.totalPrice || 0.0;

          params.orderInfo.paymentWay = 2;
          params.orderInfo.id = this.orderId || 0;

          this.$toast("支付成功");
          self.payMoneyPopup = false;
          bus.$emit("setActiveEmpty", "");
          self.confirmRecharge(orderNumber);
          self.$axios
            .post({
              url: self.API_KEY.URL_ORDER_PAYFORORDER,
              data: params,
            })
            .then(function (json) {
              if (json.data.paySuccessFlag) {
              }
            })
            .catch(function (error) {});
          // self.$router.go(0);

          this.$router.push("/orderList?orderStatus=0");
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
          data: params,
        })
        .then(function (json) {})
        .catch(function (error) {});
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
          data: params,
        })
        .then(function (json) {
          /*if(self.type == 'card'){
          self.$router.push({name:'myCard'});
        }else{
          self.$router.push({name:'myFuBag'});
        }*/
          // self.$toast("充值成功");
        })
        .catch(function (error) {});
    },
    getAccountInfo() {
      var self = this;
      var params = {};
      params.openid = this.openId;

      self.$axios
        .post({
          url: self.API_KEY.URL_ACCOUNTINFO_FIND_BYOPENID,
          data: params,
        })
        .then(function (json) {
          if (json.data.record) {
            self.accountInfo = json.data.record;
          }
        })
        .catch(function (error) {});
    },
    handleClickFuBagPay() {
      if (this.payMethodPopup == 2) {
        for (let i = 0; i < this.cardList.length; i++) {
          this.$set(this.cardList[i], "selected", false);
        }
      }
      this.payMethodPopup = 1;
      this.cardSelectedValue = "";
    },
    hiddenSubmitPrompt() {
      this.$toast("余额不足，请更换支付方式，或去充值");
    },
    goToPayMoney(item, type) {
      this.$router.push({
        name: "faceValueItem",
        query: { id: item.id, type: type },
      });
    },
    handleClickCardPay(item) {
      if (item.cardBalance < this.totalPrice) {
        this.$toast("余额不足");
        return false;
      }
      this.payMethodPopup = 2;
      this.cardSelectedValue = item.id;
      if (!item.selected) {
        for (let i = 0; i < this.cardList.length; i++) {
          this.$set(this.cardList[i], "selected", false);
        }
        item.selected = true;
      }
    },
    getCardInfo() {
      var self = this;
      var params = {};
      params.openid = this.openId;

      self.$axios
        .post({
          url: self.API_KEY.URL_FIND_MY_CARD,
          data: params,
        })
        .then(function (json) {
          if (json.data.list && json.data.list.length > 0) {
            self.cardList = json.data.list;
            for (let i = 0; i < self.cardList.length; i++) {
              self.$set(self.cardList, "selected", false);
            }
            self.haveCardData = true;
          } else {
            self.haveCardData = false;
          }
        })
        .catch(function (error) {
          self.haveCardData = false;
        });
    },
    mygets() {
      var redirect_urls = encodeURIComponent(
        "http://wap.chhtf.com/#/orderList"
      );
      var urls =
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
          needLoading: false,
        })
        .then(function (json) {
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
                  query: self.targetParams,
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
        .catch(function (error) {});
    },
  },
  props: {
    listConf: {
      type: Object,
    },
  },
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
  background: rgb(245, 245, 245);
}
.hauto {
  height: auto;
}
.order-list {
}

.confirm-pay-wrap {
  width: 100%;
}
.confirm-pay-wrap .title {
  position: relative;
  text-align: center;
  color: #222;
  font-size: 1.0625rem;
  padding: 1.0625rem 0px;
  border-bottom: 1px solid #f4f4f4;
}
.confirm-pay-wrap .title i {
  position: absolute;
  top: 1.1875rem;
  left: 0.625rem;
  font-size: 1.375rem;
  color: #a4a3a3;
}
.confirm-pay-wrap .pay-money {
  margin: 1.4375rem;
  text-align: center;
}
.confirm-pay-wrap .pay-money img {
  position: relative;
  top: -0.05rem;
  width: 1.3rem;
  height: 1.3rem;
  margin-right: 5px;
}
.confirm-pay-wrap .pay-money span {
  font-size: 1.75rem;
  color: #2c2c2c;
}
.confirm-pay-wrap .price-wrap {
  margin: 15px 15px;
  text-align: right;
  color: #666;
  font-size: 14px;
}
.confirm-pay-wrap .price-wrap .price {
  font-size: 20px;
  color: tomato;
}
.confirm-pay-wrap .price-wrap img {
  position: relative;
  top: 2px;
  width: 1.3rem;
  height: 1.3rem;
  margin-right: 2px;
}
.confirm-pay-wrap .pay-method-wrap {
  margin: 0px 10px;
  border-top: 1px solid #f4f4f4;
  text-align: left;
  height: 10rem;
}
.confirm-pay-wrap .pay-method-wrap .fu-bag-pay {
  font-size: 0.9375rem;
  color: #222222;
  padding: 0.9375rem 0px;
  border-top: 1px solid #f4f4f4;
  border-bottom: 1px solid #f4f4f4;
  text-align: left;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.confirm-pay-wrap .pay-method-wrap .fu-bag-pay i {
  font-size: 1rem;
  color: rgb(211, 55, 42);
  float: right;
}
.confirm-pay-wrap .pay-method-wrap .fu-bag-pay img {
  position: relative;
  top: 0.09rem;
  width: 0.95rem;
  height: 0.95rem;
  margin-right: 5px;
}
.confirm-pay-wrap .card-pay-wrap .card-label {
  padding: 1.5625rem 0px 0.3125rem 0px;
  font-size: 0.875rem;
  color: #777777;
  border-bottom: 1px solid #f4f4f4;
  text-align: left;
}
.confirm-pay-wrap .card-pay-wrap .item {
  padding: 0.8rem 0px;
  font-size: 0.9375rem;
  color: #222;
  text-align: left;
  align-items: center;
  border-bottom: 1px solid #f4f4f4;
}
.confirm-pay-wrap .card-pay-wrap .item .price {
  padding-left: 8px;
  position: relative;
  top: -2px;
}
.confirm-pay-wrap .card-pay-wrap .item .price img {
  position: relative;
  top: 0.15rem;
  width: 1rem;
  height: 1rem;
  margin-right: 5px;
}
.confirm-pay-wrap .card-pay-wrap .item .selected {
  font-size: 20px;
  color: rgb(211, 55, 42);
}
.confirm-pay-wrap .card-pay-wrap .card-list {
  max-height: 8.125rem;
  overflow-y: auto;
}
.confirm-pay-wrap .footer {
  width: 100%;
}
.confirm-pay-wrap .footer button {
  border-radius: 2px;
  width: 21.1875rem;
  margin: 0 auto;
  margin-bottom: 1.1875rem;
  margin-top: 3rem;
  background-color: rgb(211, 55, 42);
  font-size: 1.0625rem;
}
.add-card-link {
  display: inline-block;
  color: rgb(211, 55, 42);
  font-size: 0.9375rem;
}
.pay-money-card-link {
  display: block;
  color: rgb(211, 55, 42);
  font-size: 12px;
  text-decoration: underline;
}
.order-item .total-price {
  font-size: 13px;
  color: #f64444;
}
.order-item .total-price img {
  position: relative;
  top: 0.1rem;
  width: 0.8rem;
  height: 0.8rem;
  margin-right: 3px;
}
.order-item .number {
  font-size: 12px;
  color: #888888;
  text-align: right;
}
.order-item .more {
  font-size: 1.25rem;
  color: #cccccc;
  margin-right: 0.9375rem;
}
.vh-center {
  justify-content: flex-start;
}
.bottom-prompt {
  font-size: 14px;
  color: #666;
  text-align: center;
  margin: 5px 0;
}
</style>
