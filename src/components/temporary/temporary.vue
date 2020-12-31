<template>
  <div>
    <img class="header" src="../../assets/images/active-header.png" alt="" />
    <div style="position: relative">
      <img src="../../assets/images/年货节.jpg" style="width: 100%" alt="" />
     <button
        @click="$router.push({ name: 'fupin' })"
        style="
          width: 92%;
          height: 15%;
          left: 4%;
          top: 7%;
          position: absolute;
          opacity: 0;
        "
      ></button>
      <button
        @click="$router.push({ name: 'giftBag' })"
        style="
          width: 92%;
          height: 25%;
          left: 4%;
          top: 25%;
          position: absolute;
          opacity: 0;
        "
      ></button>
      <button
        @click="$router.push('/go5')"
        style="
          width: 45%;
          height: 40%;
          left: 4%;
          top: 55%;
          position: absolute;
          opacity: 0;
        "
      ></button>
      <button
        @click="$router.push('/go1')"
        style="
          width: 45%;
          height: 40%;
          right: 4%;
          top: 55%;
          position: absolute;
          opacity: 0;
        "
      ></button>
    </div>
  </div>
</template>
<script>
export default {
  name: "temporary",
  data() {
    return {};
  },
  mounted() {
    sessionStorage.setItem("temporary", "1");
  },
  methods: {
    gotoDetail(item, place = true) {
      if (item.hideFlag) {
        Dialog.alert({
          className: "hhhhh",
          message: "活动暂未开始，敬请期待！",
        }).then(() => {
          // on close
        });
        return;
      }
      this.$router.push({
        name: "comList",
        query: {
          type: place ? "place" : "",
          label: item.title,
          tempString: item.tempString,
          orderType: item.orderType || 0,
        },
      });
    },
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