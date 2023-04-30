<template>
  <div class="col-12" id="ConsultingView">
    <MainNav />
    <div id="Filter" class="col-12">
      <header
        class="col-12 animate__animated animate__fadeInDown"
        style="--animate-duration: 2s"
      >
        <h1>حدد موعد استشارك الأن</h1>
        <select v-model="this.AppointInfo['AppointType']">
          <option value="-1" disabled selected hidden>اختار نوع الاستشارة</option>
          <option
            v-for="(Service, index) in this.$store.state['Services']"
            :key="Service"
            :value="index"
          >
            {{ Service["name"] }}
          </option>
        </select>
      </header>
      <section class="col-12">
        <Transition name="fade" mode="out-in">
          <div
            id="AppointDate"
            class="col-12 col-sm-4"
            v-if="this.AppointInfo['AppointType'] != -1"
          >
            <h1>الخطوة الأولي</h1>
            <p>اختار اليوم المناسب</p>
            <Datepicker
              class="col-12"
              dir="ltr"
              v-model="Appoint_Date"
              placeholder="Select Date"
              :enable-time-picker="false"
              :month-change-on-scroll="false"
              :min-date="this.MinDate"
              :max-date="this.MaxDate"
              model-type="yyyy-MM-dd"
              inline
              auto-apply
              no-today
            />
          </div>
        </Transition>
        <Transition name="fade" mode="out-in">
          <div
            class="col-12 col-sm-4"
            id="AppointTime"
            v-if="this.AppointInfo['AppointDate'] != -1"
          >
            <h1>الخطوة الثانية</h1>
            <p>اختار الموعد المناسب</p>
            <div id="AvailableTimes" dir="ltr">
              <button
                v-for="(Time, index) in this.$store.state['AppointTimes']"
                :key="Time"
                :index="index"
                :class="
                  this.ReversedTime.includes(index) == false
                    ? this.AppointInfo['AppointTimeIndex'] == index
                      ? 'btn btn-warning col-5'
                      : 'btn btn-primary col-5'
                    : 'btn btn-primary col-5'
                "
                :disabled="this.ReversedTime.includes(index) == true ? true : false"
                @click="
                  this.ReversedTime.includes(index) == true
                    ? this.$store.commit('notallowed')
                    : (this.AppointInfo['AppointTimeIndex'] = index)
                "
              >
                {{ Time }}
              </button>
            </div>
          </div>
        </Transition>
        <Transition name="fade" mode="out-in">
          <div
            id="AppointDetails"
            class="col-12 col-sm-4"
            v-if="this.AppointInfo['AppointTimeIndex'] != -1"
          >
            <h1>الخطوة الثالثة</h1>
            <p>تأكيد تفاصيل الأستشارة</p>
            <table>
              <tbody>
                <tr>
                  <th>نوع الاستشارة</th>
                  <td>
                    {{
                      this.$store.state["Services"][this.AppointInfo["AppointType"]][
                        "name"
                      ]
                    }}
                  </td>
                </tr>
                <tr>
                  <th>اليوم المناسب</th>
                  <td>
                    {{ this.ShowArabicDate(this.AppointInfo["AppointDate"]) }}
                  </td>
                </tr>
                <tr>
                  <th>الموعد المناسب</th>
                  <td dir="ltr">
                    {{
                      this.$store.state["AppointTimes"][
                        this.AppointInfo["AppointTimeIndex"]
                      ]
                    }}
                    بتوقيت الإمارات
                  </td>
                </tr>

                <tr>
                  <th>سعر الاستشارة</th>
                  <td>
                    {{
                      this.IsEgypt == true
                        ? this.$store.state["Services"][this.AppointInfo["AppointType"]][
                            "egyptprice"
                          ]
                        : this.$store.state["Services"][this.AppointInfo["AppointType"]][
                            "dollarprice"
                          ] + " $"
                    }}
                  </td>
                </tr>
              </tbody>
            </table>
            <button class="btn btn-success" @click="GoToPayment()">تأكيد الحجز</button>
          </div>
        </Transition>
      </section>
    </div>
  </div>
</template>

