/**
 * 根据暗黑/明亮模式切换不同的背景
 * 暗黑 动态线条
 * 明亮 动/静态彩带
 * 20221007 updated 太卡了 只渲染一个
 */
// var script$dark = document.createElement('script');
// // 动态彩带
// script$dark.src = 'https://cdn.jsdelivr.net/gh/EmoryHuang/BlogBeautify@1.5/DynamicRibbon.min.js'
// document.body.appendChild(script$dark);
// var script$light = document.createElement('script');
// script$light.type = 'text/javascript';
// script$light.setAttribute('color', "255,255,255");
// script$light.setAttribute('opacity', '0.7');
// script$light.setAttribute('zIndex', '-2');
// script$light.setAttribute('count', '200');
// script$light.src = 'https://cdn.jsdelivr.net/gh/EmoryHuang/BlogBeautify@1.5/DynamicRibbon.min.js';
// document.body.append(script$light);
var $body = $("body");
var $mask = $(".banner .js-mask");

function toggleBgScript() {
  var mode = document.documentElement.getAttribute("data-user-color-scheme");
  var canvas = Array.from(document.getElementsByTagName("canvas"));
  var lightCanvas = canvas.find((v) => !v.id && v.width && v.height);
  var darkCanvas = canvas.find((v) => v.id.includes("c_n"));
  lightCanvas.style.display = "none";
  darkCanvas.style.display = "none";
  if (mode === "dark") {
    darkCanvas.style.display = "block";
    $body.removeClass("light");
    $mask.removeClass("light");
  } else {
    lightCanvas.style.display = "block";
    $body.addClass("light");
    $mask.addClass("light");
  }
}

var toggleBtn = document.getElementById("color-toggle-btn");
toggleBtn.addEventListener("click", (e) => {
  setTimeout(toggleBgScript, 0);
});

toggleBgScript();
