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

let timelines = gsap.timeline({ paused: true }),
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
  onUpdate: render, // use animation onUpdate instead of scrollTrigger's onUpdate
});

let offset_factor = 25,
  offset_count = 128,
  frame_limit = 370;

let text_tl = gsap.timeline({ paused: true });
text_tl.to(canvas, {
  delay: 0.5,
  xPercent: -50,
  x: -((window.innerWidth * offset_factor) / 100),
});
$(".sld_block").each(function (idx) {
  let _this = this;
  gsap.set(_this, {
    yPercent: -50,
    y: this.clientHeight,
  });
  if (idx === 0) {
    text_tl.to(_this, {
      delay: 5.5,
      opacity: 1,
      yPercent: -50,
      y: 0,
      duration: 1.5,
    });
  } else {
    text_tl.to(_this, {
      opacity: 1,
      yPercent: -50,
      y: 0,
      duration: 1.5,
    });
  }
  if (idx === $(".sld_block").length - 1) {
    text_tl.to(_this, {
      delay: 1.5,
      opacity: 1,
    });
  } else {
    text_tl
      .to(_this, {
        delay: 2,
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
    canvas.width = images[0].naturalWidth;
    canvas.height = images[0].naturalHeight;
  }
  context.clearRect(0, 0, canvas.width, canvas.height);
  context.drawImage(images[playVideo.frame], 0, 0);
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
        pin: true,
        start: "top top",
        end: "+=250%",
      },
      onUpdate: render, // use animation onUpdate instead of scrollTrigger's onUpdate
    });

    ScrollTrigger.create({
      scrub: 1.1,
      //markers: true,
      trigger: ".canvas_container",
      start: "top top",
      end: "+=200%",
      animation: text_tl,
    });
  }, 500);
}

//call the function if images load successfully else show error.
let imgLoadCounter = 0;
for (let m = 0; m < images.length; m++) {
  images[m].addEventListener("load", function () {
    imgLoadCounter++;
    if (imgLoadCounter == frameCount) {
      console.log(imgLoadCounter + " images loaded successfully");
      gsap.to("#sec_loader", 0.5, { opacity: 0 });
      $("#sec_loader").removeClass("show");
      anim_call();
      render();
    }
  });
  images[m].addEventListener("error", function () {
    $("#sec_loader").addClass("show");
  });
}
