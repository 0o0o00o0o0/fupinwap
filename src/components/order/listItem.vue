<template>
  <div class="ttt">
    <div class="order-item">
      <div class="status-wrap clearfix">
        <!-- <span>,剩余20:19</span> -->
        <span class="order-no"
          ><span>订单号:</span>{{ item.orderReference }}
          <div class="order-time">{{ item.createTime }}</div></span
        >
        <span class="status" v-if="endTimeStr">{{ endTimeStr }}</span>
        <span class="status" v-if="!endTimeStr && item.orderStatus == 5"
          >交易关闭</span
        >
        <span class="f-r" v-if="!endTimeStr && item.orderStatus == 4"
          >交易成功</span
        >
        <span class="f-r" v-if="!endTimeStr && item.orderStatus == 3"
          >待评价</span
        >
        <span class="f-r" v-if="!endTimeStr && item.orderStatus == 2"
          >已发货</span
        >
        <span class="f-r" v-if="!endTimeStr && item.orderStatus == 1"
          >已支付</span
        >
        <span
          class="f-r"
          v-if="!endTimeStr && item.orderStatus == 0 && !canIpay"
          >未支付</span
        >
      </div>
      <div class="flex vh-center" @click="goToOrderDetail(item)">
        <div class="flex">
          <div
            class="flex content clearflex"
            v-if="item.haveProduct"
            v-for="(proItem, proIndex) in item.fourCountPro"
            :key="proIndex"
          >
            <div class="image clearflex">
              <img
                v-show="proItem.coverImage != undefined"
                :src="imgServer + proItem.coverImage"
                alt=""
              />
            </div>
            <!-- <div>
                  <div class="title">{{proItem.commodityTitle}}</div>
                  <div class="subtitle">{{item.shoppingItemList[0].}}</div>
                </div>
                <div class="clearflex">
                  <div class="price"><img src="../../assets/images/fu.png" alt="">{{proItem.unitPrice}}</div>
                  <div class="size">*{{proItem.commoditySize}}</div>
                </div> -->
          </div>
        </div>
        <div class="clearflex more">
          <van-icon name="ellipsis" />
        </div>
        <div class="clearflex text-right">
          <div class="total-price">
            <!-- <img src="../../assets/images/fu.png" alt=""> -->
            <span
              v-if="item.activityFlag == 1"
              style="font-size: 12px; color: red"
              ><del>￥{{ item.actualPayment }}</del></span
            >￥<span>{{
              item.actualPayment - (item.activityFlag == 1 ? item.discounts : 0)
            }}</span>
          </div>
          <span class="number">共{{ item.totalNumber }}件</span>
        </div>
      </div>
      <div class="footer">
        <!--  <div class="order-totalprice"><span>总付款: </span><img src="../../assets/images/fu.png" alt="">{{item.actualPayment}}</div> -->
        <button
          type="button"
          class="pay-btn"
          :disabled="!canIpay"
          v-show="item.orderStatus == 0"
          :style="!canIpay ? 'background-color:gray' : ''"
          @click="goToOrderDetail(item)"
        >
          去付款
        </button>
        <button
          type="button"
          class="pay-btn"
          @click="promptSendGoods(item)"
          v-if="item.orderStatus == 1 && item.sendGoods"
        >
          提醒发货
        </button>
        <button type="button" class="pay-btn" v-else-if="item.orderStatus == 1">
          已提醒发货
        </button>
        <button
          type="button"
          class="pay-btn"
          v-show="item.orderStatus == 2"
          @click="confirmTaleDeliver(item)"
        >
          确认收货
        </button>
        <button
          type="button"
          class="pay-btn"
          v-show="item.orderStatus == 3"
          @click="
            $router.push(
              '/evaluat?' +
                '&itemId=' +
                item.id +
                '&openId=' +
                openId +
                '&productId=' +
                item.shoppingItemList.map((it) => it.commodityId).join(',')
            )
          "
        >
          去评价
        </button>
        <div
          style="color: orange; padding: 7px 10px"
          v-show="item.orderStatus == 4"
        >
          交易完成
        </div>
        <!-- <button
              type="button"
              class="pay-btn"
              v-show="item.orderStatus == 0"
              @click="cancelOrder(item)"
            >取消订单</button> -->
      </div>
    </div>
  </div>
