let achor = document.querySelectorAll(".section a");
if (achor != undefined) {
  document.querySelectorAll(".section a").forEach((e) => {
    e.addEventListener("click", (a) => {
      let id = "#" + a.target.closest(".section").id;
      sessionStorage.setItem("clickedId", id);
    });
  });
}

let back = document.querySelector(".back");
if (back != undefined) {
  let id = sessionStorage.getItem("clickedId");
  if (id != null) {
    back.href = back.href + id;
  }
}
