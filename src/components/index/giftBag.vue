<template>
  <div>
    <div style="padding-bottom: 50px; position: relative">
      <img
        style="width: 100%"
        src="../../assets/images/年货礼包.jpg"
        alt=""
        srcset=""
      />
      <button
        @click="showDia = true"
        style="
          position: absolute;
          width: 50%;
          bottom: calc(5% + 50px);
          left: 24%;
          height: 7%;
          opacity: 0;
        "
      ></button>
    </div>
    <messageBox
      ref="ref"
      :show.sync="showDia"
      title="活动参与资格认证"
      content=" 请输入您的手机号码验证活动参与资格，短信验证码5分钟内有效"
      @confirm="confirm"
      @sendMessage="sendMessage"
    />
  </div>
</template>
<script>
import messageBox from "./message";
export default {
  components: {
    messageBox,
  },
  name: "giftbag",
  data() {
    return {
      phone: "",
      code: "",
      showDia: false,
      sendMessageFlag: false,
      reTry: 60,
      Time: null,
      giftType: "",
    };
  },
  methods: {
    confirm({ phone, code }) {
      this.$axios
        .post({
          url: "/giftlist/checkPhoneAndCode",
          data: {
            phone: phone,
            code: code,
          },
          needLoading: false,
        })
        .then((res) => {
          if (res.data.checkFlag) {
            sessionStorage.setItem("phone", this.phone);
            this.$router.push({
              name: "comList",
              query: {
                phone: phone,
                label: this.giftType,
                orderType: 3,
              },
            });
          }
        });
    },
    sendMessage({phone}) {
   
      this.$axios
        .post({
          url: "/giftlist/getGiftTypeByPhone",
          data: {
            phone: phone,
          },
          needLoading: false,
        })
        .then((res) => {
          if (!res.data.giftType) {
            this.$refs.ref.cancel();
            this.$dialog.alert({
              message: "号码无资格或者资格已领取",
            });
            return;
          }
          this.giftType = res.data.giftType;
        });
    },
  },
};
</script>
<style  scoped>
/deep/ .van-dialog {
  top: 25%;
}
/deep/ .van-field__label {
  max-width: 77px !important;
}
</style>