<template>
  <div class="active" style="position: initial">
    <img class="header" src="../../assets/images/active-header.png" alt="" />
    <div class="buttons">
      <!-- <img
        class="header"
        src="../../assets/images/cloud.png"
        alt=""
      > -->
      <div class="header-bottons" @click="$router.push('/navContainer/fupin')">
        <img
          style="position: absolute; width: 4rem; left: -4rem; top: -1rem"
          src="../../assets/images/组 15.png"
          alt=""
        />
        <img src="../../assets/images/组 11.png" alt="" />
      </div>
      <img
        style="width: 65%; margin-top: 1rem"
        src="../../assets/images/logo-title.png"
        alt=""
      />
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      left: 0,
      top: 0,
    };
  },
  mounted() {
    const d = this.$refs.refImg.width / 100;
    this.top = 90 * d;
    this.left = 15 * d;
  },
};
</script>
<style scoped>
.header {
  width: 100%;
  display: block;
  height: 60vh;
}
.buttons {
  overflow: hidden;
  line-height: 0;
  background-color: rgb(221, 47, 48);
  height: 40vh;
}
.header-bottons {
  width: 10rem;
  position: relative;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  margin: 3rem auto 0;
}
.header-bottons img {
  width: 100%;
}
</style>