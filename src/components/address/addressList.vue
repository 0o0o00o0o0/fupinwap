<template>
  <div class="body-wrap">
    <div class="hauto">
      <van-nav-bar
        title="地址"
        left-text="返回"
        left-arrow
        @click-left="onClickLeft"
      />
      <div class="address-list" v-show="haveData">
        <van-radio-group v-model="defaultFlagId">
        <div
           class="address-item"
           v-for="(item,index) in addressList"
           :key="index"
           >
          <div class="people-info flex" @click="handleClickAddress(item)">
            <div class="clearflex name">{{item.receiver}}</div>
            <div class="phone">{{item.phone}}</div>
          </div>
          <div class="content" @click="handleClickAddress(item)">
            {{item.addressDetail}}
          </div>
          <div class="flex footer">
            <div class="default"><van-radio  :name="item.id" checked-color="#07c160"  @click="handleChangeDefaultValue(item.id)">默认地址</van-radio ></div>
            <div class="clearflex operate">
              <span @click="deleteAddress(item)"><van-icon name="delete"/><span>删除</span></span>
            </div>
            <div class="clearflex operate">
              <span @click="goToEditAddress(item)"><van-icon name="edit" /><span>编辑</span></span>
            </div>
          </div>
        </div>
        </van-radio-group>
      </div>
      <div v-show="!haveData"><p class="text-center">暂无地址</p></div>
      <div class="address-add">
        <button class="address-add-btn" type="button" @click="goToAddAddress">
          新增收货地址
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import '../../../static/css/public.css'
import bus from '../../assets/js/eventBus'
export default {
  name: 'addressList',
  data () {
    return {
      haveData: true,
      addressList:[],
      pageSource:null,
      defaultFlagId:'',
      fixedDefaultFlagId:'',
      openId:null,
      pageName:'',
      targetParams:{},
      code:''
    }
  },
  mounted: function(){
    this.openId = localStorage.getItem('openId') || '';
    // this.openId = this.openId == 'null' ? null:this.openId;
    // this.openId = this.openId == 'undefined' ? undefined:this.openId;
    // if(!this.openId){
    //     /*sessionStorage.setItem('TARGET_PAGE_INFO',JSON.stringify({'name':'addressList'}));
    //     window.location.href = 'https://pay.chhtf.com/store/redirectwx';
    //     return;*/
    //     this.code = this.getQueryString('code');
    //     if(this.code){
    //       this.getOpenId();
    //     }else{
    //       this.mygets();
    //     }
    // }
    this.getAddressList();
  },
  methods:{
    onClickLeft(){
      this.$router.go(-1);
    },
    goToAddAddress(){
      this.$router.push({name:'addAddress'});
    },
    goToEditAddress(item){
      this.$router.push({name:'editAddress',query:{'addressId':item.id}});
    },
    handleClickAddress(item){
      if(sessionStorage.getItem('ADDRESS_PAGE_SOURCE') == 'confirmOrder'){
        sessionStorage.setItem('ACTIVE_RECEIVE_ADDRESS',JSON.stringify(item));
        this.$router.push({name:'confirmOrder',query:{pageSource:'addressList'}});
      }
    },
    handleChangeDefaultValue(item){
      var self = this;
      var params = {};
      if(this.fixedDefaultFlagId != this.defaultFlagId){
        params.receiverAddress = {};
        params.receiverAddress.id = this.defaultFlagId;
        params.receiverAddress.openid = this.openId;
        params.receiverAddress.defaultFlag = 1;
        self.$axios.post({
            url:self.API_KEY.URL_UPDATE_DEFAULT_ADDRESS,
            data: params
        }).then(function(json) {
          self.$toast('修改成功');
          self.getAddressList();
        }).catch(function(error) {
          
        });
      }else{
        if(item.setDefaultAddress<2){
          item.setDefaultAddress++;
          params.receiverAddress = {};
          params.receiverAddress.id = this.defaultFlagId;
          params.receiverAddress.openid = this.openId;
          params.receiverAddress.defaultFlag = 1;
          self.$axios.post({
              url:self.API_KEY.URL_UPDATE_DEFAULT_ADDRESS,
              data: params
          }).then(function(json) {
            self.$toast('修改成功');
            self.getAddressList();
          }).catch(function(error) {
            
          });
        }
      }
    },
    deleteAddress(item){
      var self = this;
      var params = {};
      params.id = item.id;

      self.$axios.post({
          url:self.API_KEY.URL_ADDRESS_DELETEBYID,
          data: params
      }).then(function(json) {
        self.$toast('删除成功');
        self.getAddressList();
      }).catch(function(error) {
        
      });
    },
    getAddressList(){
      var self = this;
      var params = {};
      params.openid = this.openId;

      self.$axios.post({
          url:self.API_KEY.URL_ADDRESS_FINDBYPAGE,
          data: params
      }).then(function(json) {
        if(json.data.list && json.data.list.length>0){
          self.addressList = json.data.list;
          //self.defaultFlag = self.addressList[0].id;
          for(let i = 0;i<self.addressList.length;i++){
            if(self.addressList[i].defaultFlag){
              self.defaultFlagId = self.addressList[i].id;
              self.fixedDefaultFlagId = self.addressList[i].id;
              self.$set(self.addressList[i],'setDefaultAddress',1);
              break;
            }else{
              self.$set(self.addressList[i],'setDefaultAddress',0);
            }

          }
          self.haveData = true;
        }else{
          self.haveData = false;
        }
      }).catch(function(error) {
        self.haveData = false;
      });
    },
    // mygets() {
    //   var redirect_urls= encodeURIComponent("http://wap.chhtf.com/#/addressList");
    //   var urls = "https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx93b723928c7e335b&redirect_uri="
    //         +redirect_urls+"&response_type=code&scope=snsapi_userinfo&state=STATE#wechat_redirect";
    //   window.location.href = urls;
    // },
    // getQueryString(name) {
    //   var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
    //     var r = window.location.search.substr(1).match(reg);
    //     if (r != null) return unescape(r[2]); return null;
    // },
    // getOpenId(){
    //   var self = this;
    //   var params = {};
    //   params.code = this.code;
    //   self.$axios.post({
    //       baseURL:'',
    //       url:self.API_KEY.URL_GET_OPENID,
    //       data: params,
    //       needLoading: false
    //   }).then(function(json) {
    //     localStorage.setItem('openId',json.data.openid);
    //     self.openId = json.data.openid;
    //     if(sessionStorage.getItem('TARGET_PAGE_INFO')){
    //       self.pageName = JSON.parse(sessionStorage.getItem('TARGET_PAGE_INFO')).name || null;
    //       self.targetParams = JSON.parse(sessionStorage.getItem('TARGET_PAGE_INFO')).params || null;
    //     }
    //     if(self.openId){
    //       if(self.pageName){
    //         if(self.targetParams){
    //           self.$router.push({name:self.pageName,query:self.targetParams});
    //         }else{
    //           self.$router.push({name:self.pageName});
    //         }
    //       }else{
    //         self.$router.push({name:'index'});
    //       }
    //     }else{
    //       self.$router.push({name:'error'});
    //     }
    //   }).catch(function(error) {
    //   });
    // }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.body-wrap{
  /* background: rgb(245,245,245); */
  overflow-y: auto;
  overflow-x: hidden;
  -webkit-overflow-scrolling : touch;
  height: 35rem;
  padding-bottom: 4rem;
}
.hauto{
    height: auto;
}
.address-list{
  overflow: hidden;
  padding-top: 5px;
}
.address-item{
  margin: 10px 0;
  background-color: #fff;
}
.address-item .people-info{
  padding: 7px 14px;
}
.address-item .people-info{
  align-items: center;
  text-align: left;
}
.address-item .people-info .name{
  width: 5.3125rem;
  color: #666;
  font-size: 14px;
}
.address-item .people-info .phone{
  color: #666;
  font-size: 14px;
}
.address-item .content{
  font-size: 14px;
  color: #222;
  padding: 10px 15px;
  text-align: left;
}
.address-item .footer{
  padding: 10px 0px;
}
.address-item .footer .default{
  font-size: 14px;
  color: #666;
  text-align: left;
  margin-left: 10px;
}
.address-item .footer .operate{
  width: 4.375rem;
  text-align: center;
}
.address-item .footer .operate i{
  position: relative;
  top: 2px;
}
.address-add{
  position: fixed;
  bottom: 0;
  width: 100%;
}
.address-add-btn{
  width:100%;
  height: 44px;
  line-height: 44px;
  background-color: #48B440;
  font-size: 16px;
  color: #fff;
  text-align: center;
  border: none;
}
/deep/.van-nav-bar__text{
  color: #48B440;
  position: relative;
  top: 1px;
}
/deep/.van-nav-bar .van-icon{
  color: #48B440;
}
</style>
