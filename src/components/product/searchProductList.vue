<template>
  <div class="body-wrap" ref="bodyDom" :style="'height:'+bodyHeight+'rem'">
    <div class="hauto">
      <div class="search-bar-wrap flex">
        <!-- <div class="search-bar">
          <input type="text">
          <span><van-icon name="search" /><span>搜索商品</span></span>
        </div> -->
        <van-icon class="return-btn" name="arrow-left" @click="goToReturn"/>
        <van-search
          v-model="searchValue"
          placeholder="请输入搜索关键词"
          show-action
          shape="round"
        >
          <div slot="action" @click="onSearch">搜索</div>
        </van-search>
      </div>
      <div class="keys-wrap"  v-show="!haveData">
        <span class="item" @click="getProductListByLabelName('鸡蛋')">鸡蛋</span>
        <span class="item" @click="getProductListByLabelName('米')">米</span>
        <span class="item" @click="getProductListByLabelName('油')">油</span>
        <span class="item" @click="getProductListByLabelName('桃')">桃</span>
      </div>
      <div class="product-list flex" v-show="haveData">
        <div 
            class="product-item clearflex"
            v-for="(item,index) in list"
            :key="index"
            @click="goToProductDetail(item)">
          <div class="image">
            <img :src="imgServer+item.coverImage" alt="">
          </div>
          <span class="tag">{{item.commodityTitle}}</span>
          <div class="title">
            {{item.commoditySubtitle}}
          </div>
          <span class="price"><em>
            <!-- <img src="../../assets/images/fu.png" alt=""> -->
            ￥</em><span>{{item.displayPrice}}</span></span>
          <div class="fu-ping" v-show="item.commodityMark == '2'"><span class="image"><img src="../../assets/images/fuping.png" alt=""></span><span class="title">扶贫</span></div>
        </div>
        <div class="product-item clearflex"></div>
      </div>
    </div>
  </div>
</template>

