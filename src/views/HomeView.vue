<template>
  <div class="col-12" id="HomeView">
    <div class="col-12" id="LandingArea">
      <MainNav />
      <div class="col-12" id="Filter">
        <h1 class="animate__animated animate__zoomIn" style="--animate-duration: 2s">
          أمنح علاقتك<br />فرصة جديدة
        </h1>
        <p class="animate__animated animate__zoomIn" style="--animate-duration: 2s">
          وتحدث بحرية عن مخاوفك
        </p>
        <button
          class="btn btn-primary animate__animated animate__zoomIn"
          style="--animate-duration: 2s"
          @click="this.$router.push({ name: 'consulting' })"
        >
          احجز استشارة
        </button>
      </div>
    </div>
    <AboutSection />
    <ReviewsSection />
    <FooterSection />
  </div>
</template>

<script>
// @ is an alias to /src
import MainNav from "@/components/MainNav.vue";
import AboutSection from "@/components/AboutSection.vue";
import ReviewsSection from "@/components/ReviewsSection.vue";
import FooterSection from "@/components/FooterSection.vue";

export default {
  name: "HomeView",
  components: { MainNav, AboutSection, ReviewsSection, FooterSection },
  created() {
    let main = this;
    main.$store.commit("OpenLoader");
    setTimeout(function () {
      main.$store.commit("CloseLoader");
    }, 2500);
  },
};
</script>
<style lang="scss" scoped>
#HomeView {
  min-height: 100vh;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  align-content: flex-start;
  #LandingArea {
    min-height: calc(100vh);
    background-image: url("@/assets/photos/bg_1.webp");
    background-color: rgb(2, 21, 54);
    background-size: 100%;
    background-size: cover;
    background-repeat: no-repeat;
    background-attachment: fixed;
    @media screen and (max-width: 767px) {
      background-attachment: inherit;
      background-position-x: 50%;
      background-position-y: 0;
    }
    #Filter {
      margin-top: 4rem;
      background-color: rgba(0, 0, 0, 0.1);
      height: calc(100vh - 4rem);
      display: flex;
      flex-direction: column;
      flex-wrap: nowrap;
      align-content: center;
      justify-content: center;
      align-items: center;
      h1 {
        font-size: 4rem;
        text-align: center;
        color: white;
        margin-top: -2rem !important;
        font-family: "Lemonada", cursive;
        font-weight: 900;
        line-height: 1.7;
      }
      p {
        color: white;
        font-weight: 700;
        font-size: 2.5rem;
      }
      button {
        font-size: 2rem;
        margin-top: 1rem;
        @media screen and (max-width: 767px) {
          font-size: 3rem;
          padding: 0 2rem;
        }
      }
    }
  }
}
</style>
