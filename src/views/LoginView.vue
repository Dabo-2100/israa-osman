<template>
  <div class="col-12" id="LoginView">
    <MainNav />
    <div
      class="col-12 col-sm-4 animate__animated animate__fadeInDown"
      id="JoinForm"
      style="--animate-duration: 1.5s"
    >
      <img
        loading="lazy"
        id="AppLogo"
        src="@/assets/photos/enter.webp"
        height="50"
        width="50"
        alt="israaosmanLogo"
      />
      <h1 v-if="this.NewUser == false">تسجيل الدخول</h1>
      <h1 v-else>عضوية جديدة</h1>
      <div class="col-12 InputField">
        <input
          v-model="this.FormData['Email']"
          id="Email"
          class="col-11"
          type="text"
          placeholder="البريد الألكتروني"
          autocomplete="off"
          @keypress.enter="CheckMail($event)"
          @change="
            this.v$.FormData['Email'].$validate();
            CheckMail();
            this.LoginError = 0;
          "
        />
        <font-awesome-icon
          v-if="this.NewUser || this.UserExist"
          class="col-1"
          icon="fa-solid fa-envelope"
        />
        <font-awesome-icon
          v-else
          class="col-1"
          icon="fa-solid fa-circle-left"
          @click="CheckMail($event)"
        />
      </div>
      <Transition name="fade" mode="out-in">
        <span class="InputError col-12" v-if="v$.FormData.Email.$error">
          {{ v$.FormData.Email.$errors[0].$message }}
        </span>
      </Transition>
      <Transition name="fade" mode="out-in">
        <div class="col-12 InputField" v-if="this.NewUser == true">
          <input
            v-model="this.FormData['UserName']"
            id="UserName"
            class="col-11"
            type="text"
            placeholder="اسم المستخدم"
            @change="this.v$.FormData['UserName'].$validate()"
            @keypress.enter="this.Join()"
          />
          <font-awesome-icon class="col-1" icon="fa-solid fa-user" />
        </div>
      </Transition>
      <Transition name="fade" mode="out-in">
        <span
          class="InputError col-12"
          v-if="v$.FormData.UserName.$error && this.NewUser == true"
        >
          {{ v$.FormData.UserName.$errors[0].$message }}
        </span>
      </Transition>
      <Transition name="fade" mode="out-in">
        <button v-if="this.NewUser == true" class="btn btn-success" @click="this.Join()">
          تسجيل الأشتراك
        </button>
      </Transition>
      <Transition name="fade" mode="out-in">
        <div class="col-12 InputField" v-if="this.UserExist == true">
          <input
            class="col-11"
            v-model="this.FormData['Password']"
            :type="this.PasswordSeen == 0 ? 'password' : 'text'"
            placeholder="كلمة السر"
            id="Password"
            @keypress.enter="Login()"
            @change="
              this.v$.FormData['Password'].$validate();
              this.LoginError = 0;
            "
          />
          <font-awesome-icon
            class="col-1"
            v-if="this.PasswordSeen == 0"
            icon="fa-solid fa-eye"
            @click="this.PasswordSeen = 1"
          />
          <font-awesome-icon
            class="col-1"
            v-if="this.PasswordSeen == 1"
            icon="fa-solid fa-eye-slash"
            @click="this.PasswordSeen = 0"
          />
        </div>
      </Transition>
      <Transition name="fade" mode="out-in">
        <span
          class="InputError col-12"
          v-if="v$.FormData.Password.$error && this.UserExist == true"
        >
          {{ v$.FormData.Password.$errors[0].$message }}
        </span>
      </Transition>

      <Transition name="fade" mode="out-in">
        <span
          class="InputError col-12"
          v-if="this.LoginError == 1 && this.UserExist == true"
        >
          خطأ في كلمة السر او البريد الألكتروني
        </span>
      </Transition>
      <Transition name="fade" mode="out-in">
        <button
          v-if="this.UserExist == true"
          class="btn btn-primary"
          @click="this.Login()"
        >
          تسجيل الدخول
        </button>
      </Transition>

      <Transition name="fade" mode="out-in">
        <p class="col-12 PasswordForgot" v-if="this.UserExist == true">
          هل نسيت كلمة السر ؟ <a href="/#/reset">إعادة تعيين كلمة السر</a>
        </p>
      </Transition>
    </div>
  </div>
</template>

