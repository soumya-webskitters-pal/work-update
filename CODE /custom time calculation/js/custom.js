"use strict";

//// detect device orientation
function detect_orientation() {
  document.body.classList.remove("mobileLandscapeView");
  document.body.classList.remove("mobilePotraitView");
  document.body.classList.remove("smallView");

  if (window.outerWidth > window.outerHeight && window.outerWidth <= 767) {
    document.body.classList.add("mobileLandscapeView");
  }
  if (window.outerWidth < window.outerHeight && window.outerWidth <= 767) {
    document.body.classList.add("mobilePotraitView");
  }
  if (window.outerHeight <= 360) {
    document.body.classList.add("smallView");
  }
}

detect_orientation();
window.addEventListener("orientationchange", detect_orientation);

// window.addEventListener("orientationchange", function() {
//     console.log(screen.orientation);
//     location.reload();
// }, false);

//// Detect Safari
if (
  navigator.userAgent.indexOf("Safari") > -1 &&
  navigator.userAgent.indexOf("Chrome") <= -1
) {
  document.body.classList.add("SafariBrowser");
}

const iOS = /^iP/.test(navigator.platform);
if (iOS) {
  document.body.classList.add("iphone");
} else {
  document.body.classList.add("android");
}

//// reset scroll position:
window.history.scrollRestoration = "manual";
window.scrollTo(0, 0);

// //// prevent from scroll
// document.addEventListener('wheel', preventScroll, { passive: false });

// function preventScroll(e) {
//     e.preventDefault();
//     e.stopPropagation();
//     return false;
// }

//// check if the device is mobile or not
if (
  /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  )
) {
  // console.log("mobile device");
} else {
  // console.log("not mobile device");
}

function checkElements(els) {
  var element = document.querySelector(els);
  if (typeof element != "undefined" && element != null) {
    return true;
  } else {
    return false;
  }
}

///toggle mobile search box
if (checkElements("#m_srch_trigger")) {
  document
    .getElementById("m_srch_trigger")
    .addEventListener("click", function () {
      if (this.classList.contains("active")) {
        this.classList.remove("active");
        document
          .getElementById("m_srch_trigger_box")
          .classList.remove("active");
      } else {
        this.classList.add("active");
        document.getElementById("m_srch_trigger_box").classList.add("active");
      }
    });
}

// mobile toggle navigation
if (checkElements("#hamburger_menu")) {
  document
    .getElementById("hamburger_menu")
    .addEventListener("click", function () {
      if (this.classList.contains("active")) {
        this.classList.remove("active");
        document.getElementById("navigation").classList.remove("active");
        document.getElementById("menu_overlay").classList.remove("active");
        document.body.classList.remove("open_menu");
      } else {
        this.classList.add("active");
        document.getElementById("navigation").classList.add("active");
        document.getElementById("menu_overlay").classList.add("active");
        document.body.classList.add("open_menu");
      }
    });

  document
    .getElementById("menu_overlay")
    .addEventListener("click", function () {
      document.getElementById("hamburger_menu").classList.remove("active");
      document.getElementById("navigation").classList.remove("active");
      document.getElementById("menu_overlay").classList.remove("active");
      document.body.classList.remove("open_menu");
    });
}

///toggle notification
if (checkElements("#nof_btn")) {
  document.getElementById("nof_btn").addEventListener("click", function () {
    // let overlay;
    if (this.classList.contains("active")) {
      this.classList.remove("active");
      this.nextElementSibling.classList.remove("active");
    } else {
      this.classList.add("active");
      this.nextElementSibling.classList.add("active");
    }
  });
  window.addEventListener("mouseup", function (event) {
    let pol = document.getElementById("nof_btn");
    if (event.target != pol && event.target.parentNode != pol) {
      pol.classList.remove("active");
      pol.nextElementSibling.classList.remove("active");
    }
  });
}

