<template>
  <div class="col-12" id="UserInfo">
    <table class="col-10 table table-bordered">
      <thead>
        <tr>
          <th colspan="2">البيانات الشخصية</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <th>البريد الألكتروني</th>
          <td>{{ this.UserInfo["user_email"] }}</td>
        </tr>
        <tr>
          <th>اسم المستخدم</th>
          <td>
            <p v-if="this.EditMode == 0">{{ this.UserInfo["user_name"] }}</p>
            <input
              id="user_name"
              class="col-6"
              v-else
              type="text"
              v-model="this.UserInfo['user_name']"
            />
          </td>
        </tr>
        <tr>
          <datalist id="AllCountries">
            <option
              v-for="Country in this.countryList"
              :key="Country"
              :value="Country"
            ></option>
          </datalist>
          <th>الدولة</th>
          <td>
            <p v-if="this.EditMode == 0">
              {{
                this.UserInfo["user_country"] == 0
                  ? "----"
                  : this.UserInfo["user_country"]
              }}
            </p>
            <input
              list="AllCountries"
              class="col-6"
              id="user_country"
              v-else
              type="text"
              v-model="this.UserInfo['user_country']"
            />
          </td>
        </tr>
        <tr>
          <th>رقم الهاتف</th>
          <td>
            <p v-if="this.EditMode == 0" dir="ltr">
              {{
                this.UserInfo["user_phone"] == 0 ? "----" : this.UserInfo["user_phone"]
              }}
            </p>
            <input
              id="user_phone"
              class="col-6"
              v-else
              type="text"
              v-model="this.UserInfo['user_phone']"
              dir="ltr"
              style="text-align: right"
              placeholder="ادخل رقم الهاتف مسبوق بكود البلد"
            />
          </td>
        </tr>
        <tr>
          <th>العمر</th>
          <td>
            <p v-if="this.EditMode == 0">
              {{ this.UserInfo["user_age"] == 0 ? "----" : this.UserInfo["user_age"] }}
            </p>
            <input
              id="user_age"
              class="col-6"
              v-else
              type="number"
              min="18"
              max="70"
              maxlength="2"
              v-model="this.UserInfo['user_age']"
            />
          </td>
        </tr>
        <tr>
          <th>النوع</th>
          <td>
            <p v-if="this.EditMode == 0">
              {{
                this.UserInfo["user_gender"] == 0 ? "----" : this.UserInfo["user_gender"]
              }}
            </p>
            <select class="col-6" v-else v-model="this.UserInfo['user_gender']">
              <option value="male">male</option>
              <option value="female">female</option>
            </select>
          </td>
        </tr>
      </tbody>
    </table>
    <div class="col-12 AllErrors">
      <span class="InputError col-12" v-if="v$.UserInfo.user_name.$error">
        {{ v$.UserInfo.user_name.$errors[0].$message }}
      </span>
      <span class="InputError col-12" v-if="v$.UserInfo.user_country.$error">
        {{ v$.UserInfo.user_country.$errors[0].$message }}
      </span>
      <span class="InputError col-12" v-if="v$.UserInfo.user_phone.$error">
        {{ v$.UserInfo.user_phone.$errors[0].$message }}
      </span>
      <span class="InputError col-12" v-if="v$.UserInfo.user_age.$error">
        {{ v$.UserInfo.user_age.$errors[0].$message }}
      </span>
    </div>
    <button
      v-if="this.EditMode == 0"
      class="col-12 col-sm-3 btn btn-primary"
      @click="this.EditMode = 1"
    >
      تعديل البيانات
    </button>
    <button v-else class="col-12 col-sm-3 btn btn-success" @click="SaveChanges()">
      حفظ التعديلات
    </button>
  </div>
</template>

