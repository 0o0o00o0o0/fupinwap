<template>
  <div class="body-wrap" ref="bodyDom" :style="'height:'+bodyHeight+'rem'">
    <div class="hauto">
      <div class="product-banner-show">
        <van-swipe :autoplay="3000" indicator-color="white">
          <van-swipe-item 
            v-show="productInfo.displayPicList"
            v-for="(item,index) in productInfo.displayPicList"
            :key="index"
            >
            <img :src="imgServer+item.picAddress" alt="" style="width: 100%;height: 100%;">
          </van-swipe-item>
        </van-swipe>
      </div>
      <div class="product-info-wrap">
        <div class="title">{{productInfo.commodityTitle}}&emsp;<span class="f12">{{productInfo.specificationName}}</span></div>
        <div><span class="sub-title">{{productInfo.commoditySubtitle}}</span></div>
        <div class="price-wrap flex">
          <span class="price"><img src="../../assets/images/fu.png" alt=""><span>{{productInfo.displayPrice}}</span> </span>
          <span class="step">{{productInfo.salesVolume}}人购买</span>
        </div>
        <div class="flex setting">
          <div class="item"><span>产地:</span><span> {{productInfo.commodityPlace}}</span></div>
          <div class="item text-right"><span>运费:</span><span> 包邮</span></div>
        </div>
        <div class="flex advance">
          <div class="clearflex block">
            <span class="item"><van-icon name="passed" /><span>基地直供</span></span>
          </div>
          <div class="clearflex block"><span class="item"><van-icon name="passed" /><span>正品保证</span></span></div>
          <div>
            
          </div>
        </div>
      </div>
      <div class="product-detail-info">
        <van-tabs v-model="activeName">
          <van-tab title="商品详情">
              <!-- <img 
                v-show="productInfo.detailPicList"
                :src="imgServer+imgItem.picAddress" v-for="(imgItem,imgIndex) in productInfo.detailPicList" 
                :key="imgIndex"
                style="width: 100%;height: auto;"> -->
                <lazy-component>
                  <img  v-for="(imgItem,imgIndex) in productInfo.detailPicList" 
                :key="imgIndex" v-lazy="imgServer+imgItem.picAddress" style="width: 100%;height: auto;display: block;">
                </lazy-component>
          </van-tab>
          <van-tab title="商品评价">
            <p>暂无商品评价</p>
          </van-tab>
        </van-tabs>
      </div>
      <div class="shopping-cart-bar flex">
        <!-- <div class="flex">
          <div class="menu-item">
            <van-icon name="service-o" />
            <div class="name">
              客服
            </div>
          </div>
          <div class="menu-item" @click="goToIndex">
            <van-icon name="shop-o" />
            <div class="name">
              首页
            </div>
          </div>
          <div class="menu-item" @click="goToCart">
            <van-icon name="cart-o" />
            <div class="name">
              购物车
            </div>
          </div>
        </div>   -->
        <div class="h100 flex" v-if="productInfo.stock>0">
          <div class="flex shopping-nav">
            <div class="clearflex shopping-cart" @click="goToShoppingCart"><van-icon name="shopping-cart-o" /><span class="number" v-show="totalNumber>0">{{totalNumber}}</span></div>
            <div class="clearflex shopping-cart" @click="goToIndex"><van-icon name="wap-home" /></div>
            <div><span class="buy"  @click="goToBuy('body')">立即购买</span></div>
          </div>
          <div class="clearflex h100"><button type="button" class="cart-btn" @click="addShoppingCart('body')">加入购物车</button><!-- <button type="button" class="cart-btn buy-bg" @click="goToBuy">立即购买</button> --></div>  
        </div>
        <div v-else class="h100 flex shopping-nav">
          <div class="clearflex shopping-cart" @click="goToShoppingCart"><van-icon name="shopping-cart-o" /><span class="number" v-show="totalNumber>0">{{totalNumber}}</span></div>
            <div class="clearflex shopping-cart" @click="goToIndex"><van-icon name="wap-home" /></div>
            <div><span class="buy">已售罄</span></div>
        </div>    
      </div>
    </div>
    <van-popup v-model="specPopup" position="bottom">
      <div class="spec-popup">
        <div class="spec-close" @click="handleSpecClose"><van-icon name="cross" /></div>
        <div class="header flex">
          <div class="clearflex image">
            <img :src="imgServer+specInfo.coverImage" alt="">
          </div>
          <div>
            <div class="title">{{productInfo.commodityTitle}}</div>
            <div class="mh15 flex">
              <div class="price-wrap"><img src="../../assets/images/fu.png" alt="">{{specInfo.displayPrice}} <span class="f-gray">*{{specInfo.number}}</span></div>
              <div class="price-wrap clearflex"><img src="../../assets/images/fu.png" alt="">{{specInfo.totalPrice}}</div>
            </div>
          </div>
        </div>  
        <div class="spec-list">
          <div class="label">规格</div>
          <div class="con">
          <span 
            :class="item.active?'item active':'item'" 
            v-for="(item,index) in specInfo.commoditySpecificationList"
            :key="index"
            @click="handleSpecClick(item)">{{item.specificationName}}</span>
          </div>
        </div>
        <div class="number flex">
          <div class="label">数量</div>
          <div class="clearflex">
            <van-stepper v-model="specInfo.number" step="1" @change="handleSpecNumber"/>
          </div>
        </div>
        
        <div class="btn-wrap">
          <button type="button" class="white-btn" @click="goToBuy('popup')">立即购买</button>
          <button type="button" class="green-btn" @click="addShoppingCart('popup')">加入购物车</button>
        </div>
      </div>
    </van-popup>
  </div>