///dashboard chart1
if (checkElements("#chart0")) {
  new ApexCharts(document.getElementById("chart0"), {
    series: [
      {
        name: "Revenue",
        data: [31, 40, 28, 51, 42, 109, 100, 85, 44, 56, 95],
      },
    ],
    chart: {
      type: "area",
      height: 225,
      redrawOnParentResize: true,
      redrawOnWindowResize: true,
      toolbar: {
        show: false,
      },
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      curve: "smooth",
      width: 3,
      fill: "#00E396",
    },

    xaxis: {
      type: "date",
      tickAmount: 11,
      categories: [
        "Sep 1st",
        "Sep 4th",
        "Sep 7th",
        "Sep 10th",
        "Sep 13th",
        "Sep 16th",
        "Sep 19th",
        "Sep 21th",
        "Sep 24th",
        "Sep 27th",
        "Sep 30th",
      ],
      labels: {
        show: true,
        rotate: 0,
        // trim: true,
        style: {
          colors: "#000000",
          fontSize: "12px",
          fontFamily: "Cabin, sans-serif",
          fontWeight: 600,
        },
      },
    },
    yaxis: {
      tickAmount: 5,
      labels: {
        show: true,
        style: {
          colors: "#000000",
          fontSize: "12px",
          fontFamily: "Cabin, sans-serif",
          fontWeight: 600,
        },
      },
    },
    tooltip: {
      x: {
        format: "dd/MM/yy",
      },
    },
    yaxis: {
      title: {
        text: "$",
        style: {
          color: "#525050",
          fontSize: "20px",
          fontFamily: "Cabin, sans-serif",
          fontWeight: 600,
        },
      },
    },
    fill: {
      opacity: 1,
      colors: ["#00E396", "#fff"],
      gradient: {
        shade: "light",
        type: "vertical",
        shadeIntensity: 0.5,
        gradientToColors: undefined,
        inverseColors: true,
        opacityFrom: 0.7,
        opacityTo: 0.2,
      },
    },
    responsive: [
      {
        breakpoint: 1600,
        options: {},
      },
    ],
  }).render();
}

///dashboard chart2
if (checkElements("#chart1")) {
  new ApexCharts(document.getElementById("chart1"), {
    series: [
      {
        name: "Approved",
        data: [44, 55, 57, 56, 61, 58, 63, 60, 66, 45, 78, 30],
      },
      {
        name: "Rejected",
        data: [76, 85, 101, 98, 87, 105, 91, 114, 94, 56, 12, 56],
      },
      {
        name: "Pending",
        data: [35, 41, 36, 26, 45, 48, 52, 53, 41, 95, 44, 85],
      },
    ],
    chart: {
      type: "bar",
      height: 400,
      redrawOnParentResize: true,
      redrawOnWindowResize: true,
      toolbar: {
        show: false,
      },
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: "55%",
        endingShape: "rounded",
        borderRadius: 12,
      },
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      show: false,
    },
    grid: {
      show: false,
    },
    xaxis: {
      categories: [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
      ],
      tickAmount: 12,
      labels: {
        show: true,
        rotate: 0,
        trim: true,
        style: {
          colors: "#000000",
          fontSize: "12px",
          fontFamily: "Cabin, sans-serif",
          fontWeight: 600,
        },
      },
      axisBorder: {
        show: false,
        color: "#456456",
        height: 1,
        width: "100%",
        offsetX: 0,
        offsetY: 0,
      },
    },
    yaxis: {
      tickAmount: 8,
      title: {
        text: "Per Month",
        style: {
          color: "#525050",
          fontSize: "20px",
          fontFamily: "Cabin, sans-serif",
          fontWeight: 600,
        },
      },
      labels: {
        show: true,
        style: {
          colors: "#000000",
          fontSize: "12px",
          fontFamily: "Cabin, sans-serif",
          fontWeight: 600,
        },
      },
    },
    fill: {
      opacity: 1,
      colors: ["#008FFB", "#90C1E7", "#D1E3F1"],
    },
    tooltip: {
      y: {
        formatter: function (val) {
          return "$ " + val + " thousands";
        },
      },
    },
    legend: {
      fontSize: "14px",
      fontFamily: "Cabin, sans-serif",
      fontWeight: 600,
      labels: {
        colors: "#525050",
      },
      markers: {
        fillColors: ["#008FFB", "#90C1E7", "#D1E3F1"],
        radius: 12,
      },
      itemMargin: {
        horizontal: 30,
        vertical: 0,
      },
    },
  }).render();
}

