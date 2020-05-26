<template>
  <div class="body-wrap">
    <div class="hauto">
      <!-- <div class="price-active"><span>福值活动</span><van-icon name="question" /></div> -->
      <van-nav-bar
        title="我的福包"
        left-text="返回"
        left-arrow
        @click-left="onClickLeft"
      />
      <div class="bag-wrap">
        <div class="image"><img src="../../assets/images/fuBag.png" alt=""></div>
        <div class="price-item">
        <div class="mt15">
          <div class="price-wrap"><img src="../../assets/images/fu.png" alt=""><span>{{accountInfo.accountBalance}}</span></div>
          <!-- <span class="total-value">( 福包总额: <img src="../../assets/images/fu.png">{{accountInfo.accountValue}} )</span> -->
          <div class="propmt f14">余额</div>
        </div>
       <!-- <div class="relative" style="margin-top: 10px;">
         <div class="price-wrap"><span class="price">{{accountInfo.accountValue}}</span></div>
         <div class="propmt">总福值</div>
       </div> -->
       <van-popup v-model="activePopupShow">
          <div>福值活动</div>
      </van-popup>
        </div>
      </div>
      <div>
        <button class="weixin-pay-money-btn" type="button" @click="goToFaceValue">微信充值</button>
        <span class="find-account-list" @click="goToRecord">查看记录</span>
      </div>
    </div>
  </div>
</template>

<script>
import '../../../static/css/public.css'
import bus from '../../assets/js/eventBus'
export default {
  name: 'myFuBag',
  data () {
    return {
     accountInfo:{
      accountBalance:0.00
     },
     openId: null,
     activePopupShow: false,
     pageName:'',
      targetParams:{},
      code:''
    }
  },
  mounted: function(){
    // this.openId = localStorage.getItem('openId');
    // this.openId = this.openId == 'null' ? null:this.openId;
    // this.openId = this.openId == 'undefined' ? undefined:this.openId;
    // if(!this.openId){
    //     /*sessionStorage.setItem('TARGET_PAGE_INFO',JSON.stringify({'name':'myFuBag'}));
    //     window.location.href = 'https://pay.chhtf.com/store/redirectwx';
    //     return;*/
    //     this.code = this.getQueryString('code');
    //     if(this.code){
    //       this.getOpenId();
    //     }else{
    //       this.mygets();
    //     }
    // }
    this.getAccountInfo();
  },
  methods:{
    onClickLeft(){
      this.$router.go(-1);
    },
    goToFaceValue(){
      this.$router.push({name:'faceValueItem',query:{id:this.accountInfo.id,'type':'bag'}});
    },
    goToRecord(){
      this.$router.push({name:'recordList'});
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
    // mygets() {
    //   var redirect_urls= encodeURIComponent("http://wap.chhtf.com/#/myFuBag");
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
.relative{
  position: relative;
}
.mt15{
  margin-top: 15px;
}
.f14{
  font-size: 14px!important;
}
.bag-wrap{
  margin: 3.5625rem 0px;
  text-align: center;
  margin-bottom: 2rem;
}
.bag-wrap .image{
  width: 3.125rem;
  height: 3.125rem;
  margin: 0 auto;
  margin-bottom: 0.9375rem;
}
.bag-wrap .image img{
  width: 100%;
  height: 100%;
}
.bag-wrap .price-item{
  align-items: center;
  width: 15rem;
  margin: 0 auto;
  margin-top: 25px;
}
.bag-wrap .price-wrap{
  color: #000000;
  font-size: 1.25rem;
}
.bag-wrap .price-wrap .price{
  color: #999;
  font-size: 14px;
}
.bag-wrap .price-wrap img{
  position: relative;
  top: 0.15rem;
  width: 1.2rem;
  height: 1.2rem;
  margin-right: 3px;
}
.bag-wrap .propmt{
  color: #999999;
  font-size: 12px;
  margin-top: 0rem;
}
.bag-wrap .total-value{
  font-size: 12px;
  color: #999;
}
.bag-wrap .total-value img{
  position: relative;
  top: 0.1rem;
  width: .8rem;
  height: .8rem;
  margin-right: 2px;
}
.weixin-pay-money-btn{
  display: block;
  background-color: #48B440;
  border-radius: 22px;
  border: none;
  width: 22.1875rem;
  height: 2.75rem;
  margin: 0 auto;
  color: #fff;
  font-size: 1.0625rem;
}
.find-account-list{
  display: block;
  text-align: center;
  font-size: 0.9375rem;
  color: #555555;
  margin-top: 0.5rem;
}
.price-active{
  position: fixed;
  top: 1rem;
  right: 1rem;
  font-size: 14px;
  color: #999;
}
.price-active i{
  font-size: 15px;
  position: relative;
  top: .15rem;
  left: .2rem;
}
/deep/.van-nav-bar__text{
  color: #48B440;
  position: relative;
  top: 1px;
}
/deep/.van-nav-bar .van-icon{
  color: #48B440;
}
</style>
