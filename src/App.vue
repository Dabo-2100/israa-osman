<template>
  <MainLoader />
  <router-view />
</template>
<script>
// @ is an alias to /src
import MainLoader from "@/components/MainLoader.vue";
import $ from "jquery";
window.$ = window.jQuery = require("jquery");
import axios from "axios";
export default {
  name: "AppView",
  components: { MainLoader },
  data() {
    return {
      Content: {},
    };
  },
  created() {
    let main = this;
    $(window).resize(function () {
      let payload = {
        WindowWidth: window.innerWidth,
      };
      main.$store.dispatch("ResizePage", payload);
    });
  },
};
</script>
<style lang="scss">
@import url("https://fonts.googleapis.com/css2?family=Lemonada:wght@400;500;700&display=swap");
@import url("https://use.typekit.net/bsy5agc.css");
:root {
  --DarkBlue: #031926;
  --LightBlue: #9dbebb;
  --DarkTeal: #468189;
  --LightTeal: #77aca2;
  --Beig: #f4e9cd;
  --Gray: rgba(255, 255, 255, 0.24);
}
* {
  padding: 0;
  margin: 0;
  box-sizing: border-box;
  font-family: myriad-arabic, sans-serif;
  //font-family: ropa-sans-arabic, sans-serif;
  //font-family: co-arabic, sans-serif;
}
html {
  scroll-behavior: smooth;
}
p,
h1,
h2,
h3,
span,
ul {
  margin: 0 !important;
}
body {
  width: 100%;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  align-content: flex-start;
  justify-content: flex-start;
  align-items: flex-start;
  #app {
    width: 100%;
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    align-content: flex-start;
    justify-content: flex-start;
    align-items: flex-start;
  }
}
@media screen and (min-width: 100px) {
  /* font at xs */
  html {
    font-size: 10px !important;
  }
}

@media screen and (min-width: 767px) {
  /* font at sm */
  html {
    font-size: 12px !important;
  }
}

@media screen and (min-width: 991px) {
  /* font at md */
  html {
    font-size: 14px !important;
  }
}

@media screen and (min-width: 1200px) {
  /* font at lg */
  html {
    font-size: 16px !important;
  }
}

@media screen and (min-width: 1400px) {
  /* font at xl */
  html {
    font-size: 18px !important;
  }
}
</style>
