<template>
  <div class="body-wrap">
    <div class="hauto">
      <div class="shopping-header clearfix">
        <div class="title">商品列表</div>
        <div class="manage" v-show="!operateStatus" @click="operateStatus=!operateStatus">管理</div>
        <div class="manage" v-show="operateStatus" @click="operateStatus=!operateStatus">完成</div>
      </div>
      <div class="product-list" v-show="haveData">
        <div 
          class="product-item flex"
          v-for="(item,index) in cartList"
          :key="index">
          <div class="clearflex checkbox">
            <van-checkbox v-model="item.checked" @change="handleClickCheckbox(item)" checked-color="#07c160"></van-checkbox>
          </div>
          <div class="clearflex image">
            <img :src="imgServer+item.commodityInfo.coverImage" alt="">
          </div>
          <div class="content">
            <div class="title">{{item.commodityInfo.commodityTitle}} {{item.specificationName}}</div>
            <div class="flex">
              <div class="price"><img src="../../assets/images/fu.png" alt="">{{item.displayPrice || item.commodityInfo.displayPrice}}</div>
              <div class="number"><van-stepper v-model="item.commoditySize" 
               @change="handleChangeProductNumber(item)"
                /></div>
            </div>
          </div>
        </div>
      </div>
      <div v-show="!haveData"><p class="text-center">购物车暂无商品</p></div>
      <div class="opreate-bar flex">
        <div class="checkbox-all clearflex"><van-checkbox v-model="chkAll" checked-color="#07c160" @change="handleClickChkAll"><span class="f12">全选</span></van-checkbox></div>
        <div class="flex" v-show="!operateStatus">
          <div class="price-wrap"><span class="label">合计:&emsp;</span><span class="price-icon"><img src="../../assets/images/fu.png" alt=""><span class="price">{{totalPrice | toFixedFilter}}</span></span></div>
          <div class="clearflex balance">
            <button type="button" class="balance-btn" @click="goToBalance">结算</button>
          </div>
        </div>
        <div v-show="operateStatus">
          <div class="text-right">
            <button type="button" class="delete-btn" @click="handleClickDelete">删除</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import bus from '../../assets/js/eventBus'
