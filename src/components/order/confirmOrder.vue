<template>
  <div class="body-wrap" ref="bodyDom" :style="'height:'+bodyHeight+'rem'">
    <div class="hauto">
      <div class="address-wrap flex" @click="goToAddressList">
        <div class="clearflex location">
          <van-icon name="location-o" />
        </div>
        <div class="content"  v-show="haveDefaultAddress">
          <div>{{addressInfo.addressDetail}}</div>
          <div><span class="mr20">{{addressInfo.receiver}}</span><span>{{addressInfo.phone}}</span></div>
        </div>
        <div  class="content" v-show="!haveDefaultAddress"><p>请创建地址</p></div>
        <div class="clearflex arrow">
          <van-icon name="arrow" />
        </div>
      </div>
      
      <div class="product-list-wrap">
        <van-collapse v-model="activeNames">
          <van-collapse-item title="已选商品" name="1">
            <div class="product-list" v-show="haveCartData">
              <div
                v-for="(item,index) in cartList"
                :key="index">
                <div class="product-item flex">
                  <div class="clearflex image">
                    <img :src="imgServer+item.commodityInfo.coverImage" alt="">
                  </div>
                  <div class="content">
                    <div class="title">{{item.commodityInfo.commodityTitle}} {{item.specificationName}}</div>
                    <div class="info">
                      <span>{{item.commodityInfo.commoditySubtitle}}</span>
                    </div>
                  </div>
                  <div class="count clearflex">
                    <div class="price"><img src="../../assets/images/fu.png" alt="">{{item.displayPrice}}</div>
                    <div>*{{item.commoditySize}}</div>
                  </div>
                </div>
                <!-- <div class="steppeer"><van-stepper v-model="item.commoditySize" @change="handleChangeProductNumber(item)"/></div> -->
              </div>
            </div>
            <div v-show="!haveCartData"><p class="text-center">未查找到相关商品</p></div>
          </van-collapse-item>
        </van-collapse>
        <div class="money-info-wrap">
          <div class="clearfix fee-money">
            <div class="label">运费</div>
            <div class="price">包邮</div>
          </div>
          <div class="clearfix price-money">
            <div class="label">实付款</div>
            <div class="price"><font><img src="../../assets/images/fu.png" alt=""></font><span>{{totalPrice | toFixedFilter}}</span></div>
          </div>
        </div>
      </div>
      <!-- <div class="pay-method-wrap">
          <van-panel title="支付方式">
            <van-radio-group v-model="payMethod" @change="handleChangePayMethod">
            <div class="method-item flex">
              <div class="name">
                钱包支付
              </div>
              <div class="clearflex money">
                <span>余额:&ensp;</span>
                <span class="value"><img src="../../assets/images/fu.png" alt="">{{accountInfo.accountBalance | toFixedFilter}}</span>
              </div>
              <div class="clearflex invest-money">
                <span v-if="accountInfo.accountBalance < totalPrice">去充值</span>
                <van-radio name="1" checked-color="#07c160" v-else></van-radio>
              </div>
            </div>
            <div class="method-item flex">
              <div class="name">
                福利卡支付
              </div>
              <div class="clearflex">
                <van-radio name="2" checked-color="#07c160"></van-radio>
              </div>
            </div>
            </van-radio-group>
          </van-panel>
      </div> -->
      <div class="submit-order-wrap">
          <button type="button" class="submit-order-btn" @click="submitOrder">提交订单</button>
      </div>
      <div class="return-btn"><span @click="goToBack">返回</span></div>
    </div>
    <van-popup v-model="payMoneyPopup" position="bottom">
        <div class="confirm-pay-wrap">
          <div class="title"><van-icon name="cross" @click="handleClose"/>确认付款</div>
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
                  <div class="price clearflex"><span>(剩余: <img src="../../assets/images/fu.png">{{item.cardBalance}})</span></div>
                  <div class=""><span class="add-card-link" v-if="item.cardBalance < totalPrice"  @click="goToPayMoney(item,'card')">去充值</span></div>
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
export default {
  name: 'confirmOrder',
  data () {
    return {
      bodyHeight:35,
      activeNames:['1'],
      payMethod:'1',
      cardSelectedValue:'',
      isShowCard:false,
      cardList:[],
      haveCardData:true,
      payMethodPopup:1,
      pageSource:null,
      productId:null,
      commoditySize: 1,
      imgServer: this.API_KEY.IMG_SERVER,
      accountInfo:{
        accountBalance:0.00
      },
      productInfo:{},
      payMoneyPopup:false,
      cartList:[],
      addressInfo:{
        receiver:'',
        phone:'',
        addressDetail:''
      },
      totalPrice: '无',
      haveCartData: true,
      haveDefaultAddress: true,
      isChangeNumbering: false,
      orderId:null,
      openId: null,
      pageName:'',
      targetParams:{},
      code:''
    }
  },
  mounted: function(){
    this.bodyHeight = (window.innerHeight+15)/16;
    this.pageSource = this.$route.query.pageSource || 'cart';
    this.openId = localStorage.getItem('openId');
    // this.openId = this.openId == 'null' ? null:this.openId;
    // this.openId = this.openId == 'undefined' ? undefined:this.openId;
    // if(!this.openId){
    //     /*sessionStorage.setItem('TARGET_PAGE_INFO',JSON.stringify({'name':'confirmOrder',params:{pageSource:this.pageSource}}));
    //     window.location.href = 'https://pay.chhtf.com/store/redirectwx';
    //     return;*/
    //     this.code = this.getQueryString('code');
    //     if(this.code){
    //       this.getOpenId();
    //     }else{
    //       this.mygets();
    //     }
    // }
    if(this.pageSource == 'addressList'){
      this.cartList = JSON.parse(sessionStorage.getItem('BUY_CARTLIST_INFO')) || [];
      this.addressInfo = JSON.parse(sessionStorage.getItem('ACTIVE_RECEIVE_ADDRESS')) || {};
      this.getTotalPrice();
    }else if(this.pageSource == 'buy'){
      this.productId = this.$route.query.productId || 0;
      this.commoditySize = this.$route.query.commoditySize ||　1;
      //this.cartList = JSON.parse(sessionStorage.getItem('BUY_CARTLIST_INFO')) || [];
      this.getProductInfoById(this.productId);
      this.getDefaultAddress();
      //this.getTotalPrice();
    }else{
      //this.getCartInfo();
      this.cartList = JSON.parse(sessionStorage.getItem('BUY_CARTLIST_INFO')) || [];
      this.getTotalPrice();
      this.getDefaultAddress();
    }
   
    this.getAccountInfo();
  },
  filters:{
    toFixedFilter:function(value){
      return value == '无' ? '元' : value.toFixed(2);
    },
    cardStatusFilter:function(value){
      switch(parseInt(value)){
        case 1: return '未激活';break;
        case 2: return '正常';break;
        case 3: return '过期冻结';break;
        case 4: return '激活错误冻结';break;
        default: return '';
      };
    }
  },
  methods:{
    goToBack(){
      this.$router.go(-1);
    },
    goToAddCard(){
      this.$router.push({name:'addCard'});
    },
    handleClose(){
      this.payMoneyPopup = false;
      this.$router.push({name:'orderDetail',query:{orderId:this.orderId}});
    },
    goToPayMoney(item,type){
      this.$router.push({name:'faceValueItem',query:{id:item.id,type:type}});
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
          self.$router.push({name:'orderDetail',query:{orderId:self.orderId}});
        }
      }).catch(function(error) {
        
      });
    },
    submitOrder(){
      var self = this;
      var params = {};
      if(this.cartList.length<=0){
        this.$toast('没有商品，请选择商品后，再提交订单');
        return false;
      }
      if(!this.addressInfo.receiver){
        this.$toast('没有完整的地址信息,请选择');
        return false;
      }else if(!this.addressInfo.phone){
        this.$toast('没有完整的地址信息,请选择');
        return false;
      }else if(!this.addressInfo.addressDetail){
        this.$toast('没有完整的地址信息,请选择');
        return false;
      }

      params.orderInfo = {};
      params.orderInfo.openid = this.openId;
      params.orderInfo.actualPayment = this.totalPrice || 0.00;
      //params.orderInfo.paymentWay = this.payMethod == '1' ? 0 : 1;
      params.orderInfo.receiver = this.addressInfo.receiver || '';
      params.orderInfo.orderStatus = 0;
      params.orderInfo.addressDetail = this.addressInfo.addressDetail || '';
      params.orderInfo.phone = this.addressInfo.phone || '';
      params.orderInfo.shoppingItemList = this.getShoppingItemList();

      self.$axios.post({
          url:self.API_KEY.URL_ORDER_ADD,
          data: params
      }).then(function(json) {
        if(json.data.record){
          self.payMoneyPopup = true;
          self.orderId = json.data.record.id;
          self.getCardInfo();
          //self.$router.push({name:'orderDetail',query:{orderId:json.data.record.id}});
        }
      }).catch(function(error) {
        
      });
    },
    getShoppingItemList(){
      var shoppingItemList = [];
      for(let i = 0;i<this.cartList.length;i++){
        let obj = {};
        obj.commodityId = this.cartList[i].commodityId;
        obj.commoditySize = this.cartList[i].commoditySize;
        obj.commodityTitle = this.cartList[i].commodityInfo.commodityTitle;
        /*if(sessionStorage.getItem('SPEC_Info')){
          obj.specificationName = JSON.parse(sessionStorage.getItem('SPEC_Info')).specificationName;
          obj.unitPrice = JSON.parse(sessionStorage.getItem('SPEC_Info')).displayPrice;
        }else{
          obj.specificationName = this.cartList[i].commodityInfo.specificationName || '';
          obj.unitPrice = this.cartList[i].commodityInfo.displayPrice || '';
        }*/
        obj.specificationName = this.cartList[i].specificationName || '';
        obj.unitPrice = this.cartList[i].displayPrice || this.cartList[i].commodityInfo.displayPrice;
        obj.coverImage = this.cartList[i].commodityInfo.coverImage;
        if(this.cartList[i].displayPrice){
          obj.unitTotal = parseFloat((parseFloat(this.cartList[i].commoditySize) * parseFloat(obj.unitPrice)).toFixed(2));
        }else{
          obj.unitTotal = parseFloat((parseFloat(this.cartList[i].commodityInfo.displayPrice) * parseFloat(obj.unitPrice)).toFixed(2));
        }

        shoppingItemList.push(obj);
      }
      return shoppingItemList;
    },
    hiddenSubmitPrompt(){
      this.$toast('余额不足，请更换支付方式，或去充值');
    },
    handleChangeProductNumber(item){
      var self = this;
      var params = {};
      if(this.isChangeNumbering){
        return;
      }
      params.shoppingCart = {};
      params.shoppingCart.openid = this.openId;
      params.shoppingCart.id = item.id;
      params.shoppingCart.commodityId = item.commodityId;
      params.shoppingCart.commoditySize = item.commoditySize;
      
      this.isChangeNumbering = true;
      this.$axios.post({
          url:self.API_KEY.URL_SHOPPINGCART_UPDATE,
          data: params
      }).then(function(json) {
        self.isChangeNumbering = false;
        self.getTotalPrice();
      }).catch(function(error) {
        
      });
    },
    getDefaultAddress(){
      var self = this;
      var params = {};

      params.openid = this.openId;

      self.$axios.post({
          url:self.API_KEY.URL_ADDRESS_FINDBYPAGE,
          data: params,
          needLoading: false
      }).then(function(json) {
        if(json.data.list && json.data.list.length>0){
          self.haveDefaultAddress = true;
          //self.addressInfo = json.data.list[0];
          for(let i = 0;i<json.data.list.length;i++){
            if(json.data.list[i].defaultFlag){
              self.addressInfo = json.data.list[i];
              break;
            }
          }
        }else{
          self.haveDefaultAddress = false;
        }
      }).catch(function(error) {
        self.haveDefaultAddress = false;
      });
    },
    getAccountInfo(){
      var self = this;
      var params = {};
      params.openid = this.openId;

      self.$axios.post({
          url:self.API_KEY.URL_ACCOUNTINFO_FIND_BYOPENID,
          data: params,
          needLoading: false
      }).then(function(json) {
        if(json.data.record){
          self.accountInfo = json.data.record;
        }
      }).catch(function(error) {
        
      });
    },
    getCartInfo(){
      var self = this;
      var params = {};
      params.openid = this.openId;
      this.$axios.post({
          url:self.API_KEY.URL_SHOPPINGCART_FINDBYPAGE,
          data: params
      }).then(function(json) {
        if(json.data.list && json.data.list.length>0){   
          self.cartList = json.data.list;
          self.getTotalPrice();
          self.haveCartData = true;
        }else{
          self.haveCartData = false;
        }
      }).catch(function(error) {
        self.haveCartData = false;
      });
    },
    getTotalPrice(){
      this.totalPrice = 0.00;

      for(let i = 0;i<this.cartList.length;i++){
        if(this.cartList.displayPrice){
          this.totalPrice += parseFloat(this.cartList[i].displayPrice)*parseInt(this.cartList[i].commoditySize).toFixed(2);
        }else{
          this.totalPrice += this.cartList[i].commodityInfo.displayPrice;
        } 
      }
    },
    getProductInfoById(id){
      var self = this;
      var params = {};
      params.id = id;

      self.$axios.post({
          url:self.API_KEY.URL_COMODITYINFO_FINDBYID,
          data: params
      }).then(function(json) {
        if(json.data.record){
          var obj = {};
          self.productInfo = json.data.record;

          if(sessionStorage.getItem('SPEC_Info')){
            obj.commodityId = self.productInfo.id;
            obj.commoditySize = self.commoditySize;
            obj.commodityInfo = self.productInfo;
            obj.specificationName = JSON.parse(sessionStorage.getItem('SPEC_Info')).specificationName;
            obj.commodityInfo.displayPrice = JSON.parse(sessionStorage.getItem('SPEC_Info')).displayPrice;
            obj.commoditySize = sessionStorage.getItem('BUY_NUMBER') || 1;
          }else{
            obj.commodityId = self.productInfo.id;
            obj.commoditySize = self.commoditySize;
            obj.commodityInfo = self.productInfo;
          };
          self.cartList.push(obj);
          self.getTotalPrice();
          sessionStorage.setItem('BUY_CARTLIST_INFO',JSON.stringify(self.cartList));
        }
      }).catch(function(error) {
        
      });
    },
    goToAddressList(){
      sessionStorage.setItem('ADDRESS_PAGE_SOURCE','confirmOrder');
      this.$router.push({name:'addressList'});
    },
    goToIndex(){
      this.$router.push({name:'index'});
    },
    // mygets() {
    //   var redirect_urls= encodeURIComponent("http://wap.chhtf.com/#/confirmOrder");
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
}
.address-wrap .location{
  padding: 0px 5px 0px 15px;
}
.address-wrap .content{
  font-size: 0.9375rem;
  text-align: left;
  padding-right: 8px;
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
  align-items: center;
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
  text-align: left;
  color: #A4A4A4;
  font-size: 12px;
}
.product-item .content .number{
  color: #A4A4A4;
  text-align: left;
  font-size: 0.8125rem;
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
  top: 0.2rem;
  width: 1rem;
  height: 1rem;
  margin-right: 7px;
}
.product-item .content .number img{
  position: relative;
  top: 0.2rem;
  width: 1rem;
  height: 1rem;
  margin-right: 7px;
}
.product-item .content .price img{
  position: relative;
  top: 0.2rem;
  width: 1rem;
  height: 1rem;
  margin-right: 7px;
}
.product-item .content .price{
  width: 4rem;
  color: #A4A4A4;
  text-align: left;
  font-size: 0.8125rem;
  margin-right: 10px;
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
.money-info-wrap .price-money img{
  position: relative;
  top: 0.2rem;
  width: 1rem;
  height: 1rem;
  margin-right: 7px;
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
.pay-method-wrap{
  margin-top: 10px;
}
.method-item{
  height: 2.5rem;
  line-height: 2.5rem;
  text-align: left;
  font-size: 0.875rem;
  padding: 0px 15px;
  align-items: center;
  border-bottom: 1px dashed #eee;
}
.method-item .money{
  position: relative;
  top: 2px;
  font-size: 12px;
  margin-right: 10px;
  color: #48B440;
}
.method-item .money .value img{
  position: relative;
  top: 0.2rem;
  width: 1rem;
  height: 1rem;
  margin-right: 3px;
}
.submit-order-wrap{
  margin-top: 30px;
}
.submit-order-wrap .submit-order-btn{
  width: 22rem;
  margin: 0 auto;
  background-color: #48B440;
  border-radius: 3px;
  height: 44px;
  line-height: 44px;
  color: #fff;
  font-size: 1rem;
  border: none;
}
.submit-order-wrap .return-index-btn{
  width: 40%;
  margin: 0 auto;
  background-color: #ccc;
  border-radius: 3px;
  height: 44px;
  line-height: 44px;
  color: #222;
  font-size: 1rem;
  border: none;
}
.submit-order-wrap .submit-order-btn.gray-bg{
  background-color: #ccc;
  color: #222;
}
.gray-bg{
  background-color: #ccc;
  color: #999;
  border: 1px solid #ccc;
}
.invest-money > span,.invest-money  > span,.invest-money  > span,.invest-money  > span{
  color: #48B440;
  font-size: 14px;
  text-decoration: underline;
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
  color: #fff;
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
.steppeer{
  text-align: right;
  padding: 0px 0.937rem 0.5rem 0px;
}
.return-btn{
  text-align: center;
  font-size: 14px;
  color: #48B440;
  margin-top: 5px;
  text-decoration: underline;
}
</style>
