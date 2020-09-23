<template>
  <div>
    <div style="position: fixed;height: 80px;width: 100%;background: rgb(245,245,245);bottom:0;left:0;z-index: 99999;"></div>
  </div>
</template>

<script>
import '../../../static/css/public.css'
export default {
  name: 'login',
  data () {
    return {
      openId:null,
      pageName:'',
      targetParams:{},
      code:'',
      openIdTime:''
    }
  },
  create:function(){
   
  },
  mounted: function(){
    /*this.openId = this.$route.query.openid || null;
    this.pageName = JSON.parse(sessionStorage.getItem('TARGET_PAGE_INFO')).name;
    this.targetParams = JSON.parse(sessionStorage.getItem('TARGET_PAGE_INFO')).params || null;
    sessionStorage.setItem('openId',this.openId);
    if(this.openId){
      if(this.pageName){
        if(this.targetParams){
          this.$router.push({name:this.pageName,query:this.targetParams});
        }else{
          this.$router.push({name:this.pageName});
        }
      }else{
        this.$router.push({name:'index'});
      }
    }else{
      this.$router.push({name:'error'});
    }*/
    if(localStorage.getItem('OPENIDTIME')){
      this.openIdTime = localStorage.getItem('OPENIDTIME');

      var curTime = new Date();
      var oldTime = new Date(this.openIdTime);
      if(curTime - oldTime >= 2592000){ //2592000
        this.mygets();
      }else{
        this.openId = localStorage.getItem('openId');
        if(sessionStorage.getItem('TARGET_PAGE_INFO')){
          this.pageName = JSON.parse(sessionStorage.getItem('TARGET_PAGE_INFO')).name || null;
          this.targetParams = JSON.parse(sessionStorage.getItem('TARGET_PAGE_INFO')).params || null;
        }
        if(this.openId){
          if(this.pageName){
            if(this.targetParams){
              this.$router.push({name:this.pageName,query:this.targetParams});
            }else{
              this.$router.push({name:this.pageName});
            }
          }else{
            //self.$router.push({name:'index'});
            window.location.href = 'http://wap.chhtf.com/#/navContainer/index';
          }
        }
      }
    }else{
      this.code = this.getQueryString('code');
      if(this.code){
        this.getOpenId();
      }else{
        this.mygets();
      }
    }
    //this.$router.push({name:'index'});
  },
  methods:{
    mygets() {
      var redirect_urls= encodeURIComponent("http://wap.chhtf.com/#/navContainer/login");
      var urls = "https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx93b723928c7e335b&redirect_uri="
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
        var curTime = new Date();
        localStorage.setItem('openId',json.data.openid);
        localStorage.setItem('OPENIDTIME',curTime.getFullYear() + '-' + (curTime.getMonth()+1)+'-'+curTime.getDate()+' '+curTime.getHours()+'-'+curTime.getSeconds()+'-'+curTime.getTime());
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
            //self.$router.push({name:'index'});
            window.location.href = 'http://wap.chhtf.com/#/navContainer/index';
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
.login-wrap{
    position: fixed;
    top: 50%;
    margin-top: -170px;
    left: 50%;
    margin-left: -10.7rem;
    width: 20.25rem;
    border-radius: 6px;
    background-color: #fff;
    padding: 10px;
    height: auto;
}
.login-wrap .title{
  padding: 5px 0px 10px 0px;
  text-align: center;
  font-size: 20px;
  color: #999;
  font-weight: 700;
}
.login-btn{
  width: 18rem;
  height: 35px;
  border: 1px solid rgb(211, 55, 42);
  border-radius: 15px;
  margin: 13px 0px 3px 0px;
  background-color: #fff;
  font-size: 16px;
  color: #666;
}
</style>
