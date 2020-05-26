<template>
  <div class="body-wrap" ref="bodyDom" :style="'height:'+bodyHeight+'rem'">
    <div class="hauto">
      <div class="address-wrap flex">
        <div>{{orderInfo.orderStatus | orderStatusFilter}}</div>
      </div>
      <div class="address-info">
        <div><span>{{orderInfo.receiver}}</span><span class="phone">{{orderInfo.phone}}</span></div>
        <div>{{orderInfo.addressDetail}}</div>
      </div>
      <div class="product-list-wrap">
        <van-collapse v-model="activeNames">
          <van-collapse-item title="商品" name="1">
            <div class="product-list">
              <div  v-for="(item,index) in orderInfo.shoppingItemList" :key="index">
                <div class="product-item flex">
                  <div class="clearflex image">
                    <img :src="imgServer+item.coverImage" alt="">
                  </div>
                  <div class="content">
                    <div class="title">{{item.commodityTitle}}  {{item.specificationName}}</div>
                    <div class="info">
                      <div class="price"><img src="../../assets/images/fu.png" alt="">{{item.unitPrice}} *{{item.commoditySize}}</div>
                    </div>
                  </div>
                  <div class="count clearflex">
                    <div class="price" style="margin-top: 1.375rem"><img src="../../assets/images/fu.png" alt="">{{item.unitPrice*item.commoditySize}}</div>
                  </div>
                </div>
                <div class="delivery clearfix" v-show="item.deliveryNumber">

                    <!-- <span class="company clearfix"><label for="">商品总价:</label><span class="pull-right"><img src="../../assets/images/fu.png" alt="">{{item.unitPrice*item.commoditySize}}</span></span> -->
                    <span class="company clearfix"><label for="">运费:</label><span class="pull-right">包邮</span></span>
                    <span class="company clearfix"><label for="">快递公司:</label><span class="pull-right">{{item.deliveryCompany}}</span></span>
                    <span class="company clearfix"><label for="">快递单号:</label><span class="pull-right">{{item.deliveryNumber}}</span><span class="global-copy ctrlDeliveryNumberBtn" id="copy" :data-clipboard-text='item.deliveryNumber' @click="copyDeliveryNumber">复制</span></span>
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
            <div class="label">实付款</div>
            <div class="price"><font><img src="../../assets/images/fu.png" alt=""></font><span>{{orderInfo.actualPayment}}</span></div>
          </div>
        </div>
      </div>
      <div class="order-info-wrap">
          <div class="flex info-item">
            <div class="label clearflex">订单编号</div>
            <div class="flex">
              <div>{{orderInfo.orderReference}}</div>
              <div class="clearflex"><span class="copy ctrlBtn" id="copy" :data-clipboard-text='orderInfo.orderReference' @click="copyOrderNumber">复制</span></div>
            </div>
          </div>
          <div class="flex info-item">
            <div class="label clearflex">付款时间</div>
            <div class="flex">
              <div v-if="orderInfo.paymentTime">{{orderInfo.paymentTime}}</div>
              <div v-else></div>
            </div>
          </div>
          <div class="flex info-item" v-show="orderInfo.orderStatus == 2">
            <div class="label clearflex">快递单号</div>
            <div class="flex">
              <div v-if="orderInfo.paymentTime">{{orderInfo.deliveryNumber}}</div>
              <div v-else></div>
            </div>
          </div>
      </div>
      <div class="footer" v-show="orderInfo.orderStatus == 0">
          <van-button type="primary" class="continue-pay" @click="continuePay">继续支付</van-button>
          <van-button type="primary" class="continue-pay gray" @click="cancelOrder">取消订单</van-button>
      </div>
      <div class="return-btn" @click="goToBack"><span>返回</span></div>
    </div>
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
</template>

