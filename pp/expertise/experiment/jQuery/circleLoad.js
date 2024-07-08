/*
jquery-circle-progress - jQuery Plugin to draw animated circular progress bars

URL: http://kottenator.github.io/jquery-circle-progress/
Author: Rostyslav Bryzgunov <kottenator@gmail.com>
Version: 1.1.2
License: MIT
*/
(function(e){function t(e){this.init(e)}t.prototype={value:0,size:100,startAngle:-Math.PI,thickness:"auto",fill:{gradient:["#3aeabb","#fdd250"]},emptyFill:"rgba(0, 0, 0, .1)",animation:{duration:1200,easing:"circleProgressEasing"},animationStartValue:0,reverse:false,lineCap:"butt",constructor:t,el:null,canvas:null,ctx:null,radius:0,arcFill:null,lastFrameValue:0,init:function(t){e.extend(this,t);this.radius=this.size/2;this.initWidget();this.initFill();this.draw()},initWidget:function(){var t=this.canvas=this.canvas||e("<canvas>").prependTo(this.el)[0];t.width=this.size;t.height=this.size;this.ctx=t.getContext("2d")},initFill:function(){function p(){var n=e("<canvas>")[0];n.width=t.size;n.height=t.size;n.getContext("2d").drawImage(h,0,0,i,i);t.arcFill=t.ctx.createPattern(n,"no-repeat");t.drawFrame(t.lastFrameValue)}var t=this,n=this.fill,r=this.ctx,i=this.size;if(!n)throw Error("The fill is not specified!");if(n.color)this.arcFill=n.color;if(n.gradient){var s=n.gradient;if(s.length==1){this.arcFill=s[0]}else if(s.length>1){var o=n.gradientAngle||0,u=n.gradientDirection||[i/2*(1-Math.cos(o)),i/2*(1+Math.sin(o)),i/2*(1+Math.cos(o)),i/2*(1-Math.sin(o))];var a=r.createLinearGradient.apply(r,u);for(var f=0;f<s.length;f++){var l=s[f],c=f/(s.length-1);if(e.isArray(l)){c=l[1];l=l[0]}a.addColorStop(c,l)}this.arcFill=a}}if(n.image){var h;if(n.image instanceof Image){h=n.image}else{h=new Image;h.src=n.image}if(h.complete)p();else h.onload=p}},draw:function(){if(this.animation)this.drawAnimated(this.value);else this.drawFrame(this.value)},drawFrame:function(e){this.lastFrameValue=e;this.ctx.clearRect(0,0,this.size,this.size);this.drawEmptyArc(e);this.drawArc(e)},drawArc:function(e){var t=this.ctx,n=this.radius,r=this.getThickness(),i=this.startAngle;t.save();t.beginPath();if(!this.reverse){t.arc(n,n,n-r/2,i,i+Math.PI*2*e)}else{t.arc(n,n,n-r/2,i-Math.PI*2*e,i)}t.lineWidth=r;t.lineCap=this.lineCap;t.strokeStyle=this.arcFill;t.stroke();t.restore()},drawEmptyArc:function(e){var t=this.ctx,n=this.radius,r=this.getThickness(),i=this.startAngle;if(e<1){t.save();t.beginPath();if(e<=0){t.arc(n,n,n-r/2,0,Math.PI*2)}else{if(!this.reverse){t.arc(n,n,n-r/2,i+Math.PI*2*e,i)}else{t.arc(n,n,n-r/2,i,i-Math.PI*2*e)}}t.lineWidth=r;t.strokeStyle=this.emptyFill;t.stroke();t.restore()}},drawAnimated:function(t){var n=this,r=this.el;r.trigger("circle-animation-start");e(this.canvas).stop(true,true).css({animationProgress:0}).animate({animationProgress:1},e.extend({},this.animation,{step:function(e){var i=n.animationStartValue*(1-e)+t*e;n.drawFrame(i);r.trigger("circle-animation-progress",[e,i])},complete:function(){r.trigger("circle-animation-end")}}))},getThickness:function(){return e.isNumeric(this.thickness)?this.thickness:this.size/14}};e.circleProgress={defaults:t.prototype};e.easing.circleProgressEasing=function(e,t,n,r,i){if((t/=i/2)<1)return r/2*t*t*t+n;return r/2*((t-=2)*t*t+2)+n};e.fn.circleProgress=function(n){var r="circle-progress";if(n=="widget"){var i=this.data(r);return i&&i.canvas}return this.each(function(){var i=e(this),s=i.data(r),o=e.isPlainObject(n)?n:{};if(s){s.init(o)}else{o.el=i;s=new t(o);i.data(r,s)}})}})(jQuery)