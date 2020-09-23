<template>
  <div style="width:100%;height:100%;background:white;padding:1rem">
    <img
      style="width:55%;display:block"
      src="../../assets/images/fast-logo.png"
      alt=""
    >
    <div style="width:80%;margin:50px auto 10px;height:130px;position:relative;overflow:hidden">
      <img
        class="sun"
        src="../../assets/images/sun.png"
        alt=""
      >
      <img
        class="cloud1"
        src="../../assets/images/cloud1.png"
        alt=""
      >
      <img
        class="cloud2"
        src="../../assets/images/cloud2.png"
        alt=""
      >
      <img
        class="cloud3"
        src="../../assets/images/cloud3.png"
        alt=""
      >
    </div>
    <div style="width:80%;margin:10px auto 0">
      <img
        src="../../assets/images/fast-mainimg.png"
        style="width:100%"
        alt=""
      >
    </div>
    <div style="height:40px;line-height:45px;font-size:1.2rem;display:flex;justify-content:center;align-items:center">
      <div
        class="tran"
        v-for="(item,index) in wz"
        :key="item"
        :style="index==tt?'margin-top:-10px':''"
      >{{item}}
      </div>
    </div>
    <img
      style="width: 80%; margin: 7rem 0 0;"
      src="../../assets/images/fast-footer.png"
      alt=""
    >
  </div>
</template>
<script>
export default {
  name: "fast",
  data() {
    return {
      wz: ["火", "速", "赶", "往", "扶", "贫", "村", ".", ".", "."],
      tt: 0,
      ss: 0,
      T: null
    };
  },
  mounted() {
    this.T = setInterval(() => {
      if (this.ss >= 6) {
        clearInterval(this.T);
        this.$router.push("/navContainer/fupin");
      }
      this.ss = this.ss + 1;
      this.tt = this.tt + 1;
      if (this.tt == this.wz.length - 1) {
        this.tt = 0;
      }
    }, 250);
  }
};
</script>
<style  scoped>
* {
  box-sizing: border-box;
}
.cloud1 {
  width: 4rem;
  position: absolute;
  left: 30px;
  top: 0;
  animation: cloud1ani 3s infinite;
}
.cloud2 {
  width: 4rem;
  position: absolute;
  left: 6rem;
  top: 5rem;
  animation: cloud2ani 3s infinite;
}
.cloud3 {
  width: 4rem;
  position: absolute;
  right: 0px;
  top: 5rem;
  animation: cloud3ani 3s infinite;
}
.sun {
  width: 4rem;
  position: absolute;
  right: 0px;
  top: 0px;
  transform: rotate(0deg);
  animation: sunani 30s infinite;
}
.tran {
  transition: all 0.2s;
}
@keyframes cloud1ani {
  0% {
    top: 0;
    left: 30px;
  }
  100% {
    top: 0;
    left: 0;
  }
}
@keyframes cloud2ani {
  0% {
    left: 6rem;
  }
  100% {
    left: 4rem;
  }
}
@keyframes cloud3ani {
  0% {
    right: 0px;
  }
  100% {
    right: 30px;
  }
}
@keyframes sunani {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>