<template>
  <div class="body-wrap" ref="bodyDom" :style="'height:'+bodyHeight+'rem'">
    <div class="hauto">
      <div class="product-list" v-show="haveData">
        <div class="product-item"
           v-for="(item,index) in images"
           :key="index"
           @click="goToProductList(item,index)">
          <img :src="imgServer+item.imageUrl" alt="">
          <div class="shui-ying" v-show="item.boardStatus == 3"><img src="../../assets/images/ing.png" alt=""></div>
          <div class="shui-ying" v-show="item.boardStatus == 4"><img src="../../assets/images/end.png" alt=""></div>
          <div class="shui-ying" v-show="item.boardStatus == 2 || item.boardStatus == 1"><img src="../../assets/images/startBefore.png" alt=""></div>
        </div>
        <div class="bottom-prompt">没有更多啦</div>
       <!--  <div class="product-item" @click="goToProductList(1)">
         <img src="../../assets/images/fuqingjie.jpg" alt="">
         <div class="shui-ying"><img src="../../assets/images/startBefore.png" alt=""></div>
       </div>
       <div class="product-item" @click="goToProductList(2)">
         <img src="../../assets/images/jianjunjie.jpg" alt="">
         <div class="shui-ying"><img src="../../assets/images/startBefore.png" alt=""></div>
       </div>
       <div class="product-item" @click="goToProductList(3)">
         <img src="../../assets/images/xiazhi.jpg" alt="">
         <div class="shui-ying"><img src="../../assets/images/startBefore.png" alt=""></div>
       </div> -->
      </div>
      <div v-show="!haveData"><p class="text-center">暂无商品</p></div>
    </div>
  </div>
</template>

<script>
import '../../../static/css/public.css'
export default {
  name: 'list',
  data () {
    return {
      conf:{},
      bodyHeight:35,
      haveData:true,
      imgServer:this.API_KEY.IMG_SERVER,
      images:[],
      moduleId:null,
      labelNamelist:'',
      pageName:'',
      targetParams:{},
      code:''
    }
  },
  mounted:function(){
    this.bodyHeight = (window.innerHeight+30)/16;
    this.labelNamelist = this.$route.query.labelNamelist || '';
    //this.conf = this.listConf;
    this.moduleId = this.$route.query.id || null;
    //this.getProductListByLabelName(this.labelNamelist);
    this.getModuleInfo(this.moduleId);
  },
  methods:{
    getModuleInfo(id){
      var self = this;
      var params = {};
      params.id = id;
      self.$axios.post({
          url:self.API_KEY.URL_FIND_BOARDIMAGESLIST_BYBOARDID,
          data: params
      }).then(function(json) {
        if(json.data.list.length){
          self.haveData = true;
          self.images = json.data.list;
        }else{
          self.haveData = false;
        }
      }).catch(function(error) {
        
      });
    },
    goToProductList(item,index){
      if(item.boardStatus == 4){
        this.$toast('已结束!');
      }else{
        sessionStorage.setItem('FESTIVAL_IMG_URL',this.imgServer + item.imageUrl);
        this.$router.push({name:'productList',query:{labelNamelist:item.imageName,index:index,festivalType:2}});
      }
    },
    // mygets() {
    //   var redirect_urls= encodeURIComponent("http://wap.chhtf.com/#/festival");
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
}
.hauto{
    height: auto;
}
.product-list{

}
.product-item{
  position: relative;
  width: 23.4375rem;
  height: auto;
}
.product-item img{
  width: 100%;
  height: 100%;
}
.product-item .shui-ying{
  position: absolute;
  right: -0.5rem;
  bottom: -0.5rem;
  width: 6.25rem;
  height: 6.25rem;
}
.product-item .shui-ying img{
  width: 100%;
  height: 100%;
}
.bottom-prompt{
  font-size: 14px;
  color: #666;
  text-align: center;
  margin: 5px 0;
}
</style>