<script>
import '../../../static/css/public.css'
import bus from '../../assets/js/eventBus'
import Clipboard from 'clipboard'
export default {
  name: 'confirmOrder',
  data () {
    return {
      bodyHeight:35,
      activeNames:['1'],
      payMethod:'1',
      orderId:null,
      orderInfo:{
        deliveryNumber:'',
        deliveryCompany:'',
        fee:''
      },
      imgServer: this.API_KEY.IMG_SERVER,
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
      openId:null,
      pageName:'',
      targetParams:{},
      code:''
    }
  },
  mounted: function(){
    this.orderId = this.$route.query.orderId || '';
    this.bodyHeight = (window.innerHeight+15)/16;
    this.openId = localStorage.getItem('openId');
    // this.openId = this.openId == 'null' ? null:this.openId;
    // this.openId = this.openId == 'undefined' ? undefined:this.openId;
    // if(!this.openId){
    //     /*sessionStorage.setItem('TARGET_PAGE_INFO',JSON.stringify({'name':'orderDetail',params:{orderId:this.orderId}}));
    //     window.location.href = 'https://pay.chhtf.com/store/redirectwx';
    //     return;*/
    //     this.code = this.getQueryString('code');
    //     if(this.code){
    //       this.getOpenId();
    //     }else{
    //       this.mygets();
    //     }
    // }
    this.getOrderInfo(this.orderId);
  },
  filters:{
    'orderStatusFilter':function(value){
      switch(parseInt(value)){
        case 0:return '未支付'; break;
        case 1:return '已支付';break;
        case 2:return '已发货';break;
        case 3:return '已收货';break;
        case 4:return '交易成功';break;
        case 5:return '订单失效';break;
        default: return ''
      }
    },
    'paymentWayFilter':function(value){
      switch(parseInt(value)){
        case 0:return '福包';
        case 1:return '福利券';
        default:'';
      };
    },
    toFixedFilter:function(value){
      return value == '无' ? '元' : value.toFixed(2);
    },
  },
  methods:{
    cancelOrder(){
      var self = this;
      var params = {};
      params.orderInfo = {};
      params.orderInfo.openid = this.openId;
      params.orderInfo.id = this.orderId;
      params.orderInfo.orderStatus = 5;

      self.$axios.post({
          url:self.API_KEY.URL_ORDER_UPDATE,
          data: params
      }).then(function(json) {
          self.$toast('已取消');
          self.$router.go(0);
      }).catch(function(error) {
        
      });
    },
    goToBack(){
      if(this.$route.query.pageSource == 'order'){
        this.$router.go(-1);
      }else{
        this.$router.push({name:'index'});
      }
    },
    goToAddCard(){
      this.$router.push({name:'addCard'});
    },
    continuePay(){
      this.payMoneyPopup = true;
      this.getCardInfo();
      this.getAccountInfo();
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
      params.orderInfo.id = this.orderId || 0;

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
    getOrderInfo(id){
      var self = this;
      var params = {};
      params.id = id;

      self.$axios.post({
          url:self.API_KEY.URL_ORDER_FINDBYID,
          data: params
      }).then(function(json) {
        if(json.data.record){
          self.orderInfo = json.data.record;
          self.totalPrice = json.data.record.actualPayment;
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
    copyOrderNumber(){
      let self = this;
      let clipboard  = new Clipboard('.ctrlBtn');
      clipboard.on('success',function(e){
        //self.$message({message:'已复制到剪贴板',type:'success',duration:1500});
        self.$toast('已复制到剪贴板');
        setTimeout(()=>{

        },2000)
        e.clearSelection();
        clipboard.destroy();
      });
    },
    copyDeliveryNumber(){
      let self = this;
      let clipboard  = new Clipboard('.ctrlDeliveryNumberBtn');
      clipboard.on('success',function(e){
        //self.$message({message:'已复制到剪贴板',type:'success',duration:1500});
        self.$toast('已复制到剪贴板');
        setTimeout(()=>{

        },2000)
        e.clearSelection();
        clipboard.destroy();
      });
    },
    hiddenSubmitPrompt(){
      this.$toast('余额不足，请更换支付方式，或去充值');
    },
    goToIndex(){
      this.$router.push({name:'index'});
    },
    // mygets() {
    //   var redirect_urls= encodeURIComponent("http://wap.chhtf.com/#/orderDetail");
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
  padding-bottom: 4rem;
}
.hauto{
    height: auto;
}
.mr20{
  margin-right: 1.25rem;
}
.address-wrap{
  height: 5.3125rem;
  width: 100%;
  background-color: #48B440;
  color: #fff;
  align-items: center;
  text-align: left;
  padding: 0 15px;
  font-size: 1.0625rem;
}
.address-wrap .location{
  padding: 0px 5px 0px 15px;
}
.address-wrap .content{
  font-size: 0.9375rem;
  text-align: left;
}
.address-wrap .arrow{
  width: 2.5rem;
  text-align: center;
}
.product-list-wrap{
  margin-top: 10px;
  background: #fff;
}
.product-list{

}
.product-item{
  padding: 10px 15px;
}
.product-item .image{
  width: 3.4375rem;
  height: 3.4375rem;
}
.product-item .image img{
  width: 100%;
  height: 100%;
}
.product-item .content{
  text-align: center;
  padding-left: 10px;
}
.product-item .content .title{
  text-align: left;
  color: #222;
  font-size: 0.9375rem;
}
.product-item .content .info{
  text-align: center;
  align-items: center;
}
.product-item .content .number{
  color: #A4A4A4;
  text-align: left;
  font-size: 0.8125rem;
}
.product-item .content .number img{
  position: relative;
  top: 0.125rem;
  width: 1rem;
  height: 1rem;
  margin-right: 0.1875rem;
}
.product-item .content .price img{
  position: relative;
  top: 0.05rem;
  width: .8rem;
  height: .8rem;
  margin-right: 0.1875rem;
}
.product-item .content .price{
  width: 5rem;
  color: #A4A4A4;
  text-align: left;
  font-size: 0.8125rem;
  margin-right: 10px;
}
.product-item .count{
  text-align: right;
}
.product-item .price{
  color: #A4A4A4;
  text-align: left;
  font-size: 0.8125rem;
}
.product-item .price img{
  position: relative;
  top: 0.05rem;
  width: .8rem;
  height: .8rem;
  margin-right: 3px;
}
.product-list .delivery{
  font-size: 0.75rem;
  color: #A4A4A4;
  margin: 0 0.9375rem 0 0.9375rem;
  padding: 0rem 0 0.9375rem 0;
  text-align: left;
  border-bottom: 1px solid #eee;
}
.product-list .delivery .company{
  display: block;
  text-align: left;
  margin: 5px 0;
}
.product-list .delivery .company img{
  position: relative;
  top: 0.1em;
  width: .7rem;
  height: .7rem;
  margin-right: 0.28rem;
}
.product-list .delivery .no{
  display: block;
  text-align: left;
  margin: 5px 0;
}

.money-info-wrap{
  padding: 10px 15px;
}
.money-info-wrap .fee-money{
  font-size: 0.8125rem;
  color: #222; 
}
.money-info-wrap .fee-money .label{
  width: 50%;
  text-align: left;
  float: left;
}
.money-info-wrap .fee-money .price{
  width: 50%;
  text-align: right;
  float: right;
}
.money-info-wrap .price-money{
  font-size: 0.875rem; 
  margin-top: 8px;
}
.money-info-wrap .price-money .price font img{
  position: relative;
  top: 0.2rem;
  width: 1rem;
  height: 1rem;
  margin-right: 0.28rem;
}
.money-info-wrap .price-money .label{
  color: #222;
  width: 50%;
  text-align: left;
  float: left;
}
.money-info-wrap .price-money .price{
  color: #FC6036;
  width: 50%;
  text-align: right;
  float: right;
}
.money-info-wrap .price-money .price > span{
  font-size: 0.875rem; 
}
.money-info-wrap .price-money .price > font{
  font-size: 0.8125rem;
}
.address-info{
  text-align: left;
  background-color: #fff;
  padding: 10px 15px;
  font-size: 0.9375rem;
  color: #222;
}
.address-info .phone{
  color: #666;
  font-size: 0.9375rem;
  display: inline-block;
  margin-left: 25px;
}
.order-info-wrap{
  background-color: transparent;
  margin-top: 10px;
  text-align: left;
  padding: 15px 15px;
}
.order-info-wrap{
  color: #777;
  font-size: 0.8125rem;
}
.info-item{
  margin: 5px 0;
  align-items: center;
}
.info-item > div{
  align-items: center;
}
.info-item .label{
  padding-right: 15px;
}
.info-item .copy{
  display: inline-block;
  width: 2.1875rem;
  height: 18px;
  text-align: center;
  border: 1px solid #ccc;
  background-color: #D1D1D1;
  color: #767676;
  line-height: 18px;
  border-radius: 2px;
  font-size: 12px;
  cursor: pointer;
}
.footer{
  width: 100%;
}
.footer .return-index{
  border-radius: 2px;
  width: 40%;
  margin: 0 auto;
  margin-top: 3rem;
  background-color: #ccc;
  font-size: 1.0625rem;
  color: #222;
}
.footer .continue-pay{
  width: 22rem;
  border-radius: 2px;
  margin: 0 auto;
  margin-top: 3rem;
  background-color: #48B440;
  font-size: 1.0625rem;
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
.global-copy{
  float: right;
  display: inline-block;
  width: 2.1875rem;
  height: 1.125rem;
  text-align: center;
  border: 1px solid #ccc;
  background-color: #D1D1D1;
  color: #767676;
  line-height: 1.125rem;
  border-radius: 2px;
  font-size: 0.75rem;
  cursor: pointer;
  margin-right: 5px;
}
.return-btn{
  text-align: center;
  font-size: 14px;
  color: #48B440;
  margin-top: 5px;
  text-decoration: underline;
}
.gray{
  background-color: rgb(241,244,245)!important;
  color: #666;
  margin-top: 15px!important;
}
</style>