///dashboard new-line-chart
if (checkElements("#line1")) {
  new ApexCharts(document.getElementById("line1"), {
    series: [
      {
        name: "Pending Videos",
        data: [
          0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5,
          0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5,
          0.5, 0.5,
        ],
      },
      {
        name: "Approved Videos",
        data: [
          7, 8, 1, 7, 8, 5, 1, 4, 4, 5, 2, 6, 7, 8, 1, 8, 7, 5, 1, 4, 4, 6, 2,
          5, 2, 4, 4, 6, 2, 6,
        ],
      },
      {
        name: "Rejected Videos",
        data: [
          5, 4.5, 3, 6.2, 5, 8, 2, 3, 1.8, 5.5, 4, 8, 3, 4, 6, 6, 5, 4, 5, 3, 1,
          5, 4, 5, 2, 3, 1, 5, 4, 8,
        ],
      },
    ],
    chart: {
      type: "line",
      height: 300,
      redrawOnParentResize: true,
      redrawOnWindowResize: true,
      toolbar: {
        show: false,
      },
    },

    dataLabels: {
      enabled: false,
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: "55%",
        endingShape: "rounded",
        borderRadius: 12,
      },
    },
    stroke: {
      show: true,
      curve: "smooth",
      lineCap: "butt",
      width: 4,
      dashArray: 0,
    },
    grid: {
      borderColor: "#f1f1f1",
    },
    xaxis: {
      type: "datetime",
      categories: [
        "Nov 1",
        "Nov 2",
        "Nov 3",
        "Nov 4",
        "Nov 5",
        "Nov 6",
        "Nov 7",
        "Nov 8",
        "Nov 9",
        "Nov 10",
        "Nov 11",
        "Nov 12",
        "Nov 13",
        "Nov 14",
        "Nov 15",
        "Nov 16",
        "Nov 17",
        "Nov 18",
        "Nov 19",
        "Nov 20",
        "Nov 21",
        "Nov 22",
        "Nov 23",
        "Nov 24",
        "Nov 25",
        "Nov 26",
        "Nov 27",
        "Nov 28",
        "Nov 29",
        "Nov 30",
      ],
      tickAmount: 10,
      labels: {
        show: true,
        rotate: 0,
        trim: true,
        style: {
          colors: "#B1B1B1",
          fontSize: "7px",
          lineHeight: "1.5em",
          fontFamily: "Inter, sans-serif",
          fontWeight: 500,
        },
      },
      axisBorder: {
        show: false,
        color: "#456456",
        height: 1,
        width: "100%",
        offsetX: 0,
        offsetY: -2,
      },
    },
    yaxis: {
      tickAmount: 5,
      labels: {
        show: true,
        style: {
          colors: "#000000",
          fontSize: "13px",

          fontFamily: "Cabin, sans-serif",
          fontWeight: 600,
        },
      },
    },

    fill: {
      opacity: 1,
      colors: ["008FFB", "00E396", "FEB019"],
    },
    tooltip: {
      y: {
        formatter: function (val) {
          return "$ " + val + " thousands";
        },
      },
    },
    legend: {
      fontSize: "14px",
      fontFamily: "Cabin, sans-serif",
      fontWeight: 600,
      position: "top",
      labels: {
        colors: "#525050",
      },

      itemMargin: {
        horizontal: 10,
        vertical: 10,
      },
      tooltipHoverFormatter: function (val, opts) {
        return (
          val +
          " - " +
          opts.w.globals.series[opts.seriesIndex][opts.dataPointIndex] +
          ""
        );
      },
      markers: {
        size: 0,
        radius: 12,
        hover: {
          sizeOffset: 6,
        },
      },
    },
  }).render();
}

//// date picker
if (checkElements(".dateSelector")) {
  flatpickr(".dateSelector", {
    altInput: true,
    altFormat: "j F, Y",
    dateFormat: "Y/m/d",
  });
}

if (checkElements("#calender_range")) {
  flatpickr("#calender_range", {
    mode: "range",
    altInput: true,
    altFormat: "j F, Y",
    dateFormat: "Y/m/d",
    inline: true,
  });
}

// pass range value
if (checkElements("#apply_range")) {
  document.getElementById("calender_range_value").value =
    document.getElementById("calender_range").value;
  document.getElementById("apply_range").addEventListener("click", function () {
    document.getElementById("calender_range_value").value =
      document.getElementById("calender_range").value;
    document.getElementById("calender_range_toggle").classList.remove("active");
  });
}

// clear range value
if (checkElements("#range_clear")) {
  document.getElementById("range_clear").addEventListener("click", function () {
    document.getElementById("calender_range").value = "";
    document.querySelector(".calender_range input[readonly='readonly']").value =
      "";
    document.getElementById("calender_range_value").value =
      document.getElementById("calender_range").value;
    document.getElementById("calender_range_toggle").classList.remove("active");

    document.querySelectorAll(".flatpickr-day").forEach((el) => {
      el.classList.remove("startRange");
      el.classList.remove("selected");
      el.classList.remove("inRange");
      el.classList.remove("endRange");
    });
  });
}

