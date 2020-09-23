<template>
  <div class="index">
    <div class="index-header">
      <div style="height:25rem">
        <div class="search">
          <van-search
            background="rgba(0,0,0,0)"
            style="width:93%;height:2rem"
            @click="goToSearch"
            readonly
            placeholder="搜索商品"
          />
          <div class="classi-box">

            <img
              class="classi-img"
              src="../../assets/images/search_main.png"
              alt=""
              srcset=""
            >
            分类
          </div>
        </div>

        <div class="swiper-box">
          <van-swipe
            :autoplay="3000"
            indicator-color="white"
          >
            <van-swipe-item
              v-for="(image, index) in swipes"
              :key="index+image.url"
              @click="swipClick(image)"
            >
              <img
                style="width:100%;height:8rem"
                :src="image.url"
                alt=""
              >
            </van-swipe-item>
          </van-swipe>
        </div>
        <div class="classi-icon">
          <div
            @click="$router.push({name:'fupin'})"
            class="classi-item"
          >
            <img
              class="classi-item-img"
              src="../../assets/images/fpzq1.png"
              alt=""
            >
            <span class="classi-item-title">扶贫专区</span>
          </div>
          <div
            @click="$router.push({name:'comList',query:{type:'label',label:item.title}})"
            class="classi-item"
            v-for="(item,index) in classi_icons"
            :key="item.id+index+item.title"
          >
            <img
              class="classi-item-img"
              :src="item.url"
              alt=""
            >
            <span class="classi-item-title">{{item.title}}</span>
          </div>
        </div>
      </div>
    </div>
    <recommend
      title="扶贫推荐"
      :recommonds="fpRecomArr"
      componentType="fp"
    />
    <recommend
      title="精品推荐"
      :recommonds="jpRecomArr"
      componentType="jp"
    />
    <div
      class="rec"
      style="background:white;margin: 1rem 0;padding:0.7rem 0"
    >

      <van-tabs
        v-model="active"
        type="card"
        @change="changeTabs"
      >
        <van-tab
          v-for="(item ,index) in labelList"
          :key="index+item.id"
          :title="item.title"
        >
        </van-tab>
      </van-tabs>
    </div>
    <div style="min-height:calc(100% - 60px)">

      <div
        v-show="!labelcommdyList.length"
        style=" padding:100px 0;box-sizing:border-box"
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
            <span style="text-align:left;display:inline-block;word-break: break-all;">{{item.title}}<span style="margin-left:.5rem;color:#b4b4b4;font-size:.8rem">({{item.specificationName}})</span></span>
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
  </div>
</template>

<script>
import recommend from "./recommend";
export default {
  name: "index",
  components: {
    recommend
  },
  data() {
    return {
      labelName: "",
      labelList: [],
      labelcommdyList: [],
      swipes: [
        {
          url: require("../../assets/images/youjimi.png"),
          id: 1000
        },
        {
          url: require("../../assets/images/shanchayou.png"),
          id: 2000
        },
        {
          url: require("../../assets/images/bank.jpg"),
          id: 3000,
          link: "https://shop90666184.youzan.com/v2/feature/DAykR1pNYH"
        }
      ],
      classi_icons: [
        // {
        //   url: require("../../assets/images/fpzq1.png"),
        //   title: "扶贫专区",
        //   id: 11
        // },
        {
          url: require("../../assets/images/jrlw.png"),
          title: "节日礼包",
          id: 21
        },
        {
          url: require("../../assets/images/rlzp.png"),
          title: "肉类制品",
          id: 31
        },
        {
          url: require("../../assets/images/dlgw.png"),
          title: "豆类制品",
          id: 41
        },
        {
          url: require("../../assets/images/qldp.png"),
          title: "禽类蛋品",
          id: 51
        },
        {
          url: require("../../assets/images/fpzq.png"),
          title: "粮油米面",
          id: 61
        },
        {
          url: require("../../assets/images/gssx.png"),
          title: "果蔬生鲜",
          id: 71
        },
        {
          url: require("../../assets/images/spyl.png"),
          title: "食品饮料",
          id: 81
        },
        {
          url: require("../../assets/images/mcct.png"),
          title: "茗茶冲调",
          id: 91
        },
        {
          url: require("../../assets/images/ghtw.png"),
          title: "干货调味",
          id: 101
        }
      ],
      fpRecomArr: [],
      jpRecomArr: []
    };
  },
  updated() {
    console.log(this.$el.scrollHeight);
  },
  mounted: function() {
    this.$axios
      .post({
        url: "/homepageinfo/findByPage",
        data: { homepageInfo: {}, page: { start: 1, count: 100 } },
        needLoading: true
      })
      .then(res => {
        if (res.success) {
          const data = res.data.list;
          for (let i = 0; i < data.length; i++) {
            const n = data[i];
            if (n.boardName === "扶贫推荐") {
              this.fpRecomArr = [
                ...this.fpRecomArr,
                { id: n.id, title: n.relativeContent }
              ];
            }
            if (n.boardName === "精品推荐") {
              this.jpRecomArr = [
                ...this.jpRecomArr,
                { id: n.id, title: n.relativeContent }
              ];
            }
            if (n.boardName === "商品总览") {
              this.labelList = [
                ...this.labelList,
                { id: n.id, title: n.relativeContent }
              ];
              this.classi_icons = this.classi_icons.map(it => {
                const d = this.labelList.filter(l => l.title == it.title);
                return d.length ? { ...it, id: d[0].id } : it;
              });
            }
          }
          this.labelName = this.labelList[0].title;
          this.changeTabs(undefined, this.labelName);
        }
      });
  },
  methods: {
    swipClick(images) {
      if (images.link) {
        location.href = images.link;
      }
    },
    goToSearch() {
      this.$router.push({ name: "searchProductList" });
    },
    goToProductDetail(id) {
      this.$router.push({ name: "productDetail", query: { productId: id } });
    },
    changeTabs(a, name) {
      this.labelName = name;
      this.$axios
        .post({
          url: "/commodityinfo/findByPage",
          data: {
            page: { start: 1, count: 100 },
            commodityInfo: { labelNamelist: this.labelName }
          },
          needLoading: true
        })
        .then(res => {
          if (res.success) {
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
}
.classi-item-img {
  width: 75%;
}
.classi-icon {
  height: 13rem;
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
/deep/ .van-search__content {
  border-radius: 20px;
}
/deep/ .van-search .van-cell {
  line-height: 1rem;
}
/deep/ .van-tabs__nav--card .van-tab {
  border: none;
  color: #222;
  line-height: 30px;
}
/deep/ .van-tabs__nav--card .van-tab.van-tab--active {
  background-color: white;
  color: rgb(211, 55, 42);
  font-size: 1rem;
}
/deep/ .van-tabs__nav--card {
  border: none;
}
/deep/ .van-tab,
.van-tag--large {
  font-size: 1rem;
}
/deep/ .van-ellipsis {
  overflow: inherit !important;
}
</style>
