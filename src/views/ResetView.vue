<template>
  <MainNav />
  <div class="col-12" id="ResetView">
    <div
      class="col-11 col-sm-6 ResetForm wow animate__animated animate__fadeInDown"
      dir="rtl"
      data-wow-duration="2s"
      data-wow-delay="0"
    >
      <h1 class="col-12 FormHeader">أستعادة كلمة المرور</h1>
      <div class="col-12 InputField">
        <input
          class="col-11"
          placeholder="ادخل البريد الالكتروني"
          type="text"
          id="ResetEmail"
          @keydown.enter="CheckMail($event)"
          v-model="this.FormData['Email']"
        />
        <font-awesome-icon
          class="col-1"
          icon="fa-solid fa-circle-left"
          @click="CheckMail($event)"
        />
      </div>

      <div
        class="col-12 InputField"
        v-if="this.UserExist == 1 || this.UserExist == 2"
        :disabled="this.UserExist == 2 ? true : false"
      >
        <input
          id="ResetPassword"
          class="col-11"
          placeholder="ادخل رمز التحقق المرسل علي البريد الألكتروني"
          type="text"
          v-model="this.FormData['vCode']"
          @keydown.enter="VerfiyCode($event)"
        />
        <font-awesome-icon
          class="col-1"
          icon="fa-solid fa-circle-left"
          @click="VerfiyCode($event)"
        />
      </div>
      <div class="col-12 InputField" v-if="this.UserExist == 2">
        <input
          id="ResetPassword"
          class="col-11"
          placeholder="ادخل كلمة السر الجديدة"
          type="text"
          v-model="this.FormData['Password']"
          @keydown.enter="UpdatePassword($event)"
        />
        <font-awesome-icon
          class="col-1"
          icon="fa-solid fa-circle-left"
          @click="UpdatePassword($event)"
        />
      </div>

      <div class="col-12 FormErrors">
        <span class="col-12 InputError" v-if="this.UserExist == 0"
          >هذا البريد الالكتروني غير مسجل من قبل</span
        >
      </div>
    </div>
  </div>
</template>

