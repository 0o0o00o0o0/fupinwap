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
              :key="index"
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
            class="classi-item"
            v-for="(item,index) in classi_icons"
            :key="item.id+index"
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
  </div>
</template>

<script>
export default {
  name: "index",
  data() {
    return {
      swipes: [
        {
          url: require("../../assets/images/youjimi.png"),
          id: 1
        },
        {
          url: require("../../assets/images/shanchayou.png"),
          id: 2
        }
      ],
      classi_icons: [
        {
          url: require("../../assets/images/fpzq1.png"),
          title: "扶贫专区",
          id: 1
        },
        {
          url: require("../../assets/images/jrlw.png"),
          title: "节日礼物",
          id: 2
        },
        {
          url: require("../../assets/images/rlzp.png"),
          title: "肉类制品",
          id: 3
        },
        {
          url: require("../../assets/images/dlgw.png"),
          title: "豆类制品",
          id: 4
        },
        {
          url: require("../../assets/images/qldp.png"),
          title: "禽类蛋品",
          id: 5
        },
        {
          url: require("../../assets/images/fpzq.png"),
          title: "粮油米面",
          id: 6
        },
        {
          url: require("../../assets/images/gssx.png"),
          title: "果蔬生鲜",
          id: 7
        },
        {
          url: require("../../assets/images/spyl.png"),
          title: "食品饮料",
          id: 8
        },
        {
          url: require("../../assets/images/mcct.png"),
          title: "茗茶冲调",
          id: 9
        },
        {
          url: require("../../assets/images/ghtw.png"),
          title: "干货调味",
          id: 10
        }
      ]
    };
  },
  mounted: function() {},
  methods: {
    goToSearch() {
      this.$router.push({ name: "searchProductList" });
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.index-header {
  background-color: white;
  background-image: linear-gradient(
    rgb(72, 181, 64),
    rgb(72, 181, 64) 35%,
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
/deep/ .van-search__content {
  border-radius: 20px;
}
/deep/ .van-search .van-cell {
  line-height: 15px;
}
</style>
