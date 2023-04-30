<template>
  <MainNav />
  <section id="ArticlesView" class="col-12" v-if="!this.$route.params.article_id">
    <!-- <nav class="col-12">
      <div>
        <label>نوع المقالات</label>
        <select>
          <option>تنمية ذاتية</option>
          <option>علاقات</option>
          <option>عرض الكل</option>
        </select>
      </div>
      <div>
        <label>عرض المقالات</label>
        <select>
          <option>الاقدم</option>
          <option>الاحدث</option>
        </select>
      </div>
    </nav> -->
    <article
      :id="article['id']"
      class="col-11 wow animate__animated animate__zoomIn"
      @click="OpenArticle(article['fbId'])"
      v-for="article in this.AllArticles['Articles']"
      :key="article"
      data-wow-duration="2s"
      data-wow-delay="0"
    >
      <header class="col-12 col-sm-3">
        <img
          loading="lazy"
          class="col-12"
          :src="require('@/assets/photos/articles/' + article['id'] + '.webp')"
          alt="Article Img"
        />
      </header>
      <section class="col-12 col-sm-9">
        <h1 class="col-12">
          {{ article["Header"] }}
          <span> [ بتاريخ : {{ article["Date"] }}]</span>
        </h1>
        <p class="col-12">{{ article["Summary"] }}</p>
      </section>
    </article>
  </section>
</template>

<script>
import MainNav from "@/components/MainNav.vue";
import axios from "axios";
import WOW from "wowjs";
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
  name: "ArticlesView",
  components: { MainNav },
  data() {
    return {
      AllArticles: { Articles: "" },
    };
  },
  methods: {
    OpenArticle(id) {
      this.$router.push({ name: "article", params: { article_id: id } });
    },
  },
  watch: {},
  mounted() {
    let main = this;
    new WOW.WOW({
      live: false,
    }).init();
    onSnapshot(collection(db, "Articles"), (querySnapshot) => {
      let fbPosts = [];
      querySnapshot.forEach((doc) => {
        const Post = {
          fbId: doc.id,
          id: doc.data().id,
          Date: doc.data().Date,
          Type: doc.data().Type,
          Header: doc.data().Header,
          Summary: doc.data().Summary,
        };
        fbPosts.push(Post);
      });
      main.AllArticles["Articles"] = fbPosts;
    });
  },
};
</script>

<style scoped lang="scss">
#ArticlesView {
  nav {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    align-content: center;
    align-items: center;
    justify-content: space-between;
    padding: 1rem 2rem;
    background-color: #02161f;
    color: white;
    font-size: 1.4rem;
    select {
      margin: 0 0.5rem;
    }
  }
  display: flex;
  min-height: 100vh;
  background-color: #f3f4f2;
  padding-top: 4rem;
  flex-direction: column;
  flex-wrap: nowrap;
  align-content: center;
  align-items: center;
  article {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    align-content: center;
    justify-content: center;
    align-items: center;
    padding: 1rem;
    transition: all 500ms ease;
    border-bottom: 1px solid gray;
    cursor: pointer;
    header {
      display: flex;
      flex-direction: column;
      flex-wrap: nowrap;
      align-content: center;
      justify-content: center;
      align-items: center;
      img {
        max-height: 200px;
        max-width: 250px;
        box-shadow: 3px 3px 3px gray;
        border-radius: 5px;
        cursor: pointer;
      }
    }
    section {
      padding: 1rem;
      h1 {
        font-size: 1.2rem;
        font-family: "Lemonada";
        cursor: pointer;
      }

      p {
        font-size: 1.5rem;
        cursor: pointer;
      }
    }
  }
  article:hover {
    text-decoration: underline;
    margin-left: -1.5rem;
  }
}
</style>
