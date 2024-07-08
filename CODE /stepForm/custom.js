// Sorted alphabetical by country name (special characters on bottom)
const countryList = [
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
  "Bahamas (the)",
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
  "Cocos (Keeling) Islands",
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
  "Falkland Islands (the) [Malvinas]",
  "Faroe Islands",
  "Fiji",
  "Finland",
  "France",
  "French Guiana",
  "French Polynesia",
  "French Southern Territories (the)",
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
  "Sudan (the)",
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
];
var selectbox;
const form = document.getElementById("ct_form"),
  step_el = document.querySelectorAll(".step_box"),
  prg_box = document.querySelector(".prg_box"),
  step_action = document.querySelector(".step_action"),
  select = document.getElementById("cntry_select"),
  formMsg = document.getElementById("form_msg");
var step_flag = 0,
  goNext = true,
  stepSkip = false;
const validEmailRegex =
    /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i,
  validPhoneRegex = /\d$/g;

if (select != null || select != undefined) {
  countryList.forEach((ev) => {
    let opt = document.createElement("option");
    opt.value = ev;
    opt.innerHTML = ev;
    select.appendChild(opt);
  });
  selectbox = new Choices(select, {
    duplicateItemsAllowed: false,
    searchPlaceholderValue: "Search Country",
    // addItems: false,
    removeItems: false,
    allowHTML: true,
  });
  selectbox.passedElement.element.addEventListener("change", () => {
    step_flag = step_flag + 1;
    goNext = true;
    showHideStep();
  });
}

function init_step() {
  document.querySelector(".all_step").style.display = "block";
  step_action.querySelector(".prev_step").style.display = "block";
  formMsg.style.display = "none";
  prg_box.querySelector("span").style.width = "0%";
  fadeIn(step_el[0]);
}
function reset_step() {
  step_flag = 0;
  goNext = true;
  stepSkip = false;
  step_el[step_el.length - 1].classList.remove("active");
  step_el[0].classList.add("active");
}

function fadeOut(element) {
  element.style.display = "none";
  element.style.opacity = 0;
  // var op = 1; // initial opacity
  // var timer = setInterval(function () {
  //   if (op <= 0.1) {
  //     clearInterval(timer);
  //     element.style.display = "none";
  //   }
  //   element.style.opacity = op;
  //   element.style.filter = "alpha(opacity=" + op * 100 + ")";
  //   op -= op * 0.1;
  // }, 20);
}
function fadeIn(element) {
  var op = 0.1; // initial opacity
  element.style.display = "block";
  var timer = setInterval(function () {
    if (op >= 1) {
      clearInterval(timer);
    }
    element.style.opacity = op;
    element.style.filter = "alpha(opacity=" + op * 100 + ")";
    op += op * 0.1;
  }, 15);
}

const input = document.getElementById("phone");
if (input != null || input != undefined) {
  const outer_inp = input.closest(".step_col");
  const new_msg = document.createElement("span");
  new_msg.classList.add("error");
  outer_inp.appendChild(new_msg);

  const errorMap = [
    "This field is required",
    "Invalid country code",
    "Too short",
    "Too long",
    "Invalid number",
  ];
  const inpMsg = outer_inp.querySelector(".error");

  let iti = window.intlTelInput(input, {
    allowDropdown: true,
    autoInsertDialCode: true,
    autoPlaceholder: "polite",
    //dropdownContainer: "body",
    // excludeCountries: ["us"],
    formatOnDisplay: true,
    geoIpLookup: function (callback) {
      fetch("https://ipapi.co/json")
        .then(function (res) {
          return res.json();
        })
        .then(function (data) {
          callback(data.country_code);
        })
        .catch(function () {
          callback("us");
        });
    },
    hiddenInput: "full_number",
    initialCountry: "auto",
    nationalMode: false,
    placeholderNumberType: "MOBILE",
    separateDialCode: true,
    showFlags: true,
    utilsScript:
      "https://cdn.jsdelivr.net/npm/intl-tel-input@18.2.1/build/js/utils.js",
  });
  const inp_reset = () => {
    inpMsg.classList.remove("show");
  };
  input.addEventListener("keyup", () => {
    inp_reset();
    let inp_val = input.value.trim();
    if (inp_val && inp_val.match(validPhoneRegex)) {
      if (iti.isValidNumber()) {
        inpMsg.classList.remove("show");
      } else {
        inpMsg.innerHTML = errorMap[iti.getValidationError()];
        inpMsg.classList.add("show");
      }
    } else {
      input.value = "";
    }
  });
}

