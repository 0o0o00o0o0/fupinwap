<template>
  <div class="index">
    <div class="index-header">
      <!-- <div style="padding: 0 0 0.5rem"> -->
      <!-- <div class="search">
          <van-search
            background="rgba(0,0,0,0)"
            style="width: 93%; height: 2rem"
            @click="goToSearch"
            readonly
            placeholder="搜索商品"
          />
          <div v-show="false" class="classi-box">
            <img
              class="classi-img"
              src="../../assets/images/search_main.png"
              alt=""
              srcset=""
            />
            分类
          </div>
        </div> -->

      <!-- <div class="swiper-box">
          <van-swipe :autoplay="3000" indicator-color="white">
            <van-swipe-item
              v-for="(image, index) in swipes"
              :key="index + image.url"
            >
              <img
                style="width: 100%; height: 9.5rem"
                :src="image.url"
                alt=""
                @click="$router.push({ name: 'video' })"
              />
            </van-swipe-item>
          </van-swipe>
        </div> -->
      <!-- <div class="classi-icon">

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
        </div> -->
      <!-- </div> -->
    </div>
    <div class="fupin-area">
      <!-- <div :style="'font-size:20px;    display: flex;align-items: center;;justify-content:'+(fupinArea.length===1?' center':'space-between')"><span style="float:left;display:none">助农地区</span>
        <div
          v-for="(item,index) in fupinArea"
          :key="item.id+index"
          style="display:inline-block"
          class="fupin-area-item"
          @click="gotoDetail(item)"
        >
          {{item.title}}
        </div>
      </div> -->
      <!-- <div style="padding: 1rem 0;display:flex;align-items:center;justify-content:center">
        <div
          v-for="(item,index) in fupinArea"
          :key="item.id+index"
          class="fupin-area-item"
          @click="$router.push({name:'comList',query:{type:'place',label:item.title}})"
        >
          {{item.title}}
        </div>
      </div> -->
      <div
        v-for="(item, index) in areaShow"
        :key="item.title + index"
        :style="
          'width:17%;margin-top:' + (item.more || index < 5 ? '0' : '1rem')
        "
        @click="gotoDetail(item)"
      >
        <span
          style="font-size: 3rem"
          v-if="item.more"
          @click.stop="showHideArea = true"
        >
          ...
        </span>
        <div v-if="!item.more">
          <img style="width: 85%" :src="item.url" alt="" srcset="" />
          <div style="font-size: 12px">{{ item.title }}</div>
        </div>
      </div>
      <div style="width: 17%; margin-top: 1rem"></div>
    </div>
    <div style="position: relative;display:none">
      <img src="../../assets/images/年货节.jpg" style="width: 100%" alt="" />
      <button
        @click="$router.push({ name: 'giftBag' })"
        style="
          width: 92%;
          height: 52%;
          left: 4%;
          top: 0;
          position: absolute;
          opacity: 0;
        "
      ></button>
      <button
        @click="gotoDetail({ title: '五折专区', orderType: 2 },false)"
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
        @click="gotoDetail({ title: '1元购/10元购', orderType: 1 },false)"
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
    <!-- <img src="../../assets/11.jpg" style="display:block;width:60%;margin:5px auto;height:45px" alt="">
    <div style="display: flex; height: 7rem">
      <img
        src="../../assets/13.jpg"
        style="width: 14rem; display: block; height: calc(100% + 3px)"
        alt=""
      />
      <div style="width: 44%; margin-left: 3px">
        <img
          src="../../assets/14.jpg"
          style="display: block; width: 100%; height: 50%"
          alt=""
        />
        <img
          src="../../assets/12.jpg"
          style="display: block; width: 100%; margin-top: 3px; height: 50%"
          alt=""
        />
      </div>
    </div> -->
    <!-- <recommend
      title="臻品抢购"
      :recommonds="zpqgArr"
      :showTabs="false"
      componentType="jp"
    />
    <recommend
      title="扶贫预售"
      saleTime="7月1号8点-7月15号24点"
      :recommonds="fpysArr"
      :showRecoms='false'
      :showTabs="false"
      componentType="jp"
      :showyg="true"
    /> -->
    <div class="rec" style="margin: 1rem 0; background: rgb(245, 245, 245)">
      <img
        src="../../assets/images/热卖拷贝.png"
        alt=""
        srcset=""
        style="width: 15px; vertical-align: text-bottom"
      />
      {{ labelName }}
      <div v-show="presellTimeStr">({{ tempString }}{{ presellTimeStr }})</div>
    </div>
    <div v-show="!labelcommdyList.length" style="margin: 100px 0">
      暂无商品...
    </div>
    <div v-show="labelcommdyList.length" class="labelCommidyList">
      <div
        v-for="(item, index) in labelcommdyList"
        :key="item.id + index + item.title"
        class="labelCommidy-item"
        style=""
        @click="goToProductDetail(item.id)"
      >
        <img style="width: 100%; height: 11.5rem" :src="item.url" alt="" />
        <div
          style="
            height: 2.5rem;
            text-align: center;
            font-size: 1rem;
            display: flex;
            align-items: center;
            justify-content: start;
            text-indent: 0.5rem;
          "
        >
          <span
            style="
              text-align: left;
              display: inline-block;
              word-break: break-all;
            "
            >{{ item.title
            }}<span
              style="margin-left: 0.5rem; color: #b4b4b4; font-size: 0.8rem"
              >({{ item.specificationName }})</span
            ></span
          >
        </div>
        <div style="height: 1rem; float: left; color: red; text-indent: 0.5rem">
          <!-- <img
            style="width:1rem;vertical-align: text-bottom;margin: 0 3px"
            src="../../assets/images/fu.png"
          /> -->
          ￥{{ item.price
          }}<del
            style="font-size: 0.8rem; color: #999; margin-left: 2px"
            v-show="item.originPrice"
            >￥{{ item.originPrice }}</del
          >
        </div>
        <div
          v-show="item.showPre"
          style="
            position: absolute;
            opacity: 0.65;
            width: 3rem;
            height: 3rem;
            background-color: rgb(46, 126, 94);
            line-height: 3rem;
            border-radius: 3rem;
            top: 0;
            right: 0;
            color: white;
          "
        >
          预售
        </div>
      </div>
      <div
        v-show="labelcommdyList.length % 2"
        class="labelCommidy-item"
        style="opacity: 0"
      ></div>
    </div>
    <van-dialog
      v-model="showHideArea"
      title=""
      :close-on-click-overlay="true"
      :show-confirm-button="false"
    >
      <div class="fupin-area">
        <div
          v-for="(item, index) in areaHide"
          :key="item.title + index"
          :style="'width:23%;margin-top:' + (item.more ? '0' : '1rem')"
          @click="gotoDetail(item)"
        >
          <div>
            <img style="width: 80%" :src="item.url" alt="" srcset="" />
            <div style="font-size: 12px">{{ item.title }}</div>
          </div>
        </div>
      </div>
    </van-dialog>
  </div>
