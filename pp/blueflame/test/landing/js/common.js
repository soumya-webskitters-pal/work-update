//create plugin for homepage
!(function ($) {
  const defaults = {
    easing: "ease",
    animationTime: 1000,
    pagination: true,
    updateURL: false,
    keyboard: true,
    beforeMove: null,
    afterMove: null,
    loop: true,
    responsiveFallback: false,
    direction: "vertical",
    hashValue: parseInt(window.location.hash.replace("#", "")),
    videoContainer: "#video-hero",
    container: "body",
    totalContainer: "#main",
    sectionContainer: "section",
    scrollContainer: "body",
    enableSectionFadeIn: true,
  };

  let settings = defaults;

  const opacityTransition = (item, animationTime, easing, opacity) => {
    if (item) {
      const styles = {
        // "-webkit-transform": `opacity ${animationTime / 2}ms ease-in-out`,
        "-webkit-transition": `all ${animationTime / 2}ms ${easing}`,
        // "-moz-transform": `opacity ${animationTime / 2}ms ease-in-out`,
        "-moz-transition": `all ${animationTime / 2}ms ${easing}`,
        // "-ms-transform": `opacity ${animationTime / 2}ms ease-in-out`,
        "-ms-transition": `all ${animationTime / 2}ms ${easing}`,
        // transform: `opacity ${animationTime / 2}ms ease-in-out`,
        transition: `all ${animationTime / 2}ms ${easing}`,
        opacity: opacity,
      };
      Object.keys(styles).forEach((key) => {
        item.style[key] = styles[key];
      });
      // gsap.to(item, {
      //   duration: animationTime / 2,
      //   opacity: opacity,
      //   ease: easing,
      // });
    }
  };

  const positionTransition = (item, direction, pos, animationTime, easing) => {
    if (item) {
      const styles = {
        "-webkit-transform":
          direction === "horizontal"
            ? `translate3d(calc(100vw * ${pos}%), 0, 0)`
            : `translate3d(0, calc(100vh * ${pos}%), 0)`,
        "-webkit-transition": `all ${animationTime}ms ${easing}`,
        "-moz-transform":
          direction === "horizontal"
            ? `translate3d(calc(100vw * ${pos}%), 0, 0)`
            : `translate3d(0, calc(100vh * ${pos}%), 0)`,
        "-moz-transition": `all ${animationTime}ms ${easing}`,
        "-ms-transform":
          direction === "horizontal"
            ? `translate3d(calc(100vw * ${pos}%), 0, 0)`
            : `translate3d(0, calc(100vh * ${pos}%), 0)`,
        "-ms-transition": `all ${animationTime}ms ${easing}`,
        transform:
          direction === "horizontal"
            ? `translate3d(calc(100vw * ${pos}%), 0, 0)`
            : `translate3d(0, calc(100vh * ${pos}%), 0)`,
        transition: `all ${animationTime}ms ${easing}`,
        top: `${pos}px`,
      };

      Object.keys(styles).forEach((key) => {
        item.style[key] = styles[key];
      });

      // gsap.to(item,{
      // duration: animationTime,
      // ease: easing,
      // transform:
      // direction === "horizontal"
      //   ? `translate3d(calc(100vw * ${pos}%), 0, 0)`
      //   : `translate3d(0, calc(100vh * ${pos}%), 0)`,
      //   top: `${pos}px`,
      // })
    }
  };

  const delay = (ms) => new Promise((res) => setTimeout(res, ms));

  $.fn.swipeEvents = function () {
    return this.each(function () {
      let startX,
        startY,
        $this = $(this);

      $this.bind("touchstart", function touchstart(event) {
        const touches = event.originalEvent.touches;
        if (touches && touches.length) {
          startX = touches[0].pageX;
          startY = touches[0].pageY;
          $this.bind("touchmove", touchmove);
        }
      });

      function touchmove(event) {
        const touches = event.originalEvent.touches;
        if (touches && touches.length) {
          const deltaX = startX - touches[0].pageX;
          const deltaY = startY - touches[0].pageY;

          if (deltaX >= 50) {
            $this.trigger("swipeLeft");
          }
          if (deltaX <= -50) {
            $this.trigger("swipeRight");
          }
          if (deltaY >= 50) {
            $this.trigger("swipeUp");
          }
          if (deltaY <= -50) {
            $this.trigger("swipeDown");
          }
          if (Math.abs(deltaX) >= 50 || Math.abs(deltaY) >= 50) {
            $this.unbind("touchmove", touchmove);
          }
        }
      }
    });
  };

  /**
   * @name pageLoadLottie
   * @description loadup Lottie animations
   * @type {{src: string}}
   */
  const defaultLottieSettings = { src: "" };
  $.fn.pageLoadLottie = function (options) {
    const settings = Object.assign(defaultLottieSettings, options);
    const lottiePlayer = this.get(0);
    if (lottiePlayer) {
      $.ajax({
        url: settings.src,
        headers: { "Content-Type": "application/json" },
        type: "GET",
        dataType: "json",
        data: {},
        success: (result) => {
          let animation = bodymovin.loadAnimation({
            container: lottiePlayer,
            renderer: "svg",
            loop: true,
            autoplay: true,
            animationData: result,
          });

          let animate;
          if (typeof LottieInteractivity === "object") {
            const { create } = LottieInteractivity;
            if (animation && create) {
              animate = create({
                player: animation,
                mode: "chain",
                actions: JSON.parse($(lottiePlayer).attr("actions")),
              });
            }
          }

          $(document).on("lottie-reset", () => {
            animate.jumpToInteraction(0);
          });
        },
        error: (err) => {
          console.error("error", err);
        },
      });
    }
  };

  $.fn.pageInside = function (options) {
    const settings = Object.assign(defaults, options);
    const el = $(settings.totalContainer);
    const sections = $(settings.sectionContainer);
    const body = $(settings.scrollContainer);
    let total = sections.length,
      topPos = 0,
      leftPos = 0,
      lastAnimation = 0,
      quietPeriod = 500,
      paginationList = "";

    const removeClass = (selector, className) => {
      const elements = document.querySelectorAll(selector);
      if (elements.length) {
        elements.forEach((element) => {
          element.classList.remove(className);
        });
      }
    };

    const addClass = (selector, className) => {
      const elements = document.querySelectorAll(selector);
      if (elements.length) {
        elements.forEach((element) => {
          element.classList.add(className);
        });
      }
    };

    const animateInternal = (index, pos, direction, current, target) => {
      //  console.log(index, pos, current, target);
      if (current !== target) {
        index == 1
          ? $(".onepage-pagination").addClass("hidden")
          : $(".onepage-pagination").removeClass("hidden");
        const sections = document.querySelectorAll(settings.sectionContainer);
        let inViewSection = index - 1;

        removeClass(`${settings.sectionContainer}.in-view`, "in-view");
        removeClass(`${settings.sectionContainer}.subsection`, "subsection");

        const linked = sections[inViewSection].getAttribute("linked");
        if (linked) {
          inViewSection = parseInt(linked) - 1;
          sections[inViewSection].classList.add("subsection");
        }
        const subsections =
          sections[inViewSection].querySelectorAll(".sub-wrapper");
        if (subsections.length) {
          opacityTransition(
            subsections[0],
            settings.animationTime,
            settings.easing,
            linked ? 0 : 1
          );
          opacityTransition(
            subsections[1],
            settings.animationTime,
            settings.easing,
            linked ? 1 : 0
          );
        }

        const lottiePlayer =
          sections[inViewSection].querySelector("lottie-player");
        if (lottiePlayer) {
          opacityTransition(
            lottiePlayer,
            settings.animationTime,
            settings.easing,
            0
          );
        }

        sections[inViewSection].classList.add("in-view");

        const viewHeight = document.querySelector("html").offsetHeight;
        sections.forEach((section, index) => {
          const container = section.querySelector(".container");
          if (container) {
            container.classList.remove("direction-down");
            container.classList.remove("direction-up");
            if (inViewSection !== index) {
              container.classList.add(
                inViewSection > index ? "direction-down" : "direction-up"
              );
              positionTransition(
                container,
                settings.direction,
                inViewSection > index ? -viewHeight / 2 : viewHeight / 2,
                settings.animationTime,
                settings.easing
              );
              opacityTransition(
                section,
                settings.animationTime,
                settings.easing,
                0
              );
              $(section).css({ "z-index": "0" });
            }
          }
        });

        let triggered = false;
        $(sections).unbind(
          "webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend"
        );
        $(sections).one(
          "webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend",
          function (e) {
            if (!triggered) {
              triggered = true;
              const container =
                sections[inViewSection].querySelector(".container");
              container.classList.add(
                inViewSection < current ? "direction-down" : "direction-up"
              );
              positionTransition(
                container,
                settings.direction,
                0,
                settings.animationTime,
                settings.easing
              );
              opacityTransition(
                sections[inViewSection],
                settings.animationTime,
                settings.easing,
                1
              );
              $(sections[inViewSection]).css({ "z-index": "1" });
            }
          }
        );

        if (lottiePlayer) {
          opacityTransition(
            lottiePlayer,
            settings.animationTime,
            settings.easing,
            1
          );
          $(document).trigger("lottie-reset");
        }
      }
    };

    const transformPage = function (
      settings,
      pos,
      index,
      direction,
      current,
      target
    ) {
      if (current !== target) {
        if (typeof settings.beforeMove == "function") {
          settings.beforeMove(index);
        }
        const _this = $(this);
        animateInternal(index, pos, direction, current, target);
        $(document).trigger("nextPlayIndex", { nextPlayIndex: index });
        _this.unbind(
          "webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend"
        );
        _this.one(
          "webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend",
          function (e) {
            if (typeof settings.afterMove == "function") {
              settings.afterMove(index);
            }
          }
        );
      }
    };

    $.fn.moveDown = function () {
      const el = $(this);
      let index = $(`${settings.sectionContainer}.active`).data("index");
      let current = $(`${settings.sectionContainer}[data-index='${index}']`);
      let next = $(`${settings.sectionContainer}[data-index='${index + 1}']`);
      let pos;
      if (next.length < 1) {
        if (settings.loop === true) {
          pos = 0;
          next = $(`${settings.sectionContainer}[data-index='1']`);
        } else {
          return;
        }
      } else {
        pos = index * 100 * -1;
      }
      current.removeClass("active");
      next.addClass("active");
      if (settings.pagination === true) {
        $(`.onepage-pagination li a[data-index='${index}']`).removeClass(
          "active"
        );
        $(
          `.onepage-pagination li a[data-index='${next.data("index")}']`
        ).addClass("active");
      }

      body[0].className = body[0].className.replace(
        /\bviewing-page-\d.*?\b/g,
        ""
      );
      body.addClass(`viewing-page-${next.data("index")}`);

      if (history.replaceState && settings.updateURL === true) {
        const href =
          window.location.href.substr(0, window.location.href.indexOf("#")) +
          "#" +
          (index + 1);
        history.pushState({}, document.title, href);
      }
      transformPage(
        settings,
        pos,
        next.data("index"),
        "down",
        index,
        index + 1
      );
    };

    $.fn.moveUp = function () {
      const el = $(this);
      let index = $(`${settings.sectionContainer}.active`).data("index");
      let current = $(`${settings.sectionContainer}[data-index='${index}']`);
      let next = $(`${settings.sectionContainer}[data-index='${index - 1}']`);

      let pos;
      if (next.length < 1) {
        if (settings.loop === true) {
          pos = (total - 1) * 100 * -1;
          next = $(`${settings.sectionContainer}[data-index='${total}']`);
        } else {
          return;
        }
      } else {
        pos = (next.data("index") - 1) * 100 * -1;
      }
      current.removeClass("active");
      next.addClass("active");
      if (settings.pagination === true) {
        $(`.onepage-pagination li a[data-index='${index}']`).removeClass(
          "active"
        );
        $(
          `.onepage-pagination li a[data-index='${next.data("index")}']`
        ).addClass("active");
      }
      const body = $(settings.scrollContainer);
      body[0].className = body[0].className.replace(
        /\bviewing-page-\d.*?\b/g,
        ""
      );
      body.addClass(`viewing-page-${next.data("index")}`);

      if (history.replaceState && settings.updateURL === true) {
        const href =
          window.location.href.substr(0, window.location.href.indexOf("#")) +
          "#" +
          (index - 1);
        history.pushState({}, document.title, href);
      }
      transformPage(settings, pos, next.data("index"), "up", index, index - 1);
    };

    $.fn.moveTo = function (page_index) {
      let current = $(`${settings.sectionContainer}.active`);
      let next = $(`${settings.sectionContainer}[data-index='${page_index}']`);
      if (next.length > 0) {
        current.removeClass("active");
        next.addClass("active");
        $(`.onepage-pagination li a.active`).removeClass("active");
        $(`.onepage-pagination li a[data-index='${page_index}']`).addClass(
          "active"
        );
        const body = $("body");
        body[0].className = body[0].className.replace(
          /\bviewing-page-\d.*?\b/g,
          ""
        );
        body.addClass(`viewing-page-${next.data("index")}`);

        pos = (page_index - 1) * 100 * -1;

        if (history.replaceState && settings.updateURL === true) {
          const href =
            window.location.href.substr(0, window.location.href.indexOf("#")) +
            "#" +
            (page_index - 1);
          history.pushState({}, document.title, href);
        }
        transformPage(
          settings,
          pos,
          page_index,
          current.data("index") < next.data("index") ? "down" : "up",
          current.data("index"),
          next.data("index")
        );
      }
    };

    const responsive = () => {
      let valForTest = false;
      const typeOfRF = typeof settings.responsiveFallback;

      if (typeOfRF === "number") {
        valForTest = $(window).width() < settings.responsiveFallback;
      }
      if (typeOfRF === "boolean") {
        valForTest = settings.responsiveFallback;
      }
      let valFunction;
      let typeOFv;
      if (typeOfRF === "function") {
        valFunction = settings.responsiveFallback();
        valForTest = valFunction;
        typeOFv = typeof valForTest;
        if (typeOFv === "number") {
          valForTest = $(window).width() < valFunction;
        }
      }

      if (valForTest) {
        body.addClass("disabled-onepage-scroll");
        body.unbind("mousewheel DOMMouseScroll MozMousePixelScroll");
        el.swipeEvents().unbind("swipeDown swipeUp");
      } else {
        if (body.hasClass("disabled-onepage-scroll")) {
          body.removeClass("disabled-onepage-scroll");
          $("html, body, .wrapper").animate({ scrollTop: 0 }, "fast");
        }

        el.swipeEvents()
          .bind("swipeDown", (event) => {
            if (!body.hasClass("disabled-onepage-scroll")) {
              event.cancelable && event.preventDefault();
            }
            el.moveUp();
          })
          .bind("swipeUp", function (event) {
            if (!body.hasClass("disabled-onepage-scroll")) {
              event.cancelable && event.preventDefault();
            }
            el.moveDown();
          });

        if (body) {
          body.bind(
            "mousewheel DOMMouseScroll MozMousePixelScroll",
            (event) => {
              event.cancelable && event.preventDefault();
              const delta =
                event.originalEvent.wheelDelta || -event.originalEvent.detail;
              init_scroll(event, delta);
            }
          );
        }
      }
    };

    const init_scroll = (event, delta) => {
      let deltaOfInterest = delta;
      const timeNow = new Date().getTime();
      if (timeNow - lastAnimation < quietPeriod + settings.animationTime) {
        event.cancelable && event.preventDefault();
        return;
      }
      deltaOfInterest < 0 ? el.moveDown() : el.moveUp();
      lastAnimation = timeNow;
    };

    el.addClass("onepage-wrapper").css("position", "relative");
    $.each(sections, function (i) {
      $(this)
        .css({
          position: "absolute",
          opacity: 1,
          left: 0,
          top: 0,
        })
        .addClass("section")
        .attr("data-index", i + 1);
      settings.direction === "horizontal"
        ? (leftPos = leftPos + 100)
        : (topPos = topPos + 100);
      if (settings.pagination === true) {
        paginationList += `<li><a data-index='${i + 1}' href='#${
          i + 1
        }'></a></li>`;
      }
    });

    el.swipeEvents()
      .bind("swipeDown", (event) => {
        if (!body.hasClass("disabled-onepage-scroll")) {
          event.cancelable && event.preventDefault();
        }
        el.moveUp();
      })
      .bind("swipeUp", function (event) {
        if (!body.hasClass("disabled-onepage-scroll")) {
          event.cancelable && event.preventDefault();
        }
        el.moveDown();
      });

    // Create Pagination and Display Them
    if (settings.pagination === true) {
      if ($("ul.onepage-pagination").length < 1)
        $("<ul class='onepage-pagination'></ul>").prependTo(
          settings.scrollContainer
        );

      if (settings.direction === "horizontal") {
        posLeft = (el.find(".onepage-pagination").width() / 2) * -1;
        el.find(".onepage-pagination").css("margin-left", posLeft);
      } else {
        posTop = (el.find(".onepage-pagination").height() / 2) * -1;
        el.find(".onepage-pagination").css("margin-top", posTop);
      }
      $("ul.onepage-pagination").html(paginationList);
    }

    let init_index;
    let next;
    let pos;
    if (window.location.hash !== "" && window.location.hash !== "#1") {
      init_index = window.location.hash.replace("#", "");

      if (parseInt(init_index) <= total && parseInt(init_index) > 0) {
        $(settings.sectionContainer + `[data-index='${init_index}']`).addClass(
          "active"
        );
        body.addClass("viewing-page-" + init_index);
        if (settings.pagination === true)
          $(`.onepage-pagination li a[data-index='${init_index}']`).addClass(
            "active"
          );

        next = $(settings.sectionContainer + `[data-index='${init_index}']`);
        if (next) {
          next.addClass("active");
          if (settings.pagination === true)
            $(`.onepage-pagination li a[data-index='${init_index}']`).addClass(
              "active"
            );
          body[0].className = body[0].className.replace(
            /\bviewing-page-\d.*?\b/g,
            ""
          );
          body.addClass(`viewing-page-${next.data("index")}`);
          if (history.replaceState && settings.updateURL === true) {
            const href =
              window.location.href.substr(
                0,
                window.location.href.indexOf("#")
              ) +
              "#" +
              init_index;
            history.pushState({}, document.title, href);
          }
        }
        pos = (init_index - 1) * 100 * -1;
        positionTransition(
          $(`${settings.sectionContainer}.active .container`).get(0),
          settings.direction,
          $("html").height() / 2,
          settings.animationTime / 2,
          settings.easing
        );
        transformPage(
          settings,
          pos,
          init_index,
          "down",
          init_index - 1,
          parseInt(init_index)
        );
      } else {
        $(`${settings.sectionContainer}[data-index='1']`).addClass("active");
        body.addClass("viewing-page-1");
        if (settings.pagination === true) {
          $(`.onepage-pagination li a[data-index='1']`).addClass("active");
        }
      }
    } else {
      $(`${settings.sectionContainer}[data-index='1']`).addClass("active");
      body.addClass("viewing-page-1");
      if (settings.pagination === true) {
        $(`.onepage-pagination li a[data-index='1']`).addClass("active");
      }
      positionTransition(
        $(`${settings.sectionContainer}.active .container`).get(0),
        settings.direction,
        $("html").height() / 2,
        settings.animationTime / 2,
        settings.easing
      );
      transformPage(settings, pos, 1, "down", 0, 1);
    }

    if (settings.pagination === true) {
      $(".onepage-pagination li a").click(function () {
        const page_index = $(this).data("index");
        el.moveTo(page_index);
      });
    }

    if (body) {
      body.bind(
        "mousewheel DOMMouseScroll MozMousePixelScroll",
        function (event) {
          event.cancelable && event.preventDefault();
          const delta =
            event.originalEvent.wheelDelta || -event.originalEvent.detail;
          if (
            !$(settings.scrollContainer).hasClass("disabled-onepage-scroll")
          ) {
            init_scroll(event, delta);
          }
        }
      );
    }

    if (settings.responsiveFallback !== false) {
      $(window).resize(function () {
        responsive();
      });

      responsive();
    }

    if (settings.keyboard === true) {
      $(document).keydown(function (e) {
        const tag = e.target.tagName.toLowerCase();

        if (!$(settings.scrollContainer).hasClass("disabled-onepage-scroll")) {
          switch (e.which) {
            case 38:
              if (tag !== "input" && tag !== "textarea") el.moveUp();
              break;
            case 40:
              if (tag !== "input" && tag !== "textarea") el.moveDown();
              break;
            case 32:
              if (tag !== "input" && tag !== "textarea") el.moveDown();
              break;
            case 33:
              if (tag !== "input" && tag !== "textarea") el.moveUp();
              break;
            case 34:
              if (tag !== "input" && tag !== "textarea") el.moveDown();
              break;
            case 36:
              el.moveTo(1);
              break;
            case 35:
              el.moveTo(total);
              break;
            default:
              return;
          }
        }
      });
    }
    return false;
  };

  $.fn.pageBGLoader = function (options) {
    const settings = Object.assign(
      {
        srcDesktop: "",
        srcMobile: "",
        breakpoint: 991,
        loaderWrapper: null,
        sectionContainer: "section",
        container: "body",
        scrollContainer: "body",
        videoContainer: "#video-hero",
        enableSectionFadeIn: false,
        forceSkipFade: false,
        hashValue: parseInt(window.location.hash.replace("#", "")),
        frameGap: 0.1 /** gap front and end of loop, intro and outro */,
        easing: "ease",
        siteLoaded: false,
      },
      options
    );

    const controller = new AbortController();
    let loaderNumber = null;
    let isMobile = false;
    let processing = false;
    let frameCut = false;
    let positions = [];
    let startTime = 0;
    let endTime = 0;
    let isSkip = false;
    let playQueue = [];
    let retryCount = 0;
    let isPlaying = false;
    let videoLoopInterval;
    let video = $(settings.videoContainer).get(0);
    let sections = $(`${settings.container} ${settings.sectionContainer}`);
    let currentIndex = settings.hashValue ? settings.hashValue - 1 : 0;

    if (settings.loaderWrapper) {
      loaderNumber = settings.loaderWrapper.querySelector(".loader_number");
    }

    /**
     * @name convertTime
     * @description convert string time/frame MINUTES:SECONDS:FRAMES to seconds
     * @param time
     * @returns {number}
     */
    const convertTime = (time) => {
      const [min, sec, frames] = time ? time.split(":") : ["00", "00", "00"];
      return Math.max(
        parseInt(min) * 60 + parseInt(sec) + parseInt(frames) * (1 / 30),
        0.01
      );
    };

    /**
     * @name convertTimeRange
     * @description convert time range
     * @param timeRange
     * @returns {[number,number,*]}
     */
    const convertTimeRange = (timeRange) => {
      return [
        parseFloat((convertTime(timeRange[0]) + settings.frameGap).toFixed(3)),
        parseFloat((convertTime(timeRange[1]) - settings.frameGap).toFixed(3)),
        timeRange[2],
      ];
    };

    /**
     * @description gather time marker values from the sections
     */
    sections.toArray().forEach((dom) => {
      const section = $(dom);
      positions.push({
        forward: convertTimeRange([
          section.attr("transitionstart")
            ? section.attr("transitionstart")
            : "00:00:00",
          section.attr("transitionend")
            ? section.attr("transitionend")
            : "00:00:00",
          !(section.attr("transitionstart") === section.attr("transitionend")),
        ]),
        now: convertTimeRange([
          section.attr("loopstart") ? section.attr("loopstart") : "00:00:00",
          section.attr("loopend") ? section.attr("loopend") : "00:00:00",
          !(section.attr("loopstart") === section.attr("loopend")),
        ]),
        back: convertTimeRange([
          section.attr("transitionstartbackward")
            ? section.attr("transitionstartbackward")
            : "00:00:00",
          section.attr("transitionendbackward")
            ? section.attr("transitionendbackward")
            : "00:00:00",
          !(
            section.attr("transitionstartbackward") ===
            section.attr("transitionendbackward")
          ),
        ]),
      });
    });

    /**
     * @description set initial playQueue load
     */
    playQueue = [
      [],
      positions[currentIndex].forward,
      positions[currentIndex].now,
    ];

    /**
     * @name videoLoop
     * @description video loop that handles the range load
     */
    const videoLoop = (timestamp) => {
      const currentTime = video.currentTime;
      if (currentTime >= endTime || frameCut) {
        /** remove top playable */
        if (playQueue.length > 1) {
          frameCut = false;
          playQueue.shift();
        }
        /** feed next playable */
        [startTime, endTime, visible] = playQueue[0];
        video.currentTime = Math.max(startTime, 0.01).toFixed(3);
        if (
          playQueue.length <= 2 &&
          $(settings.totalContainer).hasClass("transition-fade-out")
        ) {
          let transitionLength = endTime - startTime + settings.frameGap;
          if (transitionLength > 1) {
            transitionLength = 1 + settings.frameGap;
          }
          /** main transition marker */
          $(settings.totalContainer).removeClass("transition-fade-out");
          /** transition fade in video background */
          transitionLength = 0.5;
          setTimeout(() => {
            opacityTransition(
              video,
              transitionLength * 1000,
              settings.easing,
              1
            );
            frameCut = true;
          }, 10);
        }
      } else {
        /** normalize currentTime */
        if (currentTime < startTime) {
          video.currentTime = Math.max(startTime, 0.01).toFixed(3);
        }
      }
      if (isSkip) {
        if (endTime - video.currentTime > 1) {
          endTime = video.currentTime + 1 + settings.frameGap;
        }
        const transitionLength = 1;
        /** main transition marker */
        $(settings.totalContainer).addClass("transition-fade-out");
        /** transition fade out video background */
        opacityTransition(video, transitionLength * 1000, settings.easing, 0);
        isSkip = false;
      }
    };

    /**
     * forcePlay
     * @description force play video and resolve tap to play
     * @param player
     * @returns {Promise<unknown>}
     */
    const forcePlay = (player) => {
      return new Promise((resolve, reject) => {
        player
          .play()
          .then(() => {
            isPlaying = true;
            console.info(
              !retryCount
                ? "Browser with Autoplay"
                : "background Video is now playing"
            );
          })
          .catch(() => {
            console.info("Browser without Autoplay");
            settings.loaderWrapper.querySelector(".loading-text").innerText =
              !isPlaying ? "Tap to Start" : "Loading";
            $("body")
              .unbind("click touchstart")
              .bind("click touchstart", function () {
                $("body").unbind("click touchstart");
                if (!isPlaying) {
                  forcePlay(player)
                    .then(() => {
                      isPlaying = true;
                      resolve(true);
                    })
                    .catch((err) => reject(err));
                }
              });
            if (reject > 3) {
              reject("Browser failed to play background video");
            }
            retryCount += 1;
          })
          .finally(() => {
            player.onended = function () {
              return forcePlay(player);
            };
            if (isPlaying) resolve(true);
          });
      });
    };

    /**
     * @name startVideo
     * @description trigger start video and close loader
     */
    const startVideo = () => {
      if (video && !isPlaying) {
        video.load();
        video.pause();
        video.currentTime = 0;
        forcePlay(video)
          .then(() => {
            timeLoop();
            settings.loaderWrapper.classList.remove("show-loader");
            processing = false;
            settings.siteLoaded = true;
          })
          .catch((err) => console.error(err));
      } else {
        settings.loaderWrapper.classList.remove("show-loader");
        processing = false;
        settings.siteLoaded = true;
      }
    };

    const abort = (controller) => {
      if (controller && typeof controller.abort === "function") {
        controller.abort();
      }
      processing = false;
    };

    document.addEventListener("frame", (e) => {
      videoLoop(e.time);
    });

    const timeLoop = (time) => {
      time *= 1e-3;
      if (this.lastT === -1) {
        this.lastT = time;
      }
      document.dispatchEvent(
        new CustomEvent("frame", { time, lastTime: time - this.lastT })
      );
      this.lastT = time;
      requestAnimationFrame(timeLoop);
    };

    /**
     * @name loadUp
     * @description Video file loader
     * @returns {Promise<void>}
     */
    const loadUp = async () => {
      if (this.get(0) && settings.loaderWrapper) {
        settings.loaderWrapper.classList.add("show-loader");
        if (settings.srcMobile && settings.srcDesktop) {
          video.src = "";
          const signal = controller.signal;

          const response = await fetch(
            isMobile ? settings.srcMobile : settings.srcDesktop,
            {
              method: "get",
              signal: signal,
            }
          );

          const contentLength = response.headers.get("content-length");
          const total = parseInt(contentLength, 10);
          let loaded = 0;
          loaderNumber.innerHTML = loaded;
          // console.log("load Start");
          const res = new Response(
            new ReadableStream({
              async start(controller) {
                const reader = response.body.getReader();
                for (;;) {
                  const { done, value } = await reader.read();
                  if (done) break;
                  loaded += value.byteLength;
                  loaderNumber.innerHTML = Math.round((loaded / total) * 100);
                  controller.enqueue(value);
                  if (loaderNumber.innerHTML >= 98) {
                    // console.log(loaderNumber.innerHTML);
                    settings.loaderWrapper
                      .querySelector(".bg_remover")
                      .classList.add("stop");
                  }
                }
                controller.close();
              },
            })
          );

          let startingVideo = false;
          const startingVideoFn = () => {
            if (!startingVideo) {
              startingVideo = true;
              startVideo();
            }
          };
          video.removeEventListener("loadeddata", startingVideoFn);
          video.addEventListener("loadeddata", startingVideoFn);

          const blob = await res.blob();
          video.src = URL.createObjectURL(
            new Blob([blob], { type: "video/mp4" })
          );

          video.removeEventListener("abort", abort);
          video.addEventListener("abort", abort);
        } else {
          for (let i = 0; i <= 100; i = i + 10) {
            loaderNumber.innerHTML = Math.round((i / 100) * 100);
            await delay(1);
          }
          startVideo();
        }
      }
    };

    /**
     * @name setLoaderContainerWidth
     * @description mark browser type and load up
     */
    const setLoaderContainerWidth = () => {
      if (!processing) {
        settings.loaderWrapper.querySelector(".loading-text").innerHTML =
          "Loading ...";
        processing = true;
        setTimeout(() => {
          const viewWidth = $(window).width();
          isPlaying = false;
          if (viewWidth < settings.breakpoint && !this.hasClass("mobile")) {
            this.removeClass("desktop");
            this.addClass("mobile");
            isMobile = true;
            loadUp();
          } else if (
            viewWidth >= settings.breakpoint &&
            !this.hasClass("desktop")
          ) {
            this.removeClass("mobile");
            this.addClass("desktop");
            isMobile = false;
            loadUp();
          } else {
            processing = false;
          }
        }, 500);
      }
    };

    /**
     * @name resize
     * @description recompute and reload/select video to be played
     */
    $(window).resize(() => setLoaderContainerWidth());
    setLoaderContainerWidth();

    /**
     * @name nextPlayIndex
     * @description feed playqueue by fed index from the scroll logic
     */
    $(document).on("nextPlayIndex", (object, { nextPlayIndex }) => {
      let index = nextPlayIndex;
      this.processing = true;
      this.disabled = true;
      let isForward = currentIndex < index - 1;
      const isIdle = currentIndex === index - 1;
      const currentIndexPointer = index - 1;
      let playQueueFeed = [...playQueue];

      isSkip = settings.enableSectionFadeIn
        ? (isMobile && Math.abs(currentIndex - currentIndexPointer) > 1) ||
          settings.forceSkipFade
        : false;
      if (isSkip) {
        isForward = true;
        currentIndex = currentIndexPointer - 1;
      }
      /** insert backward and forward then loop */
      for (
        let i = currentIndex;
        isForward ? i <= currentIndexPointer : i >= currentIndexPointer;
        isForward ? i++ : i--
      ) {
        if (i !== currentIndex && currentIndexPointer === i) {
          if (isForward && positions[i]) {
            playQueueFeed.push([...positions[i].forward, i]);
          } else if (positions[i + 1]) {
            playQueueFeed.push([...positions[i + 1].back, i + 1]);
          }
          if (positions[i]) {
            playQueueFeed.push([...positions[i].now, i]);
          }
        }
      }

      /** always take the last 3 only */
      if (playQueueFeed.length > 3) {
        playQueueFeed = playQueueFeed.slice(
          playQueueFeed.length - 3,
          playQueueFeed.length
        );
      }

      currentIndex = index - 1;
      frameCut = !isSkip && !isIdle;
      this.processing = false;
      playQueue = playQueueFeed;
    });
  };
})(window.jQuery);

