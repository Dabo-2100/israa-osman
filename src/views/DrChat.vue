<template>
  <div class="col-12 col-sm-9" id="MessagePage">
    <div class="col-12" id="MessagesBox">
      <div class="HeaderMessage">
        <h1>مرحباً قم بإرسال رسائلك وستقوم الدكتورة بالرد عليها مباشرة</h1>
      </div>
      <div
        :Message_id="Message['MessageId']"
        class="Message col-12"
        v-for="Message in this.ChatMessages"
        :key="Message"
        :style="
          Message['From_id'] == this.user_id
            ? 'flex-direction: row;'
            : 'flex-direction: row-reverse;'
        "
      >
        <div :class="Message['From_id'] == this.user_id ? 'Mine' : 'Sender'">
          <p class="content">{{ Message["Content"] }}</p>
          <div class="col-12 MessageInfo">
            <span class="time">{{ formatAMPM(Message["Time"]) }}</span>
            <span class="status">{{
              Message["Seen"] == true
                ? "Seen"
                : Message["Sent"] == true && Message["From_id"] == this.user_id
                ? "Sent"
                : ""
            }}</span>
          </div>
        </div>
      </div>
    </div>
    <div class="col-12" id="MineBox">
      <div class="col-12" id="NewMessage">
        <textarea
          rows="1"
          class="col-11"
          v-model="this.TheNewMsg"
          placeholder="اكتب رسالتك هنا ..."
          @keydown.enter="this.NewMsg()"
        ></textarea>
        <font-awesome-icon colsss="col-1" icon="fa-solid fa-paper-plane" />
      </div>
    </div>
  </div>
  <div class="col-3" id="AllChats">
    <div class="col-12 ChatsSearch">
      <input class="col-10" type="Search" placeholder="البحث في الرسائل" />
    </div>

    <div
      class="col-12 TheChat"
      v-for="Chat in this.AllChats"
      :key="Chat"
      @click="this.OpenChat(Chat['chat_id'])"
    >
      <div class="ImgContainer col-3">
        <img loading="lazy" alt="israaosman" src="@/assets/photos/User_Profile.webp" />
      </div>
      <div class="col-9 InfoContainer">
        <h1>{{ Chat["chat_id"] }}</h1>
        <span>Time</span>
        <font-awesome-icon icon="fa-solid fa-circle" v-if="Chat['unread'] > 0" />
      </div>
    </div>
  </div>
</template>

