"use strict";
gsap.registerPlugin(ScrollTrigger);
//section loader
function sec_loader() {
  gsap.to("#sec_loader", 0.3, { opacity: 1 });
  //animate first circle
  let sec_loader1 = gsap.timeline({ repeat: -1 });
  sec_loader1
    .set("#c1", { autoAlpha: 0.7 })
    .to("#c1", 0.5, { scale: 0.2, x: "+=5", transformOrigin: "50% 50%" })
    .to("#c1", 0.5, { scale: 1, x: "-=5", transformOrigin: "50% 50%" });
  //animate second circle
  let sec_loader2 = gsap.timeline({ repeat: -1 });
  sec_loader2
    .set("#c2", { autoAlpha: 0.7 })
    .to("#c2", 0.5, { scale: 0.2, x: "-=5", transformOrigin: "50% 50%" })
    .to("#c2", 0.5, { scale: 1, x: "+=5", transformOrigin: "50% 50%" });
}
sec_loader();

let timelines = gsap.timeline({
    paused: true,
  }),
  prevTab;
const canvas = document.getElementById("canvas"),
  context = canvas.getContext("2d"),
  frameCount = 390,
  images = [],
  playVideo = {
    frame: 0,
  };
const currentFrame = (index) =>
  `images/hibear_animation/${(index + 1).toString().padStart(4, "0")}.png`;
for (let _frm = 0; _frm < frameCount; _frm++) {
  const img = new Image();
  img.src = currentFrame(_frm);
  images.push(img);
}
timelines.to(playVideo, {
  duration: 27,
  frame: frameCount - 1,
  snap: "frame",
  markers: true,
  onUpdate: render, // use animation onUpdate instead of scrollTrigger's onUpdate
});

let offset_factor = 25,
  offset_count = 128,
  frame_limit = 370;

let text_tl = gsap.timeline({
  paused: true,
  // onComplete: function () {
  //   // gsap.set(".canvas_container , .pin-spacer", { clearProps: "all" });
  //   // $(".canvas_container").unwrap();
  //   // ScrollTrigger.refresh(true);
  // },
});
var mm = gsap.matchMedia();
mm.add("(min-width: 992px)", () => {
  text_tl.to(canvas, {
    delay: 1,
    xPercent: -15,
    duration: 5,
  });
}).add("(max-width: 991px)", () => {
  text_tl.to(canvas, {
    delay: 1,
    xPercent: -30,
    duration: 5,
  });
});
$(".sld_block").each(function (idx) {
  let _this = this;
  gsap.set(_this, {
    yPercent: -50,
    y: this.clientHeight,
  });
  text_tl.to(_this, {
    opacity: 1,
    yPercent: -50,
    y: 0,
    duration: 1.5,
  });
  if (idx === $(".sld_block").length - 1) {
    text_tl
      .to(_this, {
        opacity: 1,
        duration: 1,
      })
      .to(_this, {
        delay: 5,
        opacity: 1,
        duration: 0.5,
      });
  } else {
    text_tl
      .to(_this, {
        delay: 1,
        opacity: 0,
        yPercent: -50,
        y: -this.clientHeight,
        duration: 1,
      })
      .to(_this, {
        opacity: 0,
        duration: 0.5,
      });
  }
});

function render() {
  if (playVideo.frame <= 1) {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  context.clearRect(0, 0, canvas.width, canvas.height);
  let hRatio = canvas.width / images[0].naturalWidth,
    vRatio = canvas.height / images[0].naturalHeight;
  let ratio = Math.min(hRatio, vRatio);
  let centerShift_x = (canvas.width - images[0].naturalWidth * ratio) / 2,
    centerShift_y = (canvas.height - images[0].naturalHeight * ratio) / 2;

  context.drawImage(
    images[playVideo.frame],
    0,
    0,
    images[0].naturalWidth,
    images[0].naturalHeight,
    centerShift_x,
    centerShift_y,
    images[0].naturalWidth * ratio,
    images[0].naturalHeight * ratio
  );
  // console.log(playVideo.frame);
}

function anim_call() {
  setTimeout(function () {
    gsap.timeline().to(playVideo, {
      frame: frameCount - 1,
      snap: "frame",
      //   ease: "none",
      scrollTrigger: {
        scrub: 1.1,
        // markers: true,
        trigger: ".canvas_container",
        start: "top center",
        end: "+=150%",
        invalidateOnRefresh: true,
        //once: true,
      },
      onUpdate: render, // use animation onUpdate instead of scrollTrigger's onUpdate
      onComplete: () => {
        // timelines.kill(true);
      },
    });

    ScrollTrigger.create({
      scrub: 1.1,
      // markers: true,
      trigger: ".canvas_container",
      start: "top center",
      end: "+=150%",
      animation: text_tl,
      invalidateOnRefresh: true,
      once: true,
      //toggleActions: "start pause pause pause",
      // onComplete: () => {
      //  // text_tl.kill(true);
      // },
    });
    
    ScrollTrigger.create({
      scrub: 1.1,
      // markers: true,
      pin: true,
      trigger: ".canvas_container",
      start: "top top",
      end: "+=100%",
      invalidateOnRefresh: true,
    });

    // ScrollTrigger.create({
    //   scrub: 1.1,
    //   // markers: true,
    //   trigger: ".canvas_container",
    //   start: "top top",
    //   end: "+=150%",
    //   pin: true,
    //   invalidateOnRefresh: true,
    //   once: true,
    // });
  }, 800);
}

//call the function if images load successfully else show error.
let imgLoadCounter = 0;
for (let m = 0; m < images.length; m++) {
  images[m].addEventListener("load", function () {
    imgLoadCounter++;
    if (imgLoadCounter == frameCount) {
      console.log(imgLoadCounter + " images loaded successfully");
      gsap.to("#sec_loader", 0.5, { opacity: 0 });
      // $("#sec_loader").removeClass("show");
      $("#sec_loader").remove();
      anim_call();
      render();
    }
  });
  images[m].addEventListener("error", function () {
    $("#sec_loader").addClass("show");
  });
}
