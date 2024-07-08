"use strict";
gsap.registerPlugin(ScrollTrigger);

/* ================================
! sticky 1
*/
if ($(".supercharge_blk").length) {
  let content = $(".supercharge_rt"),
    pinup = $(".supercharge_blk"),
    side_nav = $(".supercharge_nav");
  let $headline = content.children();
  let headlines = gsap.utils.toArray($headline);

  let slider_tl = gsap.timeline({ pause: true });

  gsap.matchMedia().add("(min-width: 992px)", () => {
    $headline.each((i, el) => {
      if (i == 0) {
        $(el).addClass("active");
        side_nav.find("li:eq(" + i + ")").addClass("active");
        slider_tl.to(el, {
          yPercent: 0,
          duration: 1,
        });
      }
      if (i > 0) {
        gsap.set(el, {
          yPercent: 100,
          opacity: 0,
        });
        slider_tl
          .to(el, {
            delay: 0.2,
            yPercent: 0,
            opacity: 1,
            duration: 1,
            ease: "Power2.easeIn",
          })
          .to(
            $headline.eq(i - 1),
            {
              yPercent: -100,
              opacity: 0,
              duration: 1,
              ease: "Power2.easeIn",
            },
            "-=1"
          );
      }
    });

    let tween = ScrollTrigger.create({
      trigger: pinup,
      start: "top " + document.querySelector(".nav").clientHeight + "px top",
      end: "+=" + window.innerHeight * headlines.length,
      pin: true,
      scrub: true,
      animation: slider_tl,
      invalidateOnRefresh: true,
      // markers: true,
    });

    headlines.forEach((elem, i) => {
      ScrollTrigger.create({
        trigger: content,
        start: "top -=" + window.innerHeight * i,
        end: "+=" + window.innerHeight,
        invalidateOnRefresh: true,
        // markers: true,
        // onEnter: function () {
        //   $headline.removeClass("active");
        //   $(elem).addClass("active");

        //   side_nav.find("li").removeClass("active");
        //   side_nav.find("li:eq(" + (i-1) + ")").addClass("active");
        // },
        // onEnterBack: function () {
        //   $headline.removeClass("active");
        //   $(elem).addClass("active");

        //   side_nav.find("li").removeClass("active");
        //   side_nav.find("li:eq(" + i + ")").addClass("active");
        // },
        // onUpdate: function (self) {
        //   $headline.removeClass("active");
        //   side_nav.find("li").removeClass("active");
        //   if (i > 0) {
        //     if (self.isActive) {
        //       $(elem).addClass("active");
        //       side_nav.find("li:eq(" + i + ")").addClass("active");
        //     }
        //   } else {
        //     $(elem).addClass("active");
        //     side_nav.find("li:eq(0)").addClass("active");
        //   }
        // },

        onUpdate: function (self) {
          if (i > 0) {
            if (self.progress > 0.3 && self.direction > 0) {
              $headline.removeClass("active");
              side_nav.find("li").removeClass("active");
              $(elem).addClass("active");
              side_nav.find("li:eq(" + i + ")").addClass("active");
            }
            if (self.progress < 0.7 && self.direction < 0) {
              $headline.removeClass("active");
              side_nav.find("li").removeClass("active");
              $(elem).addClass("active");
              side_nav.find("li:eq(" + (i - 1) + ")").addClass("active");
            }
          } else {
            $headline.removeClass("active");
            side_nav.find("li").removeClass("active");
            $(elem).addClass("active");
            side_nav.find("li:eq(0)").addClass("active");
          }
        },
      });
    });
    $($headline[0]).addClass("active");
    side_nav.find("li:eq(0)").addClass("active");

    side_nav.find("li").on("click", function (e) {
      let y = Math.round(
        tween.start + window.innerHeight * (Number($(this).index()) + 1)
      );
      $("html, body").animate({ scrollTop: y });
    });
  });
  gsap.matchMedia().add("(max-width: 991px)", () => {
    side_nav.find("li").each((i, el) => {
      if (i == 0) {
        side_nav.find("li").removeClass("active");
        gsap.set(el, {
          borderColor: "#6e58f1",
          backgroundColor: "#fff",
        });
      }
      if (i > 0) {
        slider_tl
          .to(el, {
            delay: 1,
            borderColor: "#6e58f1",
            backgroundColor: "#fff",
            duration: 0.1,
          })
          .to(
            side_nav.find("li").eq(i - 1),
            {
              borderColor: "transparent",
              backgroundColor: "transparent",
              duration: 0.1,
            },
            "-=0.1"
          );
      }
    });
    slider_tl.to(pinup, {
      opacity: 1,
      duration: 1,
    });

    ScrollTrigger.create({
      trigger: pinup,
      start: "top " + document.querySelector(".nav").clientHeight + "px top",
      end: "+=100%",
      pin: true,
      scrub: true,
      animation: slider_tl,
      invalidateOnRefresh: true,
      // markers: true,
    });
  });
}

