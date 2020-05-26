<template>
  <div class="">
    <transition name="slide-left">
      <router-view class="child-view"></router-view>
    </transition>
    <van-tabbar id="navContainer" v-model="active" @change="handlerChange">
      <!-- <van-tabbar-item icon="shop">
        <span :class="iconActive == 'book'?'text-active':''">首页</span>
        <img
          slot="icon"
          slot-scope="props"
          :src="iconActive == 'book' ? bookIcon.active : bookIcon.normal"
        >
      </van-tabbar-item>
      <van-tabbar-item icon="chat">
        <span :class="iconActive == 'family'?'text-active':''">购物车</span>
        <img
          slot="icon"
          slot-scope="props"
          :src="iconActive == 'family' ? familyIcon.active : familyIcon.normal"
        >
      </van-tabbar-item>
      <van-tabbar-item icon="chat">
        <span :class="iconActive == 'family'?'text-active':''">我的 </span>
        <img
          slot="icon"
          slot-scope="props"  
          :src="iconActive == 'family' ? familyIcon.active : familyIcon.normal"
        >
      </van-tabbar-item> -->
      <van-tabbar-item icon="shop">
        首页
      </van-tabbar-item>
      <van-tabbar-item icon="cart-o" :info="cartProNumber" v-if="cartProNumber>0">
        购物车
      </van-tabbar-item>
      <van-tabbar-item icon="cart-o" v-else>
        购物车
      </van-tabbar-item>
      <van-tabbar-item icon="user-circle-o">
        我的
      </van-tabbar-item>
    </van-tabbar>
  </div>
</template>

<script>
import bus from '../../assets/js/eventBus'
export default {
  name: 'navContainer',
  data () {
    return {
      active: 0,
      cartProNumber:0,
      openId: null,
      pageName:'',
      targetParams:{},
      code:''
    }
  },
  mounted: function(){
    var self = this;
    this.openId = localStorage.getItem('openId');
    this.openId = this.openId == 'null' ? null:this.openId;
    this.openId = this.openId == 'undefined' ? undefined:this.openId;

    
    self.iconActive = sessionStorage.getItem('NAV_MENU_ACTIVE') || 'family';
    if(sessionStorage.getItem('ACTIVE_MENU_INDEX') && sessionStorage.getItem('ACTIVE_MENU_INDEX') != 'null' && sessionStorage.getItem('ACTIVE_MENU_INDEX') != 'undefined'){
      self.active = parseInt(sessionStorage.getItem('ACTIVE_MENU_INDEX')) || 0;
      if(sessionStorage.getItem('ACTIVE_MENU_INDEX') == "productList"){
        self.active = '';
      }
    }else{
      self.active = 0;
    }
    //console.log(this.$route.path);
    this.getCartNumber();
    bus.$on('updateShoppingNumber',function(val){
      self.getCartNumber();
    });
    bus.$on('changeActiveIcon',function(val){
      self.iconActive = val;
    })
    bus.$on('setActiveEmpty',function(val){
      self.active = '';
    });
  },
  methods:{
    handlerChange(index){
      var self = this;
      sessionStorage.setItem('ACTIVE_MENU_INDEX',index);
      if(index == 0){
        self.$router.push({name:'index'});
      }else if(index == 1){
        self.$router.push({name:'shoppingCart'});
      }else if(index == 2){
        self.$router.push({name:'personal'});
      }
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
          self.cartProNumber = 0;
          var arr = json.data.list;
          for(let i = 0;i<arr.length;i++){
            self.cartProNumber += parseInt(arr[i].commoditySize);
          }
        }else{
          self.cartProNumber = 0;
        }
      }).catch(function(error) {
        
      });
    },
    // mygets() {
    //   var redirect_urls= encodeURIComponent("http://wap.chhtf.com/#/navContainer/inde");
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
.van-tabbar-item--active{
  color: #48B440;
}
.text-active{
  color: #48B440;
}
.van-tabbar-item__icon > i{
  font-size: 25px!important;
}
.child-view {
    position: absolute;
    width:100%;
    transition: all .12s ;
}
.slide-left-enter, .slide-right-leave-active {
    opacity: 0;
}
.slide-left-leave-active, .slide-right-enter {
    opacity: 0;
}
</style>
