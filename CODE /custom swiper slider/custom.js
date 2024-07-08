if (window.DeviceOrientationEvent) {
  window.addEventListener(
    "orientationchange",
    function () {
      location.reload();
    },
    false
  );
}

jQuery(document).ready(function ($) {
  //fancybox
  Fancybox.bind('[data-fancybox="artgallery"]', {
    caption: (fancybox, slide) => {
      const caption = slide.caption || "";
      return `${caption}`;
    },
  });

  if ($(".star-slider").length) {
    new Splide(".star-slider", {
      type: "loop",
      perPage: 26,
      arrows: false,
      pagination: false,
      drag: false,
      autoScroll: {
        speed: 0.5,
        pauseOnHover: false,
        pauseOnFocus: false,
      },

      breakpoints: {
        1280: {
          perPage: 24,
        },
        992: {
          perPage: 10,
        },
        768: {
          perPage: 8,
        },
        480: {
          perPage: 6,
        },
      },
    }).mount(window.splide.Extensions);
  }

  /* CASE STUDY SLIDER START */
  if ($(".cs-card-slider").length) {
    $(".cs-card-slider").slick({
      dots: false,
      arrows: false,
      infinite: true,
      speed: 600,
      slidesToShow: 3,
      slidesToScroll: 1,
      autoplay: false,
      autoplaySpeed: 2500,
      responsive: [
        {
          breakpoint: 768,
          settings: {
            slidesToShow: 2,
            centerMode: true,
          },
        },
      ],
    });
  }
  /* CASE STUDY SLIDER END */

  // ACCORDION START
  if ($(".cmn-accrdn-wpr").length) {
    $(".cmn-accrdn-wpr").each(() => {
      $(this).find(".accrd-hdr.active").next(".accrdn-cntnt").show();
    });
  }

  $(".accrd-hdr").on("click", function () {
    $(this).toggleClass("active");
    $(this).next(".accrdn-cntnt").stop(true, true).slideToggle();
    $(this).parents().siblings().find(".accrdn-cntnt").slideUp();
    $(this).parents().siblings().find(".accrd-hdr").removeClass("active");
  });
  // ACCORDION START

  $("[data-goto]").on("click", function (event) {
    if ($(window).width() < 992) {
      var hasTarget = $(this),
        $hasTarget = $(hasTarget);
      $("html, body").animate(
        {
          scrollTop: $hasTarget.offset().top - 60,
        },
        800,
        function () {
          window.location.href.substr(0, window.location.href.indexOf("#"));
        }
      );
    }
  });

  if ($(window).width() < 992) {
    // smooth scroll to any section

    $(".home-sec").css({
      "padding-top": $(".main-hdr").outerHeight(),
    });

    setTimeout(function () {
      ScrollTrigger.refresh();
    }, 200);

    const headlineLogo = $(".brand-logo"),
      headlineText = $(".hdr-txt-logo"),
      section = $(".swiper-slide");
    section.each(function () {
      let _this = $(this),
        hdr_hdng = _this.find(".slide-hdr-hdng");

      ScrollTrigger.create({
        trigger: _this,
        start: "top 54px",
        end: "bottom 54px",
        scrub: 1,
        // markers: true,
        onEnter: () => {
          if (hdr_hdng.length > 0) {
            headlineText.text(hdr_hdng.attr("data-text"));
            headlineText.addClass("active");
            headlineLogo.removeClass("active");
          } else {
            headlineText.text("");
            headlineText.removeClass("active");
            headlineLogo.addClass("active");
          }
          if ($(this).hasClass("bg-red")) {
            $("body").removeClass("rose-white");
          } else {
            $("body").addClass("rose-white");
          }
        },
        onEnterBack: () => {
          if (hdr_hdng.length > 0) {
            headlineText.text(hdr_hdng.attr("data-text"));
            headlineText.addClass("active");
            headlineLogo.removeClass("active");
          } else {
            headlineText.text("");
            headlineText.removeClass("active");
            headlineLogo.addClass("active");
          }
          if ($(this).hasClass("bg-red")) {
            $("body").removeClass("rose-white");
          } else {
            $("body").addClass("rose-white");
          }
        },
      });
    });
  }

  // PAGES SCRIPT FOR DESKTOP VERSION => ABOVE 991px //START
  if ($(window).width() > 991) {
    let topHdrHeight = $(".main-hdr").outerHeight();
    let btmMenuHeight = $(".main-footer").outerHeight();
    $(".page-slider-cntnt").css({
      "padding-top": topHdrHeight,
      "padding-bottom": btmMenuHeight,
    });

    if ($(".artwork-slider").length) {
      // slick slider
      $(".artwork-slider").slick({
        dots: false,
        arrows: true,
        prevArrow: $(".artwork-arrow-wpr .slider-arrow.left"),
        nextArrow: $(".artwork-arrow-wpr .slider-arrow.right"),
        infinite: false,
        slidesToShow: 4,
        slidesToScroll: 1,
        autoplay: false,
        autoplaySpeed: 3000,
        speed: 1000,
        centerMode: false,
        adaptiveHeight: false,
        centerPadding: "0px",
        draggable: true,
      });
    }

    var menu = [
      "Fine Art",
      "CASE STUDIES",
      "ABOUT",
      "HOME",
      "TL;DR",
      "COACHING",
      "SERVICES",
    ];

    var sl_direction = "down";
    document.addEventListener("wheel", (event) => {
      event.deltaY > 0 ? (sl_direction = "next") : (sl_direction = "prev");
    });

    let swiperItems = document.querySelectorAll(".page-swiper .swiper-slide");
    swiperItems.forEach(function (e, i) {
      let data = convertToSlug(menu[i]);
      e.setAttribute("data-hash", data);
    });
    function convertToSlug(Text) {
      return Text.toString()
        .toLowerCase()
        .replace(/ /g, "-")
        .replace(/[^\w-]+/g, "");
    }
    var slindex = 3,
      flag = 0;
    var swiper = new Swiper(".page-swiper", {
      slidesPerView: 1,
      observer: true,
      observeParents: true,
      allowTouchMove: false,
      spaceBetween: 0,
      mousewheel: true,
      lazy: true,
      speed: 500,
      preventInteractionOnTransition: true,
      initialSlide: slindex, //$('.home-sec').index(),
      watchSlidesProgress: true,
      watchSlidesVisibility: true,
      slideVisibleClass: "myslider__slide--visible",
      loop: true,
      hashNavigation: true,
      pagination: {
        el: ".swiper-pagination",
        clickable: true,
        renderBullet: function (index, className) {
          return (
            '<li class="footer-menu-list-item ' +
            className +
            " " +
            (className + index) +
            '"><div data-slide="' +
            index +
            '" class="footer-menu"><div>' +
            menu[index] +
            '</div><div class="footer-menu-dot"></div></div></li>'
          );
        },
      },
    });

    swiper.on("slideChangeTransitionStart", function () {
      swiper.mousewheel.disable(); //.mousewheel.enable=false;
      setTimeout(() => {
        swiper.mousewheel.enable();
      }, 1200);
      //navDot();
    });
    document.addEventListener("wheel", (event) => {
      event.deltaY > 0 ? (sl_direction2 = "next") : (sl_direction2 = "prev");
    });

    swiper.on("slideChange", function (e) {
      let menuDotPosition = $(".footer-menu-wpr")
        .find(".swiper-pagination-bullet-active .footer-menu-dot")
        .position().left;
      $(".active-menu-indicator-img").css("left", menuDotPosition);
    });

    swiper.on("beforeTransitionStart", function (e) {
      //FOR SLIDE BG CHANGE
      if ($(".swiper-slide.swiper-slide-active").hasClass("bg-red")) {
        $("body").removeClass("rose-white");
      } else {
        $("body").addClass("rose-white");
      }
    });

    // Check the link of website user came from
    const linkOfTheWebsiteUserCame = document.referrer;
    const currentUrl = window.location.pathname;
    const currentUrlAfterMainDomain = currentUrl.split("/").pop();
    const pathAfterMainDomain = linkOfTheWebsiteUserCame
      .split("/")
      .pop()
      .toString();
    const tcPage = "true-classic",
      ettituePage = "ettitude",
      jsPage = "jordin-sparks",
      ljPage = "lauren-jauregui";

    function changeUrl() {
      setTimeout(() => {
        const hash = window.location.hash.slice(1);
        menu.map((e, i) => {
          var links = convertToSlug(e);
          if (hash == "home") {
            window.location.hash = "";
            window.location.href = window.location.href.replace("#home", "");
          }
          if (links === hash) {
            slindex = i;
          }
        });
        if (flag == 0) {
          gotosl();
        }
      }, 500);
    }

    function gotosl() {
      swiper.slideTo(slindex, 0, false);
      $(".swiper-slide").removeClass("swiper-slide-active");
      $(".swiper-slide").eq(slindex).addClass("swiper-slide-active");
      if ($(".swiper-slide.swiper-slide-active").hasClass("bg-red")) {
        $("body").removeClass("rose-white");
      } else {
        $("body").addClass("rose-white");
      }
    }

    function linkchecking() {
      if (currentUrlAfterMainDomain == "") {
        if (sessionStorage.getItem("loader") == "hide") {
          $(".page-loader").hide();
          if (
            pathAfterMainDomain == tcPage ||
            pathAfterMainDomain == ettituePage ||
            pathAfterMainDomain == jsPage ||
            pathAfterMainDomain == ljPage
          ) {
            swiper.slideTo($(".casestudies-sec").index(), 0, false);
          }
        } else {
          if ($(".page-loader").length) {
            setTimeout(() => {
              $(".page-loader").addClass("active");
              if ($(".swiper-slide.swiper-slide-active").hasClass("bg-red")) {
                $("body").removeClass("rose-white");
              } else {
                $("body").addClass("rose-white");
              }
            }, 100);
            setTimeout(() => {
              //$('.home-sec').removeClass('swiper-slide-active');
              $(".swiper-slide")
                .eq(swiper.realIndex)
                .removeClass("swiper-slide-active");
            }, 500);
          }
        }
      }
    }

    linkchecking();
    changeUrl();
    document.addEventListener("wheel", function () {
      flag = 1;
      changeUrl();
    });
  }

  $("[data-goto]").on("click", function (e) {
    if ($(window).width() > 991) {
      let slideSec = $(this).attr("data-goto");
      swiper.slideTo($("." + slideSec + "").index(), 1000, false);
    }
  });

  $(".home-enter-btn").on("click", function () {
    $(".page-loader").css("opacity", "0");
    setTimeout(() => {
      $(".page-loader").hide();
      //$('.home-sec').addClass('swiper-slide-active');
      $(".swiper-slide").eq(swiper.realIndex).addClass("swiper-slide-active");
      sessionStorage.setItem("loader", "hide");
    }, 1000);
  });

  if ($("[data-splitting]").length) {
    const allDataSplit = document.querySelectorAll("[data-splitting]");
    allDataSplit.forEach((elem) => {
      Splitting({ target: elem, by: "chars" });
    });
  }

  document.querySelectorAll("[data-move]").forEach((elem) => {
    elem.querySelectorAll("[move-up]").forEach((elem2, index) => {
      elem2.setAttribute("style", "--data-delay: " + index + "");
    });
    elem.querySelectorAll("[move-down]").forEach((elem2, index) => {
      elem2.setAttribute("style", "--data-delay: " + index + "");
    });
  });

  let cr_el = $(this).find(".mobile-nav li.nav-list-item");
  let menuTl = new gsap.timeline();
  $(".menu-toggler").click(function () {
    menuTl
      .to(cr_el, {
        stagger: {
          // wrap advanced options in an object
          each: 0.1,
          onComplete() {
            this.targets()[0].classList.remove("active");
          },
          from: "end",
          ease: "none",
        },
      })
      .to(".mobile-nav", {
        onComplete() {
          $(".menu-toggler.in").removeClass("show");
        },
      })
      .to(
        ".mobile-nav",
        {
          onComplete() {
            $(".mobile-nav").removeClass("show");
          },
        },
        "-=1"
      );
    menuTl.pause();
    if ($(".mobile-nav").hasClass("show")) {
      menuTl.play().timeScale(1);
    } else {
      $(".mobile-nav").addClass("show");
      $(".menu-toggler.in").addClass("show");
      gsap.to(cr_el, {
        stagger: {
          // wrap advanced options in an object
          each: 0.2,
          onComplete() {
            this.targets()[0].classList.add("active");
          },
          ease: "none",
        },
      });
    }
  });

  // one page scroll section
  jQuery(function ($) {
    var topMenuHeight = $(".main-hdr").outerHeight();
    $(".mobile-nav").menuScroll(topMenuHeight);
  });

  // COPY THE FOLLOWING FUNCTION INTO ANY SCRIPTS
  jQuery.fn.extend({
    menuScroll: function (offset) {
      // Declare all global variables
      var topMenu = this;
      var topOffset = offset ? offset : 0;
      var menuItems = $(topMenu).find('a[href*="#"]');
      var lastId;

      // Save all menu items into scrollItems array
      var scrollItems = $(menuItems).map(function () {
        var item = $($(this).attr("href"));
        if (item.length) {
          return item;
        }
      });

      // When the menu item is clicked, get the #id from the href value, then scroll to the #id element
      $(topMenu).on("click", 'a[href*="#"]', function (e) {
        var href = $(this).attr("href");
        menuTl.play().timeScale(4);

        var offsetTop = href === "#" ? 0 : $(href).offset().top - topOffset;

        setTimeout(() => {
          history.replaceState(
            "",
            document.title,
            window.location.origin +
              window.location.pathname +
              window.location.search
          );
        }, 200);
        setTimeout(() => {
          $("html, body").stop().animate(
            {
              scrollTop: offsetTop,
            },
            300
          );
          e.preventDefault();
        }, 1200);
      });

      // When page is scrolled
      $(window).scroll(function () {
        var nm = $("html").scrollTop();
        var nw = $("body").scrollTop();
        var fromTop = (nm > nw ? nm : nw) + topOffset + 10;

        // When the page pass one #id section, return all passed sections to scrollItems and save them into new array current
        var current = $(scrollItems).map(function () {
          if (
            $(this).offset().top <= fromTop &&
            $(this).offset().top + this.height() > fromTop
          )
            return this;
        });

        // Get the most recent passed section from current array
        current = current[current.length - 1];
        var id = current && current.length ? current[0].id : "";
        if (lastId !== id) {
          lastId = id;
          // Set/remove active class
          $(menuItems)
            .removeClass("current-menu-item")
            .end()
            .filter("[href='#" + id + "']")
            .parent()
            .addClass("current-menu-item");
        }
      });
    },
  });

  if ($(window).width() < 992) {
    let allSlide = document.querySelectorAll(".swiper-slide");
    allSlide.forEach((elem) => {
      let slideTl = gsap.timeline();
      let elPos = elem.getBoundingClientRect().y;
      slideTl.to(elem, {
        onStart() {
          this.targets()[0].classList.add("swiper-slide-active");
        },
        scrollTrigger: {
          trigger: elem,
          start: elPos > window.innerHeight ? "top 80%" : "top bottom",
          //markers: true,
          scrub: true,
        },
      });
    });
  }

  $("[data-modal]").on("click", function () {
    let modalName = $(this).attr("data-modal");
    $(".cmn-modal#" + modalName + "").addClass("show");
  });
  $(".modal-close-btn").on("click", function () {
    $(this).closest(".cmn-modal").removeClass("show");
  });

  if ($(".case-study-header").length) {
    $(window).scroll(function () {
      let ccHeader = document.querySelector(".case-study-header");
      if (window.scrollY > ccHeader.clientHeight) {
        ccHeader.classList.add("srink");
      } else {
        ccHeader.classList.remove("srink");
      }
    });
  }
});

