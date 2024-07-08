"use strict";
gsap.registerPlugin(ScrollTrigger, CSSRulePlugin);
ScrollTrigger.clearScrollMemory();
window.history.scrollRestoration = "manual";

jQuery(document).ready(function ($) {
  "use strict";
  gsap.registerPlugin(ScrollTrigger, CSSRulePlugin);
  gsap.config({
    nullTargetWarn: false,
    trialWarn: false,
  });

  ScrollTrigger.clearScrollMemory();
  const refresh = () => {
    ScrollTrigger.refresh(true);
  };
  refresh();
  window.addEventListener("resize", refresh);

  //char anim
  if ($(".charAnim").length) {
    Splitting({ target: ".charAnim", by: "chars" });
    gsap.set(".charAnim", { opacity: 1 });
  }
  if ($(".cAnim").length) {
    Splitting({ target: ".cAnim", by: "chars" });
    gsap.set(".cAnim", { opacity: 1 });
    gsap.set(".cAnim .char", { xPercent: 100, opacity: 0 });
  }

  //header
  gsap.set(".navbar", {
    opacity: 0,
  });
  gsap.set([".navbar-nav>li", ".nav_btns_group>li"], {
    opacity: 0,
    xPercent: 50,
  });

  var nav_timeline = gsap.timeline({ pause: true });
  nav_timeline
    .to(".main-head", { y: 0, duration: 0.5 })
    .to(".navbar", { opacity: 1, duration: 0.5 })
    .to([".navbar-nav>li", ".nav_btns_group>li"], {
      opacity: 1,
      xPercent: 0,
      stagger: 0.06,
      duration: 0.6,
      onComplete: () => {},
    });

  //home banner animation
  if ($(".home_page_banner").length) {
    let imgSl = $(".ban_img_sl"),
      txtSl = $(".ban_text_sl"),
      trans_speed = 1500,
      autoplaySpeed = 5000;
    imgSl.slick({
      dots: false,
      arrows: false,
      slidesToShow: 1,
      slidesToScroll: 1,
      speed: trans_speed,
      autoplay: true,
      autoplaySpeed: autoplaySpeed,
      infinite: true,
      fade: true,
      cssEase: "linear",
      pauseOnFocus: false,
      pauseOnHover: false,
      draggable: false,
      asNavFor: txtSl,
    });
    txtSl.slick({
      dots: false,
      arrows: false,
      slidesToShow: 1,
      slidesToScroll: 1,
      speed: trans_speed,
      autoplay: true,
      autoplaySpeed: autoplaySpeed,
      infinite: true,
      fade: true,
      pauseOnFocus: false,
      pauseOnHover: false,
      draggable: false,
      asNavFor: imgSl,
    });
    txtSl.slick("slickPause");
    imgSl.slick("slickPause");
    Splitting({ target: ".sl_text_item>*", by: "chars" });
    gsap.set(txtSl, {
      opacity: 1,
    });
    gsap.set(txtSl.find(".slick-current .char"), {
      opacity: 0,
      yPercent: 110,
    });
    $(".ban_text_sl .sl_text_item>*").each(function () {
      $(this).attr("data-fill", this.textContent).addClass("text-fill-ltr");
    });
    nav_timeline
      .to(".ban_top_line.cAnim .char", {
        xPercent: 0,
        opacity: 1,
        stagger: 0.02,
        duration: 0.3,
        ease: "power3.easeIn",
      })
      .to(
        ".ban_text_sl .slick-current .char",
        {
          opacity: 1,
          yPercent: 0,
          stagger: 0.05,
          duration: 0.5,
        },
        "-=0.2"
      )
      .to(
        ".ban_btm_line .cAnim  .char",
        {
          xPercent: 0,
          opacity: 1,
          stagger: 0.02,
          duration: 0.3,
          ease: "power3.easeIn",
          onComplete: () => {
            imgSl.slick("slickPlay");
            txtSl.slick("slickPlay");
          },
        },
        "-=0.2"
      )
      .pause();
    nav_timeline.play();
  }

  //banner laptop animation
  if ($(".bnnr_row").length) {
    gsap.set(".mble_shpe", {
      yPercent: 100,
    });
    let tl = gsap.timeline({ pause: true });
    tl.set(".bnnr_row", {
      opacity: 1,
    })
      .to(".bnr_img2", {
        opacity: 1,
        top: "-5%",
        left: "5%",
        duration: 0.4,
      })
      .to(
        ".bnr_img3",
        {
          opacity: 1,
          top: "-10%",
          left: "10%",
          duration: 0.4,
        },
        "-=0.25"
      )
      .to(
        ".mble_shpe",
        {
          opacity: 1,
          yPercent: 0,
          duration: 0.5,
        },
        "-=0.25"
      );

    ScrollTrigger.create({
      trigger: ".bnnr_row",
      start: "top 60%",
      animation: tl,
      toggleActions: "play pause play pause",
      // markers: true,
    });
  }

  //parallax
  const parallax_box = document.querySelectorAll("[data-parallax]");
  parallax_box.forEach(function (prel) {
    const parallax_el = prel.querySelectorAll("[data-speed]");
    parallax_el.forEach(function (el) {
      let smoothVal =
        Number(el.dataset.speed === 0 ? 1 : el.dataset.speed) * 100;
      let topPos = el.getBoundingClientRect().top;
      if (topPos > window.innerHeight) {
        gsap.to(el, {
          yPercent: -smoothVal,
          ease: "none",
          scrollTrigger: {
            trigger: prel,
            scrub: 1.1,
          },
        });
      } else {
        gsap.to(el, {
          yPercent: -smoothVal,
          ease: "none",
          scrollTrigger: {
            trigger: prel,
            scrub: 1.1,
            start: "top top"
          },
        });
      }
    });
  });

  //click to goto section
  $("[data-goto]").click(function () {
    $("html, body").animate(
      {
        scrollTop: $($(this).attr("href")).offset().top,
      },
      1000
    );
  });

  //active section in viewport
  if ($(".section").length) {
    ScrollOut({
      targets: ".section",
      threshold: 0.5,
      onShown: function (el) {
        el.classList.add("active");
      },
      onHidden: function (el) {
        el.classList.remove("active");
      },
    });
  }

  // smooth scroll to any section
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

  // back to top
  if ($("#scroll").length) {
    $(window).scroll(function () {
      if ($(this).scrollTop() > 200) {
        $("#scroll").fadeIn(200);
      } else {
        $("#scroll").fadeOut(200);
      }
    });
    $("#scroll").click(function () {
      $("html, body").animate({ scrollTop: 0 }, 500);
      return false;
    });
  }

  //slider
  if ($(".architecture_sl").length) {
    $(".architecture_sl").slick({
      dots: false,
      infinite: false,
      speed: 300,
      slidesToShow: 3,
      slidesToScroll: 1,
      responsive: [
        {
          breakpoint: 1024,
          settings: {
            slidesToScroll: 2,
          },
        },
        {
          breakpoint: 767,
          settings: {
            slidesToShow: 1,
          },
        },
      ],
    });

    chkHT();
    window.addEventListener("resize", chkHT);
    function chkHT() {
      let h = 0;
      document.querySelectorAll(".architecture_item").forEach(function (e) {
        if (e.clientHeight > h) {
          h = e.clientHeight;
        }
      });
      gsap.set(".architecture_item", {
        height: h + "px",
      });
    }
  }
});
