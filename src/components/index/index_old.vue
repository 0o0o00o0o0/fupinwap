<template>
  <div class="body-wrap" ref="bodyDom">
    <div class="hauto">
      <!-- <div class="search-bar-wrap">
        <div class="search-bar" @click="goToSearch">
          <div><input type="text"></div>
          <span><van-icon name="search" /><span>搜索商品</span></span>
        </div>
      </div> -->
      <div class="banner-wrap">
        <!-- <div><button type="button" @click="weixinShareTimeline">分享朋友圈</button></div>
        <div><button type="button" @click="weixinSendAppMessage">分享</button></div> -->
       <!-- <van-swipe :autoplay="3000" indicator-color="white" style="border-radius: 5px;" v-show="isShowBanner">
         <van-swipe-item style="border-radius: 5px;display: block;width: 22.1875rem;height: 10.625rem;margin: 0 auto;border-radius: 5px;"
                   v-for="(item,index) in bannerInfo"
                   :key="index"
                   @click="goToBannerDetail(item)">
           <img :src="imgServer+item.imageUrl" style="width: 100%;height: 100%;border-radius: 5px;">
         </van-swipe-item>
         <van-swipe-item style="border-radius: 5px;" @click="goToProductDetail(item)">
           <div style="width: 22.1875rem;height: 10.625rem;margin: 0 auto;border-radius: 5px;"><img src="../../assets/images/banner2.jpg" style="width: 100%;height: 100%;border-radius: 5px;"></div>
         </van-swipe-item>
         <van-swipe-item style="border-radius: 5px;" @click="goToProductDetail(item)">
           <div style="width: 22.1875rem;height: 10.625rem;margin: 0 auto;border-radius: 5px;"><img src="../../assets/images/banner3.jpg" style="width: 100%;height: 100%;border-radius: 5px;"></div>
         </van-swipe-item>
       </van-swipe> -->
       <mt-swipe :auto="4000" style="height: 10.625rem;">
        <mt-swipe-item
                   style="border-radius: 5px;display: block;width: 22.1875rem;height: 10.625rem;margin: 0 auto;border-radius: 5px;"
                   v-for="(item,index) in bannerInfo"
                   :key="index"
                   ><img @click="goToBannerDetail(item)" :src="imgServer+item.imageUrl" style="width: 100%;height: 100%;border-radius: 5px;"></mt-swipe-item>
      </mt-swipe>
       <!-- <div class="banner-toggle" v-else="isShowBanner" @click="isShowBanner=true"><van-icon name="arrow-up" /><span>展开广告图</span></div> -->
      <!--  <mt-swipe :auto="4000">
       <mt-swipe-item v-for="(item,index) in bannerInfo"
                  :key="index"
                  @click="goToBannerDetail(item)"><div style="width: 22.1875rem;height: 10.625rem;margin: 0 auto;border-radius: 5px;"><img :src="imgServer+item.imageUrl" style="width: 100%;height: 100%;border-radius: 5px;"></div></mt-swipe-item>
            </mt-swipe> -->
        <div class="position-relative">
        <div class="search-bar-wrap" :class="isShowBanner?'search-bar-wrap':'search-bar-wrap top'">
          <div class="search-bar" @click="goToSearch">
            <div><input type="text" placeholder="搜索商品"></div>
            <span><van-icon name="search" /></span>
          </div>
        </div>
        <div style="background-color: #fff;width: 23.4375rem;height: 40px;">
          <div :class="isShowBanner?'tab-wrap':'tab-wrap mn'">
            <van-tabs @click="handleClickTab">
              <!-- <van-tab v-for="index in 8" :title="'标签 ' + index">
                内容 {{ index }}
              </van-tab> -->
              <van-tab title="精选优品">
              </van-tab>
              <van-tab title="生态农特">
                <!-- <orderSetting></orderSetting> -->
              </van-tab>
              <van-tab title="红色粮油">
                <!-- <orderSetting></orderSetting> -->
                <!-- <productList :listConf="pingZhiConf"></productList> -->
              </van-tab>
              <van-tab title="时令果蔬">
                <!-- <orderSetting></orderSetting> -->
                <!-- <productList :listConf="shiLingConf"></productList> -->
              </van-tab>
              <van-tab title="休闲食品">
                <!-- <orderSetting></orderSetting> -->
                <!-- <productList :listConf="xiuXianConf"></productList> -->
              </van-tab>
              <van-tab title="南山草原">
                <!-- <orderSetting></orderSetting> -->
                <!-- <productList :listConf="nanShanConf"></productList> -->
              </van-tab>
            </van-tabs>
          </div>
        </div>
          <div class="tab-container">
            <div class=""  :style="isShowBanner ? '':'overflow-y:auto;height:'+bodyHeight+'rem'"  v-show="tabStatus == 1">
                <div class="flex middle-content">
                  <div class="consume-charitable-wrap" @click="goToProductList(middleImages[0].boardName,middleImages[0].id)">
                    <!-- <p class="title">消费扶贫</p> -->
                    <div class="image">
                      <img :src="imgServer+middleImages[0].imageUrl" alt="">
                    </div>
                  </div>
                  <div> 
                    <div class="ecology-product-wrap" @click="goToProductList(middleImages[1].boardName,middleImages[1].id)">
                      <!-- <p class="title">生态农特</p> -->
                      <div class="image">
                        <img :src="imgServer+middleImages[1].imageUrl" alt="">
                      </div>
                    </div>
                    <div class="holiday-product-wrap" @click="goToProductList(middleImages[2].boardName,middleImages[2].id)">
                      <!-- <p class="title">节日福利</p> -->
                      <div class="image">
                        <img :src="imgServer+middleImages[2].imageUrl" alt="">
                      </div>
                    </div>
                  </div>
                </div>
                <div class="product-wrap">
                  <div class="header">
                    <span class="image"><img src="../../assets/images/tuteBottom.jpg" alt=""></span>
                    <span class="title">湖南土特</span>
                  </div>
                  <!-- <div class="title" @click="goToProductList('湖南土特')">湖南土特<van-icon name="ellipsis" /></div> -->
                  <van-list
                      v-model="loading"
                      :error.sync="error"
                      :finished="finished"
                      error-text="请求失败，刷新重新加载"
                      loading-text="加载中"
                      finished-text="没有更多啦"
                      @load="onLoad"
                    >
                    <div class="flex product-list" v-show="haveTuTeData">
                      <!-- <div 
                          class="product-item clearflex" 
                          @click="goToProductDetail(item)"
                          v-for="(item,index) in tuTeList">
                        <div class="image"><img :src="imgServer+item.coverImage"></div>
                        <span class="name" :title="item.commodityTitle">{{item.commodityTitle}}</span>
                      </div> -->
                        <div
                          class="clearflex item"
                          @click="goToProductDetail(item)"
                          v-for="(item,index) in tuTeList"
                          :key="index"
                          >
                          <div class="image"><img :src="imgServer+item.coverImage" alt=""></div>
                          <div class="title">{{item.commodityTitle}}</div>
                          <div class="price"><img src="../../assets/images/fu.png" alt=""><span>{{item.displayPrice}}</span></div>
                        </div>
                    </div>
                  </van-list>
                  <!-- <div v-show="!haveTuTeData"><p class="text-center pb15">暂无商品</p></div> -->
                </div>
              </div>
              <div v-show="tabStatus == 2">
                <productList :listConf="shengTaiConf" v-if="tabStatus == 2"></productList>
              </div>
              <div v-show="tabStatus == 3">
                <productList :listConf="pingZhiConf" v-if="tabStatus == 3"></productList>
              </div>
              <div v-show="tabStatus == 4">
                <productList :listConf="shiLingConf" v-if="tabStatus == 4"></productList>
              </div>
              <div v-show="tabStatus == 5">
                <productList :listConf="xiuXianConf" v-if="tabStatus == 5"></productList>
              </div>
              <div v-show="tabStatus == 6">
                <productList :listConf="nanShanConf" v-if="tabStatus == 6"></productList>
              </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import bus from '../../assets/js/eventBus'
