<template>
  <div class="index">
    <div
      class="rec"
      style=";margin: 1rem 0;font-size:1rem;font-weight:bold;background:rgb(245, 245, 245)"
    >
      . {{title}}{{$route.query.type == "place"?'专区':''}} .
      <div style="font-weight: 100;
    font-size: 12px;
    color: #666;
}">{{tempString}}</div>
    </div>
    <div
      v-show="!labelcommdyList.length"
      style="margin:100px 0"
    >暂无商品...</div>
    <div
      v-show="labelcommdyList.length"
      class="labelCommidyList"
    >
      <div
        v-for="(item, index) in labelcommdyList"
        :key="item.id+index+item.title"
        class="labelCommidy-item"
        style=""
        @click="goToProductDetail(item.id)"
      >
        <img
          style="width:100%;height:11.5rem"
          :src="item.url"
          alt=""
        >
        <div style="height:2.5rem;;text-align:center;font-size:1rem;    display: flex;
    align-items: center;
      justify-content: start;
     text-indent:.5rem
">
          <span style="text-align:left;display:inline-block;word-break: break-all;">{{item.title}}<span
              v-show="item.specificationName"
              style="margin-left:.5rem;color:#b4b4b4;font-size:.8rem"
            >({{item.specificationName}})</span></span>
        </div>
        <div style="height:1rem;float:left;color:red;text-indent:.5rem">
          <!-- <img
            style="width:1rem;vertical-align: text-bottom;margin: 0 3px"
            src="../../assets/images/fu.png"
          /> -->
          ￥{{item.price}}<del
            style="font-size:.8rem;color:#999;margin-left:2px"
            v-show="item.originPrice"
          >￥{{item.originPrice}}</del>
        </div>
      </div>
      <div
        v-show="labelcommdyList.length%2"
        class="labelCommidy-item"
        style="opacity:0"
      >

      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "comlist",
  components: {},
  data() {
    return {
      title: "",
      labelcommdyList: [],
      tempString: ""
    };
  },
  mounted: function() {
    this.title = this.$route.query.label || 0;
    this.tempString = this.$route.query.tempString || "";
    const obj = {
      [this.$route.query.type == "place"
        ? "commodityPlace"
        : "labelNamelist"]: this.$route.query.label
    };
    this.$axios
      .post({
        url: "/commodityinfo/findByPage",
        data: { page: { start: 1, count: 100 }, commodityInfo: obj },
        needLoading: true
      })
      .then(res => {
        if (res.success) {
          this.labelcommdyList = [];
          this.labelcommdyList = res.data.list.map(it => ({
            id: it.id,
            url: this.API_KEY.IMG_SERVER + it.coverImage,
            title: it.commodityTitle,
            price: it.displayPrice,
            originPrice: it.originPrice,
            specificationName: it.specificationName
          }));
        }
      });
  },
  methods: {
    goToProductDetail(id) {
      this.$router.push({ name: "productDetail", query: { productId: id } });
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.index {
  height: calc(100vh - 50px);
  overflow: auto;
  width: 100%;
  max-width: 25rem;
  margin: 0 auto;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
}
.index-header {
  background-color: white;
  background-image: linear-gradient(
    rgb(211, 55, 42),
    rgb(211, 55, 42) 35%,
    white 35%,
    white
  );
  border-radius: 0 0 5px 5px;
  width: 100%;
}
.search {
  display: flex;
  flex: 1;
  align-items: center;
  height: 2.5rem;
  padding: 0.2rem 0;
}
.rec {
  position: sticky;
  left: 0;
  right: 0;
  top: 0rem;
}
.classi-box {
  margin-top: 0.2rem;
  width: 2.5rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  font-size: 0.6rem;
  color: white;
}
.classi-img {
  width: 1.2rem;
  height: 1.2rem;
  display: block;
}
.swiper-box {
  width: 96%;
  height: 8rem;
  margin: 2px auto;
  margin-top: 0.5rem;
}
.classi-item-img {
  width: 75%;
}
.classi-icon {
  height: 9rem;
  display: flex;
  justify-content: space-around;
  align-items: center;
  flex-wrap: wrap;
}
.classi-item {
  width: 18%;
  height: 5.5rem;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: center;
}
.classi-item-title {
  color: #333;
  font-size: 0.8rem;
}
.labelCommidyList {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-evenly;
  align-items: center;
}
.labelCommidy-item {
  width: 45%;
  height: 16rem;
  background: #fff;
  margin: 5px 0;
  border-radius: 5px;
}
.fupin-area {
  height: 5rem;
  padding: 1rem;
  margin-top: 1rem;
  background-color: #fff;
  text-align: left;
}
.fupin-area-item {
  padding: 7px 15px;
  background-color: rgb(240, 240, 240);
  color: rgb(211, 55, 42);
  margin-left: 5px;
  float: left;
}
/deep/ .van-search__content {
  border-radius: 20px;
}
/deep/ .van-search .van-cell {
  line-height: 1rem;
}
/deep/ .van-tabs__nav--card .van-tab {
  border: none;
  color: #222;
}
/deep/ .van-tabs__nav--card .van-tab.van-tab--active {
  background-color: white;
  color: rgb(72, 181, 64);
}
/deep/ .van-tabs__nav--card {
  border: none;
}
</style>
