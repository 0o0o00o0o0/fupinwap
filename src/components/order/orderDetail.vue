<template>
  <div class="body-wrap" ref="bodyDom" :style="'height:' + bodyHeight + 'rem'">
    <div class="hauto">
      <div class="address-wrap flex">
        <div>{{ orderInfo.orderStatus | orderStatusFilter }}</div>
      </div>
      <div class="address-info">
        <div>
          <span>{{ orderInfo.receiver }}</span
          ><span class="phone">{{ orderInfo.phone }}</span>
        </div>
        <div>{{ orderInfo.addressDetail }}</div>
      </div>
      <div class="product-list-wrap">
        <van-collapse v-model="activeNames">
          <van-collapse-item name="1">
            <div slot="title">
              商品
              <span
                style="
                  float: right;
                  font-size: 0.8rem;
                  color: red;
                  margin: 0 10px;
                "
                v-show="endTimeStr"
                >{{ endTimeStr }}</span
              >
            </div>
            <div class="product-list">
              <div
                v-for="(item, index) in orderInfo.shoppingItemList"
                :key="index"
              >
                <div class="product-item flex">
                  <div class="clearflex image">
                    <img :src="imgServer + item.coverImage" alt="" />
                  </div>
                  <div class="content">
                    <div class="title">
                      {{ item.commodityTitle }} {{ item.specificationName }}
                    </div>
                    <div class="info">
                      <div class="price">
                        <!-- <img src="../../assets/images/fu.png" alt=""> -->
                        ￥{{ item.unitPrice }} *{{ item.commoditySize }}
                      </div>
                    </div>
                  </div>
                  <div class="count clearflex">
                    <div class="price" style="margin-top: 1.375rem">
                      <!-- <img src="../../assets/images/fu.png" alt=""> -->
                      ￥{{ item.unitPrice * item.commoditySize }}
                    </div>
                  </div>
                </div>
                <div class="delivery clearfix" v-show="item.deliveryNumber">
                  <!-- <span class="company clearfix"><label for="">商品总价:</label><span class="pull-right"><img src="../../assets/images/fu.png" alt="">{{item.unitPrice*item.commoditySize}}</span></span> -->
                  <span class="company clearfix"
                    ><label for="">运费:</label
                    ><span class="pull-right">包邮</span></span
                  >
                  <span class="company clearfix"
                    ><label for="">快递公司:</label
                    ><span class="pull-right">{{
                      item.deliveryCompany
                    }}</span></span
                  >
                  <span class="company clearfix"
                    ><label for="">快递单号:</label
                    ><span class="pull-right">{{ item.deliveryNumber }}</span
                    ><span
                      class="global-copy ctrlDeliveryNumberBtn"
                      id="copy"
                      :data-clipboard-text="item.deliveryNumber"
                      @click="copyDeliveryNumber"
                      >复制</span
                    ></span
                  >
                </div>
                <div class="delivery clearfix" v-show="!item.deliveryNumber">
                  <span>暂无运单信息</span>
                </div>
              </div>
            </div>
          </van-collapse-item>
        </van-collapse>
        <div class="money-info-wrap">
          <div class="clearfix fee-money">
            <div class="label">运费</div>
            <div class="price">包邮</div>
          </div>
          <div class="clearfix price-money">
            <div class="label">订单总额</div>
            <div class="price">
              <font>
                <span
                  v-if="orderInfo.activityFlag == 1"
                  style="font-size: 12px; color: red"
                  ><del>￥{{ orderInfo.actualPayment }}</del></span
                >

                <!-- <img src="../../assets/images/fu.png" alt=""> -->
                ￥</font
              ><span>{{
                orderInfo.actualPayment -
                (orderInfo.activityFlag == 1 ? orderInfo.discounts : 0)
              }}</span>
            </div>
          </div>
        </div>
      </div>
      <div class="order-info-wrap">
        <div class="flex info-item">
          <div class="label clearflex">订单编号</div>
          <div class="flex">
            <div>{{ orderInfo.orderReference }}</div>
            <div class="clearflex">
              <span
                class="copy ctrlBtn"
                id="copy"
                :data-clipboard-text="orderInfo.orderReference"
                @click="copyOrderNumber"
                >复制</span
              >
            </div>
          </div>
        </div>
        <div class="flex info-item">
          <div class="label clearflex">付款时间</div>
          <div class="flex">
            <div v-if="orderInfo.paymentTime">{{ orderInfo.paymentTime }}</div>
            <div v-else></div>
          </div>
        </div>
        <!-- <div
          class="flex info-item"
          v-show="orderInfo.orderStatus == 2"
        >
          <div class="label clearflex">快递单号</div>
          <div class="flex">
            <div v-if="orderInfo.paymentTime">{{orderInfo.deliveryNumber}}</div>
            <div v-else></div>
          </div>
        </div> -->
      </div>
      <div class="footer" v-show="orderInfo.orderStatus == 0">
        <van-button
          type="primary"
          class="continue-pay"
          :style="!canIpay ? 'background-color:gray' : ''"
          :disabled="!canIpay"
          @click="continuePay"
          >继续支付</van-button
        >
        <van-button
          type="primary"
          class="continue-pay gray"
          @click="cancelOrder"
          >取消订单</van-button
        >
      </div>
      <div class="return-btn" @click="goToBack"><span>返回</span></div>
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
</template>