<script>
import $ from "jquery";
window.$ = window.jQuery = require("jquery");
import axios from "axios";
import useValidate from "@vuelidate/core";
import {
  required,
  email,
  minValue,
  maxValue,
  maxLength,
  minLength,
  helpers,
} from "@vuelidate/validators";
export default {
  name: "SettingsPage",
  components: {},
  data() {
    return {
      v$: useValidate(),
      ApiUrl: this.$store.state["Api_Url"],
      CurrentWidth: window.innerWidth,
      UserInfo: {
        user_id: "",
        user_country: "",
        user_phone: "",
        user_age: "",
        user_gender: "",
      },
      EditMode: 0,
      countryList: [
        "Afghanistan",
        "Albania",
        "Algeria",
        "American Samoa",
        "Andorra",
        "Angola",
        "Anguilla",
        "Antarctica",
        "Antigua and Barbuda",
        "Argentina",
        "Armenia",
        "Aruba",
        "Australia",
        "Austria",
        "Azerbaijan",
        "Bahamas",
        "Bahrain",
        "Bangladesh",
        "Barbados",
        "Belarus",
        "Belgium",
        "Belize",
        "Benin",
        "Bermuda",
        "Bhutan",
        "Bolivia (Plurinational State of)",
        "Bonaire, Sint Eustatius and Saba",
        "Bosnia and Herzegovina",
        "Botswana",
        "Bouvet Island",
        "Brazil",
        "British Indian Ocean Territory",
        "Brunei Darussalam",
        "Bulgaria",
        "Burkina Faso",
        "Burundi",
        "Cabo Verde",
        "Cambodia",
        "Cameroon",
        "Canada",
        "Cayman Islands",
        "Central African Republic",
        "Chad",
        "Chile",
        "China",
        "Christmas Island",
        "Cocos (Keeling) Island",
        "Colombia",
        "Comoros",
        "Congo (the Democratic Republic of the)",
        "Congo",
        "Cook Islands",
        "Costa Rica",
        "Croatia",
        "Cuba",
        "Curaçao",
        "Cyprus",
        "Czechia",
        "Côte d'Ivoire",
        "Denmark",
        "Djibouti",
        "Dominica",
        "Dominican Republic",
        "Ecuador",
        "Egypt",
        "El Salvador",
        "Equatorial Guinea",
        "Eritrea",
        "Estonia",
        "Eswatini",
        "Ethiopia",
        "Falkland Islands[Malvinas]",
        "Faroe Islands",
        "Fiji",
        "Finland",
        "France",
        "French Guiana",
        "French Polynesia",
        "French Southern Territories",
        "Gabon",
        "Gambia",
        "Georgia",
        "Germany",
        "Ghana",
        "Gibraltar",
        "Greece",
        "Greenland",
        "Grenada",
        "Guadeloupe",
        "Guam",
        "Guatemala",
        "Guernsey",
        "Guinea",
        "Guinea-Bissau",
        "Guyana",
        "Haiti",
        "Heard Island and McDonald Islands",
        "Holy See",
        "Honduras",
        "Hong Kong",
        "Hungary",
        "Iceland",
        "India",
        "Indonesia",
        "Iran (Islamic Republic of)",
        "Iraq",
        "Ireland",
        "Isle of Man",
        "Israel",
        "Italy",
        "Jamaica",
        "Japan",
        "Jersey",
        "Jordan",
        "Kazakhstan",
        "Kenya",
        "Kiribati",
        "Korea (the Democratic People's Republic of)",
        "Korea (the Republic of)",
        "Kuwait",
        "Kyrgyzstan",
        "Lao People's Democratic Republic",
        "Latvia",
        "Lebanon",
        "Lesotho",
        "Liberia",
        "Libya",
        "Liechtenstein",
        "Lithuania",
        "Luxembourg",
        "Macao",
        "Madagascar",
        "Malawi",
        "Malaysia",
        "Maldives",
        "Mali",
        "Malta",
        "Marshall Islands",
        "Martinique",
        "Mauritania",
        "Mauritius",
        "Mayotte",
        "Mexico",
        "Micronesia (Federated States of)",
        "Moldova (the Republic of)",
        "Monaco",
        "Mongolia",
        "Montenegro",
        "Montserrat",
        "Morocco",
        "Mozambique",
        "Myanmar",
        "Namibia",
        "Nauru",
        "Nepal",
        "Netherlands",
        "New Caledonia",
        "New Zealand",
        "Nicaragua",
        "Niger",
        "Nigeria",
        "Niue",
        "Norfolk Island",
        "Northern Mariana Islands",
        "Norway",
        "Oman",
        "Pakistan",
        "Palau",
        "Palestine, State of",
        "Panama",
        "Papua New Guinea",
        "Paraguay",
        "Peru",
        "Philippines",
        "Pitcairn",
        "Poland",
        "Portugal",
        "Puerto Rico",
        "Qatar",
        "Republic of North Macedonia",
        "Romania",
        "Russian Federation",
        "Rwanda",
        "Réunion",
        "Saint Barthélemy",
        "Saint Helena, Ascension and Tristan da Cunha",
        "Saint Kitts and Nevis",
        "Saint Lucia",
        "Saint Martin (French part)",
        "Saint Pierre and Miquelon",
        "Saint Vincent and the Grenadines",
        "Samoa",
        "San Marino",
        "Sao Tome and Principe",
        "Saudi Arabia",
        "Senegal",
        "Serbia",
        "Seychelles",
        "Sierra Leone",
        "Singapore",
        "Sint Maarten (Dutch part)",
        "Slovakia",
        "Slovenia",
        "Solomon Islands",
        "Somalia",
        "South Africa",
        "South Georgia and the South Sandwich Islands",
        "South Sudan",
        "Spain",
        "Sri Lanka",
        "Sudan",
        "Suriname",
        "Svalbard and Jan Mayen",
        "Sweden",
        "Switzerland",
        "Syrian Arab Republic",
        "Taiwan",
        "Tajikistan",
        "Tanzania, United Republic of",
        "Thailand",
        "Timor-Leste",
        "Togo",
        "Tokelau",
        "Tonga",
        "Trinidad and Tobago",
        "Tunisia",
        "Turkey",
        "Turkmenistan",
        "Turks and Caicos Islands",
        "Tuvalu",
        "Uganda",
        "Ukraine",
        "United Arab Emirates",
        "United Kingdom of Great Britain and Northern Ireland",
        "United States Minor Outlying Islands",
        "United States of America",
        "Uruguay",
        "Uzbekistan",
        "Vanuatu",
        "Venezuela (Bolivarian Republic of)",
        "Viet Nam",
        "Virgin Islands (British)",
        "Virgin Islands (U.S.)",
        "Wallis and Futuna",
        "Western Sahara",
        "Yemen",
        "Zambia",
        "Zimbabwe",
        "Åland Islands",
      ],
    };
  },
  methods: {
    SaveChanges() {
      let user_id = this.$store.state["UserInfo"]["user_id"];
      let main = this;
      this.v$.$validate();
      if (!this.v$.$error) {
        axios
          .post(this.ApiUrl, {
            api_name: "updateuserinfo",
            user_id: user_id,
            user_country: main.UserInfo["user_country"],
            user_phone: main.UserInfo["user_phone"],
            user_age: main.UserInfo["user_age"],
            user_gender: main.UserInfo["user_gender"],
          })
          .then(function (res) {
            main.$swal.fire({
              icon: "success",
              title: "تم تعديل بياناتك بنجاح",
              position: "top-center",
              fontSize: "0.7rem",
              showConfirmButton: false,
              timerProgressBar: true,
              timer: 2000,
            });
          });
      }
    },
  },
  validations() {
    return {
      UserInfo: {
        user_name: {
          required: helpers.withMessage("من فضلك ادخل اسم المستخدم", required),
          minLength: helpers.withMessage(
            "يجب الا يقل اسم المستخدم عن 4 حروف",
            minLength(4)
          ),
          maxLength: helpers.withMessage(
            "يجب الا يزيد اسم المستخدم عن 20 حرف",
            maxLength(20)
          ),
        },
        user_country: {
          required: helpers.withMessage("من فضلك ادخل اسم الدولة", required),
        },
        user_phone: {
          required: helpers.withMessage("من فضلك ادخل رقم الهاتف", required),
        },
        user_age: {
          required: helpers.withMessage("من فضلك ادخل العمر", required),
          minValue: helpers.withMessage(
            "يجب الا يقل عمر المستخدم عن 18 عام",
            minValue(18)
          ),
          maxValue: helpers.withMessage(
            "يجب الا يزيد عمر المستخدم عن 70 عام",
            maxValue(70)
          ),
        },
        user_gender: {
          required: helpers.withMessage("من فضلك ادخل النوع", required),
        },
      },
    };
  },
  watch: {},
  created() {
    let main = this;
    $(window).resize(function () {
      main.CurrentWidth = window.innerWidth;
    });
    $("body").on("keydown", "#user_name", function (e) {
      let data_Chrs = [];
      let val = $(this).val();
      data_Chrs = val;
      let x = e.which || e.KeyCode;
      if (x == 32) {
        if (val.length == 0) {
          e.preventDefault();
        }
        if (data_Chrs[val.length - 1] !== undefined) {
          if (data_Chrs[val.length - 1].trim() == "") {
            e.preventDefault();
          }
        }
      }
      if (e.key) {
        if (
          !e.key.match(
            /[AaBbCcDdEeFfGgHhIiJjKkLlMmNnOoPpQqRrSsTtUuVvWwXxYyZa 0123456789]/
          )
        ) {
          e.preventDefault();
        }
        return this;
      }
    });
  },
  mounted() {
    let main = this;
    let user_id = this.$store.state["UserInfo"]["user_id"];
    axios
      .post(this.ApiUrl, {
        api_name: "getuserinfo",
        user_id: user_id,
      })
      .then(function (res) {
        main.UserInfo = res.data;
      });
  },
};
</script>

<style lang="scss">
#UserInfo {
  display: flex;
  flex-direction: column;
  flex-wrap: nowrap;
  align-content: center;
  justify-content: center;
  align-items: center;
  table {
    font-size: 1rem;
    text-align: center;
    thead {
      th {
        font-weight: 600;
      }
    }
    tbody {
      th {
        font-weight: 600;
      }
    }
  }
  .AllErrors {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    align-content: center;
    justify-content: center;
    align-items: center;
  }
}
</style>
