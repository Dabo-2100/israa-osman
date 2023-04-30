<template>
  <div class="col-12" id="MessagePage">
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
        <font-awesome-icon @click="this.NewMsg()" icon="fa-solid fa-paper-plane" />
      </div>
    </div>
  </div>
</template>

<script>
import $ from "jquery";
window.$ = window.jQuery = require("jquery");
import axios from "axios";
import {
  collection,
  setDoc,
  onSnapshot,
  doc,
  addDoc,
  serverTimestamp,
  increment,
  orderBy,
  query,
} from "firebase/firestore";
import { db } from "@/firebase";
export default {
  name: "MessagePage",
  components: {},
  data() {
    return {
      CurrentWidth: window.innerWidth,
      Question: "",
      MessageIndex: 0,
      sender_id: 1,
      user_id: this.$store.state["UserInfo"]["user_id"],
      chat_id: "",
      TheNewMsg: "",
      ChatMessages: [],
    };
  },
  methods: {
    NewMsg() {
      let main = this;
      if (main["TheNewMsg"].trim() != "") {
        setDoc(doc(db, "App_Chats/Chat_" + main.chat_id), {
          creator: "App",
          unread: increment(1),
        });
        addDoc(collection(db, "App_Chats/Chat_" + main.chat_id + "/Messages"), {
          From_id: main["user_id"],
          To_id: main["sender_id"],
          Sent: true,
          Seen: false,
          Content: main["TheNewMsg"],
          Time: serverTimestamp(),
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
    main.$store.commit("OpenLoader");
    axios
      .post(this.$store.state["Api_Url"], {
        api_name: "getchatid",
        user_1: this.sender_id,
        user_2: this.user_id,
      })
      .then(async function (res) {
        main.chat_id = res.data["chat_id"];
        await setDoc(doc(db, "App_Chats/Chat_" + res.data["chat_id"]), {
          creator: "App",
        });
        onSnapshot(
          collection(db, "App_Chats/Chat_" + res.data["chat_id"] + "/Messages"),
          (querySnapshot) => {
            let fbMessages = [];
            querySnapshot.forEach((doc) => {
              const Message = {
                MessageId: doc.id,
                From_id: doc.data().From_id,
                To_id: doc.data().To_id,
                Sent: doc.data().Sent,
                Seen: doc.data().Seen,
                Content: doc.data().Content,
                Time: new Date(
                  (doc.data().Time["seconds"] +
                    doc.data().Time["nanoseconds"] * 0.00000001) *
                    1000
                ),
              };
              fbMessages.push(Message);
            });
            fbMessages.sort((a, b) => {
              return new Date(a.Time) - new Date(b.Time);
            });
            main.ChatMessages = fbMessages;

            setTimeout(function () {
              $("#MessagesBox").animate(
                { scrollTop: $("#MessagesBox")[0].scrollHeight },
                500
              );
              main.$store.commit("CloseLoader");
            }, 500);
          }
        );
      });
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
  async mounted() {
    let main = this;
    this.$store.commit("OpenLoader");
    this.$store.commit("CloseLoader");
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
  height: 100%;
  #MessagesBox {
    height: 80%;
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
    height: 20%;
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
