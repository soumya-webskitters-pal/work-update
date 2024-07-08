jQuery(document).ready(function ($) {
  // document start

  // // smooth scroll to any section
  if ($("a.scroll").length) {
    $("a.scroll").on("click", function (event) {
      if (this.hash !== "") {
        event.preventDefault();
        var target = this.hash,
          $target = $(target);
        $("html, body").animate(
          {
            scrollTop: $target.offset().top - 60,
          },
          800,
          function () {
            window.location.href.substr(0, window.location.href.indexOf("#"));
          }
        );
      }
    });
  }

  // slick slider

  // $(".afterBnnr_slider").slick({
  //   dots: false,
  //   arrows: false,
  //   infinite: false,
  //   slidesToShow: 2,
  //   slidesToScroll: 1,
  //   autoplay: true,
  //   autoplaySpeed: 3000,
  //   centerMode: true,
  //   adaptiveHeight: false,
  //   centerPadding: "19%",
  //   responsive: [
  //     {
  //       breakpoint: 640,
  //       settings: {
  //         centerPadding: "15%",
  //         slidesToShow: 1,
  //         slidesToScroll: 1,
  //       },
  //     },
  //     {
  //       breakpoint: 480,
  //       settings: {
  //         slidesToShow: 1,
  //         slidesToScroll: 1,
  //       },
  //     },
  //   ],
  // });

  $(".menu_btn").on("click", function () {
    $(this).toggleClass("active");
    $(".menu_wrappr").toggleClass("menu-active");
    $(".main_head").toggleClass("menu-open");
    $(".navbar_collapes").slideToggle(200);
  });

  $(".jobAcc_btn").on("click", function () {
    $(".accordion_item_outter_wrappr")
      .child(".accordion_item")
      .toggleClass("open_jbAcc");
  });

  /// sticky slider
  gsap.registerPlugin(ScrollTrigger);
  if ($(".afterBnnr_slider").length) {
    const horizontalSections = gsap.utils.toArray(".afterBnnr_slider");
    horizontalSections.forEach(function (sec, i) {
      var thisPinWrap = sec.querySelector(".pin-wrap");
      var thisAnimWrap = thisPinWrap.querySelector(".animation-wrap");
      var getToValue = () =>
        -(
          thisAnimWrap.scrollWidth -
          window.innerWidth +
          thisAnimWrap.getBoundingClientRect().x * 2
        );
      gsap.fromTo(
        thisAnimWrap,
        {
          x: () => 0,
        },
        {
          x: () => getToValue(),
          ease: "none",
          scrollTrigger: {
            trigger: sec,
            start: "top top",
            end: () =>
              "+=" +
              (thisAnimWrap.scrollWidth -
                window.innerWidth +
                thisAnimWrap.getBoundingClientRect().x * 2),
            pin: thisPinWrap,
            invalidateOnRefresh: true,
            scrub: true,
            //markers: true,
          },
        }
      );
    });
  }

  /// stacked card
  if ($(".acr_main").length) {
    const st_crd = gsap.utils.toArray(".acr_main");
    st_crd.forEach(function (sec, i) {
      var thisItem = sec.querySelectorAll(".acr_item");
      thisItem.forEach(function (itm, j) {
        gsap.set(itm, {
          zIndex: j,
        });
        gsap.timeline({
          scrollTrigger: {
            trigger: itm,
            pin: true,
            start: "top top",
            scrub: true,
            ease: "linear",
            //markers: true,
            pinSpacing: false,
            invalidateOnRefresh: true,
            onUpdate: (ff) => {
              // let els = ff.trigger.parentElement.previousElementSibling;
              // if (els != null) {
              gsap.set(itm, {
                opacity: 1 - ff.progress,
              });
              // }
            },
          },
        });
      });
      gsap.set(st_crd[0].nextElementSibling, {
        zIndex: thisItem.length + 1,
        position: "relative",
      });
    });
  }

  /// change nav on viewport
  if ($("[data-navBlack]").length) {
    $("[data-navBlack]").each((idx, el) => {
      ScrollTrigger.create({
        trigger: el,
        start: "top bottom",
        end: "bottom bottom",
        markers: true,
        onUpdate: (self) => {
          $(".main_head").removeClass("nav_dark");
          if (self.isActive) {
            $(".main_head").addClass("nav_dark");
          }
        },
      });
    });
  }

  // document end
});

var isLast = function (word) {
  return $(word).next().length > 0 ? false : true;
};

var getNext = function (word) {
  return $(word).next();
};

var getVisible = function () {
  return document.getElementsByClassName("is-visible");
};

var getFirst = function () {
  var node = $(".firstTxt_wrapper").children().first();
  return node;
};

