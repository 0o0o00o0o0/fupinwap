<template>
  <div class="body-wrap">
    <div class="hauto">
      <van-nav-bar
        title="绑定券"
        left-text="返回"
        left-arrow
        @click-left="onClickLeft"
      />
      <div class="address-form">
        <van-cell-group>
          <van-field
            v-model="cardNumber"
            clearable
            label="券号"
          />
          <van-field
            v-model="password"
            type="text"
            label="密码"
            placeholder=""
          />
          <van-field
            v-model="activationCode"
            type="text"
            label="激活码"
            placeholder=""
          />
        </van-cell-group>
      </div>
      <div class="address-save">
        <button class="address-save-btn" type="button" @click="confirmBind">确认绑定</button>
      </div>
    </div>
  </div>
</template>

<script>
import '../../../static/css/public.css'
import bus from '../../assets/js/eventBus'
export default {
  name: 'addAddress',
  data () {
    return {
      cardNumber:'',
      password:'',
      activationCode:'',
      openId:null,
      pageName:'',
      targetParams:{},
      code:''
    }
  },
  mounted: function(){
    this.openId = localStorage.getItem('openId');
    this.openId = this.openId == 'null' ? null:this.openId;
    this.openId = this.openId == 'undefined' ? undefined:this.openId;
    if(!this.openId){
        /*sessionStorage.setItem('TARGET_PAGE_INFO',JSON.stringify({'name':'addCard'}));
        window.location.href = 'https://pay.chhtf.com/store/redirectwx';
        return;*/
        this.code = this.getQueryString('code');
        if(this.code){
          this.getOpenId();
        }else{
          this.mygets();
        }
    }
  },
  methods:{
    onClickLeft(){
      this.$router.go(-1);
    },
    confirmBind(){
      var self = this;
      var params = {};
      params.cardInfo = {};
      params.cardInfo.openid = this.openId;
      params.cardInfo.cardNumber = this.cardNumber;
      params.cardInfo.password = this.password;
      params.cardInfo.activationCode = this.activationCode;

      self.$axios.post({
          url:self.API_KEY.URL_BIND_CARD,
          data: params
      }).then(function(json) {
        if(json.data.errorCode == 1){  //卡号不正确
          self.$toast('卡号不正确');
        }else if(json.data.errorCode == 2){  //密码或激活码不正确
          self.$toast('密码或激活码不正确');
        }else if(json.data.errorCode == 3){
          self.$toast('该卡已绑定，请联系持卡人先解绑后才可重新绑定');
        }else{
          self.$router.push({name:'myCard'});
        }
      }).catch(function(error) {
        
      });
    },
    mygets() {
      let redirect_urls= encodeURIComponent("http://wap.chhtf.com/#/addCard");
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
.address-form{
  padding-top: 15px;
}
.address-save{
  margin-top: 30px;
}
.address-save-btn{
  width: 22.1875rem;
  height: 2.75rem;
  margin: 0 auto;
  background-color: rgb(211, 55, 42);
  font-size: 1.0625rem;
  color: #fff;
  text-align: center;
  border: none;
  border-radius: 5px;
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
