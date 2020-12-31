<template>
  <div class="classi">
    <div class="search">
      <van-search
        background="rgba(0,0,0,0)"
        style="width:calc(100% - 40px);height:2rem"
        @click="goToSearch"
        readonly
        placeholder="搜索商品"
      />
      <div
        class="classi-box"
        @click="$router.push({name:'shoppingCart'})"
      >

        <img
          class="classi-img"
          src="../../assets/images/gwc.png"
          alt=""
          srcset=""
        >
        <div style="transform: scale(0.8)">购物车</div>
      </div>
    </div>
    <div class="classi-content">
      <div
        style="width:35%;height:100%"
        class="classi-tabs"
      >
        <div
          v-for="(item,index) in classiList"
          :key="item.id+index"
          :class="'classi-item '+(item.id==classid?'active':'')"
          @click="changeCom(item.id,item.title)"
        >
          <span style="display:inline-block">{{item.title}}</span>
        </div>
      </div>
      <div style="width:64.5%;height:100%;background-color:#fff">
        <div
          v-show="!commodityList.length"
          style="margin-top:100px"
        >暂无商品...</div>
        <div
          v-show="commodityList.length"
          v-for="(item,index) in commodityList"
          :key="item.id+index"
          class="classi-commi-item"
        >
          <div
            @click="goToProductDetail(item.id)"
            class="commi-message-box"
          >
            <img
              :src="item.url"
              alt=""
              style="width:14rem;height:7rem;display:block"
            >
            <div style="height:3rem; text-align:center;line-height:1.5rem;display: flex;
    align-items: center;
    justify-content: center;">
              <span style="display:inline-block;text-align:left">{{item.title}}</span>
            </div>
          </div>
          <div style="height:3.5rem;display:flex;justify-content:space-between;align-items:center;border-bottom: 1px solid rgb(245, 245, 245);">
            <div style="height:1.6rem;color:red;font-size:1.3rem">
              <img
                style="width:1.5rem;vertical-align: text-bottom;margin: 0 5px"
                src="../../assets/images/fu.png"
              />{{item.price}}</div>
            <van-button
              @click="addShopCar(item)"
              style="border-radius:112px"
              size="small"
              type="info"
            >加入购物车
              <div
                v-show="item.totalNumber"
                style="position:absolute;right:-1px;top:-9px;width:20px;height:15px;line-height:16px;background:red;color:white;border-radius:15px"
              >{{item.totalNumber}}</div>
            </van-button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import "../../../static/css/public.css";
import bus from "../../assets/js/eventBus";
export default {
  name: "list",
  data() {
    return {
      totalNumber: 0,
      classid: 0,
      classiList: [],
      commodityList: [],
      storeNumers: {}
    };
  },
  mounted: function() {
    this.storeNumers = JSON.parse(localStorage.getItem("storeNum") || "{}");
    this.classid = this.$route.query.id || 0;
    this.$axios
      .post({
        url: "/homepageinfo/findByPage",
        data: {
          homepageInfo: { boardType: 3 },
          page: { start: 1, count: 100 }
        },
        needLoading: true
      })
      .then(res => {
        if (res.success) {
          this.classiList = res.data.list.reduce(
            (c, n) =>
              n.boardName == "商品总览"
                ? [...c, { id: n.id, title: n.relativeContent }]
                : c,
            []
          );
          const g = this.classiList.filter(it => it.id === this.classid);
          // this.classid = g.length ? this.classid : this.classiList[0].id;
          this.changeCom(this.classiList[0].id, this.classiList[0].title);
        }
      });
  },
  updated: function() {
    document.getElementsByClassName("classi-tabs")[0].scrollTop =
      document.getElementsByClassName("active")[0].offsetTop - 100;
  },
  methods: {
    goToProductDetail(id) {
      this.$router.push({ name: "productDetail", query: { productId: id } });
    },
    goToSearch() {
      this.$router.push({ name: "searchProductList" });
    },
    changeCom(id, title) {
      if (id == this.classid) return;
      this.classid = id;
      this.commodityList = [];
      this.$axios
        .post({
          url: "/commodityinfo/findByPage",
          data: {
            page: { start: 1, count: 100 },
            commodityInfo: { labelNamelist: title }
          },
          needLoading: true
        })
        .then(res => {
          if (res.success) {
            this.commodityList = res.data.list.map(it => ({
              ...it,
              id: it.id,
              url: this.API_KEY.IMG_SERVER + it.coverImage,
              title: it.commodityTitle,
              price: it.displayPrice,
              totalNumber: this.storeNumers[it.id] || 0
            }));
          }
        });
    },
    addShopCar(item) {
      this.openId = localStorage.getItem("openId");
      if (!this.openId) return;
      var params = {};
      params.shoppingCart = {};
      params.shoppingCart.openid = this.openId;
      params.shoppingCart.commodityId = item.id;
      params.shoppingCart.commoditySize = 1;

      params.shoppingCart.displayPrice = item.displayPrice;
      params.shoppingCart.specificationName = item.specificationName;

      this.$axios
        .post({
          url: this.API_KEY.URL_SHOPPINGCART_ADD,
          data: params
        })
        .then(_ => {
          item.totalNumber++;
          this.storeNumers[item.id] = item.totalNumber;
          localStorage.setItem("storeNum", JSON.stringify(this.storeNumers));
          bus.$emit("updateShoppingNumber");
        })
        .catch(function(error) {});
    }
  },
  props: {
    listConf: {
      type: Object
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.classi {
  height: calc(100vh - 50px);
  width: 100%;
  max-width: 25rem;
  margin: 0 auto;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  background-color: #fff;
}
.search {
  display: flex;
  flex: 1;
  align-items: center;
  height: 2.5rem;
  padding: 0.2rem 0;
}
.classi-box {
  width: 40px;
  font-size: 0.5rem;
}
.classi-img {
  width: 1.2rem;
  height: 1.2rem;
  display: block;
  margin: 0 auto;
}
.classi-content {
  height: calc(100% - 3.5rem);
  margin-top: 1rem;
  display: flex;
  flex: 1;
}

.classi-content div {
  overflow: auto;
}
.classi-item {
  line-height: 4rem;
  background-color: rgb(245, 245, 245);
  box-sizing: border-box;
}
.active {
  background-color: #fff;
}
.active span {
  box-sizing: border-box;
  display: inline-block;
  border-left: 3px solid #35ab54;
  width: 100%;
  line-height: 1;
}
.classi-commi-item {
  width: 14rem;
  height: 14rem;
  margin: 3px auto;
}
.commi-message-box {
  height: 10rem;
  border-bottom: 1px solid rgb(245, 245, 245);
}
/deep/ .van-search__content {
  background-color: rgb(233, 236, 241);
  border-radius: 20px;
}
/deep/ .van-search .van-cell {
  line-height: 1rem;
}
</style>
