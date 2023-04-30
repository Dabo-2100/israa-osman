<template>
  <nav :class="this.$route.name == 'home' ? 'col-12' : 'col-12 WhiteNav'">
    <div id="AppInfo">
      <img
        loading="lazy"
        alt="Israa Osman Logo"
        width="70"
        height="70"
        :data-src="require('@/assets/photos/logo.webp')"
        class="lazyload"
        @click="this.$router.push({ name: 'home' })"
      />
      <h1 @click="this.$router.push({ name: 'home' })">استشاري علاقات زوجية</h1>
    </div>
    <div id="NavActions" v-if="this.$store.state['CurrentWidth'] >= 767">
      <ul class="col-12">
        <li
          @click="
            this.$store.commit('CloseSideMenu');
            ScrollToDiv('About');
          "
        >
          من نحن
        </li>
        <li
          @click="
            this.$store.commit('CloseSideMenu');
            this.$router.push({ name: 'articles' });
          "
        >
          المقالات
        </li>
        <li
          v-if="!this.user_login"
          @click="
            this.$store.commit('CloseSideMenu');
            this.$router.push({ name: 'login' });
          "
        >
          تسجيل الدخول
        </li>
        <li
          v-else
          @click="
            this.$store.commit('CloseSideMenu');
            this.$router.push({ name: 'dashboard' });
          "
        >
          الحساب الشخصي
        </li>
      </ul>
    </div>
    <font-awesome-icon
      v-else
      icon="fa-solid fa-bars"
      @click="this.$store.commit('OpenSideMenu')"
    />
  </nav>
  <transition name="slide">
    <aside
      id="SideMenu"
      class="col-12"
      v-if="
        this.$store.state['SideMenuIndex'] == 1 && this.$store.state['CurrentWidth'] < 767
      "
    >
      <ul class="col-12">
        <li @click="this.$store.commit('CloseSideMenu')">
          <font-awesome-icon icon="fa-solid fa-x" />
        </li>

        <li
          v-if="!this.user_login"
          @click="
            this.$store.commit('CloseSideMenu');
            this.$router.push({ name: 'login' });
          "
        >
          تسجيل الدخول
        </li>
        <li
          v-else
          @click="
            this.$store.commit('CloseSideMenu');
            this.$router.push({ name: 'dashboard' });
          "
        >
          الحساب الشخصي
        </li>
        <li
          @click="
            this.$store.commit('CloseSideMenu');
            ScrollToDiv('About');
          "
        >
          من نحن
        </li>
        <li
          @click="
            this.$store.commit('CloseSideMenu');
            this.$router.push({ name: 'articles' });
          "
        >
          المقالات
        </li>
      </ul>
    </aside>
  </transition>
</template>

<script>
export default {
  name: "MainNav",
  components: {},
  data() {
    return {
      user_login: localStorage.getItem("user_uid"),
      Content: {},
    };
  },
  methods: {
    ScrollToDiv(DivId) {
      if (this.$route.name == "home") {
        let payload = { NewSlide: DivId };
        this.$store.dispatch("MoveToSlide", payload);
      } else {
        this.$router.push({ name: "home" });
      }
    },
  },
  mounted() {
    $(function () {
      $(document).scroll(function () {
        var $nav = $("nav");
        $nav.toggleClass("scrolled", $(this).scrollTop() > $nav.height());
      });
    });
  },
};
</script>
<style lang="scss" scoped>
.scrolled {
  background-color: #f4f4f4;
  color: black;
}
.WhiteNav {
  color: black;
  background-color: white;
}
nav {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  align-content: center;
  justify-content: space-between;
  align-items: center;
  padding: 0 5rem;
  @media screen and (max-width: 767px) {
    padding: 0 2rem;
  }
  height: 4rem;
  color: white;
  background-color: rgba(0, 0, 0, 0.1);
  position: fixed;
  z-index: 50;
  border-bottom: 1px solid gray;
  transition: all 500ms ease;
  #AppInfo {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    align-content: center;
    justify-content: space-between;
    align-items: center;
    img {
      height: 4rem;
      width: 4rem;
      scale: 1.3;
      cursor: pointer;
    }
    h1 {
      font-family: effra-cc-arabic, sans-serif;
      font-weight: 500;
      font-size: 1.2rem;
      padding: 0 1.2rem;
      cursor: pointer;
    }
  }
  #NavActions {
    ul {
      padding: 0;
      display: flex;
      li {
        font-size: 1.2rem;
        font-weight: 600;
        padding: 0 0.5rem;
        list-style: none;
        cursor: pointer;
        transition: all 500ms ease;
      }
      li:hover {
        color: var(--DarkTeal);
        margin-top: -0.4rem;
      }
    }
  }
  svg {
    cursor: pointer;
    font-size: 1.6rem;
  }
}
#SideMenu {
  height: 100vh;
  position: fixed;
  background-color: black;
  top: 0;
  left: 0;
  z-index: 100;
  display: flex;
  flex-direction: column;
  flex-wrap: nowrap;
  align-content: center;
  justify-content: center;
  align-items: center;
  ul {
    padding: 0;
    display: flex;
    flex-direction: column;
    flex-wrap: nowrap;
    align-content: center;
    justify-content: center;
    align-items: center;
    li {
      font-size: 2rem;
      color: white;
      list-style: none;
      cursor: pointer;
      transition: all 300ms ease;
    }
    li:hover {
      margin-left: -0.6rem;
    }
  }
}
.slide-enter-from {
  width: 0;
}
.slide-enter-to {
  width: 100%;
}
.slide-enter-active {
  transition: all 500ms ease;
}
.slide-leave-from {
  width: 100%;
}
.slide-leave-to {
  width: 0;
}
.slide-leave-active {
  transition: all 300ms ease;
}
</style>
