<template>
  <div style="width:100vw;height:100vh;background:white;padding:1rem">
    <div
      style="text-align:center;padding:5rem 0"
      v-show="!evalArr.length"
    >
      暂无评价....
    </div>
    <div
      v-for="(item,index) in evalArr"
      :key="index+item.avatar"
      class="evl-des"
    >
      <div style="width:3rem">
        <img
          style="width:100%;border-radius:4rem"
          :src="item.avatar"
          alt=""
        >
      </div>
      <div style="   text-align:left; width: calc(100% - 4rem);">
        <div
          class="flex"
          style="font-size:1.2rem"
        ><span style="margin: 0 1rem 0 0">{{item.nick.length>3?item.nick.slice(0,3)+'*':item.nick}}</span>
          <van-rate
            readonly
            size="1rem"
            color="#D33729"
            v-model="item.rate"
          />
        </div>
        <div style="color:#999;text-align:left;margin-top:.8rem;font-size:.8rem">
          {{item.message}}
        </div>
        <div style="margin-top:1rem;font-size:1.2rem;word-break: break-word;">
          {{item.content}}
        </div>
        <div style="margin-top:1rem">
          <img
            style="width:45%;margin:5px 5px 5px 0;height:8rem;float:left;display:block"
            v-for="(item,index) in item.imgs"
            :key="index+item"
            :src="item"
            alt=""
          >
          <div style="clear:both"></div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: "e",
  data() {
    return {
      evalArr: []
    };
  },
  mounted() {
    const comId = this.$route.query.comId || 0;
    const obj = {
      commodityComments: { commodityId: comId },
      page: { start: 1, count: 100 }
    };
    this.$axios
      .post({
        url: "/commoditycomments/findByPage",
        data: obj,
        needLoading: true
      })
      .then(json => {
        console.log(json.data);
        this.evalArr = json.data.list.map(it => ({
          avatar: it.headimgurl,
          nick: it.nickname,
          rate: it.starLevel,
          message: "",
          message: it.createTime,
          content: it.commentsContent,
          imgs: it.commentsPicList.map(
            it => this.API_KEY.IMG_SERVER + it.picAddress
          )
        }));
      })
      .catch(function(error) {});
  }
};
</script>
<style  scoped>
* {
  box-sizing: border-box;
}
.evl-des {
  display: flex;
  justify-content: space-between;
}
.flex {
  display: flex;
  justify-content: flex-start;
}
</style>