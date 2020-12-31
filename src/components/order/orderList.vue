<template>
  <div class="body-wrap" ref="bodyDom" :style="'height:'+bodyHeight+'rem'">
    <div class="hauto">
      <div class="tab-wrap">
          <van-tabs  v-model="tabIndex" @click="handleClickTab" refs="tabDom">
            <van-tab title="全部">
              <list :listConf="allListConf"></list>
            </van-tab>
            <van-tab title="待付款">
              <list :listConf="nonPaymentConf"></list>
            </van-tab>
            <van-tab title="待发货">
              <list :listConf="paymentConf"></list>
            </van-tab>
            <van-tab title="待收货">
              <list :listConf="takeDeliverConf"></list>
            </van-tab>
            <van-tab title="待评价">
              <list :listConf="cancelTheOrders"></list>
            </van-tab>
          </van-tabs>
        </div>
    </div>
  </div>
</template>

<script>
import '../../../static/css/public.css'
import list from './list'
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
      imgServer:this.API_KEY.IMG_SERVER,
      start:0,
      orderStatus:null,
      tabIndex:null,
      allListConf:{
        orderStatus:''
      },
      nonPaymentConf:{
        orderStatus:''
      },
      paymentConf:{
        orderStatus:''
      },
      takeDeliverConf:{
        orderStatus:''
      },
      cancelTheOrders:{
        orderStatus:''
      },
      pageName:'',
      targetParams:{},
      code:''
    }
  },
  mounted:function(){
    this.bodyHeight = (window.innerHeight+15)/16;
    //this.orderStatus = this.$route.query.orderStatus;
    this.tabIndex = sessionStorage.getItem('ORDER_ACTIVE_TAB');
    switch(parseInt(this.tabIndex)){
      case 1: this.nonPaymentConf.orderStatus = 0;break;
      case 2: this.paymentConf.orderStatus = 1;break;
      case 3: this.takeDeliverConf.orderStatus = 2;break;
      case 4: this.cancelTheOrders.orderStatus = 3;break;
      default: this.allListConf.orderStatus = -1;
    };
    //this.getProductListByLabelName(this.start,this.labelNamelist);
  },
  components:{
    list
  },
  methods:{
    handleClickTab(index,title){
      sessionStorage.setItem('ORDER_ACTIVE_TAB',index);
      switch(index){
        case 0:this.allListConf.orderStatus = -1;break;
        case 1:this.nonPaymentConf.orderStatus = 0;break;
        case 2:this.paymentConf.orderStatus = 1;break;
        case 3:this.takeDeliverConf.orderStatus = 2;break;
        case 4:this.cancelTheOrders.orderStatus = 3;break;
      };
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
  padding-bottom: 1.9rem;
  background-color: #fff;
}
.hauto{
    height: auto;
}
.tab-wrap{
  background-color: #fff;
}
>>>.van-tabs__wrap--scrollable .van-tab{
  flex-basis: 20%;
}
>>>.van-tabs__line{
  width: 27px;
  transform: translateX(24px);
}
</style>