<script>
import $ from "jquery";
window.$ = window.jQuery = require("jquery");
import axios from "axios";
import { db } from "@/firebase";
import { collection, setDoc, onSnapshot, doc, addDoc } from "firebase/firestore";
import useValidate from "@vuelidate/core";
import { required, helpers } from "@vuelidate/validators";
export default {
  name: "MessagePage",
  components: {},
  data() {
    return {
      v$: useValidate(),
      CurrentWidth: window.innerWidth,
      Question: "",
      MessageIndex: 0,
      user_id: 1,
      sender_id: "",
      chat_id: "",
      TheNewMsg: "",
      AllChats: [],
      ChatMessages: [],
    };
  },
  methods: {
    NewMsg() {
      let main = this;
      if (main["TheNewMsg"].trim() != "") {
        let themsg = {
          MessageId: 3,
          From_id: main["user_id"],
          To_id: main["sender_id"],
          Sent: true,
          Seen: false,
          Content: main["TheNewMsg"],
          Time: new Date(),
        };
        addDoc(collection(db, "App_Chats/" + main.chat_id + "/Messages"), {
          From_id: main["user_id"],
          To_id: main["sender_id"],
          Sent: true,
          Seen: false,
          Content: main["TheNewMsg"],
          Time: new Date(),
        });
        this.TheNewMsg = "";
      }
    },
    formatAMPM(date) {
      var hours = date.getHours();
      var minutes = date.getMinutes();
      var ampm = hours >= 12 ? "pm" : "am";
      hours = hours % 12;
      hours = hours ? hours : 12; // the hour '0' should be '12'
      minutes = minutes < 10 ? "0" + minutes : minutes;
      var strTime = hours + ":" + minutes + " " + ampm;
      return strTime;
    },
    OpenChat(id) {
      let main = this;
      main.chat_id = id;
      onSnapshot(collection(db, "App_Chats/" + id + "/Messages"), (querySnapshot) => {
        let fbMessages = [];
        setDoc(doc(db, "App_Chats/" + main.chat_id), {
          creator: "App",
          unread: 0,
        });
        querySnapshot.forEach((doc) => {
          const Message = {
            MessageId: doc.id,
            From_id: doc.data().From_id,
            To_id: doc.data().To_id,
            Sent: doc.data().Sent,
            Seen: doc.data().Seen,
            Content: doc.data().Content,
            Time: new Date(
              (doc.data().Time["seconds"] + doc.data().Time["nanoseconds"] * 0.00000001) *
                1000
            ),
          };
          fbMessages.push(Message);
        });
        fbMessages.sort((a, b) => {
          return new Date(a.Time) - new Date(b.Time);
        });

        main.ChatMessages = fbMessages;
        $("#MessagesBox").animate({ scrollTop: $("#MessagesBox")[0].scrollHeight }, 500);
      });
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
    $("body").on("click", ".TheChat", function () {
      $("body .TheChat").removeClass("Selected");
      $(this).addClass("Selected");
    });
    let main = this;

    $(window).resize(function () {
      main.CurrentWidth = window.innerWidth;
    });
    $("body").on("keydown", "#NewMessage textarea", function (e) {
      let data_Chrs = [];
      let val = $(this).val();
      data_Chrs = val;
      let x = e.which || e.KeyCode;
      if (x == 13 && e.shiftKey) {
        e.preventDefault();
        let lines = $("#NewMessage textarea").attr("rows");
        let fline = parseInt(lines) + 1;
        if (lines < 3) {
          $(this).attr("rows", parseInt(lines) + 1);
        }
      }
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
  mounted() {
    let main = this;
    onSnapshot(collection(db, "App_Chats"), (querySnapshot) => {
      let FinalChats = [];
      querySnapshot.forEach((doc) => {
        let chat = {
          chat_id: doc.id,
          unread: doc.data().unread,
        };
        FinalChats.push(chat);
      });
      main.AllChats = FinalChats;
    });
  },
};
</script>

<style lang="scss" scoped>
#AllChats {
  height: 100vh;
  background-color: #f6f9fb;
  overflow-y: scroll;
  padding: 1rem;
  .ChatsSearch {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    align-content: center;
    justify-content: center;
    align-items: center;
    input {
      padding: 0.5rem 1rem;
      margin: 0.5rem 0;
      border: 0;
      border-radius: 0.5rem;
      font-size: 1.2rem;
    }
  }
  .TheChat {
    background-color: white;
    color: #4a576b;
    margin: 0.5rem 0;
    padding: 0.5rem 1rem;
    border-radius: 0.6rem;
    transition: all ease 500ms;
    cursor: pointer;
    display: flex;
    .ImgContainer {
      display: flex;
      align-content: center;
      justify-content: center;
      flex-direction: row;
      align-items: center;
      img {
        height: 2.5rem;
        width: 2.5rem;
      }
    }
    .InfoContainer {
      display: flex;
      align-content: center;
      justify-content: space-between;
      flex-direction: row;
      align-items: center;
      h1 {
        font-size: 1rem;
        font-family: "Lemonada";
      }
    }
  }
  .TheChat:hover {
    background-color: #2787f5;
    color: white;
  }
  .Selected {
    background-color: #2787f5;
    color: white;
  }
}

#MessagePage {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  align-content: center;
  justify-content: center;
  align-items: center;
  height: 100%;
  #MessagesBox {
    height: 80vh;
    background-color: white;
    padding: 0 1rem;
    overflow-y: scroll;
    .HeaderMessage {
      display: flex;
      flex-direction: row;
      flex-wrap: wrap;
      align-content: center;
      justify-content: center;
      align-items: center;
      h1 {
        font-size: 0.8rem;
        font-family: "Lemonada";
        background: #f5f5f5;
        color: #0aa483;
        padding: 0.5rem;
        text-align: center;
        margin-top: 1rem !important;
        border-radius: 4px;
        border: 1px solid;
      }
    }
    .Message {
      display: flex;
      margin: 1rem 0;
      .Mine {
        display: flex;
        max-width: 50%;
        flex-direction: column;
        p {
          background: #2787f5;
          color: white;
          padding: 0.5rem;

          border-radius: 10px 10px 0 10px;
          font-size: 1.3rem;
        }
        .MessageInfo {
          display: flex;
          flex-direction: row;
          justify-content: space-between;
          padding: 0 4px;
          direction: ltr;
        }
      }
      .Sender {
        display: flex;
        max-width: 50%;
        flex-direction: column;
        p {
          float: left;
          background: #f6f9fb;
          padding: 0.5rem;
          border-radius: 10px 10px 10px 0;
          font-size: 1.3rem;
        }
        .MessageInfo {
          display: flex;
          flex-direction: row;
          justify-content: space-between;
          padding: 0 4px;
          direction: ltr;
        }
      }
      span {
        color: #bfccdf;
        margin: 0 0.25rem !important;
      }
    }
  }
  #MineBox {
    display: flex;
    height: 20vh;
    flex-direction: row;
    flex-wrap: wrap;
    align-content: center;
    align-items: center;
    padding: 0 3rem;
    #NewMessage {
      background-color: rgb(235, 241, 247);
      border-radius: 4rem;
      padding: 1rem 2rem;
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      align-items: center;
      textarea {
        background-color: rgb(235, 241, 247);
        border: 0;
        outline: 0;
        font-size: 1.5rem !important;
        resize: none;
        overflow-wrap: break-word;
      }
      svg {
        background-color: #2787f5;
        color: white;
        padding: 0.6rem;
        border-radius: 50%;
      }
    }
  }
}
</style>
