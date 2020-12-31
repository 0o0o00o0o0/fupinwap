<template>
  <div>
    <van-dialog
      v-model="show"
      :close-on-click-overlay="false"
      :show-confirm-button="true"
      :show-cancel-button="true"
      :confirm-button-text="confirmTxt || '立即验证抢购'"
      @cancel="cancel"
      @confirm="confirm"
    >
      <div
        class="fupin-area"
        style="text-align: left; padding: 0 10px; font-size: 14px; color: #999"
      >
        <h3 style="color: #000">{{ title }}</h3>
        {{ content }}
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
  data() {
    return {
      phone: "",
      code: "",

      sendMessageFlag: false,
      reTry: 60,
      Time: null
    };
  },
  methods: {
    cancel() {
      this.sendMessageFlag = false;
      this.reTry = 60;
      clearInterval(this.Time);
      this.phone = "";
      this.code = "";
      this.$emit("update:show", false);
    },
    sendMessage() {
      clearInterval(this.Time);
      if (!this.phone || this.phone.length != 11) {
        this.$dialog.alert({
          message: "请输入完整电话号码"
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
      this.$emit("sendMessage", { phone: this.phone });
    },
    confirm() {
      this.$emit("confirm", { phone: this.phone, code: this.code });
    }
  },
  props: {
    show: {
      type: Boolean
    },
    title: {
      type: String
    },
    content: {
      type: String
    },
    confirmTxt: {
      type: String
    }
  }
};
</script>