//init plugin
$(document).ready(() => {
  //for homepage
  if ($("#pg_bg").length) {
    function addPad() {
      document.querySelectorAll("section").forEach(function (m) {
        m.style.paddingTop =
          document.querySelector(".main-head").clientHeight + "px";
      });
    }
    addPad();
    window.addEventListener("resize", addPad);

    $("#pg_bg").pageBGLoader({
      srcDesktop: "images/video.mp4",
      srcMobile: "images/video_mobile.mp4",
      breakpoint: 991,
      loaderWrapper: document.getElementById("pageLoader"),
      frameGap: 0,
      forceSkipFade: false,
      enableSectionFadeIn: true,
      easing: "ease",
      totalContainer: "#main",
    });
    $("#main").pageInside({
      easing: "ease",
      animationTime: 1200,
      loop: false,
      keyboard: true,
      responsiveFallback: false,
      direction: "vertical",
      // updateURL: true,
    });
    if ($("#lottiePlayer11").length) {
      $("#lottiePlayer11").pageLoadLottie({
        src: "images/search_buttom.json",
      });
    }
    if ($("#lottiePlayer12").length) {
      $("#lottiePlayer12").pageLoadLottie({
        src: "images/block-1.json",
      });
    }
    if ($("#lottiePlayer13").length) {
      $("#lottiePlayer13").pageLoadLottie({
        src: "images/block-2.json",
      });
    }
    if ($("#lottiePlayer14").length) {
      $("#lottiePlayer14").pageLoadLottie({
        src: "images/request_demo.json",
      });
    }
    if ($(".section-4-arrow").length) {
      $(".section-4-arrow,.scroll_btn").on("click", function () {
        $("#main").trigger("swipeUp");
      });
    }

    $("[data-bs-toggle='modal']").on("click", function () {
      $("body").addClass("disabled-onepage-scroll");
    });
    $("div.modal").on("shown.bs.modal", function (e) {
      $("body").addClass("disabled-onepage-scroll");
    });
    $("div.modal").on("hidden.bs.modal", function (e) {
      $("body").removeClass("disabled-onepage-scroll");
    });
    $("[data-bs-dismiss='modal']").on("click", function () {
      $("body").removeClass("disabled-onepage-scroll");
    });

    $(document).on("click", ".navbar-toggler-main", function () {
      // console.log($(this).attr("aria-expanded"));
      if ($(this).attr("aria-expanded") == "false") {
        $("body").removeClass("disabled-onepage-scroll");
      } else {
        $("body").addClass("disabled-onepage-scroll");
      }
    });

    //slider
    if ($(".investment-point-row").length) {
      let sls = $(".investment-point-row");
      let mn = gsap.matchMedia();
      mn.add("(max-width: 767px)", () => {
        if (!sls.hasClass("slick-slider")) {
          sls.slick({
            dots: false,
            arrows: true,
            infinite: true,
            speed: 300,
            slidesToShow: 1,
            slidesToScroll: 1,
            prevArrow:
              '<button type="button" class="slick-prev pull-left"><svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 66.91 122.88" style="enable-background:new 0 0 66.91 122.88" xml:space="preserve"><path d="M64.96,111.2c2.65,2.73,2.59,7.08-0.13,9.73c-2.73,2.65-7.08,2.59-9.73-0.14L1.97,66.01l4.93-4.8l-4.95,4.8 c-2.65-2.74-2.59-7.1,0.15-9.76c0.08-0.08,0.16-0.15,0.24-0.22L55.1,2.09c2.65-2.73,7-2.79,9.73-0.14 c2.73,2.65,2.78,7.01,0.13,9.73L16.5,61.23L64.96,111.2L64.96,111.2L64.96,111.2z"></path></svg></button>',
            nextArrow:
              '<button type="button" class="slick-next pull-right"><svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 66.91 122.88" style="enable-background:new 0 0 66.91 122.88" xml:space="preserve"><path d="M1.95,111.2c-2.65,2.72-2.59,7.08,0.14,9.73c2.72,2.65,7.08,2.59,9.73-0.14L64.94,66l-4.93-4.79l4.95,4.8 c2.65-2.74,2.59-7.11-0.15-9.76c-0.08-0.08-0.16-0.15-0.24-0.22L11.81,2.09c-2.65-2.73-7-2.79-9.73-0.14 C-0.64,4.6-0.7,8.95,1.95,11.68l48.46,49.55L1.95,111.2L1.95,111.2L1.95,111.2z"></path></svg></button>',
          });
          setTimeout(() => {
            sls[0].slick.refresh();
            sls.slick("setPosition");
          }, 350);
        }
        function eq_size(vz) {
          if (sls.hasClass("slick-slider")) {
            sls[0].slick.refresh();
            sls.slick("setPosition");
            gsap.set(sls.find(".investment-point-col"), {
              height: sls.find(".slick-track").get(0).clientHeight + "px",
            });
          }
        }
        window.addEventListener("resize", () => {
          eq_size("equal");
        });
        eq_size("equal");
        return () => {
          gsap.set(sls.find(".investment-point-col"), {
            height: "auto",
          });
          if (sls.hasClass("slick-slider")) {
            sls.slick("unslick");
          }
        };
      });
    }
  } else {
    $("body,html").addClass("visible");

    // sticky menu end
    function navcolor() {
      let menu = $(".main-head");
      let menuHeight = menu.get(0).clientHeight;
      if ($(window).scrollTop() > menuHeight / 2) {
        menu.addClass("shadow");
      } else {
        menu.removeClass("shadow");
      }
    }
    navcolor();
    $(window).on("scroll", navcolor);
    $(window).on("resize", navcolor);
  }

  //for Otherpages
  if ($(".section_banner").length) {
    function navGap() {
      document.querySelector(".section_banner").style.paddingTop =
        document.querySelector(".main-head").clientHeight + "px";
    }
    navGap();
    window.addEventListener("resize", navGap);
  }

  //team slider
  if ($(".tm_sl").length) {
    $(".tm_sl").slick({
      dots: false,
      infinite: true,
      speed: 300,
      slidesToShow: 4,
      slidesToScroll: 1,
      prevArrow: ".slick_custom_prev",
      nextArrow: ".slick_custom_next",
      responsive: [
        {
          breakpoint: 1024,
          settings: {
            slidesToShow: 3,
          },
        },
        {
          breakpoint: 767,
          settings: {
            slidesToShow: 2,
          },
        },
        {
          breakpoint: 480,
          settings: {
            slidesToShow: 1,
          },
        },
      ],
    });
  }

  //goto srction
  if ($(".tb_con a").length) {
    $('.tb_con a[href^="#"]').on("click", function (e) {
      e.preventDefault();
      let target = this.hash;
      let $target = $(target);
      let navHeight = document.querySelector(".main-head").clientHeight;
      $("html, body")
        .stop()
        .animate(
          {
            scrollTop: $target.offset().top - navHeight - 15,
          },
          600,
          "swing",
          function () {
            // window.location.hash = target;
          }
        );
    });
  }

  if ($(".featured_blog_box.sticky").length) {
    rez();
    window.addEventListener("resize", rez);
    function rez() {
      $(".featured_blog_box.sticky").css({
        top: document.querySelector(".main-head").clientHeight + "px",
      });
    }
  }
});