<script>
import $ from "jquery";
import WOW from "wowjs";
window.$ = window.jQuery = require("jquery");
import axios from "axios";
import MainNav from "@/components/MainNav.vue";
import useValidate from "@vuelidate/core";
import { required, email, minLength, maxLength, helpers } from "@vuelidate/validators";
export default {
  name: "ResetView",
  components: { MainNav },
  data() {
    return {
      v$: useValidate(),
      ApiUrl: this.$store.state["Api_Url"],
      CurrentWidth: window.innerWidth,
      FormData: {
        Email: "",
        Password: "",
        PasswordMatch: "",
        vCode: "",
      },
      UserExist: 3,
    };
  },
  methods: {
    CheckMail(e) {
      e.preventDefault();
      let main = this;
      this.v$.FormData.Email.$validate();
      if (!this.v$.FormData.Email.$error) {
        axios
          .post(main.ApiUrl, {
            api_name: "checkemail",
            user_email: main.FormData["Email"],
          })
          .then(function (res) {
            if (res.data == 0) {
              main.UserExist = 0;
            } else if (typeof res.data != "number") {
              let user_id = res.data["user_id"];
              if (res.data["is_verified"] == 0) {
                let payload = { key: "user_id", value: user_id };
                main.$store.dispatch("SetUserInfo", payload);
                let payload2 = {
                  key: "user_email",
                  value: main.FormData["Email"],
                };
                main.$store.dispatch("SetUserInfo", payload2);
                main.$router.push({ name: "verify" });
              } else {
                main.$store.commit("OpenLoader");
                main.UserExist = 1;
                axios
                  .post(main.ApiUrl, {
                    api_name: "resendvCode",
                    user_email: main.FormData["Email"],
                    index: 1,
                  })
                  .then(function (res) {
                    main.$store.commit("CloseLoader");
                    main.$swal.fire({
                      icon: "success",
                      title: "تم إرسال كود استعادة كلمة السر علي بريدك الألكتروني",
                      position: "top-center",
                      fontSize: "0.7rem",
                      showConfirmButton: false,
                      timerProgressBar: true,
                      timer: 2000,
                    });
                  });
              }
            }
          });
      }
    },
    UpdatePassword(e) {
      e.preventDefault();
      let main = this;
      this.v$.FormData.Password.$validate();
      if (!this.v$.FormData.Password.$error) {
        main.$store.commit("OpenLoader");
        axios
          .post(main.ApiUrl, {
            api_name: "updatepass",
            user_email: main.FormData["Email"],
            vCode: main.FormData["vCode"],
            user_password: main.FormData["Password"],
          })
          .then(function (res) {
            if (res.data == "") {
              main.$store.commit("CloseLoader");
              main.$swal.fire({
                icon: "success",
                title: "تم تغير كلمة السر بنجاح قم بتسجيل الدخول",
                position: "top-center",
                fontSize: "0.7rem",
                showConfirmButton: false,
                timerProgressBar: true,
                timer: 2000,
              });
              setTimeout(() => {
                main.$router.push({ name: "login" });
              }, 2100);
            }
          });
      }
    },
    VerfiyCode(e) {
      e.preventDefault();
      let main = this;
      this.v$.FormData.vCode.$validate();
      if (!this.v$.FormData.vCode.$error) {
        main.$store.commit("OpenLoader");
        axios
          .post(main.ApiUrl, {
            api_name: "verify2",
            user_email: main.FormData["Email"],
            vCode: main.FormData["vCode"],
          })
          .then(function (res) {
            if (res.data == 1) {
              main.UserExist = 2;
              main.$store.commit("CloseLoader");
            } else {
              main.UserExist = 1;
              main.$store.commit("CloseLoader");
              main.$swal.fire({
                icon: "error",
                title: "كود استعادة كلمة المرور خاطئ",
                position: "top-center",
                fontSize: "0.7rem",
                showConfirmButton: false,
                timerProgressBar: true,
                timer: 2000,
              });
            }
          });
      }
    },
  },
  validations() {
    return {
      FormData: {
        Email: {
          email: helpers.withMessage("من فضلك ادخل البريد الالكتروني بشكل صحيح", email),
          required: helpers.withMessage("من فضلك ادخل البريد الالكتروني", required),
        },
        Password: {
          required: helpers.withMessage("من فضلك ادخل كلمة السر", required),
          minLength: helpers.withMessage(
            "ادخل كلمة السر بطول 8 احرف علي الاقل",
            minLength(8)
          ),
          maxLength: helpers.withMessage("ادخل كلمة السر بحد اقصي 16 حرف", maxLength(16)),
        },
        vCode: {
          required: helpers.withMessage("من فضلك ادخل اسم المستخدم", required),
        },
      },
    };
  },
  watch: {
    PasswordSeen() {
      if (this.PasswordSeen == 0) {
        this.PasswordType = "password";
      } else {
        this.PasswordType = "text";
      }
    },
  },
  created() {
    let main = this;
    $(window).resize(function () {
      main.CurrentWidth = window.innerWidth;
    });
  },
  mounted() {
    new WOW.WOW({
      live: false,
    }).init();
    let user_id = this.$store.state.UserInfo["user_id"];
    let user_login = this.$store.state.UserLogin["IsLogin"];
    if (user_id && user_login == 0) {
      this.$router.push({ name: "verify" });
    } else if (user_id && user_login == 1) {
      this.$router.push({ name: "dashboard" });
    }
  },
};
</script>
<style lang="scss" scoped>
#ResetView {
  display: flex;
  padding-top: 5.1rem;
  min-height: 100vh;
  flex-direction: row;
  flex-wrap: wrap;
  align-content: flex-start;
  justify-content: center;
  align-items: flex-start;
  .ResetForm {
    padding: 1rem;
    background-color: white;
    border: 1px #c8c9ca solid;
    margin-top: 3rem;
    box-shadow: 1px 1px 15px grey;
    border-radius: 1rem;

    .FormHeader {
      font-size: 1.2rem;
      font-family: "Lemonada";
      text-align: center;
      padding: 1rem;
    }
    .InputField {
      display: flex;
      flex-direction: row;
      flex-wrap: wrap;
      align-content: center;
      justify-content: center;
      align-items: center;
      border: 1px solid #c8c9ca;
      border-radius: 0.5rem;
      margin-bottom: 1rem;
      input {
        font-size: 1.5rem;
        padding: 1rem;
        border: 0px;
        outline: 0;
        border-radius: 0.5rem;
      }
      svg {
        font-size: 1.5rem;
        color: #c8c9ca;
        cursor: pointer;
      }
    }
  }
}
</style>
