"use strict";
gsap.registerPlugin(ScrollTrigger);

/* Panels */
document.querySelectorAll(".panels").forEach((each_panel) => {
  let each_panel_inner = each_panel.querySelector(".panels-inner");
  let panels = each_panel_inner.querySelectorAll(".box");
  let singlePanelSize = each_panel_inner.querySelector(".box").offsetWidth;
  let panelsLength = panels.length * singlePanelSize;
  each_panel_inner.style.width = panelsLength + "px";
  setTimeout(() => {
    gsap.to(panels, {
      x: -(each_panel_inner.offsetWidth - each_panel.offsetWidth),
      ease: "none",
      scrollTrigger: {
        trigger: each_panel_inner,
        pin: true,
        start: "top top",
        scrub: 0.5,
        end: () => "+=" + panelsLength,
        invalidateOnRefresh: true,
      },
    });
  }, 200);
});
