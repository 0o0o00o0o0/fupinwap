<template>
  <div class="body-wrap">
    <div class="hauto">
      <van-nav-bar
        title="查看记录"
        left-text="返回"
        left-arrow
        @click-left="onClickLeft"
      />
      <div class="price-active"><!-- <span>活动</span> --><van-icon name="question" /></div>
      <div class="total-fu-value" v-if="cardId">
        <div class="title">总福值</div>
        <!-- <img src="../../assets/images/fu.png" alt=""> -->
        <div class="price">{{cardInfo.cardValue}}</div>
      </div>
      <div class="total-fu-value" v-else>
        <div class="title">总福值</div>
        <!-- <img src="../../assets/images/fu.png" alt=""> -->
        <div class="price">{{accountInfo.accountValue}}</div>
      </div>
      <van-tabs v-model="recordActive" @change="handleChangeTab">
        <van-tab title="充值记录">
          <list :conf="accountRecordConf" v-if="isShowAccount"></list>
        </van-tab>
        <van-tab title="消费记录">
          <list :conf="consumeRecordConf" v-if="isShowConsume"></list>
        </van-tab>
      </van-tabs>
    </div>
  </div>
</template>

<script>
import '../../../static/css/public.css'
import bus from '../../assets/js/eventBus'
import list from './list'
export default {
  name: 'myFuBag',
  data () {
    return {
    isShowAccount:true,
    isShowConsume:false,
    accountRecordConf:{
      params:{
        openid:null
      },
      urlKey:this.API_KEY.URL_FIND_RECHARGERECORDLIST_BYOPENID,
      listType:'account'
    },
    consumeRecordConf:{
      params:{
        openid:null
      },
      urlKey:this.API_KEY.URL_FIND_CONSUMPTIONRECORDLIST_BYOPENID,
      listType:'consume'
    },
    openId: null,
    recordActive: 0,
    accountInfo:{
      accountValue:0.00
    },
    cardId:null,
    pageName:'',
    targetParams:{},
    code:'',
    cardInfo:{
        cardNumber:'',
        id:'',
        cardBalance:'',
        deadline:'',
        cardValue:'',
        status:'',
        startDate:''
      }
    }
  },
  components:{
    list
  },
  mounted: function(){
    this.openId = localStorage.getItem('openId');
    this.openId = this.openId == 'null' ? null:this.openId;
    this.openId = this.openId == 'undefined' ? undefined:this.openId;
    this.cardId = this.$route.query.cardId || null;
    if(!this.openId){
        /*sessionStorage.setItem('TARGET_PAGE_INFO',JSON.stringify({'name':'recordList'}));
        window.location.href = 'https://pay.chhtf.com/store/redirectwx';
        return;*/
        this.code = this.getQueryString('code');
        if(this.code){
          this.getOpenId();
        }else{
          this.mygets();
        }
    }
    this.accountRecordConf.params.openid = this.openId;
    this.consumeRecordConf.params.openid = this.openId;
    //this.getRecordInfo();
    if(this.cardId){
      this.getCardInfo(this.cardId);
    }else{
      this.getAccountInfo();
    }
    
  },
  methods:{
    onClickLeft(){
      this.$router.go(-1);
    },
    handleChangeTab(index,title){
      if(index){
        this.isShowConsume = true;
        this.isShowAccount = false;
      }else{
        this.isShowAccount = true;
        this.isShowConsume = false;
      }
    },
    onLoad(){
      this.start++;
      this.getRecordInfo(this.start);
    },
    getCardInfo(id){
      var self = this;
      var params = {};
      params.id = id;

      self.$axios.post({
          url:self.API_KEY.URL_CARD_FINDBYID,
          data: params
      }).then(function(json) {
        if(json.data.record){
          self.cardInfo = json.data.record;
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
    getRecordInfo(start){
      var self = this;
      var params = {};
      params.page = {};
      params.page.start = start;
      params.page.count = 20;

      self.$axios.post({
          url:self.API_KEY.URL_RECHARGERECORD_FINDBYPAGE,
          data: params
      }).then(function(json) {
        if(json.data.list && json.data.list.length>0){
          self.haveData = true;
          for(let i = 0;i<json.data.list.length;i++){
            self.list.push(json.data.list[i]);
          }
          self.loading = false;
          if(self.list.length >= json.data.page.total){
            self.finished = true;
          };
        }else{
          self.finished = true;
          self.haveData = false;
        }
      }).catch(function(error) {
        
        self.haveData = false;
      });
    },
    mygets() {
      let redirect_urls= encodeURIComponent("http://wap.chhtf.com/#/recordList");
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
.record-list{
  margin-top: 15px;
}
.record-item{
  background-color: #fff;
  border-bottom: 1px solid #F4F4F4;
  padding: 0 10px;
  text-align: left;
}
.record-item .title{
  font-size: 0.9375rem;
  color: #222222;
  float: left;
}
.record-item .content{
  padding: 12px 0px 8px 0;
}
.record-item .account{
  font-size: 0.9375rem;
  color: #222;
  float: right;
}
.record-item .time{
  font-size: 0.8125rem;
  color: #999999;
  padding: 0 0 10px 0px;
}
.total-fu-value{
  margin: 2rem auto;
}
.total-fu-value .title{
  font-size: 1.3rem;
  color: #222222;
  margin-right: 5px;
  position: relative;
  top: -.01rem;
}
.total-fu-value img{
  position: relative;
  top: 0.1rem;
  width: 1rem;
  height: 1rem;
}
.total-fu-value .price{
  font-size: 1.185rem;
  color: #777;
}
.price-active{
  position: fixed;
  top: 4.5rem;
  right: 9.1rem;
  font-size: 14px;
  color: #999;
}
.price-active i{
  font-size: 13px;
  position: relative;
  top: .18em;
  left: .2rem;
}
/deep/.van-nav-bar__text{
  color: rgb(211, 55, 42);
  position: relative;
  top: 1px;
}
/deep/.van-nav-bar .van-icon{
  color: rgb(211, 55, 42);
}
</style>
