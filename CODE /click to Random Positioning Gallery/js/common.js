window.addEventListener("load", (event) => {
  const imgGallery = document.querySelectorAll("[random_gallery]");
  if (imgGallery.length > 0) {
    imgGallery.forEach((imgWrapper) => {
      const list = imgWrapper.querySelector("ul");
      const item = list.querySelectorAll("li");
      const totalLn = item.length;
      var count = parseInt(imgWrapper.getAttribute("random_gallery"), 0);
      var duration = Number(imgWrapper.getAttribute("data-time"));

      if (count + 1 < totalLn) {
        if (isNaN(count)) {
          count = Math.floor(totalLn / 2);
        }
        if (duration == 0) {
          duration = 1;
        }
        i = count;

        var i = 0;
        var k = 0;

        //primary setup
        [...item].map((el, i) => {
          gsap.set(el, {
            opacity: 0,
            position: "absolute",
            left: 0,
            top: 0,
            scale: 0.8,
            transformOrighin: "50% 50%",
            zIndex: 0,
            width: gsap.utils.random(35, 48, 5) + "%",
            // width:
            //   (getRandomNumber(
            //     window.innerWidth / count,
            //     window.innerWidth / 2
            //   ) /
            //     window.innerWidth) *
            //     100 +
            //   "%",
          });
          if (i < count) {
            let center = {
              x: window.innerWidth / 2 - el.clientWidth / 2,
              y: window.innerHeight / 2 - el.clientHeight / 2,
              xOffset: window.innerWidth / (count * 2),
              yOffset: window.innerHeight / (count * 2),
            };
            gsap.set(el, {
              opacity: 1,
              x:
                center.x +
                gsap.utils.random(
                  -center.xOffset,
                  center.xOffset,
                  center.xOffset / 2
                ),
              y:
                center.y +
                gsap.utils.random(
                  -center.yOffset,
                  center.yOffset,
                  center.yOffset / 2
                ),
              scale: 1,
              transformOrighin: "50% 50%",
              zIndex: 2,
            });
            el.classList.add("active");
          }
        });

        function callImg(i, pos) {
          gsap.set(item, {
            zIndex: 0,
          });
          gsap.set(item[i], {
            x: pos.x - item[i].clientWidth / 2,
            y: pos.y - item[i].clientHeight / 2,
            scale: 0.8,
            zIndex: 1,
          });
          gsap.to(item[i], {
            opacity: 1,
            scale: 1,
            transformOrighin: "50% 50%",
            ease: "Power3.easeOut",
          });
          item[i].classList.add("active");

          if (list.querySelectorAll("li.active").length > count) {
            if (i - count >= 0) {
              k = i - count;
            } else {
              k = k + 1;
              if (k > totalLn) {
                k = 0;
              }
            }
            // console.log(k);
            gsap.to(item[k], {
              opacity: 0,
              scale: 0.8,
              ease: "Power3.easeOut",
            });
            item[k].classList.remove("active");
          }
        }

        gsap.set(list, {
          opacity: 1,
        });
        imgWrapper.addEventListener("click", (e) => {
          var pos = { x: e.clientX, y: e.clientY };
          callImg(i, pos);
          i++;
          if (i >= totalLn) {
            i = 0;
          }
        });
      }
    });
  }
});