// toggle calender wrapper
if (checkElements("#calender_range_value")) {
  document
    .getElementById("calender_range_value")
    .addEventListener("click", function () {
      // this.classList.add("active");
      document.getElementById("calender_range_toggle").classList.add("active");
    });
}
// Hide calender when clicked outside
if (checkElements("#calender_range_toggle")) {
  window.addEventListener("mouseup", function (e) {
    var calender_range_toggle = document.getElementById(
      "calender_range_toggle"
    );
    if (!calender_range_toggle.contains(e.target)) {
      calender_range_toggle.classList.remove("active");
    }
  });
}

////// custom tab
if (checkElements("[data-tab-target]")) {
  document.querySelectorAll("[data-tab-target]").forEach(function (el) {
    let el_btns = el.querySelectorAll("li>a");
    el_btns.forEach(function (el_btn, el_index) {
      el_btn.addEventListener("click", function () {
        el_btns.forEach(function (e) {
          e.classList.remove("active");
        });
        this.classList.add("active");
        let tab_name = this.parentElement.parentElement.dataset.tabTarget;
        let pr_panel_el_parent = document.querySelectorAll(
          "[data-tab-parent='" + tab_name + "']"
        );
        pr_panel_el_parent.forEach(function (el_each) {
          let pr_panel_el = el_each.querySelectorAll(".tab_panel");
          pr_panel_el.forEach(function (e) {
            e.style.display = "none";
            e.classList.remove("active");
          });
          pr_panel_el[el_index].style.display = "block";
          pr_panel_el[el_index].classList.add("active");
        });
      });
    });
  });
}

//// list and grid view
if (
  checkElements("#list_view") &&
  checkElements("#grid_view") &&
  checkElements(".view_box")
) {
  //list view
  document.getElementById("list_view").addEventListener("click", function () {
    document.getElementById("grid_view").classList.remove("active");
    document.querySelector(".grid_view_box").classList.remove("active_view");
    this.classList.add("active");
    document.querySelector(".list_view_box").classList.add("active_view");
  });

  //grid view
  document.getElementById("grid_view").addEventListener("click", function () {
    document.getElementById("list_view").classList.remove("active");
    document.querySelector(".list_view_box").classList.remove("active_view");
    this.classList.add("active");
    document.querySelector(".grid_view_box").classList.add("active_view");
    skeletons_v4();
  });
}

////tooltips
if (checkElements("[data-tip]")) {
  let exampleEl = document.querySelectorAll("[data-bs-toggle='tooltip']");
  exampleEl.forEach(function (each_tp) {
    let tooltip = new bootstrap.Tooltip(each_tp, {
      fallbackPlacements: ["top", "bottom"],
    });
    //tooltip.show()
  });
}

// simple inline popup
if (checkElements("[data-pop-block]")) {
  document
    .querySelectorAll("[data-pop-block]")
    .forEach(function (each_el_pop, index) {
      let this_val = each_el_pop.dataset.popBlock;
      each_el_pop
        .querySelector("[data-btn='" + this_val + "']")
        .addEventListener("click", function () {
          this.classList.add("not-allowed");
          each_el_pop.querySelector(
            "[data-modal='" + this_val + "']"
          ).style.display = "block";
          each_el_pop
            .querySelector("[data-modal='" + this_val + "']")
            .classList.add("active");
          each_el_pop.querySelector("[data-text='" + this_val + "']").value =
            "";
          if (each_el_pop.classList.contains("data-goto")) {
            setTimeout(() => {
              document
                .querySelectorAll(".modal")[0]
                .scrollTo(
                  0,
                  each_el_pop
                    .querySelector("[data-cancel='" + this_val + "']")
                    .getBoundingClientRect().y + 1000
                );
            }, 100);
          }
        });
      each_el_pop
        .querySelector("[data-cancel='" + this_val + "']")
        .addEventListener("click", function () {
          each_el_pop
            .querySelector("[data-btn='" + this_val + "']")
            .classList.remove("not-allowed");
          each_el_pop.querySelector(
            "[data-modal='" + this_val + "']"
          ).style.display = "none";
          each_el_pop
            .querySelector("[data-modal='" + this_val + "']")
            .classList.remove("active");
        });
    });
}

