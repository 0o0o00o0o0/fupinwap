<template>
  <div>
  
    <div style="position: relative">
      <img src="../../assets/images/1go.png" style="width: 100%" alt="" />
    
      <button
        @click="gotoDetail({ title: '1元购/10元购', orderType: 1 }, false)"
        style="
          width: 55%;
          height: 40%;
          right: 22%;
          bottom: 5%;
          position: absolute;
          opacity: 0;
        "
      ></button>
    </div>
  </div>
</template>
<script>
export default {
  name: "1go",
  data() {
    return {};
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