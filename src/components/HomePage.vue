<template>
  <div class="col-12" id="HomePage">
    <div class="col-11 col-sm-6 Post" v-for="Post in this.Posts['Posts']" :key="Post">
      <div class="col-12 PostHeader">
        <img loading="lazy" alt="israaosman" src="@/assets/photos/dr.webp" />
        <div>
          <p>د / إسراء عثمان</p>
          <span>{{ this.MakeDateArab(Post["PostDate"]) }}</span>
        </div>
      </div>
      <div class="col-12 PostCaption" v-html="Post['PostCaption']"></div>
      <img
        v-if="Post['PostType'] == 'Photo'"
        loading="lazy"
        alt="israaosman"
        class="col-12"
        :src="require('@/assets/photos/posts/' + Post['PostId'] + '.webp')"
      />
    </div>
  </div>
</template>
<script>
import $ from "jquery";
window.$ = window.jQuery = require("jquery");
import axios from "axios";
import useValidate from "@vuelidate/core";
import {
  collection,
  setDoc,
  onSnapshot,
  doc,
  addDoc,
  serverTimestamp,
  increment,
  getDocs,
  orderBy,
  query,
} from "firebase/firestore";
import { db } from "@/firebase";
export default {
  name: "HomePage",
  components: {},
  data() {
    return {
      v$: useValidate(),
      CurrentWidth: window.innerWidth,
      Posts: { Posts: "" },
    };
  },
  methods: {
    MakeDateArab(newValue) {
      let date = new Date(newValue);
      let months = [
        "يناير",
        "فبراير",
        "مارس",
        "إبريل",
        "مايو",
        "يونيو",
        "يوليو",
        "أغسطس",
        "سبتمبر",
        "أكتوبر",
        "نوفمبر",
        "ديسمبر",
      ];
      let days = ["اﻷحد", "اﻷثنين", "الثلاثاء", "اﻷربعاء", "الخميس", "الجمعة", "السبت"];
      let delDateString =
        days[date.getDay()] +
        ", " +
        date.getDate() +
        " " +
        months[date.getMonth()] +
        ", " +
        date.getFullYear();
      return delDateString;
    },
  },
  validations() {},
  watch: {},
  created() {
    let main = this;
    $(window).resize(function () {
      main.CurrentWidth = window.innerWidth;
    });
    // axios
    //   .get("posts/AllPosts.json")
    //   .then((res) => (this.Posts = res.data))
    //   .catch((err) => console.log(err));
  },
  async mounted() {
    let main = this;
    const q = query(collection(db, "Posts"), orderBy("Order"));
    const querySnapshot = await getDocs(q);
    let fbPosts = [];
    querySnapshot.forEach((doc) => {
      const Post = {
        PostType: doc.data().PostType,
        PostId: doc.data().PostId,
        PostDate: doc.data().PostDate,
        PostCaption: doc.data().PostCaption,
      };
      fbPosts.push(Post);
    });
    main.Posts["Posts"] = fbPosts;

    // onSnapshot(collection(db, "Posts", orderBy("PostDate")), (querySnapshot) => {
    //   let fbPosts = [];
    //   querySnapshot.forEach((doc) => {
    //     const Post = {
    //       PostType: doc.data().PostType,
    //       PostId: doc.data().PostId,
    //       PostDate: doc.data().PostDate,
    //       PostCaption: doc.data().PostCaption,
    //     };
    //     fbPosts.push(Post);
    //   });
    //   main.Posts["Posts"] = fbPosts;
    // });
  },
};
</script>

<style lang="scss" scoped>
#HomePage {
  height: 100%;
  display: flex;
  flex-direction: column;
  flex-wrap: nowrap;
  align-content: center;
  align-items: center;
  padding: 2rem 0;
  overflow-y: scroll;
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
        font-size: 1.3rem;
        padding-right: 1rem;
      }
      span {
        font-size: 1rem;
        padding-right: 1rem;
      }
    }
    .PostCaption {
      padding: 1rem 2rem;
      font-size: 1.3rem;
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
</style>
