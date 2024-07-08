"use strict";
gsap.registerPlugin(ScrollTrigger);

/* =============================
! sticky 2
*/
if ($(".bigtext").length) {
  let el = $(".bigtext");
  let el_next = el.next();
  // gsap.set(el_next, {
  //   yPercent: 50,
  //   opacity: 0,
  // });
  var tls = gsap.timeline();
  tls
    .from(el, {
      opacity: 0.05,
      fontSize: "clamp(55px, 13.5vw, 216px)",
      duration: 3,
      // height: "100vh",
      // ease: "none",
      ease: "power2.easeIn",
      // paddingTop: "50vh",
    })
    .from(
      el_next,
      {
        yPercent: 100,
        opacity: 0,
        duration: 1,
        ease: "power2.easeOut",
      },
      "<"
    );

  // ScrollTrigger.create({
  //   trigger: el.get(0),
  //   pin: ".streamline_blk",
  //   // pinSpacing: false,
  //   start: () => "top top",
  //   // markers: true,
  //   // invalidateOnRefresh: true,
  //   // markers: true,
  //   // smoothChildTiming: true,
  //   // autoRemoveChildren: true,
  //   // fastScrollEnd: true,
  //   // preventOverlaps: true,
  // });
  ScrollTrigger.create({
    trigger: el.get(0),
    scrub: 1.2,
    start: () => "top 80%",
    // start: () => "top +=" + el_innr.get(0).clientHeight + "px center",
    end: () => "+=100%",
    animation: tls,
    markers: true,
    // invalidateOnRefresh: true,
    // markers: true,
    // smoothChildTiming: true,
    // autoRemoveChildren: true,
    // fastScrollEnd: true,
    // preventOverlaps: true,
  });
}
