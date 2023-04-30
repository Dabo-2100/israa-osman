<template>
  <MainNav />
  <div class="col-12" id="PaymentView">
    <div
      class="col-12 col-sm-6 PaymentForm wow animate__animated animate__fadeInDown"
      dir="rtl"
    >
      <div class="col-12 FormHead">
        <h1 class="FormHeader">تأكيد عملية الدفع</h1>
        <img
          loading="lazy"
          alt="israaosman"
          :src="require('@/assets/photos/payment.webp')"
        />
        <button
          class="btn btn-info"
          @click="
            this.$store.commit('ResetNewAppoint');
            this.$router.push({ name: 'consulting' });
          "
        >
          تعديل الأستشارة
        </button>
        <hr class="col-12" />
      </div>
      <div class="col-12 FormBody">
        <div class="col-12 ProductSummary">
          <table class="col-12">
            <tbody>
              <tr>
                <th colspan="2">تفاصيل حجز الاستشارة</th>
              </tr>
              <tr>
                <th>تاريخ الاستشارة</th>
                <td>{{ this.$store.state["NewAppoint"]["AppointDate"] }}</td>
              </tr>
              <tr>
                <th>توقيت الاستشارة</th>
                <td>
                  {{
                    this.$store.state["AppointTimes"][
                      this.$store.state.NewAppoint["AppointTimeIndex"]
                    ]
                  }}
                  || بتوقيت الإمارات
                </td>
              </tr>
              <tr>
                <th>سعر الأستشارة</th>
                <td>
                  {{
                    this.IsEgypt == true
                      ? this.$store.state["Services"][
                          this.$store.state.NewAppoint["AppointType"]
                        ]["egyptprice"] +
                        " " +
                        "ج.م"
                      : this.$store.state["Services"][
                          this.$store.state.NewAppoint["AppointType"]
                        ]["dollarprice"] + " $"
                  }}
                </td>
              </tr>
              <tr>
                <th>وسيلة الدفع</th>
                <td id="PaymentType">
                  <div class="form-check">
                    <input
                      class="form-check-input"
                      type="radio"
                      name="flexRadioDefault"
                      id="flexRadioDefault1"
                      value="1"
                      v-model="this.PaymentMethod"
                    />
                    <label class="form-check-label" for="flexRadioDefault1">
                      Credit Card
                    </label>
                  </div>
                  <div class="form-check">
                    <input
                      v-if="this.IsEgypt == true"
                      class="form-check-input"
                      type="radio"
                      name="flexRadioDefault"
                      id="flexRadioDefault2"
                      value="2"
                      v-model="this.PaymentMethod"
                    />
                    <label
                      v-if="this.IsEgypt == true"
                      class="form-check-label"
                      for="flexRadioDefault2"
                    >
                      Mobile Wallet
                    </label>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <hr class="col-12" />
      </div>
      <div class="col-12 FormFooter">
        <button class="col-12 col-sm-6 btn btn-primary" @click="PayNow()">Pay Now</button>
      </div>
    </div>
  </div>
  ``
  <div class="col-12 Filter">
    <div class="col-12 col-sm-8 col-md-6" id="PersonalData">
      <table class="col-12 table table-bordered">
        <tbody>
          <tr>
            <th colspan="2">بيانات العميل</th>
          </tr>
          <tr>
            <th>الاسم الاول</th>
            <td><input class="col-12" type="text" placeholder="الاسم الأول" /></td>
          </tr>
          <tr>
            <th>الاسم الثاني</th>
            <td><input class="col-12" type="text" placeholder="الاسم الثاني" /></td>
          </tr>
          <tr>
            <th>رقم الهاتف</th>
            <td>
              <Transition name="fade" mode="out-in">
                <vue-tel-input
                  v-model="this.PaymentPhone"
                  dir="ltr"
                  class="col-12"
                  id="Phone"
                  placeholder="Enter Your Phone No"
                  :dropdownOptions="{
                    showFlags: true,
                    showDialCodeInSelection: false,
                    showSearchBox: true,
                    showDialCodeInList: true,
                  }"
                  :inputOptions="{
                    maxlength: 11,
                    showDialCode: false,
                    required: true,
                  }"
                  :mode="'national'"
                  :validCharactersOnly="true"
                ></vue-tel-input>
              </Transition>
            </td>
          </tr>
          <tr>
            <th>البريد الالكتروني</th>
            <td><input class="col-12" type="email" placeholder="البريد الالكتروني" /></td>
          </tr>
        </tbody>
      </table>
      <button class="col-6 btn btn-success">Checkout</button>
    </div>
  </div>
</template>