import '../../../static/css/public.css'
export default {
  name: 'navContainer',
  data () {
    return {
      operateStatus:false,   //默认不可操作
      checked: true,
      cartList:[],
      haveData: true,
      chkAll:true,
      totalPrice:'',
      isChangeNumbering: false,
      imgServer: this.API_KEY.IMG_SERVER,
      openId:null,
      pageName:'',
      targetParams:{},
      code:''
    }
  },
  mounted: function(){
    this.openId = localStorage.getItem('openId');
    // this.openId = this.openId == 'null' ? null:this.openId;
    // this.openId = this.openId == 'undefined' ? undefined:this.openId;
    // if(!this.openId){
    //     /*sessionStorage.setItem('TARGET_PAGE_INFO',JSON.stringify({'name':'shoppingCart'}));
    //     window.location.href = 'https://pay.chhtf.com/store/redirectwx';
    //     return;*/
    //     this.code = this.getQueryString('code');
    //     if(this.code){
    //       this.getOpenId();
    //     }else{
    //       this.mygets();
    //     }
    // }
    this.getCartData();
  },
  watch:{
    'operateStatus':function(value){
      if(value){
        this.handleChangeProductChkStatus(false);
        this.chkAll = false;
      }else{
        this.handleChangeProductChkStatus(true);
        this.chkAll = true;
      }
    },
  },
  filters:{
    toFixedFilter:function(value){
      return value == '' ? '' : value.toFixed(2);
    }
  },
  methods:{
    getTotalPrice(){
      this.totalPrice = 0.00;
      for(let i = 0;i<this.cartList.length;i++){
        this.totalPrice += parseFloat(this.cartList[i].displayPrice)*parseInt(this.cartList[i].commoditySize).toFixed(2);
      }
    },
    goToBalance(){
      var validCartList = [];
      for(let i = 0;i<this.cartList.length;i++){
        if(this.cartList[i].checked){
          validCartList.push(this.cartList[i]);
        }
      }
      sessionStorage.setItem('BUY_CARTLIST_INFO',JSON.stringify(validCartList));
      this.$router.push({name:'confirmOrder',query:{pageSource:'cart'}});
    },
    handleClickCheckbox(item){
      if(item.checked){
        this.totalPrice += parseFloat(item.commodityInfo.displayPrice)*parseInt(item.commoditySize).toFixed(2);
      }else{
        this.totalPrice -= parseFloat(item.commodityInfo.displayPrice)*parseInt(item.commoditySize).toFixed(2);
      }
      
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
        bus.$emit('updateShoppingNumber','');
      }).catch(function(error) {
        
      });
    },
    handleClickDelete(){
      for(let i = 0;i<this.cartList.length;i++){
        if(this.cartList[i].checked){
          this.handleDeleteProductById(this.cartList[i].id);
        }
      }
    },
    handleDeleteProductById(id){
      var self = this;
      var params = {};
      params.id = id;

      this.$axios.post({
          url:self.API_KEY.URL_SHOPPINGCART_DELETEBYID,
          data: params
      }).then(function(json) {
        self.getCartData();
        bus.$emit('updateShoppingNumber','');
      }).catch(function(error) {
        
      });
    },
    handleClickChkAll(chkall){
      if(this.chkAll){
        this.handleChangeProductChkStatus(true);
      }else{
        this.handleChangeProductChkStatus(false);
      }
    },
    handleChangeProductChkStatus(status){
      for(let i = 0;i<this.cartList.length;i++){
        this.$set(this.cartList[i],'checked',status);
      }
    },
    getCartData(){
      var self = this;
      var params = {};
      params.openid = this.openId;
      this.$axios.post({
          url:self.API_KEY.URL_SHOPPINGCART_FINDBYPAGE,
          data: params
      }).then(function(json) {
        if(json.data.list && json.data.list.length>0){
          self.haveData = true;
          self.cartList = json.data.list;
          for(let i = 0;i<self.cartList.length;i++){
            self.$set(self.cartList[i],'checked',true);
            //self.totalPrice += parseFloat(self.cartList[i].displayPrice).toFixed(2);
          }
          self.getTotalPrice();
        }else{
          self.haveData = false;
        }
      }).catch(function(error) {
        self.haveData = false;
      });
    },
    // mygets() {
    //   var redirect_urls= encodeURIComponent("http://wap.chhtf.com/#/navContainer/shoppingCart");
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
.f12{
  font-size: 12px;
}
.shopping-header{
  height: 35px;
  background-color: #fff;
  line-height: 35px;
}
.shopping-header .title{
  float: left;
  width: 45%;
  font-size: 14px;
  color: #222;
  padding-left: 15px;
  text-align: left;
}
.shopping-header .manage{
  width: 3.4375rem;
  height: 26px;
  line-height: 26px;
  color: #fff;
  font-size: 14px;
  border: none;
  border-radius: 13px;
  background-color: #48B440;
  margin-right: 0.8125rem;
  float: right;
  margin-top: 0.3rem;
}
.product-list .product-item{
  background-color: #fff;
  border-radius: 4px;
  padding: 10px 10px 10px 0;
  margin: 15px 15px;
}
.product-list .product-item .checkbox{
  width: 2.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
}
.product-list .product-item .content{
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}
.product-list .product-item .image{
  width: 4.5625rem;
  height: 4.5625rem;
}
.product-list .product-item .image img{
  width: 100%;
  height: 100%;
}
.product-list .product-item .title{
  font-size: 16px;
  color: #222;
  text-align: left;
  margin-left:10px;
}
.product-list .product-item .price{
  font-size: 16px;
  color: #F63232;
  text-align: left;
  margin-left: 10px;
}
.product-list .product-item .price img{
  position: relative;
  top: 2px;
  width: 1.1rem;
  height: 1.1rem;
  margin-right: 7px;
}
.opreate-bar{
  position: fixed;
  width: 100%;
  bottom: 50px;
  height: 40px;
  background-color: #fff;
  align-items: center;
}
.opreate-bar .checkbox-all{
  text-align: left;
  padding-left: 15px;
}
.opreate-bar .label{
  font-size: 14px;
  color: #222;
}
.opreate-bar .price-wrap{
  display: flex;
  align-items: center;
  justify-content: flex-end;
}
.opreate-bar .price-icon{
  font-size: 14px;
  color: #F63232;
  margin-right: 15px;
}
.opreate-bar .price-icon img{
  position: relative;
  top: 2px;
  width: 1.1rem;
  height: 1.1rem;
  margin-right: 5px;
}
.opreate-bar .price{
  font-size: 14px;
  color: #F63232;
}
.opreate-bar .balance-btn{
  width: 3.4375rem;
  height: 26px;
  line-height: 26px;
  color: #fff;
  font-size: 14px;
  border: none;
  border-radius: 13px;
  background-color: #48B440;
  margin-right: 15px;
}
.opreate-bar .delete-btn{
  width: 55px;
  height: 26px;
  line-height: 26px;
  color: #F63232;
  font-size: 12px;
  border: 1px solid #F63232;
  border-radius: 13px;
  background-color: #fff;
  margin-right: 15px;
}
.text-right{
  text-align: right;
}
</style>