<script>
import MainNav from "@/components/MainNav.vue";
import axios from "axios";
import useValidate from "@vuelidate/core";
import { required, email, minLength, maxLength, helpers } from "@vuelidate/validators";
export default {
  name: "AboutView",
  data() {
    return {
      v$: useValidate(),
      NewUser: false,
      UserExist: false,
      LoginError: 0,
      PasswordSeen: 0,
      FormData: {
        Email: "",
        UserName: "",
        Password: "",
      },
    };
  },
  components: { MainNav },
  methods: {
    CheckMail() {
      let main = this;
      this.v$.FormData["Email"].$validate();
      if (!this.v$.FormData["Email"].$error) {
        axios
          .post(this.$store.state["Api_Url"], {
            api_name: "checkemail",
            user_email: main.FormData["Email"],
          })
          .then(function (res) {
            if (res.data == 0) {
              main.NewUser = true;
              main.UserExist = false;
            } else {
              main.UserExist = true;
              main.NewUser = false;
            }
          });
      } else {
        main.UserExist = false;
        main.NewUser = false;
      }
    },
    Join() {
      let main = this;
      main.v$.$validate();
      main.CheckMail();
      setTimeout(function () {
        if (
          !main.v$.FormData["Email"].$error &&
          !main.v$.FormData["UserName"].$error &&
          main.NewUser == true
        ) {
          axios
            .post(main.$store.state["Api_Url"], {
              api_name: "join",
              user_email: main.FormData["Email"],
              user_name: main.FormData["UserName"],
            })
            .then(function (res) {
              let user_id = res.data["user_id"];
              let payload = { key: "user_id", value: user_id };
              main.$store.dispatch("SetUserInfo", payload);
              let payload2 = {
                key: "user_email",
                value: main.FormData["Email"],
              };
              main.$store.dispatch("SetUserInfo", payload2);
              main.$router.push({ name: "verify" });
            });
        }
      }, 300);
    },
    Login() {
      let main = this;
      main.CheckMail();
      this.v$.FormData.Email.$validate();
      this.v$.FormData.Password.$validate();
      if (
        !this.v$.FormData.Email.$error &&
        !this.v$.FormData.Password.$error &&
        this.LoginError == 0
      ) {
        axios
          .post(main.$store.state["Api_Url"], {
            api_name: "login",
            user_email: main.FormData["Email"],
            user_password: main.FormData["Password"],
          })
          .then(function (res) {
            if (res.data == 0) {
              main.LoginError = 1;
            } else if (res.data["user_verfiy"] == 1) {
              let user_id = res.data["user_id"];
              let user_uid = res.data["user_uid"];
              let payload = { key: "user_id", value: user_id };
              localStorage.setItem("user_uid", user_uid);
              localStorage.setItem("user_login", 1);
              main.$store.dispatch("SetUserInfo", payload);
              main.$store.commit("Login");
              main.$router.push({ name: "dashboard" });
            } else {
              let user_id = res.data["user_id"];
              let payload = { key: "user_id", value: user_id };
              main.$store.dispatch("SetUserInfo", payload);
              let payload2 = {
                key: "user_email",
                value: main.FormData["Email"],
              };
              main.$store.dispatch("SetUserInfo", payload2);
              main.$router.push({ name: "verify" });
            }
          });
      }
    },
  },
  mounted() {
    $("#LoginView").on("keydown", "input", function (e) {
      let data_Chrs = [];
      let val = $(this).val();
      data_Chrs = val;
      let x = e.which || e.KeyCode;
      if (x == 32) {
        if (val.length == 0) {
          e.preventDefault();
        }
        if (data_Chrs[val.length - 1] !== undefined) {
          if (data_Chrs[val.length - 1].trim() == "") {
            e.preventDefault();
          }
        }
      }
    });
  },
  validations() {
    return {
      FormData: {
        Email: {
          required: helpers.withMessage("هذا الحقل مطلوب", required),
          email: helpers.withMessage("من فضلك ادخل البريد الألكتروني بشكل صحيح", email),
        },
        UserName: {
          required: helpers.withMessage("هذا الحقل مطلوب", required),
          minLength: helpers.withMessage(
            "يجب ان لا يقل اسم المستخدم عن 4 حروف",
            minLength(4)
          ),
          maxLength: helpers.withMessage(
            "يجب ان لا يزيد اسم المستخدم عن 30 حرف",
            maxLength(30)
          ),
        },
        Password: {
          required: helpers.withMessage("هذا الحقل مطلوب", required),
        },
      },
    };
  },
};
</script>
<style lang="scss" scoped>
#LoginView {
  background-image: url("@/assets/photos/login_bg.webp");
  min-height: 100vh;
  background-size: cover;
  display: flex;
  flex-direction: column;
  flex-wrap: nowrap;
  align-content: center;
  align-items: center;
  #JoinForm {
    margin-top: 9rem;
    background-color: white;
    border: 1px solid gray;
    border-radius: 2rem;
    padding: 2rem;
    box-shadow: 15px 15px 15px grey;
    display: flex;
    flex-direction: column;
    flex-wrap: nowrap;
    align-content: center;
    align-items: center;
    #AppLogo {
      width: 3rem;
      height: 3rem;
      margin-bottom: 1rem;
    }
    h1 {
      font-size: 1.2rem;
      font-family: "Lemonada";
      margin-bottom: 1rem !important;
    }
    .InputField {
      border: 1px gray solid;
      padding: 0.5rem 1rem;
      border-radius: 1rem;
      display: flex;
      flex-direction: row;
      flex-wrap: wrap;
      justify-content: center;
      align-items: center;
      align-content: center;
      margin-bottom: 1rem;
      input {
        background-color: white;
        color: black;
        font-size: 1.5rem;
        padding: 0 1rem;
        border: 0;
        outline: 0;
      }
      svg {
        font-size: 1.3rem;
      }
    }
    .InputError {
      margin-top: -1rem !important;
      font-size: 1rem;
      color: red;
      padding: 0.5rem 1rem;
    }
    button {
      font-size: 1.5rem;
    }
    .PasswordForgot {
      margin-top: 1rem !important;
    }
  }
}
.fade-enter-active,
.fade-leave-active {
  transition: opacity 400ms ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
