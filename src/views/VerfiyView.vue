<template>
  <MainNav />
  <div class="col-12" id="LoginView">
    <div class="col-12" id="Filter">
      <form
        class="col-11 col-sm-8 col-md-5 LoginForm animate__animated animate__zoomIn"
        style="--animate-duration: 2s"
      >
        <div class="col-12 FormHeader">
          <img
            loading="lazy"
            alt="israaosman"
            :src="require('@/assets/photos/AppLogo.webp')"
            v-if="this.CurrentWidth > 767"
          />
          <h1 class="col-12" style="text-align: center">التحقق من البريد الالكتروني</h1>
          <p class="col-12">
            {{ this.Useremail }}
            <a href="/#/login" @click="remover()">تعديل البريد الالكتروني</a>
          </p>
        </div>
        <div class="col-12 FormBody">
          <div class="col-12 FormField" type="email">
            <div class="col-11">
              <label class="col-12">ادخل كود التحقق</label>
              <input
                v-model="FormData.vCode"
                type="text"
                class="col-12"
                placeholder="ادخل كود التحقق"
                maxlength="4"
                @change="this.LoginError = 0"
                id="TheCode"
              />
            </div>
            <font-awesome-icon class="col-1" icon="fa-solid fa-envelope" />
            <span class="InputError col-12" v-if="v$.FormData.vCode.$error">
              {{ v$.FormData.vCode.$errors[0].$message }}
            </span>
          </div>
          <div class="col-12 FormFooter">
            <span class="InputError col-12" v-if="this.LoginError == 1"
              >كود التحقق خاطئ</span
            >
            <button class="col-12 col-sm-6 btn btn-success" @click="Login($event)">
              تأكيد الكود
            </button>
            <p class="col-12" v-if="this.ResendCode == 0">
              <a href="" @click="SendVCode($event)">إعادة ارسال كود التحقق</a>
            </p>
          </div>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import $ from "jquery";
window.$ = window.jQuery = require("jquery");
import MainNav from "@/components/MainNav.vue";
import axios from "axios";
import useValidate from "@vuelidate/core";
import { required, maxLength, minLength, helpers } from "@vuelidate/validators";
export default {
  name: "VerfiyView",
  components: { MainNav },
  data() {
    return {
      v$: useValidate(),
      ApiUrl: this.$store.state["Api_Url"],
      CurrentWidth: window.innerWidth,
      FormData: {
        vCode: "",
      },
      PasswordSeen: 0,
      PasswordType: "password",
      LoginError: 0,
      Useremail: this.$store.state.UserInfo["user_email"],
      ResendCode: 0,
    };
  },
  methods: {
    Login(e) {
      let main = this;
      e.preventDefault();
      this.v$.$validate();
      if (!this.v$.$error && this.LoginError == 0) {
        axios
          .post(this.ApiUrl, {
            api_name: "verify",
            vCode: main.FormData["vCode"],
            user_id: main.$store.state.UserInfo["user_id"],
          })
          .then(function (res) {
            if (res.data == 0) {
              main.LoginError = 1;
            } else {
              main.$store.commit("Login");
              main.$router.push({ name: "dashboard" });
            }
          });
      }
    },
    SendVCode(e) {
      let main = this;
      e.preventDefault();
      main.$store.commit("OpenLoader");
      main.$swal
        .fire({
          icon: "success",
          title: "تم إرسال كود التحقق الي بريدك الألكتروني",
          position: "top-center",
          fontSize: "0.7rem",
          timerProgressBar: true,
        })
        .then((result) => {
          main.ResendCode = 1;
        });
      axios
        .post(this.ApiUrl, {
          api_name: "resendvCode",
          user_email: this.$store.state.UserInfo["user_email"],
          index: 2,
        })
        .then(function (res) {
          main.$store.commit("CloseLoader");
        });
    },
    remover() {
      let payload = { key: "user_email", value: null };
      this.$store.dispatch("SetUserInfo", payload);
      let payload2 = { key: "user_id", value: null };
      this.$store.dispatch("SetUserInfo", payload2);
    },
  },
  validations() {
    return {
      FormData: {
        vCode: {
          required: helpers.withMessage("من فضلك ادخل كود التحقق", required),
        },
      },
    };
  },
  watch: {},
  created() {
    let main = this;
    $(window).resize(function () {
      main.CurrentWidth = window.innerWidth;
    });

    $("body").on("click", ".FormField", function () {
      $("input", this).focus();
      $(".FormField").removeClass("Selected");
      $(this).addClass("Selected");
      $("input", this).attr("placeholder", "");
      if (main.CurrentWidth < 767) {
        $("input", this).css("height", "3rem");
      } else {
        $("input", this).css("height", "1.5rem");
      }

      $("label", this).fadeIn();
    });

    $("body").on("blur", ".FormField input", function () {
      let type = $(this).attr("type");
      if ($(this).val() == "") {
        let parent = $(this).parent();
        $("label", parent).hide();
        if (type == "password") {
          $("input", parent).attr("placeholder", "كلمة السر");
        } else {
          $("input", parent).attr("placeholder", "البريد الالكتروني");
        }
      } else {
        if (type == "password") {
          main.v$.FormData.Password.$validate();
        } else {
          main.v$.FormData.vCode.$validate();
        }
      }
      $(".FormField").removeClass("Selected");
      $("#LoginView").on("keypress", "#TheCode", function () {
        let key = window.event.keyCode;
        let allowed = `0123456789`;
        return allowed.indexOf(String.fromCharCode(key)) != -1;
      });
    });
  },
  mounted() {
    let user_id = this.$store.state.UserInfo["user_id"];
    let user_login = this.$store.state.UserLogin["IsLogin"];
    if (user_id != "" && user_login == 1) {
      this.$router.push({ name: "dashboard" });
    } else if (user_id == "" && user_login == 0) {
      this.$router.push({ name: "login" });
    }
  },
};
</script>

