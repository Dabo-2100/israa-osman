<template>
  <footer class="col-12">
    <div>
      <p class="col-12">Dr/Israa Osman <br />Social relationship consultant</p>
    </div>
    <div class="Icons">
      <h1>Follow Us</h1>
      <a href="https://www.facebook.com/ConsultantIsraaOsman/" name="facebook">
        <font-awesome-icon icon="fa-brands fa-facebook" />
      </a>
      <a href="https://www.instagram.com/dr_israa_osman/" name="instagram">
        <font-awesome-icon icon="fa-brands fa-instagram" />
      </a>
      <a href="https://www.youtube.com/@israaosman8254" name="youtube">
        <font-awesome-icon icon="fa-brands fa-youtube" />
      </a>
      <a href="mailto:info@israaosman.com" target="_blank" name="mail">
        <font-awesome-icon icon="fa-solid fa-envelope" />
      </a>
    </div>
    <div class="col-12 CopyRights">
      © 2022 Israa Osman . All right reserved . Developed by
      <a href="https://easetasks.com"
        ><img loading="lazy" alt="israaosman" src="@/assets/photos/easeLogo.webp"
      /></a>
    </div>
  </footer>
</template>

<script>
import WOW from "wowjs";
export default {
  name: "FooterSection",
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
footer {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  align-content: center;
  justify-content: space-between;
  align-items: center;
  direction: ltr;
  background-color: #212221;
  color: white;
  padding: 1rem 3rem;
  font-size: 1.7rem;
  .Icons {
    h1 {
      text-align: center;
      font-size: 1.5rem;
    }
    svg {
      color: white;
      margin: 0 1rem;
    }
  }
  .CopyRights {
    display: flex;
    text-align: center;
    font-size: 1.2rem;
    flex-direction: row;
    flex-wrap: wrap;
    align-content: center;
    justify-content: center;
    align-items: center;
    img {
      height: 2rem;
      width: 2rem;
      border-radius: 5px;
      margin: 0 0.5rem;
    }
  }
}
</style>