</template>

<script>
import '../../../static/css/public.css'
import { Lazyload } from 'vant';

export default {
  name: 'orderSetting',
  data () {
    return {
      activeName:'商品详情',
      number:1,
      productId:null,
      productNumber:1,
      bodyHeight:35,
      imgServer:this.API_KEY.IMG_SERVER,
      totalNumber:0,
      specPopup:false,
      productInfo:{
        id:"",
        commodityCode:"",
        commodityMark:"",
        commodityTitle:"",
        commoditySubtitle:"",
        originPrice:"",
        displayPrice:"",
        salesVolume:"",
        stock:"",
        coverImage:"",
        labelNamelist:"",
        status:"",
        displayPicList:[],
        detailPicList:[],
      },
      specInfo:{
        displayPrice:'',
        coverImage:'',
        number:1,
        commoditySpecificationList:[],
        totalPrice:''
      },
      openId:null,
      pageName:'',
      targetParams:{},
      code:''
    }
  },
  mounted:function(){
    this.productId = this.$route.query.productId || 0;
    this.bodyHeight = (window.innerHeight+15)/16;
    this.openId = localStorage.getItem('openId');
    // this.openId = this.openId == 'null' ? null:this.openId;
    // this.openId = this.openId == 'undefined' ? undefined:this.openId;
    // if(!this.openId){
    //     /*sessionStorage.setItem('TARGET_PAGE_INFO',JSON.stringify({'name':'productDetail',params:{productId:this.productId}}));
    //     window.location.href = 'https://pay.chhtf.com/store/redirectwx';
    //     return;*/
    //     this.code = this.getQueryString('code');
    //     if(this.code){
    //       this.getOpenId();
    //     }else{
    //       this.mygets();
    //     }
    // }
    this.getProductInfoById(this.productId);
    this.getCartNumber();
    this.$refs.bodyDom.scrollTop = 500;
  },
  methods:{
    handleSpecClose(){
      var self = this;
      self.specInfo.displayPrice = self.productInfo.displayPrice;
      self.specInfo.number = 1;
      self.totalPrice = self.productInfo.displayPrice;
      self.specPopup = false;
    },
    handleSpecClick(item){
      var arr = this.specInfo.commoditySpecificationList;
      for(let i = 0;i<arr.length;i++){
        this.$set(arr[i],'active',false);
      }
      item.active = true;
      sessionStorage.setItem('SPEC_Info',JSON.stringify(item));
      this.specInfo.stock = item.stock;
      this.specInfo.displayPrice = item.displayPrice;
      this.specInfo.totalPrice = parseInt(this.specInfo.number) * parseInt(item.displayPrice);
    },
    handleSpecNumber(number){
      sessionStorage.setItem('BUY_NUMBER',number);
      this.specInfo.totalPrice = parseInt(number) * parseFloat(this.specInfo.displayPrice);
    },
    goToIndex(){
      this.$router.push({name:'index'});
    },
    getCartNumber(){
      var self = this;
      var params = {};
      params.openid = this.openId;
      this.$axios.post({
          url:self.API_KEY.URL_SHOPPINGCART_FINDBYPAGE,
          data: params,
          needLoading: false
      }).then(function(json) {
        if(json.data.list && json.data.list.length>0){
          var arr = json.data.list;
          for(let i = 0;i<arr.length;i++){
            self.totalNumber += arr[i].commoditySize;
          }
        }
      }).catch(function(error) {
        
      });
    },
    addShoppingCart(type){
      if(type == 'popup'){
        var self = this;
        var params = {};
        if(this.specInfo.stock < this.specInfo.number){
          this.$toast('仅剩'+this.specInfo.number+'商品能购买');
          return ;
        }
        params.shoppingCart = {};
        params.shoppingCart.openid = this.openId;
        params.shoppingCart.commodityId = this.productId;
        params.shoppingCart.commoditySize = this.specInfo.number || 1;
        if(sessionStorage.getItem('SPEC_Info')){
          params.shoppingCart.displayPrice = JSON.parse(sessionStorage.getItem('SPEC_Info')).displayPrice;
          params.shoppingCart.specificationName = JSON.parse(sessionStorage.getItem('SPEC_Info')).specificationName;
        }else{
          params.shoppingCart.displayPrice = this.productInfo.displayPrice;
          params.shoppingCart.specificationName = this.productInfo.specificationName;
        }
        
        this.$axios.post({
            url:self.API_KEY.URL_SHOPPINGCART_ADD,
            data: params
        }).then(function(json) {
          self.totalNumber  += self.specInfo.number;
          self.specPopup = false;
          self.specInfo.displayPrice = self.productInfo.displayPrice;
          self.specInfo.number = 1;
          self.totalPrice = self.productInfo.displayPrice;
          //sessionStorage.setItem('ACTIVE_MENU_INDEX',1);
          //self.$router.push({name:'shoppingCart'});
        }).catch(function(error) {
          
        });
      }else{
        if(this.productInfo.specificationFlag == 1){
          this.specPopup = true;
        }else{
          var self = this;
          var params = {};
          params.shoppingCart = {};
          params.shoppingCart.openid = this.openId;
          params.shoppingCart.commodityId = this.productId;
          params.shoppingCart.commoditySize = this.specInfo.number || 1;
          if(sessionStorage.getItem('SPEC_Info')){
            params.shoppingCart.displayPrice = JSON.parse(sessionStorage.getItem('SPEC_Info')).displayPrice;
            params.shoppingCart.specificationName = JSON.parse(sessionStorage.getItem('SPEC_Info')).specificationName;
          }else{
            params.shoppingCart.displayPrice = this.productInfo.displayPrice;
            params.shoppingCart.specificationName = this.productInfo.specificationName;
          }
          
          this.$axios.post({
              url:self.API_KEY.URL_SHOPPINGCART_ADD,
              data: params
          }).then(function(json) {
            self.totalNumber ++;

            //sessionStorage.setItem('ACTIVE_MENU_INDEX',1);
            //self.$router.push({name:'shoppingCart'});
          }).catch(function(error) {
            
          });
        }
      }
      
    },
    goToShoppingCart(){
      sessionStorage.setItem('ACTIVE_MENU_INDEX',1);
      this.$router.push({name:'shoppingCart'});
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
          self.productInfo = json.data.record;
          self.specInfo.displayPrice = self.productInfo.displayPrice;
          self.specInfo.commoditySpecificationList = self.productInfo.commoditySpecificationList;
          self.specInfo.coverImage = self.productInfo.coverImage;
          self.specInfo.totalPrice = self.productInfo.displayPrice;
          var arr = self.specInfo.commoditySpecificationList;
          var obj = {};
          obj.specificationName = self.productInfo.specificationName;
          obj.originPrice = self.productInfo.originPrice;
          obj.displayPrice = self.productInfo.displayPrice;
          obj.freight = self.productInfo.freight;
          obj.stock = self.productInfo.stock;
          arr.unshift(obj);
          for(let i = 0;i<arr.length;i++){
            if(i == 0){
              self.$set(arr[i],'active',true);
            }else{
              self.$set(arr[i],'active',false);
            }
          }
        }else{
          
        }
      }).catch(function(error) {
        self.haveTuTeData = false;
      });
    },
    goToIndex(){
      sessionStorage.setItem('ACTIVE_MENU_INDEX',0);
      this.$router.push({name:'index'});
    },
    goToCart(){
      sessionStorage.setItem('ACTIVE_MENU_INDEX',1);
      this.$router.push({name:'shoppingCart'});
    },
    goToBuy(type){
      if(type == 'popup'){
        sessionStorage.setItem('FIRST_PAGE_SOURCE','buy');
        //sessionStorage.setItem('BUY_CARTLIST_INFO',JSON.stringify(this.productInfo));
        this.$router.push({name:'confirmOrder',query:{pageSource:'buy',productId:this.productId}});
      }else{
        if(this.productInfo.specificationFlag == 1){
          this.specPopup = true;
        }else{
          sessionStorage.setItem('FIRST_PAGE_SOURCE','buy');
          //sessionStorage.setItem('BUY_CARTLIST_INFO',JSON.stringify(this.productInfo));
          this.$router.push({name:'confirmOrder',query:{pageSource:'buy',productId:this.productId}});
        }
      }
    },
    // mygets() {
    //   var redirect_urls= encodeURIComponent("http://wap.chhtf.com/#/productDetail");
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
  padding-bottom: 4rem;
}
.hauto{
    height: auto;
}
.h100{
  height: 100%;
}
.product-banner-show{
  height: 22rem;
}
.product-banner-show .van-swipe{
  width: 100%;
  height: 100%;
}
.product-info-wrap{
  background-color: #fff;
}
.product-info-wrap .title{
  text-align: left;
  font-size: 1.125rem;
  color: #222;
  padding-left: 0.9375rem;
  padding-top: 1.125rem;
}
.product-info-wrap .price-wrap{
  margin-bottom: 0.3125rem;
  text-align: left;
  padding-left: 0.75rem;
}
.product-info-wrap .price-wrap > span{
  display: block;
  flex: 1;
}
.product-info-wrap .price-wrap .step{
  float: right;
  margin-right: 15px;
  font-size: 0.9375rem;
  color: #999999;
  text-align: right;
  position: relative;
  top: 0.3125rem;
}
.product-info-wrap .price{
  font-size: 1.1875rem;
  color: #F64444;
}
.product-info-wrap .price img{
  position: relative;
  top: 2px;
  width: 1.1rem;
  height: 1.1rem;
  margin-right: 7px
}
.product-info-wrap .sub-title{
  display: block;
  padding-left: 0.9325rem;
  padding-right: 0.3rem;
  margin-top: 0.9325rem;
  margin-bottom: 1.1875rem;
  font-size: 0.9325rem;
  color: #777;
  text-align: left;
}
.product-info-wrap .discount{
  display: block;
  color: #44B259;
  font-size: 0.875rem;
  width: 5rem;
  height: 1.5rem;
  line-height: 1.5rem;
  border-radius: 1px;
  margin: 0 auto;
  border: 1px solid #44B259;
  margin-top: 0.375rem;
}
.product-info-wrap .setting{
  align-items: center;
  padding: 0.625rem 0;
  margin-bottom: 0.3125rem;
}
.product-info-wrap .setting .item{
  color: #222;
  font-size: 0.9325rem;
  padding-left: 0.9325rem;
  text-align: left;
}
.product-info-wrap .advance{
  align-items: center;
  justify-content: flex-start;
  border-top: 1px solid #eee;
  padding: 0.9325rem 0;
  text-align: left;
}
.product-info-wrap .advance .item{
  padding-left: 0.9325rem;
  font-size: 0.875rem;
  color: #999;
}
.product-info-wrap .advance .item i{
  position: relative;
  top: 2px;
  font-size: 14px;
  color: #48B440;
  padding-right: 3px;
}
.product-info-wrap .advance .item span{
  font-size: 0.75rem;
  color: #999;
}
.product-detail-info{
  margin-top: 0.625rem;
}
.shopping-cart-bar{
  position: fixed;
  left: 0px;
  bottom: 0px;
  width: 100%;
  height: 3.0625rem;
  background-color: #fff;
  z-index: 2000;
  align-items: center;
  justify-content: center;
  box-shadow: 0px 0px 0.625rem #eee;
}
.shopping-cart-bar > div{
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}
.shopping-cart-bar .cart-btn{
  width: 10.25rem;
  height: 100%;
  background-color: #48B440;
  border: none;
  font-size: 1rem;
  color: #fff;
}
.shopping-cart-bar .cart-btn.buy-bg{
  background-color: rgb(255,81,5);
}
.menu-item{
  border-right: 1px solid #ccc;
}
.menu-item:last-child{
  border-right: none;
}
.menu-item .name{
  font-size: 0.75rem;
  color: #999;
}
.menu-item > i{
  font-size: 1.25rem;
  color: #999;
}
.shopping-nav{
  align-items: center;
  justify-content: 
}
.shopping-nav .shopping-cart{
  font-size: 1.5rem;
  color: #555;
  padding: 0 0.75rem;
  position: relative;
  top: 2px;
  border-right: 1px solid #F4F4F4;
}
.shopping-nav .buy{
  text-align: center;
  font-size: 1.0625rem;
  color: #222;
}
.shopping-cart .number{
  display: block;
  position: absolute;
  right: 0.375rem;
  top: -0.1875rem;
  border-radius: 40%;
  background-color: tomato;
  color: #fff;
  font-size: 0.75rem;
  padding: 1px 0.3rem;
  transform: scale(0.8);
}
.spec-popup{
  height: auto;
}
.spec-popup .header{
  align-items: center;
  text-align: left;
  padding: 15px;
}
.spec-popup .header .image{
  width: 4.375rem;
  height: 4.375rem;
}
.spec-popup .header .image img{
  width: 100%;
  height: 100%;
}
.spec-popup .header .price-wrap img{
  position: relative;
  top: 2px;
  width: 1rem;
  height: 1rem;
  margin-right: 3px
}
.spec-popup .header .title{
  font-size: 16px;
  color: #333;
  margin-left: 15px;
  margin-bottom: 15px;
}
.spec-popup .header .price-wrap{
  font-size: 14px;
  color: #F64444;
}
.spec-popup .header .number{
  font-size: 13px;
  color: #222;
  margin-top: 10px;
  padding-left: 5px;
}
.mh15{
  margin-left: 15px;
  margin-right: 15px;
}
.spec-popup{
  position: relative;
  padding-bottom: 5rem;
}
.spec-popup .number{
  text-align: left;
  margin: 0px 15px;
  margin-top: 25px;
}
.spec-popup .number .label{
  font-size: 14px;
  color: #666;
  margin-bottom: 5px;
  padding-top: 5px;
}
.spec-popup .spec-list{
  text-align: left;
  margin: 15px;
  margin-top: 5px;
}
.spec-popup .spec-list .label{
  font-size: 14px;
  color: #666;
  margin-bottom: 10px;
}
.spec-popup .spec-list .item{
  font-size: 14px;
  background-color: #fff;
  border: 1px solid #ccc;
  border-radius: 3px;
  padding: 3px 8px;
  margin-right: 5px;
  color: #666;
  margin: 5px 5px;
  display: inline-block;
}
.spec-popup .spec-list .item.active{
  background-color: #48B440;
  color: #fff;
  border: 1px solid #48B440;
}
.spec-popup .spec-list .con{

}
.spec-popup .btn-wrap{
  position: absolute;
  bottom: 0;
  left:0;
  width: 100%;
}
.spec-popup .btn-wrap button{
  display: inline-block;
  width: 49%;
  height: 3.0625rem;
  line-height: 3.0625rem;
  font-size: 17px;
  text-align: center;
  border: none;
}
.spec-popup .btn-wrap .white-btn{
  background-color: #fff;
  color: #222;
  border-top: 1px solid #F4F4F4;
}
.spec-popup .btn-wrap .green-btn{
  background-color: #48B440;
  color: #fff;
}
.spec-popup .spec-close{
  position: absolute;
  right: 5px;
  top: 10px;
  font-size: 18px;
  color: #666;
}
.f-gray{
  color: #666;
  font-size: 12px;
}
.text-right{
  text-align: right!important;
  margin-right: 15px;
}
.f12{
  font-size: 14px;
}
</style>