<script>
import $ from "jquery";
window.$ = window.jQuery = require("jquery");
import axios from "axios";
import WOW from "wowjs";
import useValidate from "@vuelidate/core";
import { required, maxLength, minLength, helpers } from "@vuelidate/validators";
import MainNav from "@/components/MainNav.vue";
export default {
  name: "PaymentView",
  components: { MainNav },
  data() {
    return {
      v$: useValidate(),
      ApiUrl: this.$store.state["Api_Url"],
      CurrentWidth: window.innerWidth,
      IframeIndex: 0,
      PaymentSrc: "",
      PaymentMethod: 0,
      PaymentPhone: "",
      IsEgypt: false,
      PersonalData: {
        FirstName: "",
        LastName: "",
        Phone: "",
        Email: "",
      },
    };
  },
  methods: {
    PayNow() {
      let main = this;
      main.$store.commit("OpenLoader");
      let PaymentMethod = this.PaymentMethod;
      let Price =
        this.$store.state["Services"][this.$store.state.NewAppoint["AppointType"]][
          "egyptprice"
        ] * 100;
      let IntegrationID = 0;
      if (PaymentMethod == 1) {
        IntegrationID = 2912088;
        axios
          .post(this.ApiUrl, {
            api_name: "makeappoint",
            user_id: main.$store.state["UserInfo"]["user_id"],
            appoint_day: main.$store.state["NewAppoint"]["AppointDate"],
            appoint_time_index: main.$store.state["NewAppoint"]["AppointTimeIndex"],
          })
          .then(function (res) {
            let UserEmail = res.data["user_email"];
            let appoint_id = res.data["appoint_id"];
            axios
              .post("https://accept.paymob.com/api/auth/tokens", {
                api_key:
                  "ZXlKMGVYQWlPaUpLVjFRaUxDSmhiR2NpT2lKSVV6VXhNaUo5LmV5SndjbTltYVd4bFgzQnJJam8xTmpFME9UWXNJbU5zWVhOeklqb2lUV1Z5WTJoaGJuUWlMQ0p1WVcxbElqb2lhVzVwZEdsaGJDSjkuekxDRGtEcmVuVllLblFCWDB0NWtzZW4wSm1MTTBkTEJzVUdDVWRETmYtTW41RVVWaDJqMkk4VXlPOWdnSTZTa1hzUUJWUnl6MDJuR3dTM29xcVRuQXc=",
              })
              .then(function (res) {
                let Token = res.data["token"];
                axios
                  .post("https://accept.paymob.com/api/ecommerce/orders", {
                    auth_token: Token,
                    delivery_needed: "false",
                    amount_cents: Price,
                    currency: "EGP",
                    merchant_order_id: Math.floor(Math.random() * 1000) + 1,
                    items: [
                      {
                        name: "ASC1515",
                        amount_cents: Price,
                        description: "استشارة فردية",
                        quantity: "1",
                      },
                    ],
                  })
                  .then(function (res) {
                    let ID = res.data["id"];
                    axios
                      .post("https://accept.paymob.com/api/acceptance/payment_keys", {
                        auth_token: Token,
                        amount_cents: Price,
                        expiration: 3600,
                        order_id: ID,
                        billing_data: {
                          apartment: "14",
                          email: UserEmail,
                          floor: "42",
                          first_name: "Clifford",
                          street: "Ethan Land",
                          building: "8028",
                          phone_number: "+86(8)9135210487",
                          shipping_method: "PKG",
                          postal_code: "01898",
                          city: "Jaskolskiburgh",
                          country: "CR",
                          last_name: "Nicolas",
                          state: appoint_id,
                        },
                        currency: "EGP",
                        integration_id: IntegrationID,
                        lock_order_when_paid: "false",
                      })
                      .then(function (res) {
                        let finalToken = res.data["token"];
                        if (PaymentMethod == 1) {
                          //main.$store.commit("OpenIframe");
                          window.location.href =
                            "https://accept.paymobsolutions.com/api/acceptance/iframes/685590?payment_token=" +
                            finalToken;
                        } else {
                          axios
                            .post(
                              "https://accept.paymob.com/api/acceptance/payments/pay",
                              {
                                source: {
                                  identifier: main.PaymentPhone.replace(/\s/g, ""),
                                  subtype: "WALLET",
                                },
                                payment_token: finalToken,
                              }
                            )
                            .then(function (res) {
                              let finalOrderId = res.data["order"]["id"];
                              let Dir = res.data["redirect_url"];
                              axios
                                .post(main.ApiUrl, {
                                  api_name: "updateOrderid",
                                  order_id: finalOrderId,
                                  appoint_id: appoint_id,
                                })
                                .then(function (res) {
                                  window.location.href = Dir;
                                });
                            });
                        }
                      });
                  });
              });
          });

        // Card
        // axios.post(this.ApiUrl, {
        //   api_name: "makeappoint",
        //   user_id: main.$store.state["UserInfo"]["user_id"],
        //   appoint_day: main.$store.state["NewAppoint"]["AppointDate"],
        //   appoint_time_index: main.$store.state["NewAppoint"]["AppointTimeIndex"],
        // });
        // if (main.IsEgypt == false) {
        //   if (main.$store.state.NewAppoint["AppointType"] == 0) {
        //     window.location.href =
        //       "https://accept.paymobsolutions.com/standalone/?ref=p_LRR2TDgzTkNTZ1crOXF2NXZGTDhkNllmZz09X3diZFFOcFFuSDVHdEt4Z3dnVG9XZXc9PQ";
        //   } else if (main.$store.state.NewAppoint["AppointType"] == 1) {
        //     window.location.href =
        //       "https://accept.paymobsolutions.com/standalone/?ref=p_LRR2RUNjL0x4T3BDSHd6QVk5eDJzaGtaUT09X0hQVU1lZTc3eUlDcVdLWU4yekliNXc9PQ";
        //   } else if (main.$store.state.NewAppoint["AppointType"] == 2) {
        //     window.location.href =
        //       "https://accept.paymobsolutions.com/standalone/?ref=p_LRR2SVB2QXF5N3VlM0F2TFpVdzJaajFIQT09X3hsZjV4WExUWDRHRS9GUDVTSTREYWc9PQ";
        //   }
        // } else {
        //   if (main.$store.state.NewAppoint["AppointType"] == 0) {
        //     window.location.href =
        //       "https://accept.paymobsolutions.com/standalone/?ref=p_LRR2NnFWb2ZiOXRpKy9yQy9nRklqOXJodz09XzNpT2RMa3htZmk4SE5vZm50eGdOTGc9PQ";
        //   } else if (main.$store.state.NewAppoint["AppointType"] == 1) {
        //     window.location.href =
        //       "https://accept.paymobsolutions.com/standalone/?ref=p_LRR2KzZqeHFsbm5nQjlZclhoZEZPdXFkdz09X0ZUdWJxQzN2VWpHY0tJQ1dmanRvVkE9PQ";
        //   } else if (main.$store.state.NewAppoint["AppointType"] == 2) {
        //     window.location.href =
        //       "https://accept.paymobsolutions.com/standalone/?ref=p_LRR2M1NLSllUNStweG5sVTJ1Yi9lclJKdz09X2hYOWhsMXdMY0gzRVh1TzhZVTYvU3c9PQ";
        //   }
        // }
      } else {
        //Wallet
        IntegrationID = 3144954;
        axios
          .post(this.ApiUrl, {
            api_name: "makeappoint",
            user_id: main.$store.state["UserInfo"]["user_id"],
            appoint_day: main.$store.state["NewAppoint"]["AppointDate"],
            appoint_time_index: main.$store.state["NewAppoint"]["AppointTimeIndex"],
          })
          .then(function (res) {
            let UserEmail = res.data["user_email"];
            let appoint_id = res.data["appoint_id"];
            axios
              .post("https://accept.paymob.com/api/auth/tokens", {
                api_key:
                  "ZXlKMGVYQWlPaUpLVjFRaUxDSmhiR2NpT2lKSVV6VXhNaUo5LmV5SndjbTltYVd4bFgzQnJJam8xTmpFME9UWXNJbU5zWVhOeklqb2lUV1Z5WTJoaGJuUWlMQ0p1WVcxbElqb2lhVzVwZEdsaGJDSjkuekxDRGtEcmVuVllLblFCWDB0NWtzZW4wSm1MTTBkTEJzVUdDVWRETmYtTW41RVVWaDJqMkk4VXlPOWdnSTZTa1hzUUJWUnl6MDJuR3dTM29xcVRuQXc=",
              })
              .then(function (res) {
                let Token = res.data["token"];
                axios
                  .post("https://accept.paymob.com/api/ecommerce/orders", {
                    auth_token: Token,
                    delivery_needed: "false",
                    amount_cents: Price,
                    currency: "EGP",
                    merchant_order_id: Math.floor(Math.random() * 1000) + 1,
                    items: [
                      {
                        name: "ASC1515",
                        amount_cents: Price,
                        description: "استشارة فردية",
                        quantity: "1",
                      },
                    ],
                  })
                  .then(function (res) {
                    let ID = res.data["id"];
                    axios
                      .post("https://accept.paymob.com/api/acceptance/payment_keys", {
                        auth_token: Token,
                        amount_cents: Price,
                        expiration: 3600,
                        order_id: ID,
                        billing_data: {
                          apartment: "14",
                          email: UserEmail,
                          floor: "42",
                          first_name: "Clifford",
                          street: "Ethan Land",
                          building: "8028",
                          phone_number: "+86(8)9135210487",
                          shipping_method: "PKG",
                          postal_code: "01898",
                          city: "Jaskolskiburgh",
                          country: "CR",
                          last_name: "Nicolas",
                          state: appoint_id,
                        },
                        currency: "EGP",
                        integration_id: IntegrationID,
                        lock_order_when_paid: "false",
                      })
                      .then(function (res) {
                        let finalToken = res.data["token"];
                        if (PaymentMethod == 1) {
                          //main.$store.commit("OpenIframe");
                          window.location.href =
                            "https://accept.paymobsolutions.com/api/acceptance/iframes/685589?payment_token=" +
                            finalToken;
                        } else {
                          axios
                            .post(
                              "https://accept.paymob.com/api/acceptance/payments/pay",
                              {
                                source: {
                                  identifier: main.PaymentPhone.replace(/\s/g, ""),
                                  subtype: "WALLET",
                                },
                                payment_token: finalToken,
                              }
                            )
                            .then(function (res) {
                              let finalOrderId = res.data["order"]["id"];
                              let Dir = res.data["redirect_url"];
                              axios
                                .post(main.ApiUrl, {
                                  api_name: "updateOrderid",
                                  order_id: finalOrderId,
                                  appoint_id: appoint_id,
                                })
                                .then(function (res) {
                                  window.location.href = Dir;
                                });
                            });
                        }
                      });
                  });
              });
          });
      }
    },
  },
  validations() {
    return {};
  },
  watch: {},
  created() {
    let main = this;
    main.$store.state["UserLogin"]["FirstLogin"] = 1;
    axios.post(this.ApiUrl, { api_name: "connect" }).then(function (res) {
      if (res.data["geoplugin_countryName"] == "Egypt") {
        main.IsEgypt = true;
      } else {
        main.IsEgypt = false;
      }
    });
  },
  computed: {},
  mounted() {
    new WOW.WOW({
      live: false,
    }).init();
  },
};
</script>

