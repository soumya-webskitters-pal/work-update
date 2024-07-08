window.history.scrollRestoration = "manual";
ScrollTrigger.clearScrollMemory();
window.scrollTo(0, 0);
gsap.registerPlugin(ScrollTrigger);

let video_sec = document.querySelector(".video_sec");
let videoBox = video_sec.querySelector(".video_box"),
  videoPara = video_sec.querySelector(".para");

gsap.set(videoBox, {
  clipPath: "inset(12% 15%)",
  scale: 0.6,
  yPercent: -25,
  transformOrigin: "50% 100%",
});
gsap.set(videoPara, {
  opacity: 0,
  yPercent: 100,
});

let topPos = videoBox.getBoundingClientRect().top;
let tl = gsap.timeline({
  defaults: {
    duration: 0.5,
    ease: "none",
  },
});

tl.set(videoBox, {
  clipPath: "inset(12% 15%)",
  scale: 0.6,
  yPercent: -25,
  overwrite: true,
})
  .set(videoPara, {
    opacity: 0,
    yPercent: 100,
    overwrite: true,
  })
  .to(videoBox, {
    scale: 0.8,
    yPercent: 0,
    clipPath: "inset(5% 5%)",
  })
  .to(videoBox, {
    scale: 1,
    yPercent: 0,
    clipPath: "inset(0% 0%)",
    duration: 1.5,
  })
  .to(
    videoPara,
    {
      opacity: 1,
      yPercent: 0,
    },
    "-=1"
  )
  .to(videoPara, {
    opacity: 0,
    yPercent: -200,
  })
  .to(videoBox, {
    clipPath: "inset(30% 40% 30% 15%)",
    scale: 0.5,
    yPercent: 50,
    transformOrigin: "50% 100%",
  });

tl.pause();
ScrollTrigger.create({
  trigger: video_sec,
  start: `top ${topPos}`,
  end: "+=300%",
  animation: tl,
  scrub: 1.3,
  //   invalidateOnRefresh: true,
  //   scroller: page_container,
  markers: true,
});

ScrollTrigger.create({
  trigger: video_sec,
  start: "top top",
  end: "+=200%",
  pin: true,
  scrub: 1.3,
  //   invalidateOnRefresh: true,
  //   scroller: page_container,
  markers: true,
});