</template>

<script>
import recommend from "./recommend";
import { Dialog } from "vant";
import bus from "../../assets/js/eventBus";
export default {
  name: "fupin",
  components: {
    recommend,
  },
  data() {
    return {
      tempString: "",
      Time: null,
      labelName: "",
      presellTime: "",
      presellTimeStr: "",
      labelList: [],
      labelcommdyList: [],
      areaShow: [
        { title: "长沙市", url: require("../../assets/1长沙市.jpg") },
        { title: "株洲市", url: require("../../assets/2株洲市.jpg") },
        { title: "湘潭市", url: require("../../assets/2湘潭市.jpg") },
        { title: "衡阳市", url: require("../../assets/3衡阳市.jpg") },
        { title: "邵阳市", url: require("../../assets/4邵阳市.jpg") },
        // { title: "岳阳市", url: require("../../assets/5岳阳市.jpg") },
        // { title: "常德市", url: require("../../assets/6常德市.jpg") },
        { title: "张家界", url: require("../../assets/7张家界市.jpg") },
        { title: "益阳市", url: require("../../assets/8益阳市.jpg") },
        { title: "郴州市", url: require("../../assets/9郴州市.jpg") },
        { title: "永州市", url: require("../../assets/10永州市.jpg") },
        { title: "怀化市", url: require("../../assets/11怀化市.jpg") },
        // { title: "娄底市", url: require("../../assets/12娄底市.jpg") },
        { title: "湘西州", url: require("../../assets/13湘西州.jpg") },
      ],
      showHideArea: false,
      areaHide: [],
      swipes: [
        {
          url: require("../../assets/images/csnyyh.jpg"),
          id: 20,
        },
        {
          url: require("../../assets/images/larou.jpg"),
          id: 1000,
        },
        {
          url: require("../../assets/images/jidan.jpg"),
          id: 2000,
        },
      ],
      classi_icons: [
        // {
        //   url: require("../../assets/images/fpzq1.png"),
        //   title: "扶贫专区",
        //   id: 11
        // },
        {
          url: require("../../assets/images/组23.png"),
          title: "团购专享",
          id: 21,
        },
        {
          url: require("../../assets/images/组24.png"),
          title: "臻品抢购",
          id: 31,
        },
        {
          url: require("../../assets/images/组25.png"),
          title: "扶贫预售",
          id: 41,
        },
        {
          url: require("../../assets/images/组27.png"),
          title: "助农热卖",
          id: 51,
        },
      ],
      fupinArea: [],
      zpqgArr: [],
      fpysArr: [],
    };
  },
  mounted: function () {
    this.openId = localStorage.getItem("openId");
    this.openId = this.openId == "null" ? null : this.openId;
    this.openId = this.openId == "undefined" ? undefined : this.openId;
    sessionStorage.setItem('temporary','')
    if (!this.openId) {
      this.code = this.getQueryString("code");
      if (this.code) {
        this.getOpenId();
      } else {
        this.mygets();
      }
    }
    bus.$emit("changeNav", 0);
    this.$axios
      .post({
        url: "/homepageinfo/findByPage",
        data: { homepageInfo: {}, page: { start: 1, count: 100 } },
        needLoading: true,
      })
      .then((res) => {
        if (res.success) {
          const data = res.data.list;
          for (let i = 0; i < data.length; i++) {
            const n = data[i];
            if (n.boardName === "扶贫专区地区") {
              this.fupinArea = [
                ...this.fupinArea,
                {
                  id: n.id,
                  title: n.relativeContent,
                  hideFlag: n.hideFlag,
                  tempString: n.tempString,
                },
              ];
            }
            // if (
            //   n.boardName === "扶贫专区-浏览" &&
            //   n.relativeContent === "臻品抢购"
            // ) {
            //   this.zpqgArr = [{ id: n.id, title: n.relativeContent }];
            // }
            if (n.boardName === "扶贫专区-浏览") {
              this.fpysArr = [{ id: n.id, title: n.relativeContent }];
              // this.classi_icons = this.classi_icons.map(it => {
              //   const d = this.labelList.filter(l => l.title == it.title);
              //   return d.length ? { ...it, id: d[0].id } : it;
              // });
              this.presellTime = n.presellTime || this.presellTime;
              this.tempString = n.tempString;
            }
          }
          // this.labelName = "助农热卖";
          this.labelName = this.fpysArr[0].title;
          this.changeTime();
          this.changeTabs(undefined, this.labelName);
        }
      });
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
    mygets() {
      var redirect_urls = encodeURIComponent(
        "http://wap.chhtf.com/#/navContainer/fupin"
      );
      var urls =
        "https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx93b723928c7e335b&redirect_uri=" +
        redirect_urls +
        "&response_type=code&scope=snsapi_userinfo&state=STATE#wechat_redirect";
      window.location.href = urls;
    },
    getQueryString(name) {
      var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
      var r = window.location.search.substr(1).match(reg);
      if (r != null) return unescape(r[2]);
      return null;
    },
    getOpenId() {
      var self = this;
      var params = {};
      params.code = this.code;
      self.$axios
        .post({
          baseURL: "",
          url: self.API_KEY.URL_GET_OPENID,
          data: params,
          needLoading: false,
        })
        .then(function (json) {
          localStorage.setItem("openId", json.data.openid);
          self.openId = json.data.openid;
          if (sessionStorage.getItem("TARGET_PAGE_INFO")) {
            self.pageName =
              JSON.parse(sessionStorage.getItem("TARGET_PAGE_INFO")).name ||
              null;
            self.targetParams =
              JSON.parse(sessionStorage.getItem("TARGET_PAGE_INFO")).params ||
              null;
          }
          if (self.openId) {
            // if (self.pageName) {
            //   if (self.targetParams) {
            //     self.$router.push({
            //       name: self.pageName,
            //       query: self.targetParams
            //     });
            //   } else {
            //     self.$router.push({ name: self.pageName });
            //   }
            // } else {
            self.$router.push({ name: "fupin" });
            // }
          } else {
            self.$router.push({ name: "error" });
          }
        })
        .catch(function (error) {});
    },
    changeTime() {
      this.Time = setTimeout(() => {
        this.changeTime();
      }, 60 * 1000);
      const preTime =
        new Date(this.presellTime.split("-").join("/")).getTime() -
        new Date().getTime();
      if (preTime > 0) {
        const date = Math.floor(preTime / (1000 * 60 * 60 * 24));
        const hour = Math.floor(preTime / (1000 * 60 * 60)) - date * 24;
        const min =
          Math.floor(preTime / (1000 * 60)) - date * 24 * 60 - hour * 60;
        this.presellTimeStr = date + "天" + hour + "小时" + min + "分";
      } else {
        clearTimeout(this.Time);
        this.presellTimeStr = "";
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
            commodityInfo: { labelNamelist: this.labelName },
          },
          needLoading: true,
        })
        .then((res) => {
          if (res.success) {
            console.log(res.data.list);
            this.labelcommdyList = res.data.list.map((it) => ({
              id: it.id,
              url: this.API_KEY.IMG_SERVER + it.coverImage,
              title: it.commodityTitle,
              price: it.displayPrice,
              originPrice: it.originPrice,
              specificationName: it.specificationName,
              showPre: it.presellFlag,
            }));
          }
        });
    },
  },
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
/* .rec {
  position: sticky;
  left: 0;
  right: 0;
  top: 0rem;
} */
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
  width: 95%;
  height: 9.5rem;
  margin: 2px auto;
  margin-top: 0.1rem;
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
  position: relative;
}
.fupin-area {
  padding: 1rem;
  margin-top: 0.1rem;
  background-color: #fff;
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
}
.fupin-area-item {
  padding: 4px 10px;
  background-color: rgb(240, 240, 240);
  color: rgb(211, 55, 42);
  margin-left: 0rem;
  font-size: 1rem;
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
/deep/ .van-dialog {
  width: 98%;
}
.hhhhh .van-dialog__message {
  font-size: 16px;
}
</style>
