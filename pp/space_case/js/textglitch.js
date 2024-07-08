/*
for simple text anim => <span data-glitchtext>Glich text</span>

you can customize it with, 
fillType = forwards, backwards, Both (default);
<span data-glitchtext data-fillType="forwards">Glich text</span>

it will animate on mouse over (default) 
or you can customize it with data attr for click,like:
<span data-glitchtext data-event-type="click">Glich text</span>
or you can customize it with data attr for autoplay,like:
<span data-glitchtext data-event-type="auto">Glich text</span>

for button or anchor anim => <a href="#" data-glitchtext="button"><span data-glitch>Glich text</span></a>.

to call this function simply call
 glitchtext(document.querySelectorAll("[data-glitchtext]"));
 or you can customize it with 
glitchtext(document.querySelectorAll(".custom_element"));
*/
function glitchtext(m, chars) {
  const getFillMode = (e) => {
    let fillType = e.dataset.fillType;
    if (fillType != undefined) {
      if (fillType != "forwards" || fillType != "backwards") {
        fillType = "both";
      }
    } else {
      fillType = "both";
    }
    return fillType;
  };
  const setSpeed = 4 * 10 + 20;
  const animate = (e) => {
    let type = e.target.dataset.glitchtext,
      k = null;
    if (type != undefined && type == "link") {
      k = e.target.querySelector("[data-glitch]");
    }

    // return if already animating
    if (e.target.getAttribute("data-filling") === "true") return;
    e.target.setAttribute("data-filling", "true");

    // backwards: h2345 -- h234o -- h23lo -- h2llo -- hello
    // forwards:  h2345 -- he345 -- hel45 -- hell5 -- hello
    // both:      h2345 -- he345 -- he34o -- hel4o -- hello
    const fillmode = getFillMode(e.target);

    const text = e.target.getAttribute("data-text");
    const len = text != null && text.length;
    const randomArr = Array.from({ length: len }, (_, i) =>
      text[i] === " "
        ? "_"
        : ["X", "$", "!", "Y", "#", "?", "*", "0", "1", "+"][
            Math.floor(Math.random() * 9)
          ]
    );

    if (fillmode === "backwards") {
      for (let i = len - 1; i >= 0; i--) {
        if (i === 0) e.target.setAttribute("data-filling", "false");
        setTimeout(() => {
          randomArr.splice(i, 1, text[i]);
          k === null
            ? (e.target.textContent = randomArr.join(""))
            : (k.textContent = randomArr.join(""));
        }, (len - i) * setSpeed);
      }
    } else {
      const isEven = len % 2 === 0;
      for (let i = 0; i < len; i++) {
        setTimeout(() => {
          if (i === len - 1) e.target.setAttribute("data-filling", "false");
          if (fillmode === "forwards" || (fillmode === "both" && i % 2 === 0)) {
            randomArr.splice(i, 1, text[i]);
          } else {
            // runs only if fillmode is "both" and i is odd;
            randomArr.splice(
              isEven ? len - i : len - i - 1,
              1,
              isEven ? text[len - i] : text[len - i - 1]
            );
          }
          k === null
            ? (e.target.textContent = randomArr.join(""))
            : (k.textContent = randomArr.join(""));
        }, (i + 1) * setSpeed);
      }
    }
  };

  const setGlitch = (elements) => {
    elements.forEach((el, idx) => {
      let type = el.dataset.glitchtext,
        k = null;
      if (type != undefined && type == "link") {
        k = el.querySelector("[data-glitch]");
      }
      el.setAttribute(
        "data-text",
        k === null
          ? el.textContent.replace(/^\s+|\s+$/g, "")
          : k.textContent.replace(/^\s+|\s+$/g, "")
      );
      el.setAttribute("data-filling", "false");
      if (el.getAttribute("data-event-type") === "click") {
        el.onclick = animate;
      } else if (el.getAttribute("data-event-type") === "auto") {
        animate;
      } else {
        el.onmouseover = animate;
      }
      // animate on window load
      setTimeout(() => {
        animate({ target: el });
      }, idx * 80);
    });
  };
  setGlitch(m);
}
