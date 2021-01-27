<template>
  <div class="body-wrap" ref="bodyDom" :style="'height:'+bodyHeight+'rem'">
    <div :class="festivalType == 2 ? 'product-title-img2':'product-title-img'" v-show="!oldTheme">
      <div class="image"><img :src="imgAddress" alt=""></div>
      <!-- <span class="title">{{labelNamelist}}</span> -->
    </div>
    <div class="product-title" v-show="oldTheme">{{labelNamelist}}</div>
    <div class="hauto">
      <van-list
          v-model="loading"
          :error.sync="error"
          :finished="finished"
          error-text="请求失败，刷新重新加载"
          loading-text="加载中"
          finished-text="没有更多啦"
          @load="onLoad"
          offset="50"
        >
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
            <div class="fu-ping" v-show="item.commodityMark == '2'">
              <span class="image"><img src="../../assets/images/fuping.png" alt=""></span><span class="title">扶贫</span>
            </div>
          </div>
          <div class="product-item clearflex clear-css"></div>
        </div>
      </van-list>
      <!-- <div v-show="!haveData"><p class="text-center">暂无商品</p></div> -->
    </div>
  </div>
</template>

<script>
import '../../../static/css/public.css'
import xiaoFei from '../../assets/images/xiaofei.jpg'
import jieRi from '../../assets/images/jieri.jpg'
import youJi from '../../assets/images/youji.jpg'
import tute from '../../assets/images/banner4.jpg'
import duanwujie from '../../assets/images/duanwujie.jpg'
import jianjunjie from '../../assets/images/jianjunjie.jpg'
import fuqingjie from '../../assets/images/fuqingjie.jpg'
import xiazhi from '../../assets/images/xiazhi.jpg'

export default {
  name: 'productList',
  data () {
    return {
      list:[],
      loading: false,
      finished: false,
      error: false,
      bodyHeight:35,
      haveData:true,
      labelNamelist:'湖南土特',
      imgServer:this.API_KEY.IMG_SERVER,
      start:0,
      oldTheme: false,
      imgAddress: '',
      jieriImgArr:[duanwujie,fuqingjie,jianjunjie,xiazhi],
      festivalType:1,
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
      /*sessionStorage.setItem('TARGET_PAGE_INFO',JSON.stringify({'name':'personal'}));
        window.location.href = 'https://pay.chhtf.com/store/redirectwx';
        return;*/
      this.code = this.getQueryString("code");
      if (this.code) {
        this.getOpenId();
      } else {
        this.mygets();
      }
    }
    this.labelNamelist = this.$route.query.labelNamelist || '';
    this.bodyHeight = (window.innerHeight+50)/16;
    this.festivalType = this.$route.query.festivalType || 1;
    switch(this.labelNamelist){
      case '消费扶贫': this.imgAddress = xiaoFei;break;
      case '生态农特': this.imgAddress = youJi;break;
      case '节日福利': this.imgAddress = this.jieriImgArr[parseInt(this.$route.query.index)];break;
      case '湖南土特': this.imgAddress = tute;break;
      default: this.oldTheme = true;
    };
    if(this.festivalType == 2){
      this.oldTheme = false;
      //this.imgAddress = this.jieriImgArr[parseInt(this.$route.query.index)];
      this.imgAddress = sessionStorage.getItem('FESTIVAL_IMG_URL');
    }
    //this.getProductListByLabelName(this.start,this.labelNamelist);
  },
  methods:{
    goToProductDetail(item){
      sessionStorage.removeItem("SPEC_Info");
      this.$router.push({name:'productDetail',query:{productId:item.id}});
    },
    onLoad(){
      this.start++;
      this.getProductListByLabelName(this.start,this.labelNamelist);
    },
    getProductListByLabelName(start,name){
      var self = this;
      var params = {};
      params.page = {};
      params.page.start = start;
      params.page.count = 8;
      params.commodityInfo = {};
      params.commodityInfo.labelNamelist = name;

      self.$axios.post({
          url:self.API_KEY.URL_COMODITYINFO_FINDBYPAGE,
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
        self.error = true;
        self.haveData = false;
      });
    },
    mygets() {
      let redirect_urls= encodeURIComponent("http://wap.chhtf.com/#/productList");
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
  padding-bottom: 3rem;
  background-color: #fff;
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
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
}
.product-item{
  position: relative;
  width: 10.7rem;
  margin: 5px 5px;
  text-align: left;
  border-radius: 5px;
  padding-bottom: 0.8rem;
  background-color: #fff;
  box-shadow: 0px 0px 8px #eee;
}
.product-item .fu-ping{
  position: absolute;
  top: 0;
  left: 0;
  width: 1.7rem;
  height: 2.1rem;
  text-align: center;
  border-radius: 5px 0px 38% 0px;
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
  border-radius: 5px 5px 0 0;
}
.product-item .image img{
  width: 100%;
  height: 100%;
  border-radius: 5px 5px 0 0;
}
.product-item .tag{
  display: block;
  border-radius: 3px;
  font-size: 14px;
  color: #222;
  padding: 0.5rem 0.375rem 0.1375rem 0.375rem;
}
.product-item > .title{
  font-size: 13px;
  color: #777777;
  margin: 6px 0;
  text-overflow:ellipsis; 
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  overflow: hidden;
  height: 2.1875rem;
  padding: 0px 0.375rem;
}
.product-list .price{
  font-size: 14px;
  color: tomato;
  padding: 0px 0.375rem;
}
.product-item .price > em{
  font-style: normal;
}
.product-item .price > span{
  font-size: 0.9375rem;
}
.product-title{
  position: relative;
  font-size: 16px;
  color: #666;
  background-color: #fff;
  padding: 3px 18px;
  text-align: left;
  background-color: #eee;
  height: 35px;
  line-height: 35px;
}
.product-title:before{
  content: '';
  position: absolute;
  left: 8px;
  top: 4px;
  width: 5px;
  height: 80%;
  background-color: rgb(211, 55, 42);
  border-radius: 3px;
}
.product-title-img{
  text-align: left;
}
.product-title-img .image{
  width: 100%;
  height: 9.0625rem;
}
.product-title-img2 .image{
  width: 100;
  height: 12.5rem;
}
.product-title-img .image img{
  width: 100%;
  height: 100%;
}
.product-title-img2 .image img{
  width: 100%;
  height: 100%;
}
.product-title-img{
  margin-bottom: 5px;
}
.product-title-img .title{
  display: inline-block;
  margin-top: 5px;
  font-size: 16px;
  color: #666;
  text-align: left;
  padding-left: 15px;
}
.product-item .price > em img{
  position: relative;
  top: 2px;
  width: 1.1rem;
  height: 1.1rem;
  margin-right: 7px
}
.clear-css{
  background-color: transparent;
  box-shadow: none;
}
</style>
