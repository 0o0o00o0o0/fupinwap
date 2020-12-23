<template>
  <div class="body-wrap">
    <div
      class="hauto"
      v-if="conf.listType=='account'"
    >
      <!-- <van-list
            v-model="loading"
            :error.sync="error"
            :finished="finished"
            error-text="请求失败，刷新重新加载"
            loading-text="加载中"
            finished-text="没有更多了"
            @load="onLoad"
            offset="50"
          > -->
      <div
        class="record-list"
        v-show="haveData"
      >
        <div
          class="record-item"
          v-for="(item,index) in list"
          :key="index"
        >
          <div class="content clearfix"><span class="title">微信充值</span><span class="account">-{{item.rechargeValue}}</span></div>
          <div class="time">{{item.createTime}}</div>
        </div>
        <div class="bottom-prompt">没有更多啦</div>
      </div>
      <div v-show="!haveData">
        <p>暂无记录</p>
      </div>
      <!-- </van-list> -->
    </div>
    <div
      class="hauto"
      v-else
    >
      <!-- <van-list
            v-model="loading"
            :error.sync="error"
            :finished="finished"
            error-text="请求失败，刷新重新加载"
            loading-text="加载中"
            finished-text="没有更多了"
            @load="onLoad"
            offset="50"
          > -->
      <div
        class="record-list"
        v-show="haveData"
      >
        <div
          class="record-item"
          v-for="(item,index) in list"
          :key="index"
        >
          <div class="content clearfix"><span class="title">消费</span><span class="account">-{{item.consumptionValue}}</span></div>
          <div class="time clearfix"><span class="pull-left">{{item.createTime}}</span><span class="pull-right">{{item.consumptionType | consumFilter}}</span></div>
        </div>
        <div class="bottom-prompt">没有更多啦</div>
      </div>
      <div v-show="!haveData">
        <p>暂无记录</p>
      </div>
      <!-- </van-list> -->
    </div>
  </div>
</template>

<script>
import "../../../static/css/public.css";
export default {
  name: "list",
  data() {
    return {
      list: [],
      loading: false,
      finished: false,
      error: false,
      start: 0,
      haveData: true
    };
  },
  mounted: function() {
    this.getRecordList();
  },
  filters: {
    consumFilter: function(value) {
      return parseInt(value) ? "福利卡" : "福包";
    }
  },
  methods: {
    onLoad() {
      this.getRecordList();
    },
    getRecordList() {
      var self = this;
      var params = {};
      params = this.conf.params;

      self.$axios
        .post({
          url: self.conf.urlKey,
          data: params
        })
        .then(function(json) {
          if (json.data.list && json.data.list.length > 0) {
            self.haveData = true;
            self.list = json.data.list;
            /*for(let i = 0;i<json.data.list.length;i++){
            self.list.push(json.data.list[i]);
          }
          self.loading = false;
          if(self.list.length >= json.data.page.total){
            self.finished = true;
          };*/
          } else {
            self.haveData = false;
          }
        })
        .catch(function(error) {
          self.haveData = false;
        });
    }
  },
  props: {
    conf: {
      type: Object
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.body-wrap {
  /* background: rgb(245,245,245); */
  overflow-y: auto;
  overflow-x: hidden;
  -webkit-overflow-scrolling: touch;
  height: 35rem;
  padding-bottom: 0rem;
}
.hauto {
  height: auto;
}
.relative {
  position: relative;
}
.mt15 {
  margin-top: 15px;
}
.f14 {
  font-size: 14px !important;
}
.record-list {
  margin-top: 15px;
}
.record-item {
  background-color: #fff;
  border-bottom: 1px solid #f4f4f4;
  padding: 0 10px;
  text-align: left;
}
.record-item .title {
  font-size: 0.9375rem;
  color: #222222;
  float: left;
}
.record-item .content {
  padding: 12px 0px 8px 0;
}
.record-item .account {
  font-size: 0.9375rem;
  color: #222;
  float: right;
}
.record-item .time {
  font-size: 0.8125rem;
  color: #999999;
  padding: 0 0 10px 0px;
}
.bottom-prompt {
  font-size: 14px;
  color: #666;
  text-align: center;
  margin: 5px 0;
}
</style>