<script>
import "../../../static/css/public.css";
import bus from "../../assets/js/eventBus";
import Pay from "./payComponent";
import Clipboard from "clipboard";
export default {
  name: "confirmOrder",
  components: {
    Pay,
  },
  destroyed: function () {
    clearInterval(this.Time);
  },
  data() {
    return {
      useedCard: true,
      isCard: true,
      bodyHeight: 35,
      activeNames: ["1"],
      payMethod: "1",
      orderId: null,
      orderInfo: {
        deliveryNumber: "",
        deliveryCompany: "",
        fee: "",
      },
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
      openId: null,
      pageName: "",
      endTimeStr: "",
      Time: null,
      canIpay: true,
      targetParams: {},
      code: "",
      originPrice: 0,
      orderType: 0,
    };
  },
  created: function () {
    this.orderId = this.$route.query.orderId || localStorage.getItem("orderId");
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
    this.bodyHeight = (window.innerHeight + 15) / 16;
    this.openId = localStorage.getItem("openId");
    this.openId = this.openId == 'null' ? null:this.openId;
    this.openId = this.openId == 'undefined' ? undefined:this.openId;
    if(!this.openId){
        /*sessionStorage.setItem('TARGET_PAGE_INFO',JSON.stringify({'name':'orderDetail',params:{orderId:this.orderId}}));
        window.location.href = 'https://pay.chhtf.com/store/redirectwx';
        return;*/
        this.code = this.getQueryString('code');
        if(this.code){
          this.getOpenId();
        }else{
          this.mygets();
        }
    }
    this.getOrderInfo(this.orderId);
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
    paymentWayFilter: function (value) {
      switch (parseInt(value)) {
        case 0:
          return "福包";
        case 1:
          return "福利券";
        default:
          "";
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
    ylPay() {
      this.$refs.card.submit();
      this.useedCard = false;
      setTimeout(() => {
        this.useedCard = true;
      }, 3000);
    },
    cancelOrder() {
      var self = this;
      var params = {};
      params.orderInfo = {};
      params.orderInfo.openid = this.openId;
      params.orderInfo.id = this.orderId;
      params.orderInfo.orderStatus = 5;

      self.$axios
        .post({
          url: self.API_KEY.URL_ORDER_UPDATE,
          data: params,
        })
        .then(function (json) {
          self.$toast("已取消");
          self.$router.go(0);
        })
        .catch(function (error) {});
    },
    goToBack() {
      if (this.$route.query.pageSource == "order") {
        this.$router.go(-1);
      } else {
        this.$router.push({ name: "fupin" });
      }
    },
    goToAddCard() {
      this.$router.push({ name: "addCard" });
    },
    continuePay() {
      this.payMoneyPopup = true;
      this.getCardInfo();
      this.getAccountInfo();
    },
    // confirmPay() {
    //   var self = this;
    //   var params = {};
    //   params.orderInfo = {};
    //   params.orderInfo.openid = this.openId;
    //   params.orderInfo.actualPayment = this.totalPrice || 0.0;
    //   if (this.payMethodPopup == 2) {
    //     params.orderInfo.cardId = this.cardSelectedValue;
    //   }
    //   params.orderInfo.paymentWay = this.payMethodPopup == 1 ? 0 : 1;
    //   params.orderInfo.id = this.orderId || 0;

    //   self.$axios
    //     .post({
    //       url: self.API_KEY.URL_ORDER_PAYFORORDER,
    //       data: params
    //     })
    //     .then(function(json) {
    //       if (json.data.paySuccessFlag) {
    //         self.payMoneyPopup = false;
    //         bus.$emit("setActiveEmpty", "");
    //         self.$router.go(0);
    //         //self.$router.push({name:'orderDetail',query:{orderId:self.orderId}});
    //       }
    //     })
    //     .catch(function(error) {});
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
    getOrderInfo(id) {
      var self = this;
      var params = {};
      params.id = id;

      self.$axios
        .post({
          url: self.API_KEY.URL_ORDER_FINDBYID,
          data: params,
        })
        .then(function (json) {
          if (json.data.record) {
            self.orderInfo = json.data.record;
            self.orderType = json.data.record.orderType || 0;
            self.totalPrice = json.data.record.actualPayment;
            if (self.orderInfo.orderStatus == 0) {
              self.cTime();
            }
          }
        })
        .catch(function (error) {});
    },
    cTime() {
      if (this.orderInfo.orderStatus == 0 && this.orderInfo.endTime) {
        this.Time = setInterval(() => {
          if (
            new Date(this.orderInfo.endTime).getTime() - new Date().getTime() <=
            0
          ) {
            this.cancelOrder();
            this.endTimeStr = "剩余:00分00秒";
            clearInterval(this.Time);
            this.canIpay = false;
          } else {
            const t =
              new Date(this.orderInfo.endTime).getTime() - new Date().getTime();
            const m = Math.floor(t / (1000 * 60));
            const s = Math.floor((t / 1000) % 60);
            this.endTimeStr =
              "剩余:" + this.putZero(m) + "分" + this.putZero(s) + "秒";
          }
        }, 1000);
      }
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
    goToPayMoney(item, type) {
      this.$router.push({
        name: "faceValueItem",
        query: { id: item.id, type: type },
      });
    },
    putZero(param) {
      return (param + "").padStart(2, "0");
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
    copyOrderNumber() {
      let self = this;
      let clipboard = new Clipboard(".ctrlBtn");
      clipboard.on("success", function (e) {
        //self.$message({message:'已复制到剪贴板',type:'success',duration:1500});
        self.$toast("已复制到剪贴板");
        setTimeout(() => {}, 2000);
        e.clearSelection();
        clipboard.destroy();
      });
    },
    copyDeliveryNumber() {
      let self = this;
      let clipboard = new Clipboard(".ctrlDeliveryNumberBtn");
      clipboard.on("success", function (e) {
        //self.$message({message:'已复制到剪贴板',type:'success',duration:1500});
        self.$toast("已复制到剪贴板");
        setTimeout(() => {}, 2000);
        e.clearSelection();
        clipboard.destroy();
      });
    },
    hiddenSubmitPrompt() {
      this.$toast("余额不足，请更换支付方式，或去充值");
    },
    // goToIndex() {
    //   this.$router.push({ name: "index" });
    // }
    mygets() {
      let redirect_urls= encodeURIComponent("http://wap.chhtf.com/#/orderDetail");
      let urls = "https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx93b723928c7e335b&redirect_uri="
            +redirect_urls+"&response_type=code&scope=snsapi_userinfo&state=STATE#wechat_redirect";
      window.location.href = urls;
    },
    getQueryString(name) {
      var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
        var r = window.location.search.substr(1).match(reg);
        if (r != null) return unescape(r[2]); return null;
    },
    getOpenId(){
      var self = this;
      var params = {};
      params.code = this.code;
      self.$axios.post({
          baseURL:'',
          url:self.API_KEY.URL_GET_OPENID,
          data: params,
          needLoading: false
      }).then(function(json) {
        localStorage.setItem('openId',json.data.openid);
        self.openId = json.data.openid;
        if(sessionStorage.getItem('TARGET_PAGE_INFO')){
          self.pageName = JSON.parse(sessionStorage.getItem('TARGET_PAGE_INFO')).name || null;
          self.targetParams = JSON.parse(sessionStorage.getItem('TARGET_PAGE_INFO')).params || null;
        }
        if(self.openId){
          if(self.pageName){
            if(self.targetParams){
              self.$router.push({name:self.pageName,query:self.targetParams});
            }else{
              self.$router.push({name:self.pageName});
            }
          }else{
            self.$router.push({name:'index'});
          }
        }else{
          self.$router.push({name:'error'});
        }
      }).catch(function(error) {
      });
    }
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
  padding-bottom: 4rem;
}
.hauto {
  height: auto;
}
.mr20 {
  margin-right: 1.25rem;
}
.address-wrap {
  height: 5.3125rem;
  width: 100%;
  background-color: rgb(211, 55, 42);
  color: #fff;
  align-items: center;
  text-align: left;
  padding: 0 15px;
  font-size: 1.0625rem;
}
.address-wrap .location {
  padding: 0px 5px 0px 15px;
}
.address-wrap .content {
  font-size: 0.9375rem;
  text-align: left;
}
.address-wrap .arrow {
  width: 2.5rem;
  text-align: center;
}
.product-list-wrap {
  margin-top: 10px;
  background: #fff;
}
.product-list {
}
.product-item {
  padding: 10px 15px;
}
.product-item .image {
  width: 3.4375rem;
  height: 3.4375rem;
}
.product-item .image img {
  width: 100%;
  height: 100%;
}
.product-item .content {
  text-align: center;
  padding-left: 10px;
}
.product-item .content .title {
  text-align: left;
  color: #222;
  font-size: 0.9375rem;
}
.product-item .content .info {
  text-align: center;
  align-items: center;
}
.product-item .content .number {
  color: #a4a4a4;
  text-align: left;
  font-size: 0.8125rem;
}
.product-item .content .number img {
  position: relative;
  top: 0.125rem;
  width: 1rem;
  height: 1rem;
  margin-right: 0.1875rem;
}
.product-item .content .price img {
  position: relative;
  top: 0.05rem;
  width: 0.8rem;
  height: 0.8rem;
  margin-right: 0.1875rem;
}
.product-item .content .price {
  width: 5rem;
  color: #a4a4a4;
  text-align: left;
  font-size: 0.8125rem;
  margin-right: 10px;
}
.product-item .count {
  text-align: right;
}
.product-item .price {
  color: #a4a4a4;
  text-align: left;
  font-size: 0.8125rem;
}
.product-item .price img {
  position: relative;
  top: 0.05rem;
  width: 0.8rem;
  height: 0.8rem;
  margin-right: 3px;
}
.product-list .delivery {
  font-size: 0.75rem;
  color: #a4a4a4;
  margin: 0 0.9375rem 0 0.9375rem;
  padding: 0rem 0 0.9375rem 0;
  text-align: left;
  border-bottom: 1px solid #eee;
}
.product-list .delivery .company {
  display: block;
  text-align: left;
  margin: 5px 0;
}
.product-list .delivery .company img {
  position: relative;
  top: 0.1em;
  width: 0.7rem;
  height: 0.7rem;
  margin-right: 0.28rem;
}
.product-list .delivery .no {
  display: block;
  text-align: left;
  margin: 5px 0;
}

.money-info-wrap {
  padding: 10px 15px;
}
.money-info-wrap .fee-money {
  font-size: 0.8125rem;
  color: #222;
}
.money-info-wrap .fee-money .label {
  width: 50%;
  text-align: left;
  float: left;
}
.money-info-wrap .fee-money .price {
  width: 50%;
  text-align: right;
  float: right;
}
.money-info-wrap .price-money {
  font-size: 0.875rem;
  margin-top: 8px;
}
.money-info-wrap .price-money .price font img {
  position: relative;
  top: 0.2rem;
  width: 1rem;
  height: 1rem;
  margin-right: 0.28rem;
}
.money-info-wrap .price-money .label {
  color: #222;
  width: 50%;
  text-align: left;
  float: left;
}
.money-info-wrap .price-money .price {
  color: #fc6036;
  width: 50%;
  text-align: right;
  float: right;
}
.money-info-wrap .price-money .price > span {
  font-size: 0.875rem;
}
.money-info-wrap .price-money .price > font {
  font-size: 0.8125rem;
}
.address-info {
  text-align: left;
  background-color: #fff;
  padding: 10px 15px;
  font-size: 0.9375rem;
  color: #222;
}
.address-info .phone {
  color: #666;
  font-size: 0.9375rem;
  display: inline-block;
  margin-left: 25px;
}
.order-info-wrap {
  background-color: transparent;
  margin-top: 10px;
  text-align: left;
  padding: 15px 15px;
}
.order-info-wrap {
  color: #777;
  font-size: 0.8125rem;
}
.info-item {
  margin: 5px 0;
  align-items: center;
}
.info-item > div {
  align-items: center;
}
.info-item .label {
  padding-right: 15px;
}
.info-item .copy {
  display: inline-block;
  width: 2.1875rem;
  height: 18px;
  text-align: center;
  border: 1px solid #ccc;
  background-color: #d1d1d1;
  color: #767676;
  line-height: 18px;
  border-radius: 2px;
  font-size: 12px;
  cursor: pointer;
}
.footer {
  width: 100%;
}
.footer .return-index {
  border-radius: 2px;
  width: 40%;
  margin: 0 auto;
  margin-top: 3rem;
  background-color: #ccc;
  font-size: 1.0625rem;
  color: #222;
}
.footer .continue-pay {
  width: 22rem;
  border-radius: 2px;
  margin: 0 auto;
  margin-top: 3rem;
  background-color: rgb(211, 55, 42);
  font-size: 1.0625rem;
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
.global-copy {
  float: right;
  display: inline-block;
  width: 2.1875rem;
  height: 1.125rem;
  text-align: center;
  border: 1px solid #ccc;
  background-color: #d1d1d1;
  color: #767676;
  line-height: 1.125rem;
  border-radius: 2px;
  font-size: 0.75rem;
  cursor: pointer;
  margin-right: 5px;
}
.return-btn {
  text-align: center;
  font-size: 14px;
  color: rgb(211, 55, 42);
  margin-top: 5px;
  text-decoration: underline;
}
.gray {
  background-color: rgb(241, 244, 245) !important;
  color: #666;
  margin-top: 15px !important;
}
</style>
