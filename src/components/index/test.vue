<template>
  <div style="width: 100%; height: 100%">
    按钮按钮：
    <wx-open-launch-weapp
      username="gh_ee5c1f0c4601"
      path="/pages/index/index.html"
    >
      <script type="text/wxtag-template">
        <style>.btn { padding: 12px}</style>
        <button class="btn">跳转小程序</button>
      </script>
    </wx-open-launch-weapp>
  </div>
</template>

<script>
export default {
  methods: {
    wxmini() {
      // 获取密钥
      this.$axios
        .post({
          url: "/getWinXinShareEntity",
          data: { sharedUrl:  encodeURIComponent(window.location.href.split("#")[0]) },
        })
        .then((res) => {
          console.log(res);
          let { appId, noncestr, signature, timestamp } = res.data.record;
          wx.config({
            // eslint-disable-line
            debug: true, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印
            appId: "wx93b723928c7e335b", // 必填，公众号的唯一标识
            timestamp, // 必填，生成签名的时间戳
            nonceStr:noncestr, // 必填，生成签名的随机串
            signature, // 必填，签名
            jsApiList: ["onMenuShareTimeline"], // 必填，需要使用的JS接口列表
            openTagList: ["wx-open-launch-weapp"], // 可选，需要使用的开放标签列表，例如['wx-open-launch-app']
          });
          /* eslint-disable */
          wx.ready(function () {
            console.log("ready");
          });
        });
    },
  },
  created() {
    const oScript = document.createElement("script");
    oScript.type = "text/javascript";
    oScript.src = "https://res2.wx.qq.com/open/js/jweixin-1.6.0.js";
    oScript.onload = this.wxmini;
    document.body.appendChild(oScript);
  },
};
</script>

<style>
</style>