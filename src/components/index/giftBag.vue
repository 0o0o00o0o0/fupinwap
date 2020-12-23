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
    <van-dialog
      v-model="showDia"
      :close-on-click-overlay="false"
      :show-confirm-button="true"
      :show-cancel-button="true"
      :confirm-button-text="'立即验证抢购'"
      @cancel="cancel"
      @confirm="confirm"
    >
      <div
        class="fupin-area"
        style="text-align: left; padding: 0 10px; font-size: 14px; color: #999"
      >
        <h3 style="color: #000">活动参与资格认证</h3>
        请输入您的手机号码验证活动参与资格，短信验证码5分钟内有效
        <div>
          <van-field
            v-model="phone"
            label="电话号码"
            placeholder="请输入电话号码"
            type="phone"
          />
          <van-field
            v-model="code"
            center
            clearable
            label="短信验证码"
            placeholder="请输入验证码"
          >
            <van-button
              slot="button"
              @click="sendMessage"
              :loading-text="reTry + 's后重试'"
              :loading="sendMessageFlag"
              size="small"
              :type="sendMessageFlag ? '' : 'primary'"
            >
              发送验证码
            </van-button>
          </van-field>
        </div>
      </div>
    </van-dialog>
  </div>
</template>
<script>
export default {
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
    cancel() {
      this.sendMessageFlag = false;
      this.reTry = 60;
      clearInterval(this.Time);
      this.phone = "";
      this.code = "";
    },
    confirm() {
      this.$axios
        .post({
          url: "/giftlist/checkPhoneAndCode",
          data: {
            phone: this.phone,
            code: this.code,
          },
          needLoading: false,
        })
        .then((res) => {
          if (res.data.checkFlag) {
            sessionStorage.setItem("phone", this.phone);
            this.$router.push({
              name: "comList",
              query: {
                phone: this.phone,
                label: this.giftType,
                orderType: 3,
              },
            });
          }
        });
    },
    sendMessage() {
      clearInterval(this.Time);
      if (!this.phone || this.phone.length != 11) {
        this.$dialog.alert({
          message: "请输入完整电话号码",
        });
        return;
      }
      this.sendMessageFlag = true;
      this.Time = setInterval(() => {
        if (this.reTry > 0) {
          this.reTry--;
        } else {
          this.cancel();
        }
      }, 1000);
      this.$axios
        .post({
          url: "/giftlist/getGiftTypeByPhone",
          data: {
            phone: this.phone,
          },
          needLoading: false,
        })
        .then((res) => {
          if (!res.data.giftType) {
            this.cancel();
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