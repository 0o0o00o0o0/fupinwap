<template>
  <div class="body-wrap">
    <div class="hauto">
      <van-nav-bar
        title="我的券"
        left-text="返回"
        left-arrow
        @click-left="onClickLeft"
      />
      <div class="card-list" v-show="haveData">
        <div 
            class="card-item"
            v-for="(item,index) in cardList"
            :key="index"
            @click="goToCardDetail(item)">
          <div class="card-no">NO.{{item.cardNumber}}</div>
          <div class="card-type flex"><div class="label">{{item.typeName}}</div><div class="type">{{item.status | statusFilter}}</div></div>
        </div>
      </div>
      <div v-show="!haveData"><p>暂无有效券</p></div>
      <div class="mt31">
        <button class="add-card-btn" type="button" @click="addCard"><van-icon name="plus" />绑定福利券</button>
      </div>
    </div>
  </div>
</template>

<script>
import '../../../static/css/public.css'
import bus from '../../assets/js/eventBus'
export default {
  name: 'navContainer',
  data () {
    return {
      cardList:[],
      haveDate: true,
      openId: null,
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
        /*sessionStorage.setItem('TARGET_PAGE_INFO',JSON.stringify({'name':'myCard'}));
        window.location.href = 'https://pay.chhtf.com/store/redirectwx';
        return;*/
        this.code = this.getQueryString('code');
        if(this.code){
          this.getOpenId();
        }else{
          this.mygets();
        }
    }
    this.getMyCard();
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
    onClickLeft(){
      this.$router.go(-1);
    },
    addCard(){
      this.$router.push({name:'addCard'});
    },
    goToCardDetail(item){
      this.$router.push({name:'cardDetail',query:{cardId:item.id}});
    },
    getMyCard(){
      var self = this;
      var params = {};
      params.openid = this.openId;

      self.$axios.post({
          url:self.API_KEY.URL_FIND_MY_CARD,
          data: params
      }).then(function(json) {
        if(json.data.list && json.data.list.length>0){
          self.cardList = json.data.list;
          self.haveData = true
        }else{
          self.haveData = false;
        }
      }).catch(function(error) {
        self.haveData = false;
      });
    },
    mygets() {
      var redirect_urls= encodeURIComponent("http://wap.chhtf.com/#/myCard");
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
.mt31{
  margin-top: 1.9375rem;
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
  width: 22.1875rem;
  margin: 0px 0.625rem;
  height: 2.75rem;
  border-radius: 5px;
  border: 1px solid rgb(211, 55, 42);
  color: rgb(211, 55, 42);
  font-size: 1.0625rem;
  background-color: transparent;
  cursor: pointer;
}
.add-card-btn i{
  font-size: 1.25rem;
  position: relative;
  top: 0.25rem;
  margin-right: 0.1875rem;
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
