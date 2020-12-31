<template>
  <div class="body-wrap">
    <div class="hauto">
      <div class="date-wrap">2019年5月<van-icon name="arrow-down" /></div>
      <div class="account-record-list">
        <div class="account-record-item">
          <div class="flex info">
            <div class="name">微信充值</div>
            <div class="clearflex price">+100</div>
          </div>
          <div class="date">5月22日 22:11</div>
        </div>
        <div class="account-record-item">
          <div class="flex info">
            <div class="name">微信充值</div>
            <div class="clearflex price">+100</div>
          </div>
          <div class="date">5月22日 22:11</div>
        </div>
        <div class="account-record-item">
          <div class="flex info">
            <div class="name">微信充值</div>
            <div class="clearflex price">+100</div>
          </div>
          <div class="date">5月22日 22:11</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import '../../../static/css/public.css'
import bus from '../../assets/js/eventBus'
export default {
  name: 'accountRecord',
  data () {
    return {
     
    }
  },
  mounted: function(){
    
  },
  methods:{
    
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
.date-wrap{
  text-align: left;
  margin: 1.0625rem 0.625rem;
  color: #222222;
  font-size: 0.9375rem;
}
.account-record-list{
  background-color: #fff;
}
.account-record-item{
  padding: 0.625rem;
  text-align: left;
  border-bottom: 1px solid #F4F4F4;
}
.account-record-item .info{
  align-items: center;
}
.account-record-item .info .name{
  color: #222222;
  font-size: 0.9375rem;
}
.account-record-item .info .price{
  font-size: 1.0625rem;
  color: #222222;
}
.account-record-item .date{
  color: #999999;
  font-size: 0.8125rem;
  margin-top: 0.3rem;
}
</style>
