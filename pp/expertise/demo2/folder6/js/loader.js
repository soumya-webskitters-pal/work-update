var loadTime, timerStart = Date.now();
window.onscroll = function (e) {
    e.stopPropagation()
};// document.body.style.overflow = "hidden", document.body.style.minHeight = "100vh";
var LoaderArray = ["Loading Component...", "Loading Texture...", "Loading particles...", "Prepare Camera...", "Prepare Scene...", "Please Wait..."];
const loaderStyle = {
    loaderBg: "rgb(17, 44, 70)",
    loadBarBlankBg: "rgba(240, 87, 87, 0.5)",
    loadBarBg: "rgb(240, 87, 87)",
    loadBarShadow: "0 0 1vw #75b5df",
    loadTextColor: "rgb(255,255,255)",
    loadTextShadow: "rgb(255, 255, 255) 1px 1px 20px",
    loadFont: "1vw",
    loaderAlign: "center",
    loaderBarHeight: ".5vw"
};
! function (e) {
    var t = document.createElement("div");
    t.setAttribute("class", "loader"), t.setAttribute("id", "loader"), t.style.backgroundColor = loaderStyle.loaderBg, t.style.color = loaderStyle.loadTextColor, t.style.fontSize = loaderStyle.loadFont, t.style.position = "fixed", t.style.top = "0", t.style.bottom = "0", t.style.left = "0", t.style.right = "0", t.style.zIndex = "9999999", document.body.appendChild(t);
    var a = document.createElement("span");
    a.innerText = LoaderArray[0], a.style.position = "fixed", a.style.paddingBottom = loaderStyle.loadFont, a.style.textShadow = loaderStyle.loadTextShadow, "center" == loaderStyle.loaderAlign ? (a.style.webkitTransform = "translate(-50%,-50%)", a.style.mozTransform = "translate(-50%,-50%)", a.style.msTransform = "translate(-50%,-50%)", a.style.transform = "translate(-50%,-50%)", a.style.top = "50%", a.style.left = "50%") : (a.style.webkitTransform = "translate(0,-50%)", a.style.mozTransform = "translate(0,-50%)", a.style.msTransform = "translate(0,-50%)", a.style.transform = "translate(0,-50%)", a.style.top = "50%", a.style.left = "2.5%"), t.appendChild(a);
    var l = document.createElement("div");
    l.style.position = "fixed", l.style.width = "100%", l.style.height = loaderStyle.loaderBarHeight, l.style.background = loaderStyle.loadBarBlankBg, l.style.webkitTransform = "translate(0,-50%)", l.style.mozTransform = "translate(0,-50%)", l.style.msTransform = "translate(0,-50%)", l.style.transform = "translate(0,-50%)", l.style.top = "50%", l.style.left = "0", l.style.right = "0", l.style.marginTop = "2vw", t.appendChild(l);
    var o = document.createElement("div");
    o.style.position = "absolute", o.style.width = "0%", o.style.height = loaderStyle.loaderBarHeight, o.style.background = loaderStyle.loadBarBg, o.style.webkitBoxShadow = loaderStyle.loadBarShadow, o.style.mozBoxShadow = loaderStyle.loadBarShadow, o.style.msBoxShadow = loaderStyle.loadBarShadow, o.style.boxShadow = loaderStyle.loadBarShadow, o.style.webkitTransform = "translate(0,-50%)", o.style.mozTransform = "translate(0,-50%)", o.style.msTransform = "translate(0,-50%)", o.style.transform = "translate(0,-50%)", o.style.top = "50%", o.style.left = "0", l.appendChild(o);
    var r = 0,
        s = 0;
    loadTime = setInterval(() => {
        r >= 100 && (r = 0, s++), s >= LoaderArray.length && (s = 0), a.innerText = LoaderArray[s] + r + "%", r += 5 * (s + 1), o.style.width = r + "%"
    }, 50)
}();