<template>
  <section id="About" class="col-12">
    <div
      class="col-12 col-sm-6 wow animate__animated animate__zoomIn"
      data-wow-duration="4s"
      data-wow-delay="0"
      id="DrImg"
    >
      <img
        class="col-12"
        width="200"
        src="@/assets/photos/dr.webp"
        loading="lazy"
        alt="israaosman"
      />
    </div>
    <div class="col-12 col-sm-6" id="DrInfo">
      <h1>تعرف علي د/إسراء عثمان</h1>
      <div class="col-12">
        <p
          class="wow animate__animated animate__fadeIn"
          data-wow-duration="1.5s"
          data-wow-delay="0"
        >
          استشاريه علاقات زوجيه
        </p>
        <p
          class="wow animate__animated animate__fadeIn"
          data-wow-duration="1.5s"
          data-wow-delay="0.3s"
        >
          مدربه معتمده لتثقيف الابوين
        </p>
        <p
          class="wow animate__animated animate__fadeIn"
          data-wow-duration="1.5s"
          data-wow-delay="0.6s"
        >
          مدربه تربيه بشريه
        </p>
        <p
          class="wow animate__animated animate__fadeIn"
          data-wow-duration="1.5s"
          data-wow-delay="0.9s"
        >
          مدربه متخصصه في العلاقات
        </p>
        <p
          class="wow animate__animated animate__fadeIn"
          data-wow-duration="1.5s"
          data-wow-delay="1.2s"
        >
          مدربه انوثه
        </p>
        <p
          class="wow animate__animated animate__fadeIn"
          data-wow-duration="1.5s"
          data-wow-delay="1.5s"
        >
          اول من تكلم عن طاقه الانوثه وكيفيه جذب الشريك .
        </p>

        <p
          class="wow animate__animated animate__fadeIn"
          data-wow-duration="1.5s"
          data-wow-delay="1.8s"
        >
          دبلومه العلوم الصيدليه متخصصه في العقارات المعالجه للآضطرابات النفسيه و العصبيه.
        </p>
        <p
          class="wow animate__animated animate__fadeIn"
          data-wow-duration="1.5s"
          data-wow-delay="2.1s"
        >
          مسيره مهنيه لاثني عشر سنه في القاهره / المانيا/ السعوديه/ الامارات ، فيما يزيد
          عن ٢٠٠٠ حاله
        </p>
        <p
          class="wow animate__animated animate__fadeIn"
          data-wow-duration="1.5s"
          data-wow-delay="2.4s"
        >
          اكتر من مليون و نص متابع علي شبكات التواصل الاجتماعي
        </p>
      </div>
    </div>
  </section>
</template>

<script>
import WOW from "wowjs";
export default {
  name: "AboutSection",
  data() {
    return {};
  },
  mounted() {
    new WOW.WOW({
      live: false,
    }).init();
  },
};
</script>

<style scoped lang="scss">
section {
  display: flex;
  background-color: #f6f6f6;
  font-size: 1.5rem;
  padding: 4rem 2rem;
  flex-direction: row;
  flex-wrap: wrap;
  #DrImg {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: center;
    align-content: center;
    align-items: center;
    padding: 3rem;
    img {
      height: 50vh;
      @media screen and (max-width: 767px) {
        height: auto;
        border-radius: 10px;
      }
      border-radius: 10px 10px 0 10px;
    }
  }
  #DrInfo {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: center;
    align-content: center;
    align-items: center;
    color: #5f5f5f;
    h1 {
      font-size: 2rem;
      @media screen and (max-width: 767px) {
        font-size: 1.5rem;
        width: 100%;
        text-align: center;
      }
      font-family: "Lemonada";
      margin-bottom: 1rem !important;
      color: black;
    }
    p {
      font-size: 1.4rem;
    }
  }
}
</style>
