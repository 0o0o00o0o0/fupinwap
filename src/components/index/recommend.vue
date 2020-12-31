<template>
  <div class="recommend">
    <div class="recommend-title">
      <div
        class="commend-title-bold"
        style="display:flex;justify-content:start;align-items:center"
      >{{title}}<span style="margin-left:5px;font-size:1rem;color:red">{{saleTime}}</span></div>
      <div
        v-show="showRecoms"
        style="height:2rem;width:70%"
      >
        <van-tabs
          v-show="showTabs"
          @click="getData"
          v-model="active"
        >
          <van-tab
            v-for="(item,index) in recommonds"
            :key="item.id+index"
            :title="item.title"
          ></van-tab>

        </van-tabs>
      </div>

    </div>
    <div class="recomend-content">
      <div
        v-show="!commodityList.length"
        style="margin:30px 0"
      >暂无商品...</div>
      <div
        v-show="commodityList.length"
        :style="'width:'+(domWidth*commodityList.length)+'px;height:100%'"
      >
        <div
          @click="goToProductDetail(item.id)"
          v-for="(item,index) in commodityList"
          :key="item.id+index+item.title"
          class="re-content-item"
        >
          <img
            class="re-content-img"
            :src="item.url"
            alt=""
          >
          <img
            v-show="showyg"
            style="position:absolute;top:0;right:0;width:35px"
            src="../../assets/images/预售图标.png"
            alt=""
          >
          <div style="height:2rem;line-height:2rem;white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
    word-break: break-all;width:100%">{{item.title}}</div>
          <div style="height:1rem;color:red">
            <!-- <img
              style="width:1rem;vertical-align: text-bottom;margin: 0 3px"
              src="../../assets/images/fu.png"
            /> -->
            ￥{{item.price}} <del
              style="font-size:.8rem;color:#999;margin-left:2px"
              v-show="item.originPrice"
            >￥{{item.originPrice}}</del></div>
        </div>
      </div>
    </div>
    <div
      v-show="showLoading"
      style="width:100%;height:100%;position:absolute;left:0;top:0;background:rgba(0,0,0,0.3);z-index:99;display:flex;justify-content:center;align-items:center"
    >
      <van-loading
        type="spinner"
        color="white"
      />
    </div>
  </div>
</template>

<script>
import "../../../static/css/public.css";
export default {
  name: "list",
  data() {
    return {
      showLoading: false,
      active: 0,
      storitive: 100,
      domWidth: 0,
      recommondWidth: 0,
      commodityList: []
    };
  },
  mounted: function() {
    console.log(this.recommonds);
  },
  updated: function() {
    this.domWidth
      ? null
      : (this.domWidth = document
          .getElementsByClassName("re-content-item")[0]
          .getBoundingClientRect().width);
  },
  methods: {
    goToProductDetail(id) {
      this.$router.push({ name: "productDetail", query: { productId: id } });
    },
    getData(index) {
      if (index != this.storitive) {
        const obj = {
          [this.componentType == "fp"
            ? "commodityPlace"
            : "labelNamelist"]: this.recommonds[index].title
        };
        this.showLoading = true;
        this.$axios
          .post({
            url: "/commodityinfo/findByPage",
            data: { page: { start: 1, count: 100 }, commodityInfo: obj },
            needLoading: false
          })
          .then(res => {
            if (res.success) {
              this.commodityList = [];
              this.commodityList = res.data.list.map(it => ({
                id: it.id,
                url: this.API_KEY.IMG_SERVER + it.coverImage,
                title: it.commodityTitle,
                price: it.displayPrice,
                originPrice: it.originPrice
              }));
            }
            this.showLoading = false;
          });
      }
    }
  },
  watch: {
    recommonds: {
      immediate: true,
      handler(val) {
        this.active = 0;
        this.storitive = 100;
        this.getData(0);
      }
    }
  },
  props: {
    title: {
      type: String
    },
    recommonds: {
      type: Array
    },
    componentType: {
      type: String
    },
    showTabs: {
      type: Boolean,
      default: true
    },
    showyg: {
      type: Boolean,
      default: false
    },
    saleTime: {
      type: String,
      default: ""
    },
    showRecoms: {
      type: Boolean,
      default: true
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.recommend {
  width: 100%;
  height: 16rem;
  margin-top: 1rem;
  padding: 1rem;
  box-sizing: border-box;
  background-color: white;
  position: relative;
}
.recommend-title {
  height: 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.recomend-content {
  height: 11rem;
  margin-top: 1rem;
  overflow-y: auto;
}
.commend-title-bold {
  font-size: 1.3rem;
}
.re-content-item {
  width: 8rem;
  height: 11rem;
  float: left;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  position: relative;
}
.re-content-img {
  width: 7rem;
  height: 7rem;
  display: block;
}
/deep/ .van-tab,
.van-tag--large {
  font-size: 1rem;
}
/deep/ .van-tabs__nav--line {
  /* padding-bottom: 1px !important */
  display: flex;
  justify-content: flex-end;
}
/deep/ .van-tab {
  line-height: 30px;
  flex: none;
}
/deep/ .van-tabs__line {
  height: 1px;
}
/deep/ .van-tabs--line .van-tabs__wrap {
  height: auto;
}
/deep/ .van-hairline--top-bottom::after {
  border: none;
}
</style>
