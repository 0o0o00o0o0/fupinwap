<template>
  <div>
    <div class="find-setting-wrap flex">
      <div>
        <div class="setting-item"><span>新品排序</span><van-icon name="play" class="triangle-up" /><van-icon name="play"  class="triangle-down"/></div>
      </div>
      <div>
        <div class="setting-item"><span>价格排序</span><van-icon name="play" class="triangle-up" /><van-icon name="play" class="triangle-down" /></div>
      </div>
      <div>
        <div class="setting-item"><span>人气指数</span><van-icon name="play" class="triangle-up" /><van-icon name="play"  class="triangle-down"/></div>
      </div>
    </div>
  </div>
</template>

<script>
import '../../../static/css/public.css'
export default {
  name: 'orderSetting',
  data () {
    return {
      
    }
  },
  mounted:function(){
    
  },
  methods:{
    
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.body-wrap{
  /* background: rgb(245,245,245); */
}
.hauto{
    height: auto;
}
.find-setting-wrap{
  height: 40px;
  background: rgb(245,245,245);
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
</style>
