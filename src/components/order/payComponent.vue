<template>
  <div class="confirm-pay-wrap">
    <div class="title">
      <van-icon name="cross" @click="handleClose" />确认付款
    </div>
    <div class="pay-money">
      <!-- <img src="../../assets/images/fu.png" alt=""> -->
      <span style="color: red; font-size: 16px" v-if="originPrice"
        ><del>￥{{ originPrice }}</del></span
      >
      ￥<span>{{ totalPrice }}</span>
    </div>
    <div class="pay-method-wrap">
      <div class="fu-bag-pay" @click="payMethodPopup = 2">
        <div style="display: flex; align-items: center">
          <img
            style="width: 2rem; height: 2rem; vertical-align: middle"
            src="../../assets/images/ylzf.jpg"
            alt=""
            srcset=""
          />银联支付
          <span style="font-size: 0.8rem; color: red; font-weight: 600"
            >(支持长沙农商银行信用卡)</span
          >
        </div>
        <!-- <span>&emsp; -->
        <!-- (剩余:  -->
        <!-- <img src="../../assets/images/fu.png"> -->
        <!-- ￥{{accountInfo.accountBalance | toFixedFilter}})</span>&emsp;
                <span class="add-card-link" v-if="accountInfo.accountBalance < totalPrice"  @click="goToPayMoney(accountInfo,'bag')">去充值</span>
              <span class="selected"> -->
        <!-- <van-icon
              name="success"
              v-if="payMethodPopup == 2"
            /> -->
        <!-- <van-icon name="success" v-else style="visibility: hidden;"/></span> -->
        <van-icon name="success" v-if="payMethodPopup == 2" />
      </div>

      <van-field
        v-model="userCardNumber"
        maxlength="22"
        style="font-size: 18px"
        placeholder="请输入16位或19位卡号"
      />
      <!-- <div class="fu-bag-pay" @click="payMethodPopup = 1">
         
            <div style="display: flex; align-items: center">
              <img
                style="width: 2rem; height: 2rem; vertical-align: middle"
                src="../../assets/images/wxzf.jpg"
                alt=""
                srcset=""
              />微信支付
            </div>
           
            <van-icon name="success" v-if="payMethodPopup == 1" />
           
          </div> -->

      <!-- <div class="card-pay-wrap">
              <div class="card-label">福利券支付</div>
              <div class="card-list" v-show="haveCardData">
                <div 
                  class="flex item"
                  v-for="(item,index) in cardList"
                  :key="index"
                  @click="handleClickCardPay(item)">
                  <div class="clearflex card-no">No.{{item.cardNumber}}</div>
                  <div class="price clearflex"><span>(剩余: 
                    <img src="../../assets/images/fu.png">
                    ￥{{item.cardBalance}})</span></div>
                  <div class=""><span class="add-card-link" v-if="item.cardBalance < totalPrice"  @click="goToPayMoney(item,'card')">去充值</span></div>
                  <div class="selected clearflex">
                    <van-icon name="success" v-if="item.selected"/>
                    <van-icon name="success" v-else style="visibility: hidden;"/></div>
                </div>
              </div>
              <div v-show="!haveCardData"><p><span class="add-card-link" @click="goToAddCard">暂无福利券,去添加</span></p></div>
            </div> -->
    </div>
    <div class="footer flex">
      <!-- <van-button type="default">取消</van-button> -->
      <van-button
        v-show="payMethodPopup == 1"
        type="primary"
        readonly
        class="gray-bg btn"
        @click="confirmPay"
        >确认支付</van-button
      >
      <van-button
        :disabled="!(canIsubmit && useedCard)"
        v-show="payMethodPopup == 2"
        type="primary"
        @click="ylPay"
        >确认</van-button
      >
    </div>
    <Card
      v-if="userCardNumber"
      ref="card"
      :txnAmt="totalPrice"
      :orderId="orderId"
      :userCardNumber="userCardNumber"
      :orderPayment="originPrice ? originPrice : totalPrice"
      :buyType="orderType"
    />
  </div>
