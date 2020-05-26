  <template>
  <div id="app">
    <transition name="slide-left">
      <router-view class="child-view"></router-view>
    </transition>
  </div>
</template>

<script>
export default {
  name: "App",
  data() {
    return { code: "", openId: "" };
  },
  mounted: function() {
    this.openId = localStorage.getItem("openId");
    this.openId = this.openId == "null" ? null : this.openId;
    this.openId = this.openId == "undefined" ? undefined : this.openId;

    if (!this.openId) {
      this.code = this.getQueryString("code");
        console.log(111)
      if (this.code) {
        // this.getOpenId();
      } else {
        // this.mygets();
      }
    }
  },
  methods: {
    mygets() {
      var redirect_urls = encodeURIComponent(
        "http://wap.chhtf.com/#/navContainer/index"
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
          needLoading: false
        })
        .then(function(json) {
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
            if (self.pageName) {
              if (self.targetParams) {
                self.$router.push({
                  name: self.pageName,
                  query: self.targetParams
                });
              } else {
                self.$router.push({ name: self.pageName });
              }
            } else {
              self.$router.push({ name: "index" });
            }
          } else {
            self.$router.push({ name: "error" });
          }
        })
        .catch(function(error) {});
    }
  }
};
</script>

<style>
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  background: rgb(245, 245, 245);
  height: 100%;
}
html,
body {
  height: 100%;
}

.child-view {
  position: absolute;
  width: 100%;
  transition: all 0.12s;
}
.slide-left-enter,
.slide-right-leave-active {
  opacity: 0;
}
.slide-left-leave-active,
.slide-right-enter {
  opacity: 0;
}
</style>