/* =============================
! sticky 2
*/
if ($(".streamline_blk").length) {
  setTimeout(() => {
    gsap.matchMedia().add("(min-width: 992px)", () => {
      let content = $(".streamline_btm"),
        pinup = $(".streamline_blk"),
        side_nav = $(".streamline_top");
      let $headline = content.children();
      let headlines = gsap.utils.toArray($headline);

      let slider_tl = gsap.timeline({ pause: true });

      $headline.each((i, el) => {
        if (i == 0) {
          $(el).addClass("active");
          side_nav.find("li:eq(" + i + ")").addClass("active");
          slider_tl.to(el, {
            yPercent: 0,
            duration: 1,
          });
        }
        if (i > 0) {
          gsap.set(el, {
            yPercent: 100,
          });
          slider_tl
            .to(el, {
              yPercent: 0,
              duration: 1,
            })
            .set($headline.eq(i - 1), {
              opacity: 0,
            });
        }
      });
      let tween = ScrollTrigger.create({
        trigger: pinup,
        start: "top " + document.querySelector(".nav").clientHeight + "px top",
        end: "+=" + window.innerHeight * headlines.length,
        pin: true,
        scrub: true,
        animation: slider_tl,
        invalidateOnRefresh: true,
        // markers: true,
      });

      headlines.forEach((elem, i) => {
        ScrollTrigger.create({
          trigger: content,
          start: "top -=" + window.innerHeight * i,
          end: "+=" + window.innerHeight,
          invalidateOnRefresh: true,
          //markers: true,
          onUpdate: function (self) {
            // console.log(self.progress);
            $headline.removeClass("active");
            side_nav.find("li").removeClass("active");
            if (i > 0) {
              if (self.isActive) {
                $(elem).addClass("active");
                side_nav.find("li:eq(" + i + ")").addClass("active");
              }
            } else {
              $(elem).addClass("active");
              side_nav.find("li:eq(0)").addClass("active");
            }
          },
        });
      });
      $($headline[0]).addClass("active");
      side_nav.find("li:eq(0)").addClass("active");

      side_nav.find("li").on("click", function () {
        let y = Math.round(
          tween.start + window.innerHeight * (Number($(this).index()) + 1)
        );
        $("html, body").animate({ scrollTop: y });
      });
    });
  }, 200);
}

/* =============================
! scrollTo goto 3
*/
//toggle accr
$(".faq_heading_box").on("click", function () {
  if ($(this).hasClass("active")) {
    $(".answer").removeClass("active").stop().slideUp();
    $(this).removeClass("active");
  } else {
    $(this).addClass("active");
    $(".answer").removeClass("active").stop().slideUp();
    $(this).next().addClass("active").stop().slideDown();
  }
});

if ($(".faq-page-sec-wrap").length) {
  setTimeout(() => {
    let sec_trigger = $(".faq-page-sec-wrap"),
      content = $(".faq-box-right-wrap"),
      pinup = $(".faq-box-left"),
      side_nav = $(".faq-box-left-list");

    side_nav.find("li>a").on("click", function (e) {
      e.preventDefault();
      ScrollTrigger.refresh();
      side_nav.find("li>a").removeClass("active");
      $(this).addClass("active");
      $("html, body").animate(
        {
          scrollTop:
            $($(this).attr("href")).offset().top -
            document.querySelector(".nav").clientHeight -
            Number(sec_trigger.css("paddingTop").slice(0, -2)),
        },
        600
      );
    });

    ScrollTrigger.create({
      trigger: sec_trigger,
      start: "top " + document.querySelector(".nav").clientHeight + "px top",
      end:
        "bottom " +
        (pinup.get(0).clientHeight +
          2 * Number(sec_trigger.css("paddingTop").slice(0, -2))) +
        "px",
      pin: pinup,
      scrub: true,
      invalidateOnRefresh: true,
      // markers: true,
    });

    content.children().each((i, elem) => {
      let ssGoto = ScrollTrigger.create({
        trigger: elem,
        start: "top 20%",
        end: "bottom 20%",
        //scrub: true,
        invalidateOnRefresh: true,
        // markers: true,
        onEnter: function () {
          content.children().removeClass("active");
          $(elem).addClass("active");

          side_nav.find("li>a").removeClass("active");
          side_nav.find("li:eq(" + i + ")>a").addClass("active");
        },
        onEnterBack: function () {
          content.children().removeClass("active");
          $(elem).addClass("active");

          side_nav.find("li>a").removeClass("active");
          side_nav.find("li:eq(" + i + ")>a").addClass("active");
        },
      });
      window.addEventListener("scroll", () => {
        ssGoto.refresh();
      });
    });
  }, 400);
}