</template>
<script>
import Card from "./card";
import "../../../static/css/public.css";
export default {
  name: "pay",
  components: {
    Card,
  },
  data() {
    return {
      payMethodPopup: 2,
      userCardNumber: "",
      useedCard: true,
    };
  },
  props: {
    originPrice: {
      type: Number,
    },
    totalPrice: {
      type: Number,
    },
    orderId: {
      type: Number,
    },
    orderType: {
      type: Number,
    },
  },
  watch: {
    originPrice(val) {
      this.originPrice = val;
    },
    totalPrice(val) {
      this.totalPrice = val;
    },
    orderId(val) {
      this.orderId = val;
    },
    orderType(val) {
      this.orderType = val;
    },
    userCardNumber(val) {
      this.$nextTick(() => {
        const strNums = String(this.userCardNumber).split(" ").join("");
        this.compute();
        let str = strNums.split(" ").join("");
        if (str.length > 4)
          str = str.replace(str.slice(0, 4), str.slice(0, 4) + " ");
        if (str.length > 9)
          str = str.replace(str.slice(0, 9), str.slice(0, 9) + " ");
        if (str.length > 14)
          str = str.replace(str.slice(0, 14), str.slice(0, 14) + " ");
        this.userCardNumber = str;
      });
    },
  },
  mounted() {
    this.userCardNumber = localStorage.getItem("ylCard") || "";
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
    handleClose() {
      this.$emit("close");
      this.$router.push({
        name: "orderDetail",
        query: { orderId: this.orderId },
      });
    },
    ylPay() {
      // if (
      //   this.orderType > 0 &&
      //   !(
      //     this.userCardNumber.split(" ").join("").indexOf("6229065") > -1 ||
      //     this.userCardNumber.split(" ").join("").indexOf("6229061") > -1
      //   )
      // ) {
      //   this.$dialog.alert({ message: "您的卡片不能参与活动" });
      //   return;
      // }
      if (this.orderType > 0) {
        this.$axios
          .post({
            url: "/discountsbuylist/findDiscountsbuyFlagBy",
            data: {
              userCardNumber: this.userCardNumber.split(' ').join(''),
              orderId: this.orderId,
            },
          })
          .then((res) => {
            if (res.data.discountsbuyFlag > 0) {
              this.$refs.card.submit();
              this.useedCard = false;
              setTimeout(() => {
                this.useedCard = true;
              }, 3000);
            }
            if (res.data.discountsbuyFlag == 0) {
              this.$dialog.alert({ message: "该卡号暂无参与活动权限" });
            }
            if (res.data.discountsbuyFlag == -1) {
              this.$dialog.alert({
                message: "该卡号本月已参加该活动，不能重复参加",
              });
            }
          });
        return;
      }
      this.$refs.card.submit();
      this.useedCard = false;
      setTimeout(() => {
        this.useedCard = true;
      }, 3000);
    },
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
  },
};
</script>
<style >
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
  font-size: 1.1375rem;
  color: #222222;
  padding: 0.9375rem 0px;
  border-top: 1px solid #f4f4f4;
  border-bottom: 1px solid #f4f4f4;
  text-align: left;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.confirm-pay-wrap .pay-method-wrap .fu-bag-pay .selected {
  font-size: 20px;
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
.confirm-pay-wrap .pay-method-wrap .fu-bag-pay i {
  float: right;
  color: rgb(211, 55, 42);
  font-size: 1rem;
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
  color: #fff;
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
.steppeer {
  text-align: right;
  padding: 0px 0.937rem 0.5rem 0px;
}
.return-btn {
  text-align: center;
  font-size: 14px;
  color: rgb(211, 55, 42);
  margin-top: 5px;
  text-decoration: underline;
}
</style>