<style lang="scss" scoped>
#LoginView {
  display: flex;
  background-color: #fbfbfb;
  background-position: 50%;
  background-size: cover;
  background-repeat: no-repeat;
  min-height: 100vh;
  flex-direction: column;
  flex-wrap: wrap;
  align-content: center;
  justify-content: flex-start;
  align-items: center;
  @media screen and (max-width: 767px) {
    align-items: flex-start;
    background-color: #f2f2f2;
    background-image: none;
  }
  #Filter {
    min-height: 100vh;
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    align-content: flex-start;
    justify-content: center;
    align-items: center;
    .backnav {
      display: flex;
      direction: rtl;
      flex-direction: row;
      flex-wrap: wrap;
      align-content: center;
      justify-content: space-between;
      margin-right: 5%;
      button {
        border: 0px;
        background-color: transparent;
        font-size: 3rem;
        svg {
          color: #a448ad;
        }
      }
      img {
        height: 8rem;
      }
    }

    .LoginForm {
      display: flex;
      flex-direction: column;
      flex-wrap: nowrap;
      align-content: center;
      justify-content: center;
      align-items: center;
      margin-top: 7.1rem !important;
      padding: 2rem;
      background-color: white;
      direction: rtl;
      transition: all 500ms ease;
      @media screen and (max-width: 767px) {
        background-color: transparent;
        backdrop-filter: blur(0);
        border-radius: 0;
        box-shadow: 0 0;
        border: 0;
        padding: 0rem;
      }
      border-radius: 2rem;
      box-shadow: 1px 1px 15px rgba(0, 0, 0, 0.372);
      .FormHeader {
        display: flex;
        flex-direction: column;
        flex-wrap: wrap;
        align-content: center;
        align-items: center;
        justify-content: center;
        img {
          height: 5rem;
          margin-bottom: 1rem;
        }
        h1 {
          text-align: center;
          color: black;
          font-size: 1.2rem;
          margin-bottom: 1rem !important;
          font-family: "Lemonada";
          @media screen and (max-width: 767px) {
            color: black;
            text-align: right;
          }
        }
      }
      .FormBody {
        display: flex;
        flex-direction: column;
        flex-wrap: nowrap;
        align-content: center;
        justify-content: center;
        align-items: center;
        .FormField {
          background-color: white;
          border-radius: 5px;
          padding: 0.5rem;
          transition: all 500ms ease;
          border: 1px #ced4da solid;
          min-height: 3rem;
          @media screen and (max-width: 767px) {
            min-height: 5rem;
            margin: 1rem 0;
          }
          display: flex;
          align-items: center;
          align-content: center;
          flex-direction: row;
          flex-wrap: wrap;
          justify-content: center;

          label {
            display: none;
            color: #c8c9ca;
            font-size: 1.2rem;
            height: 1.5rem;
            @media screen and (max-width: 767px) {
              font-size: 1.6rem;
              height: 2rem;
            }
            transition: all 500ms ease;
            padding-right: 0.5rem;
          }

          input {
            border: 0;
            outline: 0;
            font-size: 1.2rem;
            transition: all 500ms ease;
            padding-right: 0.5rem;
            text-align: right;
            direction: ltr;
            @media screen and (max-width: 767px) {
              font-size: 1.6rem;
            }
          }
          input:focus {
            background-color: transparent;
          }
          input::placeholder {
            color: #888888;
          }
          svg {
            color: #888888;
            cursor: pointer;
            @media screen and (max-width: 767px) {
              font-size: 1.6rem;
            }
          }
        }
        .InputError {
          @media screen and (max-width: 767px) {
            font-size: 1rem;
          }
          font-size: 0.7rem;
          color: white;
          font-weight: 400;
          transition: all 500ms ease;
          background-color: rgb(220 29 29 / 51%);
          padding: 0.5rem;
        }
        .FormField[type="email"] {
          border-radius: 5px 5px 0 0;
        }
        .FormField[type="password"] {
          border-radius: 0 0 5px 5px;
        }
        .Selected {
          border: 2px rgb(6, 91, 155) solid;
        }
      }
      .FormFooter {
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
        align-content: center;
        justify-content: center;
        align-items: center;
        margin-top: 1rem;
        .InputError {
          @media screen and (max-width: 767px) {
            font-size: 1rem;
          }
          font-size: 0.7rem;
          color: white;
          font-weight: 400;
          transition: all 500ms ease;
          background-color: rgb(220 29 29 / 71%);
          padding: 0.5rem;
        }
        button {
          margin-top: 1rem;
          font-size: 1.5rem;
          @media screen and (max-width: 767px) {
            font-size: 1.5rem;
            padding: 0.7rem 0;
            font-weight: 600;
            margin-top: 0rem;
          }
        }
        p {
          margin-top: 1rem !important;
          font-size: 0.8rem;
          color: black;
          @media screen and (max-width: 767px) {
            color: black;
          }
          a {
            text-decoration: underline;
          }
        }
      }
    }
  }
  #AppointementSelection {
    background-color: white;
    padding: 1rem 3%;
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    align-content: center;
    justify-content: center;
    align-items: center;
    border: solid 1px #c8c9ca;
    margin-top: 5.1rem;
    border-top: 0;
    .AppointHead {
      display: flex;
      flex-direction: row-reverse;
      flex-wrap: wrap;
      align-content: center;
      justify-content: center;
      align-items: center;
      .AppointHeader {
        text-align: center;
        font-size: 1.2rem;
        color: black;
        font-family: "greycliff-arabic-cf";
        padding-bottom: 1rem !important;
        border-bottom: 1px solid #c8c9ca;
      }
      .AppointType {
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
        align-content: center;
        justify-content: center;
        align-items: center;
        direction: rtl;
        padding-top: 1rem;
        label {
          font-size: 1rem;
        }
        select {
          background-color: white;
          font-size: 1rem;
          color: black;
          border: 0;
          outline: none;
          margin-right: 0.5rem;
          cursor: pointer;
        }
      }
    }

    .AvailableAppoints {
      display: flex;
      flex-direction: row;
      flex-wrap: wrap;
      align-content: center;
      justify-content: center;
      align-items: center;
      border-right: solid 1px #c8c9ca;
      @media screen and (max-width: 767px) {
        border-right: 0;
        border-top: 1px #c8c9ca solid;
        order: 4 !important;
      }
      padding: 1rem;
      label {
        font-size: 0.8rem;
        text-align: center;
      }
    }
    .DaySelection {
      display: flex;
      flex-direction: column;
      flex-wrap: wrap;
      align-content: center;
      align-items: center;
      justify-content: flex-start;
      padding: 1rem;
      padding-top: 0;
      label {
        font-size: 0.9rem;
        text-align: center;
        margin-bottom: 1rem !important;
      }
      @media screen and (max-width: 767px) {
        order: 3 !important;
      }
    }
    input[type="date"] {
      font-size: 0.9rem;
      text-align: center;
      padding: 0.5rem;
      background: white;
      color: black;
      cursor: pointer;
      border: solid 1px #c8c9ca;
    }
    .SelectedDate {
      display: flex;
      padding: 1rem;
      margin-bottom: 1rem !important;
      flex-direction: row;
      flex-wrap: wrap;
      align-content: center;
      justify-content: center;
      align-items: flex-start;
      transition: all 500ms ease;
      text-align: center;
      color: white;
      background: #317f81;
      border-radius: 1rem;
    }
    .Appoint {
      font-size: 0.8rem;
      margin: 1rem 0.5rem !important;
    }
    #SelectedDate {
      color: white;
      text-align: center;
    }
    table {
      color: white;
      margin: 0;
      thead {
        th {
          font-weight: 600;
        }
      }
      tbody {
        th {
          font-weight: 600;
        }
      }
    }
    .InputError {
      @media screen and (max-width: 767px) {
        font-size: 1rem;
      }
      font-size: 0.7rem;
      color: white;
      font-weight: 400;
      padding-right: 0.5rem;
      transition: all 500ms ease;
      background-color: rgb(220 29 29 / 71%);
      padding: 0.5rem;
      border-radius: 5px;
      margin: 1rem 0 !important;
      text-align: center;
    }
  }
}
</style>
