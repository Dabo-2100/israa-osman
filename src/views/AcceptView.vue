<template>
  <div class="col-12" id="Accepted">
    <img :src="require('@/assets/photos/ver_1.webp')" alt="israa osman" loading="lazy" />
    <h1>لم يتم تأكيد عملية الدفع بعد</h1>
    <h1 dir="rtl">رقم تسجيل الأستشارة : {{ this.$route.params.OrderId }}</h1>
    <h1>
      يمكنك التواصل مع أدارة الموقع من خلال الرقم التالي لتنسيق موعد الأستشارة وتأكيد
      عملية الدفع
    </h1>
    <a href="https://wa.me/201095090300">
      <font-awesome-icon icon="fa-brands fa-square-whatsapp" />
    </a>
    <h1>+201095090300</h1>
  </div>
</template>

<script>
import $ from "jquery";
window.$ = window.jQuery = require("jquery");
import axios from "axios";
import "vue3-video-play/dist/style.css";
import AOS from "aos";
import "aos/dist/aos.css"; // You can also use <link> for styles
export default {
  name: "AcceptView",
  inject: ["ApiUrl"],
  components: {},
  data() {
    return {
      CurrentWidth: window.innerWidth,
    };
  },
  methods: {},
  watch: {},
  created() {
    setTimeout(function () {
      window.scrollTo(0, 0);
    }, 100);
    AOS.init();
    let main = this;
    $(window).resize(function () {
      main.CurrentWidth = window.innerWidth;
    });
  },
  mounted() {
    let main = this;
    let order_id = this.$route.params.OrderId;
    let user_uid = sessionStorage.getItem("user_uid");
    if (!user_uid) {
      main.$router.push({ name: "home" });
    } else {
      axios
        .post(this.ApiUrl, {
          api_name: "checkaccept",
          order_id: order_id,
          user_uid: user_uid,
        })
        .then(function (res) {
          if (res.data == 0) {
            main.$router.push({ name: "home" });
          }
        });
    }
  },
};
</script>
