<template>
  <div class="col-12" id="MessagePage">
    <div class="col-12 col-sm-7" id="MessageDr">
      <div class="col-10 AskBox">
        <div class="col-12 ImgContainer">
          <img
            loading="lazy"
            alt="israaosman"
            class="UserImg"
            :src="require('@/assets/photos/dr.webp')"
          />
        </div>
        <h1 class="col-12">اسئل د/إسراء عثمان</h1>
        <div class="col-12 InputField" v-if="this.MessageIndex == 0">
          <input
            class="col-11"
            placeholder="اكتب سؤالك هنا "
            v-model="this.Question"
            @keydown.enter="SendQuestion()"
          />
          <font-awesome-icon
            class="col-1"
            icon="fa-solid fa-circle-left"
            @click="SendQuestion()"
          />
          <span class="InputError col-12" v-if="v$.Question.$error">
            {{ v$.Question.$errors[0].$message }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import $ from "jquery";
window.$ = window.jQuery = require("jquery");
import axios from "axios";
import useValidate from "@vuelidate/core";
import {
  required,
  email,
  minValue,
  maxValue,
  maxLength,
  minLength,
  helpers,
} from "@vuelidate/validators";
export default {
  name: "MessagePage",
  inject: ["ApiUrl"],
  components: {},
  data() {
    return {
      v$: useValidate(),
      CurrentWidth: window.innerWidth,
      Question: "",
      MessageIndex: 0,
    };
  },
  methods: {
    SendQuestion() {
      let main = this;
      this.v$.$validate();
      if (!this.v$.$error) {
        axios
          .post(this.ApiUrl, {
            api_name: "sendAsk",
            question: this.Question,
            user_uid: localStorage .getItem("user_uid"),
          })
          .then(function (res) {
            let payload = {
              type: "success",
              message:
                "تم إرسال سؤالك الي الدكتورة إسراء عثمان وستقوم بالرد عليه من خلال ستوري علي انستاجرام",
            };
            main.$store.dispatch("MakeAlert", payload);
            main.MessageIndex = 1;
          });
      }
    },
  },
  validations() {
    return {
      Question: {
        required: helpers.withMessage("من فضلك ادخل السؤال الذي تريد ارساله", required),
      },
    };
  },
  watch: {},
  created() {
    let main = this;
    $(window).resize(function () {
      main.CurrentWidth = window.innerWidth;
    });
    $("body").on("keydown", "#MessagePage input", function (e) {
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
      if (e.key) {
        if (
          !e.key.match(
            /[AaBbCcDdEeFfGgHhIiJjKkLlMmNnOoPpQqRrSsTtUuVvWwXxYyZ 0123456789 ؟.,’آلآْ~ٍِلأأـ،/:ًٌَُلإإ‘÷×؛<~ضصثقفغعهخحجدشسيبلاتنمكطئءؤرلاىةوزظألألآآذ]/
          )
        ) {
          e.preventDefault();
        }
        return this;
      }
    });
  },
  mounted() {
    // let main = this;
    // let user_id = this.$store.state.UserInfo["user_id"];
    // axios
    //   .post(this.ApiUrl, {
    //     api_name: "getuserinfo",
    //     user_id: user_id,
    //   })
    //   .then(function (res) {
    //     main.UserInfo = res.data;
    //   });
  },
};
</script>

<style lang="scss" scoped>
#MessagePage {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  align-content: center;
  justify-content: center;
  align-items: center;

  #MessageDr {
    background: linear-gradient(
      45deg,
      #405de6,
      #5851db,
      #833ab4,
      #c13584,
      #e1306c,
      #fd1d1d
    );
    padding: 1rem;
    color: white;
    height: 50vh;
    border-radius: 1rem;
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    align-content: center;
    justify-content: center;
    align-items: center;
    @media screen and (max-width: 767px) {
      border-radius: 0rem;
    }
    .AskBox {
      background-color: white;
      border-radius: 1rem;
      padding: 2rem;
      display: flex;
      flex-direction: row;
      flex-wrap: wrap;
      align-content: center;
      justify-content: center;
      align-items: center;
      .ImgContainer {
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
        align-content: center;
        justify-content: center;
        align-items: center;
        img {
          height: 4rem;
          width: 4rem;
          border-radius: 50%;
          margin-top: -3.5rem;
          border: solid 2px white;
        }
      }
      h1 {
        color: black;
        font-size: 1.2rem;
        font-family: "greycliff-arabic-cf";
        text-align: center;
        margin: 1rem 0 !important;
      }
      .InputField {
        border-radius: 1rem;
        padding: 1rem;
        background-color: #e7e7e7;
        color: black;
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
        align-content: center;
        justify-content: center;
        align-items: center;
        input {
          border: solid 0;
          outline: 0;
          padding: 1rem;
          font-size: 1rem;
          background-color: #e7e7e7;
        }
        svg {
          font-size: 1.5rem;
          cursor: pointer;
        }
      }
    }
  }
  .MessagesBar {
    background-color: #f5f7fb;
    height: 70vh;
    .MessageSummary {
      background-color: White;
      display: flex;
      flex-direction: row;
      flex-wrap: wrap;
      align-content: center;
      justify-content: center;
      align-items: center;
      margin: 1rem 0;
      padding: 1rem 0.5rem;
      img {
        height: 3rem;
        width: 3rem;
        border-radius: 50%;
      }
      h1 {
        font-size: 1.2rem;
        color: #3e3e3e;
      }
      p {
        font-size: 1rem;
        margin: 0.5rem 0 !important;
        color: #898989;
      }
      span {
        font-size: 0.8rem;
      }
    }
    .MessageSummary:hover {
      cursor: pointer;
      background-color: rgb(56 143 146);
    }
  }
  .MessageDetails {
    background-color: #155724;
    height: 70vh;
  }
}
</style>