// remove notification
if (checkElements("[data-notify-close]")) {
  document.querySelectorAll("[data-notify-close]").forEach(function (elt) {
    let parent = elt.closest(".notify_list"),
      parent2 = parent.closest(".box_model_notification");
    elt.addEventListener("click", function () {
      this.parentElement.remove();
      setTimeout(() => {
        if (parent.children.length <= 0) {
          parent.closest(".per_day_notif").remove();
          if (parent2.children.length <= 0) {
            let node = document.createElement("div");
            node.classList.add("no_data_found");

            let nodeIconWrap = document.createElement("div");
            nodeIconWrap.classList.add("iconwrap");
            node.appendChild(nodeIconWrap);
            let nodeIcon = document.createElement("img");
            nodeIcon.src = "images/no-found.png";

            // nodeIcon.classList.add("far");
            // nodeIcon.classList.add("fa-smile-beam");
            nodeIconWrap.appendChild(nodeIcon);

            let textNodeElement = document.createElement("h3");
            let textnode = document.createTextNode("Oops!");
            textNodeElement.appendChild(textnode);
            node.appendChild(textNodeElement);

            let textNodePara = document.createElement("p");
            let textNodeParaInfo = document.createTextNode("No data found");
            textNodePara.appendChild(textNodeParaInfo);
            node.appendChild(textNodePara);

            parent2.appendChild(node);
          }
        }
      }, 50);
    });
  });
}

//custom dropdown
if (checkElements(".selectize")) {
  document.querySelectorAll(".selectize").forEach(function (select) {
    NiceSelect.bind(select);
  });
  // document.querySelectorAll("[data-dropdown]").forEach(function (eel) {
  //     eel.querySelectorAll(".dropdown-menu li a").forEach(function (els) {
  //         els.addEventListener("click", function () {
  //             eel.querySelector("[data-bs-toggle]").innerText = this.innerText;
  //         });
  //     })
  // });
}

//chnage profile image
if (checkElements("[data-profile-image]")) {
  document.querySelectorAll("[data-profile-image]").forEach(function (eel) {
    eel
      .querySelector("input[type='file']")
      .addEventListener("change", function (e) {
        eel.querySelector("img").src = URL.createObjectURL(e.target.files[0]);
      });
  });
}

// show file name
if (checkElements("#inquiry_file")) {
  function bytesToSize(bytes) {
    const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
    if (bytes === 0) return "n/a";
    const i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)), 10);
    if (i === 0) return `${bytes} ${sizes[i]}`;
    return `${(bytes / 1024 ** i).toFixed(1)} ${sizes[i]}`;
  }
  document.getElementById("uploaded_file_info").style.visibility = "hidden";
  document
    .getElementById("inquiry_file")
    .addEventListener("change", function (e) {
      document.getElementById("uploaded_file_info").style.visibility =
        "visible";
      document.querySelector(".file_name").innerHTML = e.target.files[0].name;
      document.querySelector(".file_size").innerHTML = bytesToSize(
        e.target.files[0].size
      );
    });
  document.getElementById("file_del").addEventListener("click", function () {
    document.getElementById("inquiry_file").value = "";
    document.querySelector(".file_name").innerHTML = "";
    document.querySelector(".file_size").innerHTML = "";
    document.getElementById("uploaded_file_info").style.visibility = "hidden";
  });
}

//editable input
if (checkElements("[data-editable]")) {
  document.querySelectorAll("[data-editable]").forEach(function (exl) {
    exl.querySelector("[data-edit]").addEventListener("click", function (e) {
      this.classList.add("hide");
      exl.querySelector("[data-save]").classList.remove("hide");
      exl.querySelectorAll(".data-input").forEach(function (ee) {
        ee.disabled = false;
        ee.focus();
        ee.classList.remove("disabled");
      });
    });
    exl.querySelector("[data-save]").addEventListener("click", function (e) {
      this.classList.add("hide");
      exl.querySelector("[data-edit]").classList.remove("hide");
      exl.querySelectorAll(".data-input").forEach(function (ee) {
        ee.disabled = true;
        ee.classList.add("disabled");
      });
    });
  });
}

// Mask Password With Asterisk While Typing
if (checkElements("[data-mask]")) {
  document.querySelectorAll("[data-mask]").forEach(function (ee) {
    let esl = ee.querySelector("input[type='password']");
    for (let i = 0; i < esl.value.length; i++) {
      esl.nextElementSibling.innerHTML = "*" + esl.nextElementSibling.innerHTML;
    }
    esl.addEventListener("keyup", (q) => {
      const dummyText = Array(q.target.value.length).fill("*").join("");
      q.target.nextElementSibling.innerHTML = dummyText;
    });
  });
}

// alert when acknowledge video
var handleAcknowledge = () => {
  swal({
    title: "Successfully Saved!",
    icon: "success",
    button: "Ok",
  });
};

