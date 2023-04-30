import { createStore } from "vuex";
// Api_Url: "http://localhost/israa-osman/public/php/index.php",
export default createStore({
  state: {
    Api_Url: "php/index.php",
    CurrentWidth: window.innerWidth,
    LoaderIndex: 0,
    SideMenuIndex: 0,
    Services: [
      {
        name: "مكالمة اون لاين لمدة ساعة",
        egyptprice: 950,
        dollarprice: 150,
        id: "101",
      },
      {
        name: "مكالمة اون لاين لمدة ساعة + امكانية متابعة واتس اب",
        egyptprice: 1200,
        dollarprice: 250,
        id: "102",
      },
      {
        name: "مكالمتين اون لاين خلال شهر + امكانية متابعة علي الواتس اب",
        egyptprice: 2000,
        dollarprice: 450,
        id: "103",
      },
      {
        name: "دورة الانوثة او دورة فن التعلق",
        egyptprice: 3000,
        dollarprice: 250,
        id: "104",
      },
      {
        name: "دورة الانوثة + دورة فن التعلق",
        egyptprice: 4500,
        dollarprice: 400,
        id: "104",
      },
    ],
    AppointTimes: [
      "1:00 PM",
      "2:00 PM",
      "3:00 PM",
      "4:00 PM",
      "5:00 PM",
      "6:00 PM",
    ],
    NewAppoint: {
      IsSet: 0,
      AppointType: 1,
      AppointDate: "",
      AppointTimeIndex: 0,
    },
    UserLogin: {
      IsLogin: 0,
      FirstLogin: 0,
    },
    UserInfo: {
      user_id: "",
      user_name: "",
      user_password: "",
      user_country: "",
      user_uid: "",
    },
  },
  getters: {},
  mutations: {
    Login() {
      this.state["UserLogin"]["IsLogin"] = 1;
    },
    Logout() {
      this.state["UserLogin"]["IsLogin"] = 0;
      this.state["UserInfo"]["user_id"] = null;
    },
    OpenLoader() {
      this.state["LoaderIndex"] = 1;
    },
    CloseLoader() {
      this.state["LoaderIndex"] = 0;
    },
    OpenSideMenu() {
      this.state["SideMenuIndex"] = 1;
    },
    CloseSideMenu() {
      this.state["SideMenuIndex"] = 0;
    },
    notallowed() {
      alert("Sorry Bro , this time is already reversed ");
      location.reload();
    },
    ResetNewAppoint() {
      this.state["NewAppoint"]["IsSet"] = 0;
      this.state["NewAppoint"]["AppointType"] = -1;
      this.state["NewAppoint"]["AppointDate"] = -1;
      this.state["NewAppoint"]["AppointTimeIndex"] = -1;
    },
  },
  actions: {
    ResizePage: ({ state }, payload) => {
      state.CurrentWidth = payload["WindowWidth"];
    },
    UpdateNewAppoint: ({ state }, payload) => {
      state.NewAppoint["IsSet"] = 1;
      state.NewAppoint["AppointType"] = payload["AppointType"];
      state.NewAppoint["AppointDate"] = payload["AppointDate"];
      state.NewAppoint["AppointTimeIndex"] = payload["AppointTimeIndex"];
    },
    SetUserInfo: ({ state }, payload) => {
      state.UserInfo[payload["key"]] = payload["value"];
    },
    MoveToSlide: ({ state }, payload) => {
      let NewSlide = payload["NewSlide"];
      state.SideMenuIndex = 0;
      $("html, body").animate(
        { scrollTop: $("#" + NewSlide).offset().top },
        200,
        "linear",
        function () {
          // setTimeout(() => {
          //   // state.LandingView["AcceptScroll"] = 1;
          //   // state.LandingView["CurrentSlide"] = NewSlide;
          // }, 600);
        }
      );
    },
  },
  modules: {},
});
