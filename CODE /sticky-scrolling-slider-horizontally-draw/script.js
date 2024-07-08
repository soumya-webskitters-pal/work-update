"use strict";   
gsap.registerPlugin(DrawSVGPlugin, ScrollTrigger);



 /* Panels */

var panels = gsap.utils.toArray(".panels-inner .box");
var singlePanelSize = document.querySelector(".panels-inner .box").offsetWidth;
var panelsLength = panels.length * singlePanelSize;
//console.log(panelsLength);

document.querySelector(".panels-inner").style.width = panelsLength + "px";
// panels sliding
var tween = gsap.to(panels, {
	xPercent: -100 * ( panels.length - 1 ),
	ease: "none",
	scrollTrigger: {
		trigger: ".panels-inner",
		pin: true,
		start: "top top",
		scrub: 0.5,
		end: () =>  "+=" +  panelsLength,
	}
});

// path move along with slider
gsap.to(".path", {
	x: - panelsLength + 400,
	ease: "none",
	scrollTrigger: {
		trigger: ".panels-inner",
		//pin: true,
		start: "top top",
		scrub: 0.5,
		end: () =>  "+=" +  panelsLength,
	}
});

// path draw
gsap.from('.path-in',{ 
	scrollTrigger: {
		trigger: '.panels-inner',
		start: "top center",
		scrub: 0.5,
		end: () =>  "+=" + panelsLength,
	},
	ease: "none",
	drawSVG:"0%"
  });


// sticky nav
gsap.to(".anchor-nav", {
	ease: "none",
	scrollTrigger: {
		trigger: ".panels-inner",
		start: "top top",
		scrub: 0.5,
		end: () =>  "+=" +  (panelsLength + 100),
		onEnter: () => {
			$(".anchor-nav").addClass("active");
		},
		onEnterBack: () => {
			$(".anchor-nav").addClass("active");
		},
		onLeave: () => {
			$(".anchor-nav").removeClass("active");
		},
		onLeaveBack: () => {
			$(".anchor-nav").removeClass("active");
		}
	}
});


// navbar current active
var links = gsap.utils.toArray(".anchor-nav li a");
panels.forEach((elem , i) => {
	ScrollTrigger.create({
		trigger: elem,
		scrub: 1,
		start: "top -=" + (singlePanelSize * i),
		end: "+=" + singlePanelSize,
		toggleActions: "play reverse play reverse",
		onEnter: function () {
			$(panels).removeClass("current");
			$(elem).addClass("current");
			//console.log(i);
			$(".anchor-nav li").removeClass("current");
			$(".anchor-nav").find("li:nth-child("+ (i+1) + ")").addClass("current");
		},
		onEnterBack: function () {
			$(panels).removeClass("current");
			$(elem).addClass("current");
			//console.log(i);
			$(".anchor-nav li").removeClass("current");
			$(".anchor-nav").find("li:nth-child("+ (i+1) + ")").addClass("current");
		
		}
	});
})

// navbar link to sections
document.querySelectorAll(".anchor").forEach((anchor, i) => {
	anchor.addEventListener("click", function(e) {
		e.preventDefault();
		let targetElem = e.target.getAttribute("href");
		let y = targetElem;
		let totalScroll = tween.scrollTrigger.end - tween.scrollTrigger.start,
 		totalMovement = (panels.length - 1) * document.querySelector(targetElem).offsetWidth;
 			y = Math.round(tween.scrollTrigger.start + (document.querySelector(targetElem).offsetLeft / totalMovement) * totalScroll);
			//console.log(document.querySelector(targetElem).offsetLeft);
			 gsap.to(window, {
							scrollTo: {
								y: y,
								autoKill: false
							},
							duration: 0.5
						});
	});
});

