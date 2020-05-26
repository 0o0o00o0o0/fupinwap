<template>
  <div class="body-wrap">
    <div class="hauto">
      <p>授权失败，请重新进入公众号授权进入商城</p>
    </div>
  </div>
</template>

<script>
import '../../../static/css/public.css'
import bus from '../../assets/js/eventBus'
export default {
  name: 'login',
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
  background-color: #eee;
}
</style>