// skeletons effect
if (checkElements(".skeleton")) {
  const skeletons = document.querySelectorAll(".skeleton");
  skeletons.forEach((skeletonem) => {
    setTimeout(() => {
      skeletonem.classList.remove("skeleton");
    }, 4000);
  });
}

// skeletons effect
function skeletons_v1() {
  if (checkElements(".all .skeleton_v1")) {
    const skeletons = document.querySelectorAll(".all .skeleton_v1");
    skeletons.forEach((skeletonem) => {
      setTimeout(() => {
        skeletonem.classList.remove("skeleton_v1");
      }, 4000);
    });
  }
}

function skeletons_v2() {
  if (checkElements(".appr .skeleton_v1")) {
    const skeletons = document.querySelectorAll(".appr .skeleton_v1");
    skeletons.forEach((skeletonem) => {
      setTimeout(() => {
        skeletonem.classList.remove("skeleton_v1");
      }, 4000);
    });
  }
}

function skeletons_v3() {
  if (checkElements(".rec .skeleton_v1")) {
    const skeletons = document.querySelectorAll(".rec .skeleton_v1");
    skeletons.forEach((skeletonem) => {
      setTimeout(() => {
        skeletonem.classList.remove("skeleton_v1");
      }, 4000);
    });
  }
}

function skeletons_v4() {
  if (checkElements(".grid_view_box_selection .skeleton_v1")) {
    const skeletons = document.querySelectorAll(
      ".grid_view_box_selection .skeleton_v1"
    );
    skeletons.forEach((skeletonem) => {
      setTimeout(() => {
        skeletonem.classList.remove("skeleton_v1");
      }, 4000);
    });
  }
}

skeletons_v1();

if (checkElements(".nav_tab_selecton")) {
  document
    .getElementById("nav_tab_selecton_all")
    .addEventListener("click", function () {
      skeletons_v1();
    });

  document
    .getElementById("nav_tab_selecton_appr")
    .addEventListener("click", function () {
      skeletons_v2();
    });

  document
    .getElementById("nav_tab_selecton_rej")
    .addEventListener("click", function () {
      skeletons_v3();
    });
}

// password controller
// function handlePasswordController(e) {
//     var element = document.querySelector(e);
//     console.log(element);
//     if (this.classList.contains("active")) {
//         this.classList.remove("active");
//     }
//     else {
//         this.classList.add("active");
//     }

// }

if (checkElements("[data-toggle-password]")) {
  document.querySelectorAll("[data-toggle-password]").forEach(function (el) {
    let togglePasswordBtns = el.querySelectorAll(".toggle_open_eye");
    let togglePasswordFields = el.childNodes[3];
    togglePasswordBtns.forEach(function (togglePasswordBtn) {
      togglePasswordBtn.addEventListener("click", function () {
        // console.log(togglePasswordFields);
        togglePasswordBtns.forEach(function (e) {
          if (e.classList.contains("active")) {
            e.classList.remove("active");
            togglePasswordFields.setAttribute("type", "password");
          } else {
            e.classList.add("active");
            togglePasswordFields.setAttribute("type", "text");
          }
        });
      });
    });
  });
}

const headers = document.getElementsByClassName("accordion-toggle");
const contents = document.getElementsByClassName("nesting-menu");

for (let i = 0; i < headers.length; i++) {
  headers[i].addEventListener("click", () => {
    for (let j = 0; j < contents.length; j++) {
      if (i == j) {
        contents[j].style.display =
          contents[j].style.display == "block" ? "none" : "block";
      } else {
        contents[j].style.display = "none";
      }
    }
  });
}