<style lang="scss" scoped>
#PaymentView {
  display: flex;
  padding-top: 5.1rem;
  min-height: 100vh;
  flex-direction: row;
  flex-wrap: wrap;
  align-content: flex-start;
  justify-content: center;
  align-items: flex-start;
  .PaymentForm {
    margin-top: 1rem;
    background-color: white;
    border-radius: 2rem;
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    align-content: flex-start;
    justify-content: center;
    padding: 2rem;
    box-shadow: #c8c9ca 1px 1px 15px;
    .FormHead {
      display: flex;
      flex-direction: row;
      flex-wrap: wrap;
      align-content: center;
      justify-content: space-evenly;
      align-items: center;
      .FormHeader {
        font-size: 1.2rem;
        font-family: "Lemonada";
        text-align: center;
      }
      img {
        height: 10rem;
      }
    }
    .FormBody {
      display: flex;
      flex-direction: row;
      flex-wrap: wrap;
      align-content: center;
      justify-content: center;
      align-items: center;
      .ProductSummary {
        table {
          tbody {
            th,
            tr {
              text-align: center;
              border: solid 1px #c8c9ca;
              font-size: 1.4rem;
            }
            #PaymentType {
              padding: 1rem 2rem;
              text-align: left;
              .form-check {
                margin: 0.5rem 0;
              }
              #Phone {
                text-align: left;
                padding: 0.5rem;
                border-radius: 0.5rem;
                border: solid 1px gray;
                direction: ltr;
              }
            }
          }
        }
      }
      .FormSummary {
        padding: 1rem;
        h1 {
          font-size: 1.2rem;
          text-align: center;
        }
      }
      .PaymentMethod {
        padding: 1rem;
        border-right: 1px solid #c8c9ca;
        h1 {
          font-size: 1.2rem;
          text-align: center;
        }
      }
    }
    .FormFooter {
      display: flex;
      flex-direction: row;
      flex-wrap: wrap;
      align-content: center;
      justify-content: center;
      align-items: center;
      button {
        font-size: 1.5rem;
      }
    }
  }
}
.Filter {
  position: fixed;
  top: 0;
  width: 100%;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.64);
  z-index: 100;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  align-content: center;
  justify-content: center;
  align-items: center;
  #PersonalData {
    display: flex;
    background-color: white;
    padding: 1rem 5%;
    border-radius: 1rem;
    box-shadow: 5px 5px 10px;
    flex-direction: row;
    flex-wrap: wrap;
    align-content: center;
    justify-content: center;
    align-items: center;
    table {
      font-size: 1.4rem;
      text-align: center;
      vertical-align: middle;
      input {
        padding: 0.25rem 0.5rem;
      }
    }
    button {
      font-size: 1.5rem;
    }
  }
}
.fade-enter-active,
.fade-leave-active {
  transition: opacity 400ms ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
span.vti__dropdown-arrow {
  margin-left: 1rem !important;
}
</style>
