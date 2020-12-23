<template>
  <div class="el">
    <div
      v-for="(item,index) in evalarr"
      :key="item.productId+index"
      class="evala"
    >
      <div class="eval flex">
        <img
          :src="API_KEY.IMG_SERVER+item.coverImage"
          alt=""
        >
        <div class="eval-title">
          {{item.commodityTitle}}({{item.specificationName}})
        </div>
      </div>
      <div class="start">
        <span>描述相符</span>
        <van-rate
          style="display:inline-block;margin: 0 1.5rem"
          v-model="item.rate"
          :size="25"
          @change="changeRate($event,index)"
          color="#D33729"
          void-icon="star"
          void-color="#eee"
        />
        <span style="font-size:.8rem;color:#A9ABB3;margin-top:3px">{{item.rateName}}</span>
      </div>
      <van-cell-group>
        <van-field
          v-model="item.evala"
          type="textarea"
          placeholder="留下你的评价吧"
          maxlength="200"
          rows="3"
          autosize
        />
      </van-cell-group>
      <div style="padding:1rem 0">
        <img
          class="upload-img"
          v-for="(it,index) in item.imgs"
          :key="it.url+index"
          :src="API_KEY.IMG_SERVER+it.picAddress"
          alt=""
        >
        <div class="upload-img upload-btn">
          <van-icon
            size="2rem"
            name="photo-o"
          />
          <div>
            添加图片
          </div>
          <input
            type="file"
            style="width:100%;height:100%;position:absolute;opacity:0;left:0;top:0"
            name=""
            id=""
            accept="image/gif,image/jpeg,image/bmp"
            capture="camera"
            multiple="multiple"
            @change="addPic($event,index)"
          >
        </div>
        <div style="clear:both"></div>
      </div>
    </div>
    <button
      @click="send(0)"
      class="send-btn"
    >发布</button>
  </div>
</template>
<script>
import axiossss from "axios";
export default {
  name: "evaluate",
  data() {
    return {
      evalarr: [],
      item_id: "",
      openId: "",
      productId: null,
      commodityTitle: "",
      coverImage: "",
      specificationName: "",
      rate: 5,
      rateName: "非常好",
      evala: "",
      imgs: []
    };
  },
  mounted() {
    const product = this.$route.query.productId || "0";
    this.item_id = this.$route.query.itemId;
    this.openId = this.$route.query.openId;
    console.log(this.item_id, this.openId);
    this.evalarr = product.split(",").map(it => ({
      productId: it,
      commodityTitle: "",
      coverImage: "",
      specificationName: "",
      rate: 5,
      evala: "",
      rateName: "非常好",
      imgs: []
    }));

    this.evalarr.forEach(item => {
      this.getProductInfoById(item);
    });
  },
  methods: {
    getProductInfoById(item) {
      var params = {};
      params.id = item.productId;

      this.$axios
        .post({
          url: this.API_KEY.URL_COMODITYINFO_FINDBYID,
          data: params
        })
        .then(json => {
          if (json.data.record) {
            item.commodityTitle = json.data.record.commodityTitle;
            item.coverImage = json.data.record.coverImage;
            item.specificationName = json.data.record.specificationName;
          }
        })
        .catch(function(error) {});
    },
    addPic(e, index) {
      const file = e.target.files[0];
      const fd = new FormData();
      fd.append("file", file);
      fd.append("commodityId", this.evalarr[index].productId);
      fd.append("picType", 4);
      axiossss
        .post(
          "http://backmanage.chhtf.com:8180/pmp/upload/uploadCommodityPic",
          fd
        )
        .then(res => {
          this.evalarr[index].imgs.push({
            picAddress: res.data.data.uploadImagePath,
            picType: 1
          });
        });
    },
    changeRate(num, index) {
      const t = ["", "非常差", "差", "一般", "好", "非常好"];
      this.evalarr[index].rateName = t[num];
    },
    send(num) {
      if (!this.evalarr[num]) {
        var self = this;
        var params = {};
        params.orderInfo = {};
        params.orderInfo.openid = this.openId;
        params.orderInfo.id = this.item_id;
        params.orderInfo.orderStatus = 4;

        self.$axios
          .post({
            url: "/orderinfo/update",
            data: params
          })
          .then(json => {
            self.$toast("已评价");
            this.$router.push("/orderList?orderStatus=4");
          })
          .catch(function(error) {});
      }
      const value = this.evalarr[num];
      const obj = {
        commodityComments: {
          commodityId: value.productId,
          userId: localStorage.getItem("user_id") || 1,
          commentsContent: value.evala,
          commentsPicList: value.imgs,
          starLevel: value.rate
        }
      };
      this.$axios
        .post({
          url: "/commoditycomments/add",
          data: obj
        })
        .then(json => {
          this.send(num + 1);
        })
        .catch(function(error) {});
    }
  },
  computed: {
    rateName() {
      return this.evalarr.map(it => t[it.rate]);
    }
  }
};
</script>
<style  scoped>
* {
  box-sizing: border-box;
  background: white;
}
.evala {
  padding: 1rem;
  max-width: 25rem;
  width: 100%;
  margin: 0 auto;
}
.eval {
}
.flex {
  display: flex;
  flex: 1;
}
.eval img {
  width: 4rem;
  height: 4rem;
}
.eval-title {
  padding: 0 1rem;
  font-size: 14px;
  color: #666;
  text-align: left;
}
.start {
  padding: 1rem 0;
  font-size: 1.2rem;
  font-weight: 600;
  display: flex;
  justify-content: flex-start;
  border-bottom: 1px solid #e7e7e7;
}
[class*="van-hairline"]::after {
  border: 0;
}
.upload-img {
  width: 6rem;
  height: 6rem;
  display: block;
  float: left;
  margin-right: 5px;
}
.upload-btn {
  border: 1px dashed #bcbdc4;
  position: relative;
  color: #a9abb3;
  font-size: 1rem;
  padding: 1.5rem 0;
}
.send-btn {
  width: 80%;
  line-height: 3rem;
  background-color: #d33729;
  outline: 0;
  border: none;
  color: #fff;
  border-radius: 5px;
  margin-top: 2rem;
}
.el {
  background-color: transparent;
}
/deep/ .van-cell {
  padding: 10px 0;
}
</style>