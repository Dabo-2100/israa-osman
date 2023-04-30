<template>
  <MainNav />
  <section id="ArticleView" class="col-12">
    <img
      loading="lazy"
      alt="israaosman"
      v-if="this.img_id != false"
      class="col-10"
      :src="require('@/assets/photos/articles/' + this.img_id + '.webp')"
    />
    <h1
      class="col-12 wow animate__animated animate__zoomIn"
      data-wow-duration="2s"
      data-wow-delay="0"
    >
      {{ this.TheArticle["Header"] }}
    </h1>
    <div
      class="col-12 wow animate__animated animate__zoomIn"
      data-wow-duration="2s"
      data-wow-delay="0"
      v-for="Part in this.TheArticle['Body']"
      :key="Part"
    >
      {{ Part }}
    </div>
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
  getDoc,
  increment,
  orderBy,
  query,
} from "firebase/firestore";
import { db } from "@/firebase";
export default {
  name: "ArticleView",
  components: { MainNav },
  data() {
    return {
      TheArticle: { Header: "", Body: [] },
      article_id: this.$route.params.article_id,
      img_id: false,
    };
  },
  methods: {},
  watch: {},
  async mounted() {
    let main = this;
    new WOW.WOW({
      live: false,
    }).init();
    let article_id = this.$route.params.article_id;
    const docRef = doc(db, "Articles/" + article_id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const Article = {
        Header: docSnap.data().Header,
        Body: docSnap.data().Body,
      };
      main.img_id = docSnap.data().id;
      main.TheArticle = Article;
    } else {
      main.$router.push({ name: "view404" });
    }

    // axios
    //   .get("articles/AllArticles.json")
    //   .then(function (res) {
    //     let myArray = res.data["Articles"];
    //     let TheArticle = myArray.find((article) => article.id === article_id);
    //     if (TheArticle == undefined) {
    //       alert("Wrong ID");
    //     } else {
    //       axios
    //         .get("articles/" + article_id + ".json")
    //         .then(function (res) {
    //           main.TheArticle = res.data;
    //         })
    //         .catch((err) => console.log(err));
    //     }
    //   })
    //   .catch((err) => console.log(err));
  },
};
</script>
<style lang="scss" scoped>
#ArticleView {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  padding: 5rem 5%;
  min-height: 100vh;
  background-color: #f6f6f6;
  img {
    max-width: 40vh;
    max-height: 40vh;
  }
  h1 {
    margin-top: 1rem !important;
    font-size: 1.4rem;
    font-family: "Lemonada";
    text-align: right;
  }
  div {
    font-size: 1.5rem;
    text-align: justify;
    margin: 2rem 0;
  }
}
</style>
