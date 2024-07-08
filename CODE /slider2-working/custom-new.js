document.querySelectorAll(".carousel").forEach((gg) => {
  const list = gg.querySelector(".carousel__list");
  const time = 30000;
  const slideToShow = 3;

  if (list.hasChildNodes()) {
    var list_item = list.querySelectorAll(".carousel__item");
    list_item.forEach((el, i) => {
      el.setAttribute("tabindex", 0);
      el.setAttribute("slideActualIndex", i);
    });

    function init() {
      list_item = list.querySelectorAll(".carousel__item");
      let j = list_item.length - 1;
      list_item.forEach((el, i) => {
        el.classList.remove("show");
        if (i < slideToShow) {
          el.classList.add("show");
        }
        if (i == j-1) {
        console.log(i,j);
          let clone = list_item[j].cloneNode(true);
          list.prepend(clone);
          j++
        }
      });
    }
    init();
    // 6  --- 3

    // 0
    // 1
    // 2
    // 3
    // 4 -
    // 5 -

    // const prev = gg.querySelector(".prev");
    // const next = gg.querySelector(".next");
    // let auto, pauser;

    // function pauseAll() {
    //   list.querySelectorAll("video").forEach(function (each_video) {
    //     each_video.pause();
    //     // each_video.currentTime = 0;
    //   });
    // }
    // function playvideo(item) {
    //   item.querySelector("video").play();
    // }

    // const getActiveIndex = () => {
    //   list_item = list.querySelectorAll(".carousel__item");
    //   const $active = list.querySelector("[data-active]");
    //   return getSlideIndex($active);
    // };

    // const getSlideIndex = ($slide) => {
    //   list_item = list.querySelectorAll(".carousel__item");
    //   return [...list_item].indexOf($slide);
    // };

    // const prevSlide = () => {
    //   list_item = list.querySelectorAll(".carousel__item");
    //   const index = getActiveIndex();
    //   const $last = list_item[list_item.length - 1];
    //   $last.remove();
    //   list.prepend($last);
    //   activateSlide(list_item[index]);
    // };
    // const nextSlide = () => {
    //   list_item = list.querySelectorAll(".carousel__item");
    //   const index = getActiveIndex();
    //   const $first = list_item[0];
    //   $first.remove();
    //   list.append($first);
    //   activateSlide(list_item[index]);
    // };

    // const chooseSlide = (e) => {
    //   const max = window.matchMedia("screen and ( max-width: 600px)").matches
    //     ? 5
    //     : 8;
    //   const $slide = e.target.closest(".carousel__item");
    //   const index = getSlideIndex($slide);
    //   if (index < 3 || index > max) return;
    //   if (index === max) nextSlide();
    //   if (index === 3) prevSlide();
    //   activateSlide($slide);
    // };

    // const activateSlide = ($slide) => {
    //   if (!$slide) return;
    //   list_item.forEach((el) => {
    //     el.removeAttribute("data-active");
    //     //  el.classList.remove("active");
    //   });
    //   $slide.setAttribute("data-active", true);
    //   //  $slide.classList.add("active");
    //   $slide.focus();
    //   pauseAll();
    //   playvideo($slide);
    // };

    // const autoSlide = () => {
    //   nextSlide();
    // };

    // const pauseAuto = () => {
    //   clearInterval(auto);
    //   clearTimeout(pauser);
    // };

    // pauseAll();
    // setTimeout(() => {
    //   playvideo(list.querySelector("[data-active]"));
    // }, 300);

    // const handleNextClick = (e) => {
    //   pauseAuto();
    //   nextSlide(e);
    // };

    // const handlePrevClick = (e) => {
    //   pauseAuto();
    //   prevSlide(e);
    // };

    // const handleSlideClick = (e) => {
    //   pauseAuto();
    //   chooseSlide(e);
    // };

    // const handleSlideKey = (e) => {
    //   switch (e.keyCode) {
    //     case 37:
    //     case 65:
    //       handlePrevClick();
    //       break;
    //     case 39:
    //     case 68:
    //       handleNextClick();
    //       break;
    //   }
    // };

    // const startAuto = () => {
    //   auto = setInterval(autoSlide, time);
    // };

    // startAuto();

    // next.addEventListener("click", handleNextClick);
    // prev.addEventListener("click", handlePrevClick);

    //  list.addEventListener( "click", handleSlideClick );
    //  list.addEventListener( "focusin", handleSlideClick );
    //  list.addEventListener( "keyup", handleSlideKey );
  }
});