import '../../../static/css/public.css'
import productList from './list'
import orderSetting from './orderSetting'
import imgUrl from '../../assets/images/banner1.jpg'

export default {
  name: 'index',
  data () {
    return {
      bodyHeight:35,
      tuTeList:[],
      haveTuTeData:true,
      imgServer: this.API_KEY.IMG_SERVER,
      shengTaiConf:{
        labelNamelist:''
      },
      pingZhiConf:{
        labelNamelist:''
      },
      shiLingConf:{
        labelNamelist:''
      },
      xiuXianConf:{
        labelNamelist:''
      },
      nanShanConf:{
        labelNamelist:''
      },
      openId: null,
      imgUrl:imgUrl,
      imgServer: this.API_KEY.IMG_SERVER,
      bannerInfo:[],
      middleImages:[],
      isShowBanner: false,
      loading: false,
      finished: false,
      error: false,
      start: 0,
      scrollTopTime:0,
      tabStatus: 1,
      pageName:'',
      targetParams:{},
      code:''
    }
  },
  mounted:function(){
 
    this.getModuleInfo(1) || [];
    this.getModuleInfo(2) || [];
    this.bodyHeight = (window.innerHeight-50)/16;
    this.getTuTeList();
    this.getWeiXinInfo(this.openId);
    if(document.addEventListener){
      document.addEventListener('WeixinJSBridgeReady', this.weixinShareTimeline, false); }else if(document.attachEvent){
      document.attachEvent('WeixinJSBridgeReady' , this.weixinShareTimeline);document.attachEvent('onWeixinJSBridgeReady',this.weixinShareTimeline);}
    //window.addEventListener('scroll', this.handleScroll, true);
    },
  methods:{
    touchFunc(e){
      if(e.target.y > 10){
        this.isShowBanner = false;
      }else{
        this.isShowBanner = true;
      }
    },
    handleScroll(){
      let clientHeight = document.documentElement.clientHeight || document.body.clientHeight;  
      // 设备/屏幕高度
      //let scrollObj = document.getElementById(div); // 滚动区域
      let scrollTop = document.documentElement.scrollTop || document.body.scrollTop || window.pageYOffset; // div 到头部的距离
      let scrollHeight = document.body.scrollHeight; // 滚动条的总高度

      //滚动条到底部的条件
      if(scrollTop >= 180){
        this.isShowBanner = false;
      }else{
        this.isShowBanner = true;
      }
    },
    onLoad(){
      this.start++;
      this.getTuTeList(this.start);
    },
    getModuleInfo(type){
      var self = this;
      var params = {};
      params.someType = type;

      self.$axios.post({
          url:self.API_KEY.URL_FIND_BOARDINFOLIT_BYBORADTYPE,
          data: params,
          needLoading: false
      }).then(function(json) {
        if(json.data.list){
          if(type == 1){
            self.bannerInfo = json.data.list;
            self.isShowBanner = true;
          }else if(type == 2){
            self.middleImages = json.data.list;
          }
        }
      }).catch(function(error) {
        
      });
    },
    weixinShareTimeline(){
      var self = this;
      WeixinJSBridge.on('menu:share:timeline', function(argv){
        WeixinJSBridge.invoke('shareTimeline',{
          "appid":"",
          "img_url":self.imgServer + self.imgUrl,
          //"img_width":"640",
          //"img_height":"640",
          "link":'https://pay.chhtf.com/store/redirectwx',
          "desc": '测试描述',
          "title":'测试'
        }); 
      });
    },
    weixinSendAppMessage(){
      var self = this;
      WeixinJSBridge.on('menu:share:appmessage', function(argv){
        WeixinJSBridge.invoke('sendAppMessage',{
        "img_url":self.imgServer + self.imgUrl,
        //"img_width":"640",
        //"img_height":"640",
        "link":'https://pay.chhtf.com/store/redirectwx',
        "desc": '测试描述',
        "title":'测试'
        });
      });
    },
    getWeiXinInfo(openid){
      var self = this;
      var params = {};
      params.openid = openid;

      self.$axios.post({
          url:'https://pay.chhtf.com/store/getWxuserInfo',
          data: params,
          needLoading: false
      }).then(function(json) {
        
      }).catch(function(error) {
        
      });
    },
    goToBannerDetail(item){
      var id = parseInt(item.relativeContent);
      sessionStorage.removeItem("SPEC_Info");
      this.$router.push({name:'productDetail',query:{productId:id}});
    },
    goToProductDetail(item){
      sessionStorage.removeItem("SPEC_Info");
      this.$router.push({name:'productDetail',query:{productId:item.id}});
    },
    goToProductList(name,id){
      sessionStorage.setItem('ACTIVE_MENU_INDEX','productList');
      bus.$emit('setActiveEmpty','');
      if(name == '节日福利'){
        this.$router.push({name:'festival',query:{labelNamelist:name,id:id}});
      }else{
        this.$router.push({name:'productList',query:{labelNamelist:name}});
      }
    },
    goToSearch(){
      this.$router.push({name:'searchProductList'});
    },
    handleClickTab(index,title){
      switch(index){
        case 0:this.tabStatus = 1;break;
        case 1:this.shengTaiConf.labelNamelist = title;
               this.tabStatus = 2;
               break;
        case 2:this.pingZhiConf.labelNamelist = title;
               this.tabStatus = 3;
               break;
        case 3:this.shiLingConf.labelNamelist = title;
               this.tabStatus = 4;
               break;
        case 4:this.xiuXianConf.labelNamelist = title;
               this.tabStatus = 5;
               break;
        case 5:this.nanShanConf.labelNamelist = title;
               this.tabStatus = 6;
               break;
      };
    },
    getTuTeList(start){
      var self = this;
      var params = {};
      params.page = {};
      params.page.start = start;
      params.page.count =12;
      params.commodityInfo = {};
      params.commodityInfo.labelNamelist = '湖南土特';

      self.$axios.post({
          url:self.API_KEY.URL_COMODITYINFO_FINDBYPAGE,
          data: params,
          needLoading: false
      }).then(function(json) {
        if(json.data.list && json.data.list.length>0){
          self.haveTuTeData = true;
          for(let i = 0;i<json.data.list.length;i++){
            self.tuTeList.push(json.data.list[i]);
          }
          self.loading = false;
          if(self.tuTeList.length >= json.data.page.total){
            self.finished = true;
          };
        }else{
          self.finished = true;
          self.haveTuTeData = false;
        }
      }).catch(function(error) {
       
        self.haveTuTeData = false;
      });
    },

  },
  components:{
    productList,
    orderSetting
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
  background: #fff;
  padding-bottom: -1rem;
}
.hauto{
    height: auto;
}
.p10{
  padding: 10px;
}
.search-bar-wrap{
  position: absolute;
  right: 1.7rem;
  top: -.5rem;
  z-index: 1000000;
}
.search-bar-wrap.top{
  top: -1.1rem;
}
.search-bar{
  position: relative;
  width: 5.625rem;
  margin: 0px auto;
  padding: 15px 0px;
  height: 28px;
}
.search-bar input{
  width: 100%;
  border: none;
  border-radius: 14px;
  background-color: #F4F4F4;
  border: 1px solid #E9E8E8;
  padding: 7px 6px;
  padding-left: 8px;
}
.search-bar input::-webkit-input-placeholder{
  font-size: 14px;
  color: #999999;
  padding-left: 1.5rem;
}
.search-bar > span{
  position: absolute;
  left: 50%;
  top: 1.0625rem;
  margin-left: -2.625rem;
  font-size: 14px;
  color: #999999;
}
.search-bar > span > i{
  position: relative;
  top: 0.3125rem;
  font-size: 20px;
  left: .6rem;
}
.banner-wrap{
  position: relative;
  width: 22.1875rem;
  top: 0;
  margin: 0 auto;
  padding-top: 10px;
}
.tab-wrap{
  border-radius: 5px;
  width: 15.1875rem;
  margin-top: 8px;
}
.consume-charitable-wrap{
  position: relative;
  padding-right: 10px;
}
.consume-charitable-wrap:before{
  /* content: " ";
  position: absolute;
  right: 0;
  bottom: 0;
  width: 1px;
  height: 100%;
  background-color: #ebedf0;
  transform: scaleX(0.5); */
}
.consume-charitable-wrap .title{
  text-align: left;
  font-size: 14px;
  color: #222222;
  margin: 0px 0px 10px 0px;
}
.consume-charitable-wrap .image{
  height: 12.95rem;
}
.consume-charitable-wrap .image img{
  width: 100%;
  height: 100%;
}
.ecology-product-wrap{
  position: relative;
}
.ecology-product-wrap:before{
  /* content: " ";
  position: absolute;
  left: 0;
  bottom: 0;
  width: 100%;
  height: 1px;
  background-color: #ebedf0;
  transform: scaleY(0.5); */
}
.ecology-product-wrap .title{
  text-align: left;
  font-size: 14px;
  color: #222222;
  margin: 0px 0px 10px 0px;
}
.ecology-product-wrap .image{
  width: auto;
  height: 6.13rem;
}
.ecology-product-wrap .image img{
  width: 100%;
  height: 100%;
}
.holiday-product-wrap{
  padding-top: 10px;
}
.holiday-product-wrap .title{
  text-align: left;
  font-size: 14px;
  color: #222222;
  margin: 0px 0px 10px 0px;
}
.holiday-product-wrap .image{
  width: auto;
  height: 6.13rem;
}
.holiday-product-wrap .image img{
  width: 100%;
  height: 100%;
}
.product-wrap{
  margin-top: 15px;
  border-radius: 5px;
  margin-bottom: 65px;
}
.product-wrap .product-list{
  flex-wrap: nowrap;
  overflow-x: auto;
  flex-wrap: wrap;
}
/* .product-wrap .title{
  font-size: 16px;
  color: #222;
  padding: 10px 15px;
  text-align: left;
}
.product-wrap .title i{
  float: right;
  font-size: 22px;
  color: #999;
}
.product-wrap .header .image{
  width: 8.25rem;
  height: 2.0625rem;
}
.product-wrap .product-item{
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  width: 5.15rem;
}
.product-wrap .product-item .image{
  width: 4rem;
  height: 3.8rem;
}
.product-wrap .product-item .image img{
  width: 100%;
  height: 100%;
}
.product-wrap .product-item .name{
  font-size: 12px;
  color: #222;
  width: 4.4375rem;
  margin: 18px auto;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  min-height: 20px;
} */
.product-list .item{
  width: 6.5rem;
  background-color: #fff;
  box-shadow: 0px 0px 8px #eee;
  margin: 6px 6px;
  border-radius: 5px;
}
.product-list .item .title{
  text-align: left;
  font-size: 14px;
  color: #222;
  margin-top: 3px;
  padding: 0 6px;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  height: 1.5rem;
}
.product-list .item .image{
  width: 5.6rem;
  height: 6rem;
  margin: 0 auto;
  margin-top: 5px;
}
.product-list .item .image img{
  width: 100%;
  height: 100%;
  border-radius: 5px;
}
.product-list .item .price{
  text-align: left;
  color: #F64444;
  font-size: 15px;
  padding: 0 6px;
  margin-top: 8px;
  padding-bottom: 8px;
}
.product-list .item .price img{
  position: relative;
  top: 0.1rem;
  width: .9rem;
  height: .9rem;
  margin-right: 5px;
}
.tab-wrap .van-tabs{
  border-radius: 5px!important;
}
/deep/ .van-tabs__nav{
  background-color: #fff!important;
}
/deep/ .van-tab--active{
  color: #35AB54;
}
>>>.van-hairline--top-bottom::after{
  border-width: none;
}
.middle-content{
  margin-top: 5px;
  padding: 10px;
  box-shadow: 0px 7px 6px #eee;
  border-radius: 5px;
}
>>>.van-tabs__content{
  width: 22.2rem;
}
>>>.van-tab{
  flex-basis: 32%!important;
  padding-top: 2px;
}
.position-relative{
  position: relative;
}
.product-wrap .header{
  position: relative;
  margin-bottom: 10px;
}
.product-wrap .header .image{
  display: block;
  width: 8rem;
  height: 2.2rem;
  margin: 0 auto;
}
.product-wrap .header .image img{
  width: 100%;
  height: 100%;
}
.product-wrap .header .title{
  position: absolute;
  top: 0.4375rem;
  left: 50%;
  margin-left: -2rem;
  font-size: 1rem;
  color: #222222;
  font-weight: 700;
}
>>>.van-hairline--top-bottom::after{
  border-width: 0px;
}
.pn{
  padding: 0!important;
}
.banner-toggle{
  text-align: center;
  font-size: 12px;
  color: #999;
  padding-top: 5px;
}
.banner-toggle i{
  font-size: 14px;
  position: relative;
  top: 2px;
  right: 3px;
}
.mn{
  position: fixed;
  top: 0;
  left: 0;
  margin: 0!important;
  width: 70%;
  z-index: 99999;
}
.tab-container{
  background-color: #fff;
}
</style>
