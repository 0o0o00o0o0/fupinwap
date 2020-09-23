<template>
  <div>
    <form
      ref="form"
      action="http://wap.chhtf.com:8080/store/ylpayRechargeRecord"
      method="post"
    >
      <input
        type="hidden"
        name="openid"
        id="openid"
        :value="openId"
      />
      <input
        type="hidden"
        name="rechargeValue"
        id="rechargeValue"
        :value="txnAmt"
      />
      <input
        type="hidden"
        name="rechargeNumber"
        id="rechargeNumber"
        :value="txnTime"
      />

      <input
        type="hidden"
        name="correlationId"
        id="correlationId"
        :value="orderId"
      />
      <input
        type="hidden"
        name="userCardNumber"
        id="userCardNumber"
        :value="userCardNumber"
      >
    </form>
  </div>
</template>
<script>
export default {
  data() {
    return {
      txnTime: ""
    };
  },
  mounted() {
    this.openId = localStorage.getItem("openId");
  },
  watch: {
    userCardNumber(val) {
      this.userCardNumber = val.split(" ").join("");
    }
  },
  methods: {
    puzero(val) {
      return ("" + val).padStart(2, "0");
    },
    submit() {
      this.$axios
        .post({ url: "/rechargerecord/createRechargeNumber" })
        .then(res => {
          this.txnTime = res.data.rechargeNumber;
          this.$nextTick(() => {
            localStorage.setItem('ylCard',this.userCardNumber)
            this.$refs.form.submit();
          });
        });
    }
  },
  props: {
    txnAmt: {
      type: Number
    },
    orderId: {
      type: String
    },
    userCardNumber: {
      type: String
    }
  }
};
</script>