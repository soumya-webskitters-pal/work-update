const imgGallery = document.querySelectorAll("[random_gallery]");
if (imgGallery.length > 0) {
  imgGallery.forEach((imgWrapper, index) => {
    const list = imgWrapper.querySelector("ul");
    const item = list.querySelectorAll("li");
    const totalLn = item.length;
    var count = parseInt(imgWrapper.getAttribute("random_gallery"), 0);
    var duration = Number(imgWrapper.getAttribute("data-time"));
    if (isNaN(count)) {
      count = Math.floor(totalLn / 2);
    }
    if (duration == 0) {
      duration = 1;
    }
    // console.log(count, duration);
    var k = 0;
    var mainTl = gsap.timeline({
        pause: true,
        defaults: {
          duration: duration,
        },
      }),
      subTl = gsap.timeline({
        pause: true,
        repeatRefresh: true,
        repeat: -1,
        defaults: {
          duration: duration,
        },
      });

    if (count + 2 < totalLn) {
      [...item].map((el, i) => {
        //primary setup
        gsap.set(el, {
          opacity: 0,
          position: "absolute",
          left: 0,
          top: 0,
          x: getRandomNumber(0, list.clientWidth - el.clientWidth / 2),
          y: getRandomNumber(0, list.clientHeight - el.clientHeight / 2),
        });

        if (i >= 0 && i < count) {
          k = count + i;
        }
        if (k > totalLn - 2) {
          k = -1;
        }
        k++;
        //console.log(i, ">>", k, i);

        subTl
          .to(item[k], {
            opacity: 1,
          })
          .to(
            item[i],
            {
              opacity: 0,
            },
            "<"
          )
          .set(item[i], {
            x: getRandomNumber(0, list.clientWidth - item[i].clientWidth / 2),
            y: getRandomNumber(0, list.clientHeight - item[i].clientHeight / 2),
          });
      });
      subTl.pause();

      //for first time show
      for (let i = 0; i <= count; i++) {
        mainTl.set(item[i], { opacity: 0 }).to(item[i], {
          opacity: 1,
          onComplete: () => {
            if (i == count) {
              subTl.restart();
            }
          },
        });
      }
      mainTl.pause();
    }

    gsap.set(list, {
      opacity: 0,
      pointerEvents: "none",
    });
    const btn = imgWrapper.querySelector("[data-gallery_btn]");
    btn.addEventListener("mouseenter", () => {
      mainTl.pause().progress(0);
      subTl.pause().progress(0);
      gsap.to(list, {
        opacity: 1,
        pointerEvents: "all",
        onComplete: () => mainTl.restart(),
      });
    });

    document.addEventListener("mouseleave", () => {
      mainTl.pause().progress(0);
      subTl.pause().progress(0);
      gsap.to(list, {
        opacity: 0,
        pointerEvents: "none",
      });
      gsap.to(item, {
        opacity: 0,
        duration: 0.1,
      });
    });
  });
}
function getRandomNumber(min, max) {
  return Math.random() * (max - min) + min;
}