//////////s.p---*/
////range date picker
if (checkElements("#unique_date_sec")) {
  const mainSet_val = document.getElementById("dateSelectorRangeInline"),
    quickpicker = document.getElementById("quick_pik"),
    showValFromDatePicker = document.getElementById("picker_dtd");
  const qSelect = quickpicker.querySelector(".selectize_quick");
  const print_date = quickpicker.querySelector(".date_range_p");

  const qSelect_sl = NiceSelect.bind(qSelect);

  function dateRangePickerInit(tr) {
    const dt_pickers = new Lightpick({
      field: mainSet_val,
      singleDate: false,
      footer: true,
      tooltipNights: true,
      format: "DD/MM/YYYY",
      onOpen: () => {
        setMonth();
      },
      locale: {
        buttons: {
          prev: '<svg width="8" height="14" viewBox="0 0 8 14" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M0.500195 7.7998L6.2002 13.3998C6.6002 13.7998 7.2002 13.7998 7.6002 13.3998C8.0002 12.9998 8.0002 12.3998 7.6002 11.9998L2.7002 6.9998L7.6002 1.9998C8.0002 1.5998 8.0002 0.999804 7.6002 0.599804C7.4002 0.399804 7.2002 0.299805 6.9002 0.299805C6.60019 0.299805 6.4002 0.399804 6.2002 0.599804L0.500195 6.1998C0.100195 6.6998 0.100195 7.2998 0.500195 7.7998C0.500195 7.6998 0.500195 7.6998 0.500195 7.7998Z" fill="currentColor"/></svg>',
          next: '<svg width="8" height="14" viewBox="0 0 8 14" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M7.54023 6.29004L1.88023 0.640037C1.78726 0.546308 1.67666 0.471914 1.5548 0.421145C1.43294 0.370377 1.30224 0.344238 1.17023 0.344238C1.03821 0.344238 0.907509 0.370377 0.785649 0.421145C0.66379 0.471914 0.553189 0.546308 0.460226 0.640037C0.273975 0.827399 0.169434 1.08085 0.169434 1.34504C0.169434 1.60922 0.273975 1.86267 0.460226 2.05004L5.41023 7.05004L0.460226 12C0.273975 12.1874 0.169434 12.4409 0.169434 12.705C0.169434 12.9692 0.273975 13.2227 0.460226 13.41C0.552841 13.5045 0.663286 13.5797 0.785161 13.6312C0.907036 13.6827 1.03792 13.7095 1.17023 13.71C1.30253 13.7095 1.43342 13.6827 1.55529 13.6312C1.67717 13.5797 1.78761 13.5045 1.88023 13.41L7.54023 7.76004C7.64173 7.66639 7.72274 7.55274 7.77815 7.42624C7.83355 7.29974 7.86216 7.16314 7.86216 7.02504C7.86216 6.88693 7.83355 6.75033 7.77815 6.62383C7.72274 6.49733 7.64173 6.38368 7.54023 6.29004Z" fill="currentColor"/></svg>',
          close:
            '<svg width="11" height="11" viewBox="0 0 11 11" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M5.5 10C7.975 10 10 7.975 10 5.5C10 3.025 7.975 1 5.5 1C3.025 1 1 3.025 1 5.5C1 7.975 3.025 10 5.5 10Z" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"></path><path d="M4.22705 6.7832L6.77263 4.23762" stroke="currentColor" stroke-width="0.8" stroke-linecap="round" stroke-linejoin="round"></path><path d="M6.77263 6.76238L4.22705 4.2168" stroke="currentColor" stroke-width="0.8" stroke-linecap="round" stroke-linejoin="round"></path></svg>',
          reset: "cancel",
          apply: "Confirm",
        },
      },
      numberOfMonths: 2,
      onSelect: function () {
        if (
          dt_pickers.getStartDate() != null &&
          dt_pickers.getEndDate() != null
        ) {
          quickpicker.style.display = "none";
          showValFromDatePicker.style.display = "block";
          showValFromDatePicker.querySelector(".dt_date").innerHTML =
            '<span class="color from">' +
            dt_pickers.getStartDate().format("MMMM DD, YYYY") +
            '</span> to <span class="color to">' +
            dt_pickers.getEndDate().format("MMMM DD, YYYY") +
            "</span>.";
        }
      },
    });
    //add cutom attr

    const picker_el = dt_pickers.el;
    picker_el.id = "dateSelectorRange_picker";
    picker_el.classList.add("custom_picker");
    function setMonth() {
      let monthAr = [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ];
      const picker_select = picker_el.querySelectorAll(
        ".lightpick__select.lightpick__select-months"
      );
      picker_select.forEach((el, idx) => {
        //console.log(el, idx);
        el.querySelectorAll("option").forEach((el_op, idx_op) => {
          //console.log(el_op, idx_op);
          el_op.innerHTML = monthAr[idx_op];
        });
      });
    }

    if (tr) {
      dt_pickers.destroy();
    }
  }

  qSelect.addEventListener("change", function () {
    print_date.innerHTML = "(" + returnTime(this.value)[0] + ")";
    mainSet_val.value = returnTime(this.value)[1];
  });

  function returnTime(value) {
    let day = null,
      dayC = null;
    let data = null;
    if (value == 0) {
      day = moment();
      data = day.clone().format("DD/MM/YYYY");
      day = day.format("MMMM DD, YYYY");
    }
    //
    else if (value == 1) {
      day = moment().subtract(1, "days");
      data = day.clone().format("DD/MM/YYYY");
      day = day.format("MMMM DD, YYYY");
    }
    //
    else if (value == 2) {
      day = moment().subtract(1, "weeks");
      dayC = moment();
      data =
        day.clone().format("DD/MM/YYYY") +
        " - " +
        dayC.clone().format("DD/MM/YYYY");
      day = day.format("MMMM DD, YYYY");
      dayC = dayC.format("MMMM DD, YYYY");
    }
    //
    else if (value == 3) {
      day = moment().subtract(1, "months");
      dayC = moment();
      data =
        day.clone().format("DD/MM/YYYY") +
        " - " +
        dayC.clone().format("DD/MM/YYYY");
      day = day.format("MMMM DD, YYYY");
      dayC = dayC.format("MMMM DD, YYYY");
    }
    //
    else if (value == 4) {
      day = moment().startOf("isoweek");
      dayC = moment();
      if (dayC - day <= 0) {
        dayC = null;
        data = day.clone().format("DD/MM/YYYY");
      } else {
        data =
          day.clone().format("DD/MM/YYYY") +
          " - " +
          dayC.clone().format("DD/MM/YYYY");

        dayC = dayC.format("MMMM DD, YYYY");
      }
      day = day.format("MMMM DD, YYYY");
    }
    //
    else if (value == 5) {
      dayC = moment().startOf("isoweek");
      day = dayC.clone().subtract(1, "weeks");
      data =
        day.clone().format("DD/MM/YYYY") +
        " - " +
        dayC.clone().format("DD/MM/YYYY");
      day = day.format("MMMM DD, YYYY");
      dayC = dayC.format("MMMM DD, YYYY");
    }
    //
    else if (value == 6) {
      dayC = "Today";
      day = moment().startOf("month");
      data =
        day.clone().format("DD/MM/YYYY") +
        " - " +
        moment().format("DD/MM/YYYY");
      day = day.format("MMMM DD, YYYY");
    }
    //
    else if (value == 7) {
      day = moment().startOf("month").subtract(1, "months");
      dayC = day.clone().endOf("month");
      data =
        day.clone().format("DD/MM/YYYY") +
        " - " +
        dayC.clone().format("DD/MM/YYYY");
      dayC = dayC.format("MMMM DD, YYYY");
      day = day.format("MMMM DD, YYYY");
    }
    //
    else if (value == 8) {
      dayC = "Today";
      day = moment().startOf("year");
      data =
        day.clone().format("DD/MM/YYYY") +
        " - " +
        moment().format("DD/MM/YYYY");
      day = day.format("MMMM DD, YYYY");
    }
    //
    else if (value == 9) {
      dayC = moment().startOf("year");
      day = dayC.clone().subtract(1, "years");
      data =
        day.clone().format("DD/MM/YYYY") +
        " - " +
        dayC.clone().format("DD/MM/YYYY");
      dayC = dayC.format("MMMM DD, YYYY");
      day = day.format("MMMM DD, YYYY");
    }
    //
    else if (value == 10) {
      day = moment().startOf("year").subtract(6, "years");
      dayC = "Today";
      data =
        day.clone().format("DD/MM/YYYY") +
        " - " +
        moment().format("DD/MM/YYYY");
      day = day.format("MMMM DD, YYYY");
    }
    if (dayC != null) {
      day = day + " - " + dayC;
    }

    return [day, data];
  }
  function printToday() {
    print_date.innerHTML = "(" + returnTime(0)[0] + ")";
    const $options = Array.from(qSelect.options);
    const optionToSelect = $options.find((item) => item.value == 0);
    optionToSelect.selected = true;
    mainSet_val.value = returnTime(0)[1];
    dateRangePickerInit(true);
    dateRangePickerInit();

    qSelect_sl.update();

    quickpicker
      .querySelectorAll(".nice-select-dropdown li")[0]
      .classList.add("none");
    quickpicker
      .querySelectorAll(".nice-select-dropdown li")[0]
      .classList.add("selected");
  }
  //print today date on document load
  printToday();

  //
  showValFromDatePicker
    .querySelector(".reset_picker")
    .addEventListener("click", function () {
      quickpicker.style.display = "block";
      showValFromDatePicker.style.display = "none";
      showValFromDatePicker.querySelector(".dt_date").innerHTML = "";
      printToday();
    });
}
