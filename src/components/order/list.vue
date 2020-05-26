<template>
  <div class="body-wrap" ref="bodyDom" :style="'height:'+bodyHeight+'rem'">
    <div class="hauto">
      <div class="order-list" v-if="haveData">
        <div 
          class="order-item"
          v-for="(item,index) in list"
          :key="index"
          >
          <div class="status-wrap clearfix">
            <!-- <span>,剩余20:19</span> -->
            <span class="order-no"><span>订单号:</span>{{item.orderReference}}<div class="order-time">{{item.paymentTime}}</div></span>
            <span class="status">{{item.orderStatus | orderStatusFilter}}</span>
          </div>
          <div class="flex vh-center">
            <div class="flex">
              <div class="flex content clearflex" @click="goToOrderDetail(item)" v-if="item.haveProduct"
                v-for="(proItem,proIndex) in item.fourCountPro"
                :key="proIndex"
              >
                <div class="image clearflex">
                  <img v-show="proItem.coverImage != undefined" :src="imgServer+proItem.coverImage" alt="">
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
            <div class="clearflex more"  @click="goToOrderDetail(item)"><van-icon name="ellipsis" /></div>
            <div class="clearflex text-right"  @click="goToOrderDetail(item)">
              <div class="total-price"><img src="../../assets/images/fu.png" alt=""><span>{{item.actualPayment}}</span></div>
              <span class="number">共{{item.totalNumber}}件</span>
            </div>
          </div>
          <div class="footer">
           <!--  <div class="order-totalprice"><span>总付款: </span><img src="../../assets/images/fu.png" alt="">{{item.actualPayment}}</div> -->
            <button type="button" class="pay-btn" v-show="item.orderStatus == 0" @click="continuePay(item)">去付款</button>
            <button type="button" class="pay-btn" @click="promptSendGoods(item)" v-if="item.orderStatus == 1&& item.sendGoods">提醒发货</button>
            <button type="button" class="pay-btn" v-else-if="item.orderStatus == 1">已提醒发货</button>
            <button type="button" class="pay-btn" v-show="item.orderStatus == 2" @click="confirmTaleDeliver(item)">确认收货</button>
            <button type="button" class="pay-btn" v-show="item.orderStatus == 0" @click="cancelOrder(item)">取消订单</button>
          </div>
        </div>
        <div class="bottom-prompt">没有更多啦</div>
      </div>
      <div v-else><p>暂无订单</p></div>
      <van-popup v-model="payMoneyPopup" position="bottom">
        <div class="confirm-pay-wrap">
          <div class="title"><van-icon name="cross" @click="payMoneyPopup = false"/>确认付款</div>
          <div class="pay-money"><img src="../../assets/images/fu.png" alt=""><span>{{totalPrice}}</span></div>
          <div class="pay-method-wrap">
            <div class="fu-bag-pay" @click="handleClickFuBagPay">
              <span>福包支付</span><span>&emsp;(剩余: <img src="../../assets/images/fu.png">{{accountInfo.accountBalance | toFixedFilter}})</span>&emsp;<span class="add-card-link" v-if="accountInfo.accountBalance < totalPrice"  @click="goToPayMoney(accountInfo,'bag')">去充值</span>
              <span class="selected">
                <van-icon name="success" v-if="payMethodPopup == 1"/>
                <van-icon name="success" v-else style="visibility: hidden;"/></span>
            </div>
            <div class="card-pay-wrap">
              <div class="card-label">福利券支付</div>
              <div class="card-list" v-show="haveCardData">
                <div 
                  class="flex item"
                  v-for="(item,index) in cardList"
                  :key="index"
                  @click="handleClickCardPay(item)">
                  <div class="clearflex card-no">No.{{item.cardNumber}}</div>
                  <div class="price">(剩余: <img src="../../assets/images/fu.png">{{item.cardBalance}})</div>
                  <div class="selected clearflex">
                    <van-icon name="success" v-if="item.selected"/>
                    <van-icon name="success" v-else style="visibility: hidden;"/></div>
                </div>
              </div>
              <div v-show="!haveCardData"><p><span class="add-card-link" @click="goToAddCard">暂无福利券,去添加</span></p></div>
            </div>
          </div>
        <div class="footer flex">
          <!-- <van-button type="default">取消</van-button> -->
          <van-button 
            type="primary"
            readonly
            class="gray-bg btn"
            v-if="payMethodPopup == 1 && accountInfo.accountBalance < totalPrice"
            @click="hiddenSubmitPrompt">确认支付</van-button>
          <van-button v-else type="primary" @click="confirmPay">立即付款</van-button>
        </div>
        </div>
      </van-popup>
    </div>
  </div>
