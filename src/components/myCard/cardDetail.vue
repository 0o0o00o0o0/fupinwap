<template>
  <div class="body-wrap">
    <div class="hauto">
      <van-nav-bar
        title="券详情"
        left-text="返回"
        left-arrow
        @click-left="onClickLeft"
      />
      <div class="card-list">
        <div class="card-item">
          <div class="card-no">NO.{{cardInfo.cardNumber}}</div>
          <div class="card-type flex"><div class="label">{{cardInfo.typeName}}</div><div class="type">{{cardInfo.status | statusFilter}}</div></div>
        </div>
        <div class="card-info">
          <div class="item clearfix">
            <span>总福值：<img src="../../assets/images/fu.png" alt="">{{cardInfo.cardValue}}</span>
            <span class="pull-right">余额：<img src="../../assets/images/fu.png" alt="">{{cardInfo.cardBalance}}</span>
        </div>
          <div class="item"><span>有效日期：<span class="f12">{{cardInfo.deadline}} ~ {{cardInfo.startDate}}</span></span></div>
        </div>
      </div>
      <div class="mt80">
        <button class="add-card-btn" type="button" v-show="cardInfo.status == 2" @click="toFuBagPopup = true">转入福包</button>
         <button class="add-card-btn" type="button" v-show="cardInfo.status == 2" @click="goToFaceValue">充值</button>
         <button class="add-card-btn" type="button" v-show="cardInfo.status == 3" @click="cancelBindPopup = true">解冻</button>
      </div>
      <div>
        <span class="find-account-list" @click="goToRecord">查看记录</span>
      </div>
    </div>
     <van-popup v-model="toFuBagPopup">
        <div class="confirm-pay-wrap">
          <div class="title"><van-icon name="cross" @click="toFuBagPopup=false"/>转入福包</div>
          <div class="bag-wrap">
            <div class="balance"><img src="../../assets/images/fu.png" alt="">135</div>
            <div class="server-price">额外扣除1.33福币服务费</div>
          </div>
          <div>
            <button class="popup-confirm">确认</button>
          </div>
        </div>
      </van-popup>
      <van-popup v-model="cancelBindPopup">
        <div class="confirm-pay-wrap">
          <div class="title"><van-icon name="cross" @click="cancelBindPopup=false"/>解冻</div>
          <div class="bag-wrap">
            <div class="server-price mv30"><van-icon name="info-o" />额外扣除30.3福币服务费</div>
          </div>
          <div>
            <button class="popup-confirm">确认</button>
          </div>
        </div>
      </van-popup>
  </div>
</template>

<script>
import '../../../static/css/public.css'
import bus from '../../assets/js/eventBus'
export default {
  name: 'cardDetail',
  data () {
    return {
      cardId:null,
      toFuBagPopup: false,
      cancelBindPopup: false,
      cardInfo:{
        cardNumber:'',
        id:'',
        cardBalance:'',
        deadline:'',
        status:'',
        startDate:''
      },
      pageName:'',
      targetParams:{},
      code:''
    }
  },
  mounted: function(){
    this.cardId = this.$route.query.cardId || 0;
    this.getCardInfoById(this.cardId);
  },
  filters:{
    'statusFilter':function(value){
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
    goToRecord(){
      this.$router.push({name:'recordList',query:{'cardId':this.cardId}});
    },
    onClickLeft(){
      this.$router.go(-1);
    },
    addCard(){
      this.$router.push({name:'addCard'});
    },
    goToFaceValue(){
      this.$router.push({name:'faceValueItem',query:{id:this.cardInfo.id,'type':'card'}});
    },
    getCardInfoById(id){
      var self = this;
      var params = {};
      params.id = id;

      self.$axios.post({
          url:self.API_KEY.URL_CARD_FINDBYID,
          data: params
      }).then(function(json) {
        if(json.data.record){
          var year = '';
          self.cardInfo = json.data.record;
          year = parseInt(json.data.record.deadline.substr(0,4)) + 1 +'';
          self.cardInfo.startDate = year + json.data.record.deadline.substr(4);
        }
      }).catch(function(error) {
        
      });
    },
    // mygets() {
    //   var redirect_urls= encodeURIComponent("http://wap.chhtf.com/#/cardDetail");
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
.mt80{
  margin-top: 5rem;
}
.mv30{
  margin-top: 1.875rem;
  margin-bottom: 0.8125rem;
}
.f12{
  font-size: 0.875rem;
}
.card-list{
  padding-top: 0.3125rem;
  text-align: left;
}
.card-item{
  margin: 0.625rem 0.625rem;
  border-radius: 7px;
  background-color: #fff;
}
.card-item .card-no{
  color: #222222;
  font-size: 0.9375rem;
  padding: 0.3125rem 0.8125rem;
}
.card-item .card-type{
  padding: 1.5625rem 0.8125rem;
  align-items: center;
  justify-content: space-between;
}
.card-item .card-type .label{
  color: #222222;
  font-size: 0.9375rem;
}
.card-item .card-type .type{
  position: relative;
  top: -3px;
  color: #999999;
  font-size: 0.8125rem;
  text-align: right;
}
.add-card-btn{
  display: block;
  width: 22.1875rem;
  height: 2.75rem;
  margin: 0.9375rem auto;
  background-color: #48B440;
  font-size: 1.0625rem;
  color: #fff;
  text-align: center;
  border: none;
  border-radius: 2px;
  cursor: pointer;
}
.add-card-btn i{
  font-size: 1.25rem;
  position: relative;
  top: 0.25rem;
  margin-right: 0.1875rem;
}
.card-info{
  margin: 0.625rem 0.625rem;
}
.card-info .item{
  margin: 0.3125rem auto;
  font-size: 0.9375rem;
  color: #555555;
}
.card-info .item img{
  position: relative;
  top: 0.2rem;
  width: 1rem;
  height: 1rem;
  margin-right: 7px;
}
.bag-wrap{
  text-align: center;
  padding: 0.4rem 0px;
}
.bag-wrap .balance{
  margin: 0.9375rem auto;
  font-size: 1.75rem;
  color: #2C2C2C;
}
.bag-wrap .balance img{
  position: relative;
  top: 0.2rem;
  width: 1.5rem;
  height: 1.5rem;
  margin-right: 7px;
}
.bag-wrap .server-price{
  font-size: 0.9375rem;
  color: #777777;
}
.bag-wrap .server-price > i{
  position: relative;
  top: 0.25rem;
  padding-right: 0.3125rem;
  font-size: 1.2rem;
  color: #F46565!important;
}
.confirm-pay-wrap{
  width: 19.25rem;
}
.confirm-pay-wrap .title{
  height: 2.8125rem;
  text-align: center;
  line-height: 2.8125rem;
  color: #222;
  font-size: 1rem;
  border-bottom: 1px solid #eee;
  position: relative;
}
.confirm-pay-wrap .title i{
  color: #A4A3A3;
  font-size: 1.3rem;
  position: absolute;
  left: 0.3rem;
  top: 0.8125rem;
}
.popup-confirm{
  width: 15.1875rem;
  height: 2.6875rem;
  margin: 1.4375rem auto;
  background-color: #48B440;
  color: #fff;
  font-size: 1.0625rem;
  border: none;
  border-radius: 2px;
}
/deep/.van-nav-bar__text{
  color: #48B440;
  position: relative;
  top: 1px;
}
/deep/.van-nav-bar .van-icon{
  color: #48B440;
}
.find-account-list{
  display: block;
  text-align: center;
  font-size: 0.9375rem;
  color: #555555;
  margin-top: 0.5rem;
}
</style>
