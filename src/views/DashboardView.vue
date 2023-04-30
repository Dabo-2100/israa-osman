<template>
  <div class="col-12" id="Dashboard">
    <aside id="Aside" class="col-3 col-md-2" v-if="this.CurrentWidth > 767">
      <img
        loading="lazy"
        alt="israaosman"
        class="AppLogo"
        src="@/assets/photos/AppLogo.webp"
      />
      <ul class="col-12">
        <li
          class="col-12"
          v-for="Action in this.Content['ul']"
          :key="Action"
          @click="
            Action['Page'] == 0
              ? this.reservation()
              : Action['Page'] == 1
              ? this.$router.push({ name: 'articles' })
              : (this.CurrentPage = Action['Page'])
          "
        >
          <font-awesome-icon :icon="Action['Icon']" class="col-1" />
          <p class="col-11">{{ Action["Name"] }}</p>
        </li>
      </ul>
      <div class="col-12 LogOut" @click="Logout()">
        <img
          loading="lazy"
          alt="israaosman"
          :src="require('@/assets/photos/shutdown.webp')"
        />
        <p>تسجيل الخروج</p>
      </div>
    </aside>
    <section id="MainContent" class="col-12 col-md-10 container">
      <component :is="this.CurrentPage"></component>
    </section>
    <div class="col-12" id="FooterMenu" v-if="this.CurrentWidth < 767">
      <ul class="col-12">
        <li
          class=""
          v-for="Action in this.Content['ul']"
          :key="Action"
          @click="
            Action['Page'] == 0
              ? this.reservation()
              : Action['Page'] == 1
              ? this.$router.push({ name: 'articles' })
              : (this.CurrentPage = Action['Page'])
          "
        >
          <font-awesome-icon :icon="Action['Icon']" class="col-12" />
          <p class="col-12">{{ Action["Name"] }}</p>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import $ from "jquery";
window.$ = window.jQuery = require("jquery");
import axios from "axios";
import useValidate from "@vuelidate/core";
import { required, email, minLength, helpers } from "@vuelidate/validators";
import HomePage from "@/components/HomePage.vue";
import SettingsPage from "@/components/SettingsPage.vue";
import MessagePage from "@/components/MessagePage.vue";
export default {
  name: "DashboardView",
  components: { HomePage, SettingsPage, MessagePage },
  data() {
    return {
      CurrentPage: "HomePage",
      v$: useValidate(),
      CurrentWidth: window.innerWidth,
      user_id: this.$store.state.UserInfo["user_id"],
      Content: {
        ul: [
          {
            Name: "الصفحة الرئيسية",
            Icon: "fa-solid fa-grip",
            Page: "HomePage",
          },
          { Name: "الرسائل", Icon: "fa-solid fa-message", Page: "MessagePage" },
          {
            Name: "الاستشارات",
            Icon: "fa-solid fa-hand-holding-hand",
            Page: "0",
          },
          {
            Name: "المقالات",
            Icon: "fa-solid fa-hand-holding-hand",
            Page: "1",
          },
          { Name: "الاعدادات", Icon: "fa-solid fa-gear", Page: "SettingsPage" },
        ],
      },
    };
  },
  methods: {
    Logout() {
      this.$store.commit("Logout");
      this.$router.push({ name: "home" });
      localStorage.removeItem("user_uid");
    },
    reservation() {
      this.$router.push({ name: "consulting" });
    },
  },
  validations() {},
  watch: {},
  created() {
    let main = this;
    let user_loginSession = localStorage.getItem("user_login");
    let user_uid = localStorage.getItem("user_uid");
    let user_login = this.$store.state["UserLogin"]["IsLogin"];
    $(window).resize(function () {
      main.CurrentWidth = window.innerWidth;
    });
    if (user_login == 0) {
      axios
        .post(this.$store.state["Api_Url"], {
          api_name: "getuserid",
          user_uid: user_uid,
        })
        .then(function (res) {
          if (res.data == false) {
            main.$router.push({ name: "home" });
          } else if (
            main.$store.state["NewAppoint"]["IsSet"] == 1 &&
            main.$store.state["UserLogin"]["FirstLogin"] == 0
          ) {
            main.$store.state["UserInfo"]["user_id"] = res.data["user_id"];
            main.$store.state["UserLogin"]["IsLogin"] = 1;
            main.$router.push({ name: "payment" });
          } else if (main.$store.state["NewAppoint"]["IsSet"] == 0 && res.data != false) {
            main.$store.state["UserInfo"]["user_id"] = res.data["user_id"];
            main.$store.state["UserLogin"]["IsLogin"] = 1;
          }
        });
    } else if (
      user_login == 1 &&
      this.$store.state["NewAppoint"]["IsSet"] == 1 &&
      main.$store.state["UserLogin"]["FirstLogin"] == 0
    ) {
      this.$router.push({ name: "payment" });
    }
  },
  mounted() {},
};
</script>