</template>
<script>
import bus from "../../assets/js/eventBus";
export default {
  data() {
    return {
      imgServer: this.API_KEY.IMG_SERVER,
      endTimeStr: "",
      canIpay: true,
      Time: null,
    };
  },
  mounted: function () {
    if (this.item.orderStatus == 0 && this.item.endTime) {
      this.Time = setInterval(() => {
        if (new Date(this.item.endTime).getTime() - new Date().getTime() <= 0) {
          let par = {};
          par.orderInfo = {};
          par.orderInfo.openid = this.openId;
          par.orderInfo.id = this.item.id;
          par.orderInfo.orderStatus = 5;

          this.$axios
            .post({
              url: this.API_KEY.URL_ORDER_UPDATE,
              data: par,
            })
            .then(function (json) {})
            .catch(function (error) {});
          this.endTimeStr = "剩余:00分00秒";
          clearInterval(this.Time);
          this.canIpay = false;
        } else {
          const t =
            new Date(this.item.endTime).getTime() - new Date().getTime();
          const m = Math.floor(t / (1000 * 60));
          const s = Math.floor((t / 1000) % 60);
          this.endTimeStr =
            "剩余:" + this.putZero(m) + "分" + this.putZero(s) + "秒";
        }
      }, 1000);
    }
  },
  methods: {
    putZero(param) {
      return (param + "").padStart(2, "0");
    },
    confirmTaleDeliver(item) {
      var self = this;
      var params = {};
      params.orderInfo = {};
      params.orderInfo.openid = this.openId;
      params.orderInfo.id = item.id;
      params.orderInfo.orderStatus = 3;

      self.$axios
        .post({
          url: "/orderinfo/update",
          data: params,
        })
        .then(function (json) {
          self.$toast("已确认收货");
          bus.$emit("setActiveEmpty", "");
          self.$router.go(0);
        })
        .catch(function (error) {});
    },
    promptSendGoods(item) {
      this.$toast("已提醒发货");
      item.sendGoods = false;
    },
    continuePay(item) {
      if (item.shoppingItemList.length > 0) {
        this.orderId = item.id;
        localStorage.setItem("orderId", item.id);
        this.totalPrice = item.actualPayment;
        this.payMoneyPopup = true;
        this.getCardInfo();
        this.getAccountInfo();
      } else {
        this.$toast("无商品，该订单有误");
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
    goToOrderDetail(item) {
      bus.$emit("setActiveEmpty", "");
      this.$router.push({
        name: "orderDetail",
        query: { orderId: item.id, pageSource: "order" },
      });
    },
  },
  destroyed: function () {
    clearInterval(this.Time);
  },
  props: {
    item: Object,
    openId: String,
  },
};
</script>
<style  scoped>
.order-item {
  background-color: #fff;
  border-radius: 5px;
  padding: 10px 15px;
  margin: 10px;
}
.order-item .image {
  width: 3.2rem;
  height: 3.2rem;
  margin-right: 5px;
}
.order-item .image img {
  width: 100%;
  height: 100%;
}
.order-item .status-wrap {
  font-size: 13px;
  color: #2cc972;
  text-align: left;
  padding-bottom: 15px;
}
.order-item .content {
  text-align: left;
}
.order-item .title {
  font-size: 15px;
  color: #222222;
  padding-left: 5px;
}
.order-item .subtitle {
  font-size: 12px;
  color: #a4a4a4;
  padding-left: 5px;
  padding-bottom: 5px;
  padding-top: 5px;
}
.order-item .price {
  font-size: 13px;
  color: #f64444;
}
.order-item .price img {
  position: relative;
  top: 0.2rem;
  width: 1rem;
  height: 1rem;
  margin-right: 7px;
}
.order-item .size {
  font-size: 12px;
  color: #888888;
  text-align: right;
  padding-top: 10px;
}
.order-item .footer {
  margin-top: 15px;
  border-top: 1px solid #eee;
  padding-top: 5px;
  text-align: right;
}
.order-item .footer button {
  border: none;
  border-radius: 15px;
  padding: 7px 20px;
  color: #fff;
  background-color: #d33729;
  font-size: 14px;
  margin-left: 5px;
}
.order-item .order-no {
  float: left;
  font-size: 12px;
  color: #241c1c;
}
.order-item .status {
  float: right;
  font-size: 0.8rem;
  color: red;
}
.order-item .order-totalprice {
  text-align: right;
  padding-top: 5px;
  font-size: 14px;
  padding-bottom: 10px;
  color: #666;
}
.order-item .order-totalprice img {
  position: relative;
  top: 0.2rem;
  width: 1rem;
  height: 1rem;
  margin-right: 7px;
}
.order-item .order-time {
  font-size: 12px;
  color: #999999;
  margin-top: -1px;
}
.f-r {
  float: right;
}
</style>