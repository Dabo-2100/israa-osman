import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import "normalize.css";
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap/dist/js/bootstrap";
import 'animate.css';
import '@vuepic/vue-datepicker/dist/main.css'
import 'sweetalert2/dist/sweetalert2.min.css';
import 'lazysizes';
import 'lazysizes/plugins/parent-fit/ls.parent-fit';
import Datepicker from '@vuepic/vue-datepicker';
import VueSweetalert2 from 'vue-sweetalert2';
import VueSplide from '@splidejs/vue-splide';
import VueTelInput from 'vue-tel-input';
import 'vue-tel-input/dist/vue-tel-input.css';
import { library } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import "vue3-carousel/dist/carousel.css";
import {
    faAppStore,
    faBlogger,
    faFacebook,
    faFacebookMessenger,
    faInstagram,
    faSquareFacebook,
    faSquareInstagram,
    faSquareTwitter,
    faSquareWhatsapp,
    faTwitter,
    faWhatsapp,
    faYoutube,
} from "@fortawesome/free-brands-svg-icons";
import {
    faUserSecret,
    faComment,
    faCircleLeft,
    faUserTie,
    faPhone,
    faUser,
    faEye,
    faEyeSlash,
    faEnvelope,
    faGear,
    faMessage,
    faBoxArchive,
    faMagnifyingGlass,
    faCircle,
    faPlus,
    faArrowRightFromBracket,
    faCalendar,
    faWallet,
    faWarehouse,
    faGrip,
    faBell,
    faUsers,
    faTrash,
    faPen,
    faHouseChimneyMedical,
    faCircleCheck,
    faCircleDot,
    faStethoscope,
    faFilePrescription,
    faListCheck,
    faPaperclip,
    faSquareXmark,
    faSquarePlus,
    faCartShopping,
    faHeart,
    faHouse,
    faBars,
    faEarthAmerica,
    faRightLong,
    faLeftLong,
    faArrowLeft,
    faArrowRight,
    faCircleXmark,
    faHandHoldingHand,
    faPenToSquare,
    faCheck,
    faLaptopCode,
    faStore,
    faBlog,
    faX,
    faChevronDown,
    faPaperPlane,
} from "@fortawesome/free-solid-svg-icons";
library.add(
    faPaperPlane,
    faYoutube,
    faX,
    faTwitter,
    faWhatsapp,
    faFacebookMessenger,
    faStore,
    faBlogger,
    faAppStore,
    faBlog,
    faLaptopCode,
    faCheck,
    faComment,
    faPenToSquare,
    faGear,
    faGrip,
    faCircle,
    faHandHoldingHand,
    faMessage,
    faCircleLeft,
    faCircleXmark,
    faCircleLeft,
    faArrowLeft,
    faArrowRight,
    faRightLong,
    faLeftLong,
    faFacebook,
    faInstagram,
    faEnvelope,
    faEarthAmerica,
    faPhone,
    faUserSecret,
    faUserTie,
    faUser,
    faEye,
    faEyeSlash,
    faEnvelope,
    faGear,
    faMessage,
    faBoxArchive,
    faMagnifyingGlass,
    faCircle,
    faPlus,
    faArrowRightFromBracket,
    faCalendar,
    faWallet,
    faWarehouse,
    faGrip,
    faBell,
    faUsers,
    faTrash,
    faPen,
    faHouseChimneyMedical,
    faCircleCheck,
    faCircleDot,
    faStethoscope,
    faFilePrescription,
    faListCheck,
    faPaperclip,
    faSquareXmark,
    faSquarePlus,
    faCartShopping,
    faHeart,
    faHouse,
    faMagnifyingGlass,
    faSquareFacebook,
    faSquareWhatsapp,
    faSquareTwitter,
    faSquareInstagram,
    faBars,
    faChevronDown
);
createApp(App)
    .component('Datepicker', Datepicker)
    .component("font-awesome-icon", FontAwesomeIcon)
    .use(VueSweetalert2)
    .use(VueSplide)
    .use(VueTelInput)
    .use(store)
    .use(router)
    .mount("#app");

// npm install axios
// npm install bootstrap
// npm install --save normalize.css
// npm install jquery
// npm install popper.js
// npm install @vuelidate/core @vuelidate/validators
// npm i --save @fortawesome/fontawesome-svg-core
// npm i --save @fortawesome/free-solid-svg-icons
// npm i --save @fortawesome/free-regular-svg-icons
// npm i --save @fortawesome/free-brands-svg-icons
// npm i --save @fortawesome/vue-fontawesome@latest-3
// npm install aos --save
// npm i vue-slick-carousel
// npm install lazysizes --save
// npm i vue-img-loader --save
// npm install @vuepic/vue-datepicker
// npm install animate.css --save
// npm install -S vue-sweetalert2
// npm install wow.js
// npm install --save wowjs
// npm i swiper
// npm install @splidejs/vue-splide