<style lang="scss" scoped>
#Dashboard {
  display: flex;
  height: 100vh;
  background-color: #fbfbfb;
  direction: rtl;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: flex-start;
  #Aside {
    display: flex;
    flex-direction: column;
    flex-wrap: nowrap;
    align-content: center;
    justify-content: space-between;
    align-items: center;
    background-color: white;
    .AppLogo {
      height: 4rem;
      width: 4rem;
    }
    ul {
      display: flex;
      flex-direction: column;
      flex-wrap: nowrap;
      align-content: center;
      align-items: center;
      padding: 1rem;
      margin: 0;
      li {
        display: flex;
        list-style: none;
        color: #508d86;
        font-size: 1.4rem;
        padding: 1rem;
        flex-direction: row;
        flex-wrap: wrap;
        align-content: center;
        justify-content: center;
        align-items: center;
        cursor: pointer;
        transition: all 400ms ease;
        border-radius: 1rem;
        p {
          padding: 0 0.5rem;
        }
      }
      li:hover {
        background-color: #508d86;
        color: white;
      }
    }
    .LogOut {
      display: flex;
      flex-direction: row;
      flex-wrap: nowrap;
      align-content: center;
      justify-content: center;
      align-items: center;
      padding-bottom: 3rem;
      cursor: pointer;
      img {
        height: 2rem;
      }
      p {
        font-size: 1rem;
        margin: 0 0.5rem !important;
      }
    }
  }
  #MainContent {
    height: calc(100vh);
    @media screen and (max-width: 767px) {
      height: calc(100vh - 5.1rem);
    }
    background-color: #fbfbfb;
    display: flex;
    flex-direction: column;
    flex-wrap: nowrap;
    align-content: center;
    justify-content: flex-start;
    align-items: center;
    padding: 0;
    .Post {
      background-color: white;
      border-radius: 1rem;
      border: 1px solid #c8c9ca;
      margin: 1rem 0;
      .PostHeader {
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
        align-content: center;
        align-items: center;
        padding: 0.5rem;
        img {
          height: 3rem;
          width: 3rem;
          border-radius: 50%;
        }
        p {
          font-size: 1rem;
          padding-right: 1rem;
        }
        span {
          font-size: 0.7rem;
          padding-right: 1rem;
        }
      }
      .PostCaption {
        border-bottom: 1px solid #c8c9ca;
        pre {
          margin: 0;
          padding: 0rem;
          margin-right: -4rem !important;
        }
      }
      .PostLikes {
        display: flex;
        flex-direction: column;
        flex-wrap: nowrap;
        align-content: center;
        justify-content: center;
        align-items: center;
        .PostAllLikes {
          text-align: left;
          direction: ltr;
          border-bottom: 1px solid #c8c9ca;
          padding: 1rem;
        }
        .UserActions {
          display: flex;
          flex-direction: row;
          flex-wrap: wrap;
          align-content: center;
          align-items: center;
          justify-content: center;
          svg {
            cursor: pointer;
            transition: all 300ms ease;
            padding: 1rem 0;
          }
          svg:hover {
            background-color: #d6d6d6;
            color: red;
          }
          svg[name="Like"] {
            border-radius: 0 0 1rem 0;
          }
          svg[name="Save"] {
            border-radius: 0 0 0 1rem;
            outline: 1px solid #c8c9ca;
          }
        }
      }
    }
  }
  #FooterMenu {
    height: 5rem;
    position: fixed;
    bottom: 0;
    background-color: #212221;
    ul {
      display: flex;
      padding: 0;
      margin: 0;
      height: 5rem;
      li {
        height: 100%;
        width: calc(100% / 5);
        background-color: #317f81;
        list-style: none;
        display: flex;
        flex-direction: column;
        flex-wrap: nowrap;
        align-content: center;
        justify-content: center;
        align-items: center;
        font-size: 1rem;
        color: white;
        cursor: pointer;
        p {
          text-align: center;
          padding-top: 0.5rem;
        }
      }
      li:hover {
        background-color: #2122218b;
      }
    }
  }
}
</style>
