//create plugin for homepage
!(function ($) {
  const defaults = {
    easing: "ease",
    animationTime: 1000,
    paginationContainer: ".onepage-pagination",
    updateURL: false,
    keyboard: true,
    beforeMove: null,
    afterMove: null,
    loop: true,
    disableInResponsive: false,
    responsiveSize: 991,
    direction: "vertical",
    hashValue: parseInt(window.location.hash.replace("#", "")),
    container: "body",
    totalContainer: "#main",
    sectionContainer: "section",
    scrollContainer: "body",
    enableSectionFadeIn: true,
  };

  const opacityTransition = (item, animationTime, easing, opacity) => {
    if (item) {
      const styles = {
        "-webkit-transition": `all ${animationTime / 2}ms ${easing}`,
        "-moz-transition": `all ${animationTime / 2}ms ${easing}`,
        "-ms-transition": `all ${animationTime / 2}ms ${easing}`,
        transition: `all ${animationTime / 2}ms ${easing}`,
        opacity: opacity,
      };
      Object.keys(styles).forEach((key) => {
        item.style[key] = styles[key];
      });
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
          ? $(settings.paginationContainer).addClass("hidden")
          : $(settings.paginationContainer).removeClass("hidden");
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
      $(settings.paginationContainer)
        .find(`li a[data-index='${index}']`)
        .removeClass("active");
      $(settings.paginationContainer)
        .find(`li a[data-index='${next.data("index")}']`)
        .addClass("active");

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
      $(settings.paginationContainer)
        .find(`li a[data-index='${index}']`)
        .removeClass("active");
      $(settings.paginationContainer)
        .find(`li a[data-index='${next.data("index")}']`)
        .addClass("active");
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
        $(settings.paginationContainer)
          .find(`li a.active`)
          .removeClass("active");
        $(settings.paginationContainer)
          .find(`li a[data-index='${page_index}']`)
          .addClass("active");
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

    const disableLayout = () => {
      let valFunction = settings.responsiveSize;
      if (settings.disableInResponsive && $(window).width() < valFunction) {
        body.addClass("disabled-onepage-scroll");
        body.unbind("mousewheel DOMMouseScroll MozMousePixelScroll");
        el.swipeEvents().unbind("swipeDown swipeUp");
        $(settings.paginationContainer).find("li a").unbind("click");
        $(settings.paginationContainer).css("opacity", 0);
        $("html,body").addClass("visible");
        el.parents().css("height", "auto");
        $(settings.sectionContainer)
          .removeClass("active in-view")
          .removeAttr("style").removeAttr("data-index");
        $(settings.sectionContainer)
          .find(".container")
          .removeClass(" direction-down direction-up")
          .removeAttr("style");
        $(settings.sectionContainer)
          .find(".subsection")
          .removeClass("active in-view")
          .removeAttr("style");
        $(settings.sectionContainer).find(".sub-wrapper").removeAttr("style");
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
      paginationList += `<li><a data-index='${i + 1}' href='#${
        i + 1
      }'></a></li>`;
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
    if (settings.direction === "horizontal") {
      posLeft = (el.find(settings.paginationContainer).width() / 2) * -1;
      el.find(settings.paginationContainer).css("margin-left", posLeft);
    } else {
      posTop = (el.find(settings.paginationContainer).height() / 2) * -1;
      el.find(settings.paginationContainer).css("margin-top", posTop);
    }
    $(settings.paginationContainer).html(paginationList);

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
        $(settings.paginationContainer)
          .find(`li a[data-index='${init_index}']`)
          .addClass("active");

        next = $(settings.sectionContainer + `[data-index='${init_index}']`);
        if (next) {
          next.addClass("active");
          $(settings.paginationContainer)
            .find(`li a[data-index='${init_index}']`)
            .addClass("active");
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
        $(settings.paginationContainer)
          .find(`li a[data-index='1']`)
          .addClass("active");
      }
    } else {
      $(`${settings.sectionContainer}[data-index='1']`).addClass("active");
      body.addClass("viewing-page-1");
      $(settings.paginationContainer)
        .find(`li a[data-index='1']`)
        .addClass("active");
      positionTransition(
        $(`${settings.sectionContainer}.active .container`).get(0),
        settings.direction,
        $("html").height() / 2,
        settings.animationTime / 2,
        settings.easing
      );
      transformPage(settings, pos, 1, "down", 0, 1);
    }

    $(settings.paginationContainer)
      .find("li a")
      .click(function () {
        const page_index = $(this).data("index");
        el.moveTo(page_index);
      });

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
        disableLayout();
      });

      disableLayout();
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
})(window.jQuery);

//init plugin
$(document).ready(() => {
  $("#main").pageInside({
    easing: "ease",
    animationTime: 1200,
    loop: false,
    keyboard: true,
    disableInResponsive: true,
    direction: "vertical",
    paginationContainer: ".onepage-pagination",
    // updateURL: true,
  });
});