</template>

<script>
import '../../../static/css/public.css'
import bus from '../../assets/js/eventBus'
export default {
  name: 'navContainer',
  data () {
    return {
      conf:{},
      haveData: true,
      list:[],
      imgServer:this.API_KEY.IMG_SERVER,
      cardSelectedValue:'',
      isShowCard:false,
      cardList:[],
      haveCardData:true,
      payMethodPopup:1,
      accountInfo:{
        accountBalance:0.00
      },
      payMoneyPopup:false,
      totalPrice:'',
      curOrderId:null,
      openId: null,
      bodyHeight:35,
      pageName:'',
      targetParams:{},
      code:''
    }
  },
  mounted: function(){
    this.bodyHeight = (window.innerHeight+180)/16;
    this.conf = this.listConf;
    this.openId = localStorage.getItem('openId');
    // this.openId = this.openId == 'null' ? null:this.openId;
    // this.openId = this.openId == 'undefined' ? undefined:this.openId;
    // if(!this.openId){
    //     /*sessionStorage.setItem('TARGET_PAGE_INFO',JSON.stringify({'name':'orderList'}));
    //     window.location.href = 'https://pay.chhtf.com/store/redirectwx';
    //     return;*/
    //     this.code = this.getQueryString('code');
    //     if(this.code){
    //       this.getOpenId();
    //     }else{
    //       this.mygets();
    //     }
    // }
    this.getOrderListByStatus(this.conf.orderStatus);
  },
  filters:{
    'orderStatusFilter':function(value){
      switch(parseInt(value)){
        case 0:return '未支付';break;
        case 1:return '已支付';break;
        case 2:return '已发货';break;
        case 3:return '已收货';break;
        case 4:return '交易成功';break;
        case 5:return '订单失效';break;
        default:return '';
      }
    },
    toFixedFilter:function(value){
      return value == '无' ? '元' : value.toFixed(2);
    },
  },
  methods:{
    cancelOrder(item){
      var self = this;
      var params = {};
      params.orderInfo = {};
      params.orderInfo.openid = this.openId;
      params.orderInfo.id = item.id;
      params.orderInfo.orderStatus = 5;

      self.$axios.post({
          url:self.API_KEY.URL_ORDER_UPDATE,
          data: params
      }).then(function(json) {
          self.$toast('已取消');
          bus.$emit('setActiveEmpty','');
          self.$router.go(0);
      }).catch(function(error) {
        
      });
    },
    confirmTaleDeliver(item){
      var self = this;
      var params = {};
      params.orderInfo = {};
      params.orderInfo.openid = this.openId;
      params.orderInfo.id = item.id;
      params.orderInfo.orderStatus = 3;

      self.$axios.post({
          url:self.API_KEY.URL_ORDER_UPDATE,
          data: params
      }).then(function(json) {
          self.$toast('已确认收货');
          bus.$emit('setActiveEmpty','');
          self.$router.go(0);
      }).catch(function(error) {
        
      });
    },
    promptSendGoods(item){
      this.$toast('已提醒发货');
      item.sendGoods = false;
    },
    getOrderListByStatus(status){
      var self = this;
      var params = {};
      params.page = {};
      params.page.start = 1;
      params.page.count = 20;
      params.orderInfo = {};
      params.orderInfo.orderStatus = parseInt(status);
      params.orderInfo.openid = this.openId;

      self.$axios.post({
          url:self.API_KEY.URL_ORDER_FINDBYPAGE,
          data: params
      }).then(function(json) {
        if(json.data.list && json.data.list.length>0){
          self.list = json.data.list;
          for(let i = 0;i<self.list.length;i++){
            var totalNumber  = 0;
            var fourCountPro = [];
            self.list[i].shoppingItemList.forEach(function(item,index,arr){
              totalNumber += parseInt(item.commoditySize);
              if(index<4){
                fourCountPro.push(item);
              }
            });

            self.$set(self.list[i],'sendGoods',true);    //添加是否已提醒发货属性

            /*记录没有商品的情况*/
            if(self.list[i].shoppingItemList.length<=0){
              self.$set(self.list[i],'haveProduct',false);
            }else{
              self.$set(self.list[i],'haveProduct',true);
              self.$set(self.list[i],'totalNumber',totalNumber);    //添加订单商品总数属性
              self.$set(self.list[i],'fourCountPro',fourCountPro);    //添加订单商品总数属性
            }
            /*记录没有商品的情况 结束*/
            
          }
          self.haveData = true;
        }else{
          self.haveData = false;
        }
      }).catch(function(error) {
        self.haveData = false;
      });
    },
    goToOrderDetail(item){
      bus.$emit('setActiveEmpty','');
      this.$router.push({name:'orderDetail',query:{orderId:item.id,pageSource:'order'}});
    },
    goToAddCard(){
      this.$router.push({name:'addCard'});
    },
    continuePay(item){
      if(item.shoppingItemList.length>0){
        this.curOrderId = item.id;
        this.totalPrice = item.actualPayment;
        this.payMoneyPopup = true;
        this.getCardInfo();
        this.getAccountInfo();
      }else{
        this.$toast('无商品，该订单有误');
      }
    },
    confirmPay(){
      var self = this;
      var params = {};
      params.orderInfo = {};
      params.orderInfo.openid = this.openId;
      params.orderInfo.actualPayment = this.totalPrice || 0.00;
      if(this.payMethodPopup == 2){
        params.orderInfo.cardId = this.cardSelectedValue;
      }
      params.orderInfo.paymentWay = this.payMethodPopup == 1 ? 0 : 1;
      params.orderInfo.id = this.curOrderId || 0;

      self.$axios.post({
          url:self.API_KEY.URL_ORDER_PAYFORORDER,
          data: params
      }).then(function(json) {
        if(json.data.paySuccessFlag){
          self.payMoneyPopup = false;
          bus.$emit('setActiveEmpty','');
          self.$router.go(0)
          //self.$router.push({name:'orderDetail',query:{orderId:self.orderId}});
        }
      }).catch(function(error) {
        
      });
    },
    getAccountInfo(){
      var self = this;
      var params = {};
      params.openid = this.openId;

      self.$axios.post({
          url:self.API_KEY.URL_ACCOUNTINFO_FIND_BYOPENID,
          data: params
      }).then(function(json) {
        if(json.data.record){
          self.accountInfo = json.data.record;
        }
      }).catch(function(error) {
        
      });
    },
    handleClickFuBagPay(){
      if(this.payMethodPopup == 2){
        for(let i = 0;i<this.cardList.length;i++){
          this.$set(this.cardList[i],'selected',false);
        }
      }
      this.payMethodPopup = 1;
      this.cardSelectedValue = '';
    },
    hiddenSubmitPrompt(){
      this.$toast('余额不足，请更换支付方式，或去充值');
    },
    goToPayMoney(item,type){
      this.$router.push({name:'faceValueItem',query:{id:item.id,type:type}});
    },
    handleClickCardPay(item){
      if(item.cardBalance < this.totalPrice){
        this.$toast('余额不足');
        return false;
      }
      this.payMethodPopup = 2;
      this.cardSelectedValue = item.id;
      if(!item.selected){
        for(let i = 0;i<this.cardList.length;i++){
          this.$set(this.cardList[i],'selected',false);
        }
        item.selected = true;
      }
    },
    getCardInfo(){
      var self = this;
      var params = {};
      params.openid = this.openId;

      self.$axios.post({
          url:self.API_KEY.URL_FIND_MY_CARD,
          data: params
      }).then(function(json) {
        if(json.data.list && json.data.list.length>0){
          self.cardList = json.data.list;
          for(let i = 0;i<self.cardList.length;i++){
            self.$set(self.cardList,'selected',false);
          }
          self.haveCardData = true
        }else{
          self.haveCardData = false;
        }
      }).catch(function(error) {
        self.haveCardData = false;
      });
    },
    // mygets() {
    //   var redirect_urls= encodeURIComponent("http://wap.chhtf.com/#/orderList");
    //   var urls = "https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx93b723928c7e335b&redirect_uri="
    //         +redirect_urls+"&response_type=code&scope=snsapi_userinfo&state=STATE#wechat_redirect";
    //   window.location.href = urls;
    // },
    // getQueryString(name) {
    //   var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
    //     var r = window.location.search.substr(1).match(reg);
    //     if (r != null) return unescape(r[2]); return null;
    // },
    // getOpenId(){
    //   var self = this;
    //   var params = {};
    //   params.code = this.code;
    //   self.$axios.post({
    //       baseURL:'',
    //       url:self.API_KEY.URL_GET_OPENID,
    //       data: params,
    //       needLoading: false
    //   }).then(function(json) {
    //     localStorage.setItem('openId',json.data.openid);
    //     self.openId = json.data.openid;
    //     if(sessionStorage.getItem('TARGET_PAGE_INFO')){
    //       self.pageName = JSON.parse(sessionStorage.getItem('TARGET_PAGE_INFO')).name || null;
    //       self.targetParams = JSON.parse(sessionStorage.getItem('TARGET_PAGE_INFO')).params || null;
    //     }
    //     if(self.openId){
    //       if(self.pageName){
    //         if(self.targetParams){
    //           self.$router.push({name:self.pageName,query:self.targetParams});
    //         }else{
    //           self.$router.push({name:self.pageName});
    //         }
    //       }else{
    //         self.$router.push({name:'index'});
    //       }
    //     }else{
    //       self.$router.push({name:'error'});
    //     }
    //   }).catch(function(error) {
    //   });
    // }
  },
  props:{
    'listConf':{
      type: Object
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.body-wrap{
  /* background: rgb(245,245,245); */
  overflow-y: auto;
  overflow-x: hidden;
  -webkit-overflow-scrolling : touch;
  height: 35rem;
  background: rgb(245,245,245);
}
.hauto{
    height: auto;
}
.order-list{


}
.order-item{
  background-color: #fff;
  border-radius: 5px;
  padding: 10px 15px;
  margin: 10px;
}
.order-item .image{
  width: 3.2rem;
  height: 3.2rem;
  margin-right: 5px;
}
.order-item .image img{
  width: 100%;
  height: 100%;
}
.order-item .status-wrap{
  font-size:13px; 
  color: #2CC972;
  text-align: left;
  padding-bottom: 15px;
}
.order-item .content{
  text-align: left;
}
.order-item .title{
  font-size: 15px;
  color: #222222;
  padding-left: 5px;
}
.order-item .subtitle{
  font-size: 12px;
  color: #A4A4A4;
  padding-left: 5px;
  padding-bottom: 5px;
  padding-top: 5px; 
}
.order-item .price{
  font-size: 13px;
  color: #F64444;
}
.order-item .price img{
  position: relative;
  top: 0.2rem;
  width: 1rem;
  height: 1rem;
  margin-right: 7px;
}
.order-item .size{
  font-size: 12px;
  color: #888888;
  text-align: right;
  padding-top: 10px;
}
.order-item .footer{
  margin-top: 15px;
  border-top: 1px solid #eee;
  padding-top: 5px;
  text-align: right;
}
.order-item .footer button{
  border: none;
  border-radius: 15px;
  padding: 7px 20px;
  background-color: #F3F3F3;
  color: #44AB52;
  font-size: 14px;
  margin-left: 5px;
}
.order-item .order-no{
  float: left;
  font-size: 12px;
  color: #241C1C;
}
.order-item .status{
  float: right;
}
.order-item .order-totalprice{
  text-align: right;
  padding-top: 5px;
  font-size: 14px;
  padding-bottom: 10px;
  color: #666;
}
.order-item .order-totalprice img{
  position: relative;
  top: 0.2rem;
  width: 1rem;
  height: 1rem;
  margin-right: 7px;
}
.order-item .order-time{
  font-size: 12px;
  color: #999999;
  margin-top: -1px;
}
.confirm-pay-wrap{
  width: 100%;
}
.confirm-pay-wrap .title{
  position: relative;
  text-align: center;
  color: #222;
  font-size: 1.0625rem;
  padding: 1.0625rem 0px;
  border-bottom: 1px solid #F4F4F4;
}
.confirm-pay-wrap .title i{
  position: absolute;
  top: 1.1875rem;
  left: 0.625rem;
  font-size: 1.375rem;
  color: #A4A3A3;
}
.confirm-pay-wrap .pay-money{
  margin: 1.4375rem;
  text-align: center;
}
.confirm-pay-wrap .pay-money img{
  position: relative;
  top: -0.05rem;
  width: 1.3rem;
  height: 1.3rem;
  margin-right: 5px;
}
.confirm-pay-wrap .pay-money span{
  font-size: 1.75rem;
  color: #2C2C2C;
}
.confirm-pay-wrap .price-wrap{
  margin: 15px 15px;
  text-align: right;
  color: #666;
  font-size: 14px;
}
.confirm-pay-wrap .price-wrap .price{
  font-size: 20px;
  color: tomato;
}
.confirm-pay-wrap .price-wrap img{
  position: relative;
  top: 2px;
  width: 1.3rem;
  height: 1.3rem;
  margin-right: 2px;
}
.confirm-pay-wrap .pay-method-wrap{
  margin: 0px 10px;
  border-top: 1px solid #F4F4F4;
  text-align: left;
}
.confirm-pay-wrap .pay-method-wrap .fu-bag-pay{
  font-size: 0.9375rem;
  color: #222222;
  padding: 0.9375rem 0px;
  border-top: 1px solid #f4f4f4;
  border-bottom: 1px solid #f4f4f4;
  text-align: left;
}
.confirm-pay-wrap .pay-method-wrap .fu-bag-pay .selected{
  font-size: 20px;
  color: #48B440;
  float: right;
}
.confirm-pay-wrap .pay-method-wrap .fu-bag-pay img{
  position: relative;
  top: 0.09rem;
  width: 0.95rem;
  height: 0.95rem;
  margin-right: 5px;
}
.confirm-pay-wrap .card-pay-wrap .card-label{
  padding: 1.5625rem 0px 0.3125rem 0px;
  font-size: 0.875rem;
  color: #777777;
  border-bottom: 1px solid #f4f4f4;
  text-align: left;
}
.confirm-pay-wrap .card-pay-wrap .item{
  padding: 0.8rem 0px;
  font-size: 0.9375rem;
  color: #222;
  text-align: left;
  align-items: center;
  border-bottom: 1px solid #f4f4f4;
}
.confirm-pay-wrap .card-pay-wrap .item .price{
  padding-left: 8px;
  position: relative;
  top: -2px;
}
.confirm-pay-wrap .card-pay-wrap .item .price img{
  position: relative;
  top: 0.15rem;
  width: 1rem;
  height: 1rem;
  margin-right: 5px;
}
.confirm-pay-wrap .card-pay-wrap .item .selected{
  font-size: 20px;
  color: #48B440;
}
.confirm-pay-wrap .card-pay-wrap .card-list{
  max-height: 8.125rem;
  overflow-y: auto;
}
.confirm-pay-wrap .footer{
  width: 100%;
}
.confirm-pay-wrap .footer button{
  border-radius: 2px;
  width: 21.1875rem;
  margin: 0 auto;
  margin-bottom: 1.1875rem;
  margin-top: 3rem;
  background-color: #48B440;
  font-size: 1.0625rem;
}
.add-card-link{
  display: inline-block;
  color: #48B440;
  font-size: 0.9375rem;
}
.pay-money-card-link{
  display: block;
  color: #48B440;
  font-size: 12px;
  text-decoration: underline;
}
.order-item .total-price{
  font-size: 13px;
  color: #F64444;
}
.order-item .total-price img{
  position: relative;
  top: 0.1rem;
  width: .8rem;
  height: .8rem;
  margin-right: 3px;
}
.order-item .number{
  font-size: 12px;
  color: #888888;
  text-align: right;
}
.order-item .more{
  font-size: 1.25rem;
  color: #CCCCCC;
  margin-right: 0.9375rem;
}
.vh-center{
  justify-content: flex-start;
}
.bottom-prompt{
  font-size: 14px;
  color: #666;
  text-align: center;
  margin: 5px 0;
}
</style>
