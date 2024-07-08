"use strict";
gsap.registerPlugin(ScrollTrigger);

/* =============================
! sticky 2
*/
if ($(".streamline_blk").length) {
  setTimeout(() => {
    gsap.matchMedia().add("(min-width: 992px)", () => {
      let content = $(".streamline_btm"),
        pinup = $(".streamline_blk"),
        side_nav = $(".streamline_top");
      let headline = content.children();
      let headlines = gsap.utils.toArray(headline);
      let el_length = headline.length-1;

      let tween = ScrollTrigger.create({
        trigger: pinup,
        start: () =>
          "top " + document.querySelector(".nav").clientHeight + "px top",
        end: () => "+=" + (window.innerHeight / 2) * headlines.length,
        pin: true,
        scrub: true,
        invalidateOnRefresh: true,
        // markers: true,
        smoothChildTiming: true,
        // autoRemoveChildren: true,
        fastScrollEnd: true,
        preventOverlaps: true,
      });

      headlines.forEach((elem, i) => {
        ScrollTrigger.create({
          trigger: content,
          start: () => "top -=" + (window.innerHeight / 2) * i,
          end: () => "+=" + window.innerHeight / 2,
          invalidateOnRefresh: true,
          //markers: true,
          smoothChildTiming: true,
          // autoRemoveChildren: true,
          fastScrollEnd: true,
          preventOverlaps: true,
          onUpdate: (self) => {
            // console.log(self.progress);
            headline.removeClass("active");
            side_nav.find("li").removeClass("active");
            if (i > 0) {
              if (self.isActive) {
                $(elem).addClass("active");
                side_nav.find("li:eq(" + i + ")").addClass("active");
              }
              else{
                $(headline[el_length]).addClass("active");
                side_nav.find("li:eq(" + el_length + ")").addClass("active");
              }
            } else {
              $(elem).addClass("active");
              side_nav.find("li:eq(0)").addClass("active");
            }
          },
        });
      });
      $(headline[0]).addClass("active");
      side_nav.find("li:eq(0)").addClass("active");

      side_nav.find("li").on("click", function () {
        let y = Math.round(
          tween.start + (window.innerHeight / 2) * (Number($(this).index()) + 1)
        );
        $("html, body").animate({ scrollTop: y });
      });
    });
  }, 200);
}