<script>
import '../../../static/css/public.css'
export default {
  name: 'productList',
  data () {
    return {
      list:[],
      haveData:false,
      labelNamelist:null,
      imgServer:this.API_KEY.IMG_SERVER,
      searchValue:'',
      bodyHeight:35,
      pageName:'',
      targetParams:{},
      code:''
    }
  },
  mounted:function(){
      this.openId = localStorage.getItem("openId");
    this.openId = this.openId == "null" ? null : this.openId;
    this.openId = this.openId == "undefined" ? undefined : this.openId;
    if (!this.openId) {
      /*sessionStorage.setItem('TARGET_PAGE_INFO',JSON.stringify({'name':'productDetail',params:{productId:this.productId}}));
        window.location.href = 'https://pay.chhtf.com/store/redirectwx';
        return;*/
      this.code = this.getQueryString("code");
      if (this.code) {
        this.getOpenId();
      } else {
        this.mygets();
      }
    }
    this.bodyHeight = (window.innerHeight)/16;
  },
  methods:{
    goToReturn(){
      this.$router.go(-1);
    },
    goToProductDetail(item){
      sessionStorage.removeItem("SPEC_Info");
      this.$router.push({name:'productDetail',query:{productId:item.id}});
    },
    onSearch(){
      if(this.searchValue){
        this.getProductListByLabelName(this.searchValue);
      }else{
        this.$toast('搜索值不能为空');
        return;
      }
    },
    getProductListByLabelName(title){
      var self = this;
      var params = {};
      params.page = {};
      params.page.start = 1;
      params.page.count = 50;
      params.commodityInfo = {};
      params.commodityInfo.commodityTitle = title;
      this.searchValue = title;
      self.$axios.post({
          url:self.API_KEY.URL_COMODITYINFO_FINDBYPAGE,
          data: params
      }).then(function(json) {
        if(json.data.list && json.data.list.length>0){
          self.haveData = true;
          self.list = json.data.list;
        }else{
          self.$toast('无结果集');
          self.haveData = false;
        }
      }).catch(function(error) {
        self.$toast('无结果集');
        self.haveData = false;
      });
    },
    mygets() {
      let redirect_urls= encodeURIComponent("http://wap.chhtf.com/#/searchProductList");
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
  },
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
  padding-bottom: 1rem;
}
.hauto{
    height: auto;
}
.find-setting-wrap{
  height: 40px;
  background: rgba(239,239,239,.3);
  align-items: center;
  justify-content: center;
}
.find-setting-wrap .setting-item{
  font-size: 14px;
  color: #999;
  position: relative;
}
.find-setting-wrap .setting-item > i{
  font-size: 12px;
  color: #999;
  position: absolute;
}
.find-setting-wrap .setting-item .triangle-up{
  transform: rotate(-90deg);
  top: 1px;
  right: 15px;
}
.find-setting-wrap .setting-item .triangle-down{
  transform: rotate(90deg);
  top: 8px;
  right: 15px;
}
.product-list{
  position: relative;
  background-color: #fff;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
}
.product-item{
  position: relative;
  width: 9.8rem;
  margin: 10px 10px;
  text-align: left;
}
.product-item .fu-ping{
  position: absolute;
  top: 0;
  left: 0;
  width: 1.7rem;
  height: 2.1rem;
  text-align: center;
  border-radius: 0px 0px 38% 0px;
  background: hsla(0, 0%, 100%, 0.79) border-box;
  overflow:hidden;
  box-shadow: 0 0 0 1px hsla(0,0%,100%,.3) inset, 0 0.2em 0.3em rgba(0,0,0,0.2);
  text-shadow: 0 1px 1px hsla(0,0%,100%,.3);
}
.product-item .fu-ping:before{
  content:'';
  position:absolute;
  top:0;
  right:0;
  bottom:0;
  left:0;
  margin:0px;
  z-index:-1;
  -webkit-filter:blur(20px);
  filter:blur(20px);
}
.product-item .fu-ping .image{
  width: 1rem;
  padding: 1px 3px;
  display: block;
  height: 1.2rem;
  margin: 0 auto;
}
.product-item .fu-ping .image img{
  width: 100%;
  height: 100%;
}
.product-item .fu-ping .title{
  font-size: 12px;
  color: rgb(211, 55, 42);
  text-align: center;
  display: block;
  transform: scale(.8);
  margin-top: -3px;
}
.product-item .image{
  width: 100%;
  height: 10rem;
}
.product-item .image img{
  width: 100%;
  height: 100%;
}
.product-item .tag{
  display: block;
  background: rgba(0,180,105,.5);
  border-radius: 3px;
  font-size: 14px;
  padding: 7px 4px;
  color: #196b2e;
}
.product-item > .title{
  font-size: 14px;
  color: #222;
  margin: 6px 0;
  text-overflow:ellipsis; 
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 3;
  overflow: hidden;
  height: 60px;
}
.product-item .price{
  font-size: 14px;
  color: tomato;
}
.product-item .price > em{
  font-style: normal;
}
.product-item .price > em img{
  position: relative;
  top: 2px;
  width: 1.1rem;
  height: 1.1rem;
  margin-right: 7px
}
.product-item .price > span{
  font-size: 18px;
}
.search-bar-wrap{
  background-color: #fff;
  align-items: center;
  justify-content: center;
}
.search-bar{
  position: relative;
  width: 22.1875rem;
  margin: 0px auto;
  padding: 15px 0px;
  height: 28px;
}
.search-bar input{
  width: 100%;
  border: none;
  border-radius: 14px;
  height: 28px;
  line-height: 28px;
  background-color: #fff;
}
.search-bar > span{
  position: absolute;
  left: 50%;
  top: 15px;
  margin-left: -42px;
  font-size: 16px;
  color: #999999;
}
.search-bar > span > i{
  position: relative;
  top: 5px;
  font-size: 20px;
}
.keys-wrap{
  margin-top: 15px;
  text-align: left;
  padding-left: 10px;
}
.keys-wrap .item{
  display: inline-block;
  padding: 5px 15px;
  border-radius: 25px;
  background-color: transparent;
  border: 1px solid rgb(211, 55, 42);
  color: #999;
  font-size: 14px;
  text-align: center;
  margin: 0 8px;
}
.return-btn{
  color: rgb(211, 55, 42);
  font-size: 1.25rem;
  margin-left: 0.3125rem;
}
</style>
