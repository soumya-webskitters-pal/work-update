"use strict";
window.addEventListener("load", () => {
   const canvas = document.getElementById("canvas"),
    ctx = canvas.getContext("2d"),
    canvas_bound = { x: window.innerWidth, y: window.innerHeight },
    datalist = document.getElementById("data").querySelectorAll("li");
  canvas.width = canvas_bound.x;
  canvas.height = canvas_bound.y;

  //get data
  datalist.forEach((e, i) => {
    draw(
      e.querySelector("h2"),
      e.querySelector("p"),
      e.querySelector("img"),
      i,
      datalist.length
    );
  });

  //draw element
  function draw(title, para, img, index, list_length) {
    const absPos = {
      x: 0,
      y: 0,
      w: canvas_bound.x / list_length,
      h: 100,
      r: 15,
      offset: 10,
    };
    var el_pos = {
      x: absPos.x * index + absPos.offset,
      y: (absPos.y + absPos.h) * index + absPos.offset * 2,
      w: absPos.w - absPos.offset,
      h: absPos.h - absPos.offset,
      r: absPos.r,
    };
    ctx.beginPath();
    ctx.lineWidth = "0.5";
    ctx.fillStyle = "rgba(255,0,0,0.2)";
    ctx.strokeStyle = "rgba(255,0,0,1)";

    ctx.roundRect(el_pos.x, el_pos.y, el_pos.w, el_pos.h, el_pos.r);
    ctx.fill();
    ctx.stroke();
    ctx.font = "20px Georgia";
    ctx.textAlign = "start";
    ctx.textBaseline = "middle";
    ctx.fillStyle = "rgba(0,0,0,1)";
    ctx.fillText(title.innerText, el_pos.x + 100, el_pos.y + el_pos.h / 2 - 10);
    ctx.font = "12px Georgia";
    ctx.textAlign = "start";
    ctx.textBaseline = "middle";
    ctx.fillStyle = "rgba(0,0,0,0.85)";
    ctx.fillText(para.innerText, el_pos.x + 100, el_pos.y + el_pos.h / 2 + 10);
    ctx.drawImage(img, el_pos.x + 10, el_pos.y + 10, 75, 70);
    ctx.closePath();
  }

  //resize function
  function resize() {
    canvas_bound.x = window.innerWidth;
    canvas_bound.y = window.innerHeight;
    canvas.width = canvas_bound.x;
    canvas.height = canvas_bound.y;
  }
  window.addEventListener("resize", resize);

});