init_step();
if (step_el != null || step_el != undefined) {
  step_el.forEach((el, i) => {
    let btn = el.querySelectorAll(".stp_nxt");
    if (btn != null || btn != undefined) {
      btn.forEach((btl) => {
        btl.addEventListener("click", function (m) {
          if (m.target.type != "radio") {
            m.preventDefault();
          }
          if (step_flag > step_el.length - 1) {
            step_flag = step_el.length - 1;
          }

          //final checking of input
          // console.log(step_flag);
          let inps = step_el[step_flag].querySelectorAll(".inp_nxt");
          let e_flag = 0;
          if (inps != null || inps != undefined) {
            inps.forEach((e) => {
              if (e.getAttribute("validate")) {
                e.closest(".step_col")
                  .querySelector(".error")
                  .classList.remove("show");
                e_flag++;
              } else {
                goNext = false;
                e.closest(".step_col")
                  .querySelector(".error")
                  .classList.add("show");
              }
            });
          }
          if (e_flag == inps.length) {
            goNext = true;
          }
          if (goNext || this.value) {
            step_flag = step_flag + 1;

            if (step_flag == 2 && this.value === "yes") {
              stepSkip = true;
              step_flag = step_flag + 1;
              selectbox.setValue(["United States of America"]);
            }
            if (step_flag == 2 && this.value === "no") {
              stepSkip = false;
            }

            if (step_flag > step_el.length - 1 && goNext) {
              document.querySelector(".all_step").style.display = "none";
              step_action.querySelector(".prev_step").style.display = "none";
              formMsg.style.display = "block";
              prg_box.querySelector("span").style.width = "100%";
              setTimeout(() => {
                form.submit();
              }, 100);
              setTimeout(reset_step, 200);
            }

            if (step_flag < step_el.length) {
              showHideStep();
            }
          }
        });
      });
    }

    //input box validation
    let inp = el.querySelectorAll(".inp_nxt");
    if (inp != null || inp != undefined) {
      inp.forEach((inpst) => {
        inpst.addEventListener("blur", validateData);
        inpst.addEventListener("change", validateData);
        inpst.addEventListener("input", validateData);
      });
    }
  });
}

function validateData(ev) {
  // console.log(ev.target.value);
  if (ev.target.value && ev.target.value.length) {
    let valid = true;
    if (ev.target.type == "email" && !ev.target.value.match(validEmailRegex)) {
      valid = false;
    }
    if (ev.target.type == "tel") {
      if (
        ev.target.value.length < 6 ||
        ev.target.value.length > 11 ||
        !ev.target.value.match(validPhoneRegex)
      ) {
        valid = false;
      }
    }
    if (valid) {
      ev.target
        .closest(".step_col")
        .querySelector(".error")
        .classList.remove("show");
      ev.target.setAttribute("validate", "true");
    } else {
      ev.target
        .closest(".step_col")
        .querySelector(".error")
        .classList.add("show");
      ev.target.removeAttribute("validate");
    }
  } else {
    ev.target
      .closest(".step_col")
      .querySelector(".error")
      .classList.add("show");
    ev.target.removeAttribute("validate");
  }
}

//back btn
if (step_action != null || step_action != undefined) {
  step_action
    .querySelector(".prev_step")
    .addEventListener("click", function (e) {
      e.preventDefault();
      step_flag--;
      if (step_flag < 0) {
        step_flag = 0;
      }
      if (stepSkip && step_flag == 2) {
        step_flag--;
      }
      showHideStep("back");
    });
}
//show-hide step
function showHideStep(direction) {
  prg_box.querySelector("span").style.width =
    (100 / step_el.length) * step_flag + "%";

  if (step_flag == 0) {
    prg_box.style.display = "none";
    step_action.style.display = "none";
  } else {
    prg_box.style.display = "block";
    step_action.style.display = "block";
  }
  step_el.forEach((w, i) => {
    if (i != step_flag) {
      w.classList.remove("active");
      fadeOut(w);
    }
  });
  // if (direction == "back") {
  //   step_el[step_flag].classList.add("active");
  // } else {
  step_el[step_flag].classList.add("active");
  fadeIn(step_el[step_flag]);
  // }
  goNext = false;
}
