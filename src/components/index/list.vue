<template>
  <div class="body-wrap">
    <div class="hauto">
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
          <span class="price"><em><img src="../../assets/images/fu.png" alt=""></em><span>{{item.displayPrice}}</span></span>
          <div class="fu-ping" v-show="item.commodityMark == '2'"><span class="image"><img src="../../assets/images/fuping.png" alt=""></span><span class="title">扶贫</span></div>
        </div>
        <div class="product-item clearflex"></div>
      </div>
      <div class="bottom-prompt">没有更多啦</div>
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
      list:[],
      haveData:true,
      imgServer:this.API_KEY.IMG_SERVER
    }
  },
  mounted:function(){
    this.conf = this.listConf;
    this.getProductListByLabelName(this.conf.labelNamelist);
  },
  methods:{
    goToProductDetail(item){
      sessionStorage.removeItem("SPEC_Info");
      this.$router.push({name:'productDetail',query:{productId:item.id}});
    },
    getProductListByLabelName(name){
      var self = this;
      var params = {};
      params.page = {};
      params.page.start = 1;
      params.page.count = 50;
      params.commodityInfo = {};
      params.commodityInfo.labelNamelist = name;

      self.$axios.post({
          url:self.API_KEY.URL_COMODITYINFO_FINDBYPAGE,
          data: params
      }).then(function(json) {
        if(json.data.list && json.data.list.length>0){
          self.haveData = true;
          self.list = json.data.list;
        }else{
          self.haveData = false;
        }
      }).catch(function(error) {
        self.haveData = false;
      });
    },
    
  },
  props:{
    'listConf':{
      type:Object
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
  padding-bottom: 3rem;
  margin-top: .5rem;
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
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  padding: 0 3px;
}
.product-item{
  position: relative;
  width: 10.5rem;
  margin: 0.3rem 0px;
  text-align: left;
  background-attachment: fixed; 
  background-color: #fff;
  margin-right: 0.1875rem;
  border-radius: 5px;
  box-shadow: 0px 0px 8px #eee;
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
  border-radius: 5px 5px 0 0;
}
.product-item .fu-ping .image img{
  width: 100%;
  height: 100%;
  border-radius: 5px 5px 0 0;
}
.product-item .fu-ping .title{
  font-size: 12px;
  color: #48B440;
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
  font-size: 0.875rem;
  padding: 7px 4px;
  color: #222;
}
.product-item > .title{
  font-size: 14px;
  color: #777777;
  text-overflow:ellipsis; 
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  overflow: hidden;
  height: 2.3125rem;
  padding: 0 5px;
}
.product-item .price{
  display: block;
  font-size: 14px;
  color: #F64444;
  margin: 10px 5px;
}
.product-item .price > em{
  font-style: normal;
}
.product-item .price > em img{
  position: relative;
  top: 0.125rem;
  width: 1.1rem;
  height: 1.1rem;
  margin-right: 0.4375rem;
}
.product-item .price > span{
  font-size: 18px;
}
.bottom-prompt{
  font-size: 14px;
  color: #666;
  text-align: center;
  margin: 5px 0;
  padding: 0px 0 20px 0;
}
</style>