var switchWords = function (current, next) {
  $(current).removeClass("is-visible").addClass("is-hidden");
  $(next).removeClass("is-hidden").addClass("is-visible");
};

var getStarted = function () {
  //We start by getting the visible element and its sibling
  var first = getVisible();
  var next = getNext(first);

  //If our element has a sibling, it's not the last of the list. We switch the classes
  if (next.length !== 0) {
    switchWords(first, next);
  } else {
    //The element is the last of the list. We remove the visible class of the current element
    $(first).removeClass("is-visible").addClass("is-hidden");

    //And we get the first element of the list, and we give it the visible class. And it starts again.
    var newEl = getFirst();
    $(newEl).removeClass("is-hidden").addClass("is-visible");
  }
};

var init = function () {
  setInterval(function () {
    getStarted();
  }, 2000);
};

init();

// var btnn = document.getElementById('ddd');
// btnn.onclick = function () {
//   alert()
//   this.closest('.accordion_item').classList.add('fff');
// }

window.addEventListener("load", (event) => {
  const eachFaq = [...document.querySelectorAll(".acc_headr")];

  eachFaq.forEach((item) => {
    let faqContent = item.nextElementSibling;
    if (!item.classList.contains("active")) {
      faqContent.style.height = "0px";
    } else {
      faqContent.style.height = faqContent.scrollHeight + "px";
    }
  });

  var accordionItem = document.getElementsByClassName("accordion_item");
  const accordionBtns = document.querySelectorAll(".acc_btn");

  accordionBtns.forEach((accordion) => {
    accordion.onclick = function () {
      let content = this.parentNode.nextElementSibling;

      if (content.style.height == "0px") {
        for (i = 0; i < accordionItem.length; i++) {
          if (this != accordionItem[i]) {
            accordionItem[i].querySelector(".accordion_conetnt").style.height =
              "0px";
          }
          accordionItem[i]
            .querySelector(".acc_headr")
            .classList.remove("active");
        }
        content.style.height = content.scrollHeight + "px";
        // content.style.height = content.scrollHeight + "px";
        this.closest(".acc_headr").classList.add("active");

        document.querySelectorAll(".accordion_item").forEach((element) => {
          element.classList.remove("active_wrappr");
        });
        this.closest(".accordion_item").classList.add("active_wrappr");
      } else {
        content.style.height = "0px";
        this.closest(".acc_headr").classList.remove("active");
        this.closest(".accordion_item").classList.remove("active_wrappr");
      }
    };
  });
});

function addFunction() {
  var element = document.getElementById("firstPopUp_box");
  element.classList.add("show");
}

function removeFunction() {
  var element = document.getElementById("firstPopUp_box");
  element.classList.remove("show");
}

setTimeout(function () {
  document.getElementById("firstPopUp_box").classList.remove("hidden");
  document.getElementById("firstPopUp_box").classList.add("flex");
}, 2000);

function addFunctionOne() {
  var element = document.getElementById("secndPopUp_box");
  element.classList.add("show");
}

function removeFunctionOne() {
  var element = document.getElementById("secndPopUp_box");
  element.classList.remove("show");
}

setTimeout(function () {
  document.getElementById("secndPopUp_box").classList.remove("hidden");
  document.getElementById("secndPopUp_box").classList.add("flex");
}, 2000);

var swiper = new Swiper(".innr_bnnr_slider", {
  navigation: {
    nextEl: ".swiper-button-next",
    prevEl: ".swiper-button-prev",
  },
  pagination: {
    el: ".swiper-pagination",
  },
  loop: true,
  speed: 500,
  // effect: 'fade',
});

// // Hide Header on on scroll down
var didScroll;
var lastScrollTop = 0;
var delta = 5;
var navbarHeight = $(".main_head").outerHeight();

$(window).scroll(function (event) {
  didScroll = true;
});

if ($(window).width() < 640) {
  setInterval(function () {
    if (didScroll) {
      hasScrolled();
      didScroll = false;
    }
  }, 250);
}

$(window).resize(function () {
  if ($(window).width() < 640) {
    setInterval(function () {
      if (didScroll) {
        hasScrolled();
        didScroll = false;
      }
    }, 250);
  }
});

function hasScrolled() {
  var st = $(this).scrollTop();

  // Make sure they scroll more than delta
  if (Math.abs(lastScrollTop - st) <= delta) return;

  // If they scrolled down and are past the navbar, add class .nav-up.
  // This is necessary so you never see what is "behind" the navbar.
  if (st > lastScrollTop && st > navbarHeight) {
    // Scroll Down
    $(".main_head").removeClass("nav-down").addClass("nav-up");
  } else {
    // Scroll Up
    if (st + $(window).height() < $(document).height()) {
      $(".main_head").removeClass("nav-up").addClass("nav-down");
    }
  }

  lastScrollTop = st;
}
