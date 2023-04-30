<template>
  <section class="col-12">
    <h1 class="col-12 wow animate__animated animate__fadeIn" data-wow-duration="2s">
      آراء المستفدين من الاستشارات
    </h1>
    <Carousel
      class="col-10 col-sm-6 wow animate__animated animate__fadeIn"
      data-wow-duration="2s"
      :transition="1000"
      :autoplay="2500"
      :wrap-around="true"
      :pauseAutoplayOnHover="true"
    >
      <Slide v-for="(slide, index) in 9" :key="slide">
        <div class="carousel__item col-12">
          <img
            loading="lazy"
            :src="require('@/assets/photos/reviews/' + (index + 1) + '.webp')"
            alt="Consulting Review"
          />
        </div>
      </Slide>
      <template #addons>
        <Navigation />
        <Pagination />
      </template>
    </Carousel>
  </section>
</template>

<script>
import { defineComponent } from "vue";
import { Carousel, Navigation, Pagination, Slide } from "vue3-carousel";
import WOW from "wowjs";
// import "vue3-carousel/dist/carousel.css";

export default defineComponent({
  name: "Basic",
  components: {
    Carousel,
    Slide,
    Pagination,
    Navigation,
  },
  mounted() {
    new WOW.WOW({
      live: false,
    }).init();
  },
});
</script>

<style scoped lang="scss">
section {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  align-content: center;
  justify-content: center;
  align-items: center;
  padding: 1rem 0;
  h1 {
    font-size: 2rem;
    text-align: center;
    font-family: "Lemonada";
    margin-top: 1rem !important;
    @media screen and (max-width: 767px) {
      font-size: 1.5rem;
      width: 100%;
      text-align: center;
    }
  }
}
.carousel__item {
  width: 100%;
  background-color: #f4f4f4;
  color: white;
  font-size: 2rem;
  padding: 2rem;
  border-radius: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
  img {
    width: 80%;
    @media screen and (max-width: 767px) {
      scale: 1.3;
    }
  }
}
.carousel__slide {
  padding: 5px;
}

.carousel__prev,
.carousel__next {
  box-sizing: content-box;
  border: 1px solid white;
  border-radius: 50%;
  color: white;
}
</style>
