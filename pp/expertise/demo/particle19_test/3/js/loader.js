/*page-loader*/
var timerStart = Date.now();

var loadTime;

//disable scroll
window.onscroll = function (e) {
    e.stopPropagation();
}

document.body.style.overflow = "hidden";
document.body.style.minHeight = "100vh";

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


(function (e) {
    //set loader div
    var loader = document.createElement("div");
    loader.setAttribute('class', 'loader');
    loader.setAttribute('id', 'loader');
    loader.style.backgroundColor = loaderStyle.loaderBg;
    loader.style.color = loaderStyle.loadTextColor;
    loader.style.fontSize = loaderStyle.loadFont;
    loader.style.position = "fixed";
    loader.style.top = "0";
    loader.style.bottom = "0";
    loader.style.left = "0";
    loader.style.right = "0";
    loader.style.zIndex = "9999999";
    document.body.appendChild(loader);


    //set loader div text
    var loaderTextNode = document.createElement("span");
    loaderTextNode.innerText = LoaderArray[0];
    loaderTextNode.style.position = "fixed";
    loaderTextNode.style.paddingBottom = loaderStyle.loadFont;
    loaderTextNode.style.textShadow = loaderStyle.loadTextShadow;
    if (loaderStyle.loaderAlign == "center") {
        loaderTextNode.style.webkitTransform = "translate(-50%,-50%)";
        loaderTextNode.style.mozTransform = "translate(-50%,-50%)";
        loaderTextNode.style.msTransform = "translate(-50%,-50%)";
        loaderTextNode.style.transform = "translate(-50%,-50%)";
        loaderTextNode.style.top = "50%";
        loaderTextNode.style.left = "50%";
    }
    else {
        loaderTextNode.style.webkitTransform = "translate(0,-50%)";
        loaderTextNode.style.mozTransform = "translate(0,-50%)";
        loaderTextNode.style.msTransform = "translate(0,-50%)";
        loaderTextNode.style.transform = "translate(0,-50%)";
        loaderTextNode.style.top = "50%";
        loaderTextNode.style.left = "2.5%";
    }
    loader.appendChild(loaderTextNode);


    //set loader progress
    var loaderProgressNode = document.createElement("div");
    loaderProgressNode.style.position = "fixed";
    loaderProgressNode.style.width = "100%";
    loaderProgressNode.style.height = loaderStyle.loaderBarHeight;
    loaderProgressNode.style.background = loaderStyle.loadBarBlankBg;
    loaderProgressNode.style.webkitTransform = "translate(0,-50%)";
    loaderProgressNode.style.mozTransform = "translate(0,-50%)";
    loaderProgressNode.style.msTransform = "translate(0,-50%)";
    loaderProgressNode.style.transform = "translate(0,-50%)";
    loaderProgressNode.style.top = "50%";
    loaderProgressNode.style.left = "0";
    loaderProgressNode.style.right = "0";
    loaderProgressNode.style.marginTop = "2vw";
    loader.appendChild(loaderProgressNode);

    //set loader progress inner
    var loaderProgressInnerNode = document.createElement("div");
    loaderProgressInnerNode.style.position = "absolute";
    loaderProgressInnerNode.style.width = "100%";
    loaderProgressInnerNode.style.height = loaderStyle.loaderBarHeight;
    loaderProgressInnerNode.style.background = loaderStyle.loadBarBg;
    loaderProgressInnerNode.style.webkitBoxShadow = loaderStyle.loadBarShadow;
    loaderProgressInnerNode.style.mozBoxShadow = loaderStyle.loadBarShadow;
    loaderProgressInnerNode.style.msBoxShadow = loaderStyle.loadBarShadow;
    loaderProgressInnerNode.style.boxShadow = loaderStyle.loadBarShadow;
    loaderProgressInnerNode.style.webkitTransform = "translate(0,-50%)";
    loaderProgressInnerNode.style.mozTransform = "translate(0,-50%)";
    loaderProgressInnerNode.style.msTransform = "translate(0,-50%)";
    loaderProgressInnerNode.style.transform = "translate(0,-50%)";
    loaderProgressInnerNode.style.top = "50%";
    loaderProgressInnerNode.style.left = "0";
    loaderProgressNode.appendChild(loaderProgressInnerNode);

    var barWidth = 0, m = 0;
    loadTime = setInterval(() => {
        if (barWidth >= 100) {
            barWidth = 0;
            m++;
        }
        if (m >= LoaderArray.length) {
            m = 0;
        }
        loaderTextNode.innerText = LoaderArray[m] + barWidth + "%";
        barWidth += 5 * (m + 1);
    }, 50);
})();