<script>
// @ is an alias to /src
import axios from "axios";
import MainNav from "@/components/MainNav.vue";
import { ref } from "vue";
export default {
  name: "ConsultingView",
  components: { MainNav },
  data() {
    return {
      Date: "",
      MinDate: "",
      MaxDate: "",
      AppointInfo: {
        IsSet: 0,
        AppointType: -1,
        AppointDate: -1,
        AppointTimeIndex: -1,
      },
      ReversedTime: [],
      IsEgypt: true,
    };
  },
  methods: {
    ShowArabicDate(newValue) {
      let date = new Date(newValue);
      let months = [
        "يناير",
        "فبراير",
        "مارس",
        "إبريل",
        "مايو",
        "يونيو",
        "يوليو",
        "أغسطس",
        "سبتمبر",
        "أكتوبر",
        "نوفمبر",
        "ديسمبر",
      ];
      let days = ["اﻷحد", "اﻷثنين", "الثلاثاء", "اﻷربعاء", "الخميس", "الجمعة", "السبت"];
      var delDateString =
        days[date.getDay()] +
        ", " +
        date.getDate() +
        " " +
        months[date.getMonth()] +
        ", " +
        date.getFullYear();
      return delDateString;
    },
    GoToPayment() {
      let payload = this.AppointInfo;
      this.$store.dispatch("UpdateNewAppoint", payload);
      if (this.$store.state.UserInfo["user_id"] == 0) {
        this.$swal
          .fire({
            icon: "info",
            title: "من فضلك قم بتسجيل الدخول لتأكيد الحجز",
            position: "top-center",
            fontSize: "0.7rem",
            showConfirmButton: true,
            timerProgressBar: true,
            confirmButtonText: "تسجيل",
          })
          .then((result) => {
            /* Read more about isConfirmed, isDenied below */
            if (result.isConfirmed) {
              this.$router.push({ name: "login" });
            } else if (result.isDenied) {
              alert("Bardo Tamam");
            }
          });
      } else {
        this.$router.push({ name: "payment" });
      }
    },
  },
  created() {
    let main = this;
    $("body").on("click", "#AvailableTimes button", function () {
      $("#AvailableTimes button").removeClass("btn-warning");
      $(this).addClass("btn-warning");
    });
    Date.prototype.addDays = function (days) {
      let date = new Date(this.valueOf());
      date.setDate(date.getDate() + days);
      return date;
    };
    function formatDate(date) {
      var d = new Date(date),
        month = "" + (d.getMonth() + 1),
        day = "" + d.getDate(),
        year = d.getFullYear();

      if (month.length < 2) month = "0" + month;
      if (day.length < 2) day = "0" + day;

      return [year, month, day].join("-");
    }
    let user_uid = localStorage.getItem("user_uid");
    let user_login = this.$store.state["UserLogin"]["IsLogin"];
    $(window).resize(function () {
      main.CurrentWidth = window.innerWidth;
    });
    if (user_login == 0 && user_uid) {
      axios
        .post(this.$store.state["Api_Url"], {
          api_name: "getuserid",
          user_uid: user_uid,
        })
        .then(function (res) {
          if (res.data != false) {
            main.$store.state["UserInfo"]["user_id"] = res.data["user_id"];
          }
        });
    }

    axios
      .post(this.$store.state["Api_Url"], { api_name: "connect" })
      .then(function (res) {
        if (res.data["geoplugin_countryName"] == "Egypt") {
          main.IsEgypt = true;
        } else {
          main.IsEgypt = false;
        }
      });
    axios
      .post(this.$store.state["Api_Url"], {
        api_name: "ResetCalendar",
        TodayDate: new Date(),
      })
      .then(function (res) {
        let theDate = new Date(res.data["Today"]);
        main.MinDate = res.data["Today"];
        main.MaxDate = formatDate(theDate.addDays(15));
      });
  },
  mounted() {
    if (
      this.$store.state["NewAppoint"]["IsSet"] == 1 &&
      this.$store.state["UserLogin"]["IsLogin"] == 0
    ) {
      this.AppointInfo = this.$store.state["NewAppoint"];
      this.Appoint_Date = this.$store.state["NewAppoint"]["AppointDate"];
      $(
        "#AvailableTimes button[index='" +
          this.$store.state["NewAppoint"]["AppointTimeIndex"] +
          "']"
      ).addClass("btn-warning");
    } else if (
      this.$store.state["NewAppoint"]["IsSet"] == 1 &&
      this.$store.state["UserLogin"]["IsLogin"] == 1
    ) {
      this.$router.push({ name: "payment" });
    }
  },
  watch: {
    Appoint_Date(newVal) {
      let main = this;
      this.AppointInfo["AppointDate"] = newVal;
      axios
        .post(this.$store.state["Api_Url"], {
          api_name: "ResetCalendar",
          TodayDate: newVal,
        })
        .then(function (res) {
          let objectLength = Object.keys(res.data).length;
          let ReversedTimeLen = parseInt(objectLength - 1);
          if (ReversedTimeLen > 0) {
            let ReversedTime = [];
            for (let index = 0; index < objectLength - 1; index++) {
              let appoint = res.data[index]["appoint_time_index"];
              ReversedTime.push(appoint);
            }
            main.ReversedTime = ReversedTime;
          } else {
            main.ReversedTime = [];
          }
        });
    },
    ReversedTime(newVal) {},
  },
  setup() {
    const Appoint_Date = ref(new Date());
    return {
      Appoint_Date,
    };
  },
};
</script>