let n_path = document.querySelectorAll(".pr");
n_path.forEach((i_cnt)=> {
  let length = i_cnt.getTotalLength();
  i_cnt.style.cssText =`
  stroke-dasharray: ${length + 1},
  stroke-dashoffset: ${length + 1},
  opacity: 1,
  `;
});











/****/
 //move elements on mouse move
 if ($("[data-move_container]").length && isDekstop) {
  const bnrMove = document.querySelectorAll("[data-move_container]");

  bnrMove.forEach(function (bnr) {
    bnr.addEventListener("mousemove", function (mouse) {
      //move elements
      if ($(bnr).find("[data-move]").length) {
        $(bnr)
          .find("[data-move]")
          .each(function (i, el) {
            let _this = this;
            let resistance = Number($(_this).attr("data-move")) * 10;

            let x =
                (mouse.clientX - window.innerWidth / 2) / resistance / 10,
              y = (mouse.clientY - window.innerHeight / 2) / resistance / 5;
            // console.log(x, y);
            gsap.to(el, {
              x: x,
              y: y,
              duration: 0.2,
              ease: "none",
              z: Math.max(x * 10, y * 10),
            });
          });
      }

      //rotate elements
      if ($(bnr).find("[data-rotate]").length) {
        $(bnr)
          .find("[data-rotate]")
          .each(function (i, el) {
            let _this = this;
            let resistance = Number($(_this).attr("data-rotate")) * 10;
            let r =
              (mouse.clientX - window.innerWidth / 2) / resistance / 5 +
              (mouse.clientY - window.innerHeight / 2) / resistance / 10;
            gsap.to(el, {
              rotation: r,
              duration: 0.15,
              ease: "none",
            });
          });
      }
    });
  });
}