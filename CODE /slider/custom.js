const d = document;
const $q = d.querySelectorAll.bind(d);
const $g = d.querySelector.bind(d);
const $list = $g(".carousel__list");
// const $prev = $g(".prev");
// const $next = $g(".next");
const dots = document.querySelectorAll(".pg_dot");
var dotFlag = 0;
const time = 5000;
const slideToShow = 3;
var auto, pauser;
var allslides = $list.querySelectorAll(".carousel__item").length;

function playvideo(item) {
  $list.querySelectorAll("video").forEach(function (each_video) {
    each_video.currentTime = 0;
    if (item === each_video.closest(".carousel__item")) {
      each_video.play();
    } else {
      each_video.pause();
    }
  });
}

const getActiveIndex = () => {
  const $active = $g("[data-active]");
  return getSlideIndex($active);
};

const getSlideIndex = ($slide) => {
  return [...$q(".carousel__item")].indexOf($slide);
};

const prevSlide = () => {
  dotFlag--;
  const index = getActiveIndex();
  const $slides = $q(".carousel__item");
  const $last = $slides[$slides.length - 1];
  $last.remove();
  $list.prepend($last);
  activateSlide($q(".carousel__item")[index]);
};
const nextSlide = () => {
  dotFlag++;
  const index = getActiveIndex();
  const $slides = $q(".carousel__item");
  const $first = $slides[0];
  $first.remove();
  $list.append($first);
  activateSlide($q(".carousel__item")[index]);
};

const chooseSlide = (index) => {
  if (index == slideToShow + 1) return;
  if (index > slideToShow) nextSlide();
  if (index === slideToShow) prevSlide();
};

const activateSlide = ($slide) => {
  if (!$slide) return;
  const $slides = $q(".carousel__item");
  $slides.forEach((el) => {
    el.removeAttribute("data-active");
  });
  dots.forEach((el) => {
    el.classList.remove("active");
  });
  $slide.setAttribute("data-active", true);
  $slide.focus();
  playvideo($slide);

  if (dotFlag < 0) {
    dotFlag = 2;
  }
  if (dotFlag > 2) {
    dotFlag = 0;
  }
  console.log(dotFlag);
  dots[dotFlag].classList.add("active");
};

const autoSlide = () => {
  nextSlide();
};

const pauseAuto = () => {
  clearInterval(auto);
  clearTimeout(pauser);
};

const handleNextClick = (e) => {
  pauseAuto();
  nextSlide(e);
};

const handlePrevClick = (e) => {
  pauseAuto();
  prevSlide(e);
};

const startAuto = () => {
  auto = setInterval(autoSlide, time);
  setTimeout(() => {
    playvideo($g("[data-active]"));
  }, 300);
};

dots[0].classList.add("active");
dots[0].parentElement.setAttribute("style", `--time:${time}ms`);

const handleSlideClick = (e) => {
  pauseAuto();
  const $slide = e.target.closest(".carousel__item");
  const index = getSlideIndex($slide);
  chooseSlide(index);
};

// const dotsClick = (e) => {
//   pauseAuto();
//   const $slide = e.target;
//   const index = [...$q(".pg_dot")].indexOf($slide);
//   console.log(index);

//   if (index == 0) {
//   }
//   if (index == 1) {
//   }
//   if (index == 2) {
//   }
//   // chooseSlide(index);
// };

startAuto();

// $next.addEventListener("click", handleNextClick);
// $prev.addEventListener("click", handlePrevClick);
$list.addEventListener("click", handleSlideClick);

document.querySelectorAll(".pg_dot").forEach((el, i) => {
  el.addEventListener("click", function (e) {
    var all_dots = document.querySelectorAll(".pg_dot");
    if (el.classList.contains("active")) {
      e.preventDefault();
    } else {
      pauseAuto();
      if (all_dots[0].classList.contains("active")) {
        if (i == 1) {
          nextSlide();
        }
        if (i == 2) {
          nextSlide();
          nextSlide();
        }
      }
      if (dots[1].classList.contains("active")) {
        if (i == 0) {
          prevSlide();
        }
        if (i == 2) {
          nextSlide();
        }
      }
      if (dots[2].classList.contains("active")) {
        if (i == 0) {
          prevSlide();
          prevSlide();
        }
        if (i == 1) {
          prevSlide();
        }
      }
      startAuto();
    }
  });
});

// dots.forEach((m, index) => {
//   m.addEventListener("click", function () {
//     if (index == 0) {
//       prevSlide();
//     }
//     if (index == 1) {
//       chooseSlide(5);
//     }
//     if (index == 2) {
//     }
//   });

//   // m.addEventListener("click", dotsClick);
// });