<style lang="scss" scoped>
.dp__flex_display {
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  align-content: center;
  align-items: center;
  justify-content: center;
}
#ConsultingView {
  display: flex;
  min-height: 100vh;
  background-image: url("@/assets/photos/happy_appoint.webp");
  background-size: cover;
  background-repeat: no-repeat;
  @media screen and (max-width: 767px) {
    background-image: url("@/assets/photos/happy_appoint_sm.webp");
  }
  #Filter {
    display: flex;
    background-color: rgba(0, 0, 0, 0.15);
    margin-top: 4rem;
    min-height: calc(100vh - 4rem);
    flex-direction: column;
    flex-wrap: nowrap;
    align-content: center;
    padding: 2rem 5rem;
    justify-content: center;
    align-items: center;
    @media screen and (max-width: 767px) {
      padding: 2rem;
    }
    header {
      display: flex;
      transition: all 500ms ease;
      flex-direction: column;
      flex-wrap: nowrap;
      align-content: center;
      justify-content: center;
      align-items: center;
      h1 {
        font-size: 2rem;
        color: white;
        font-family: "Lemonada";
      }
      select {
        margin-top: 1rem;
        background-color: var(--DarkBlue);
        color: white;
        font-size: 1.7rem;
        padding: 0.5rem 1rem;
        cursor: pointer;
        border-radius: 8px;
      }
    }
    section {
      display: flex;
      flex-direction: row;
      flex-wrap: wrap;
      justify-content: space-around;
      padding: 2rem 1rem;
      #AppointDate {
        h1 {
          font-size: 1.5rem;
          color: white;
          font-family: "Lemonada";
        }
        p {
          font-size: 2.5rem;
          color: var(--Beig);
        }
        display: flex;
        flex-direction: column;
        flex-wrap: nowrap;
        align-content: center;
        align-items: center;
      }
      #AppointTime {
        display: flex;
        flex-direction: column;
        flex-wrap: nowrap;
        align-content: center;
        align-items: center;
        @media screen and (max-width: 767px) {
          margin: 1rem 0;
        }
        h1 {
          font-size: 1.5rem;
          color: white;
          font-family: "Lemonada";
        }
        p {
          font-size: 2.5rem;
          color: var(--Beig);
        }
        #AvailableTimes {
          background-color: white;
          display: flex;
          flex-direction: row;
          flex-wrap: wrap;
          justify-content: space-around;
          padding: 1rem;
          border-radius: 7px;
          height: 100%;
          align-items: center;
          button {
            height: 3rem;
            margin: 0.5rem 0;
          }
        }
      }
      #AppointDetails {
        display: flex;
        flex-direction: column;
        flex-wrap: nowrap;
        align-content: center;
        align-items: center;
        h1 {
          font-size: 1.5rem;
          color: white;
          font-family: "Lemonada";
        }
        p {
          font-size: 2.5rem;
          color: var(--Beig);
        }
        table {
          background-color: white;
          width: 80%;
          font-size: 1.2rem;
          text-align: center;
          height: 100%;
          th {
            text-align: center;
            border-bottom: 1px solid gray;
            padding: 0 0.5rem;
          }
          td {
            text-align: center;
            border-right: 1px solid gray;
            border-bottom: 1px solid gray;
            padding: 0.5rem;
          }
        }
        button {
          margin-top: 1rem;
          font-size: 1.5rem;
          padding: 0.5rem 2rem;
        }
      }
    }
  }

  .fade-enter-active,
  .fade-leave-active {
    transition: opacity 1200ms ease;
  }
  .fade-enter-from,
  .fade-leave-to {
    opacity: 0;
  }
}
</style>
