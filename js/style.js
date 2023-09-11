var banner = document.getElementById("banner");

if (["/archives/", "/tags/"].includes(location.pathname)) {
  banner.style.backgroundPositionY = "20%";
}

// if (['/'].includes(location.pathname)) {
//   setTimeout(() => {
//     var headBanner = document.querySelector('.header-inner');
//     var hdBannerHeight =
//       headBanner && headBanner.getBoundingClientRect().height;
//     var live2dWidget = document.getElementById('live2d-widget');
//     if (headBanner && live2dWidget) {
//       var bottom = live2dWidget.style.bottom;
//       live2dWidget.style.display = 'none';
//       live2dWidget.style.bottom = '-100%';
//       live2dWidget.style.transition = 'bottom 500ms ease-in';
//       function scrollcb(e) {
//         console.log(window.scrollY);
//         if (window.scrollY > hdBannerHeight) {
//           live2dWidget.style.bottom = bottom + 'px';
//         } else {
//           live2dWidget.style.bottom = '-100%';
//         }
//       }
//       window.addEventListener('scroll', scrollcb);
//       scrollcb();
//     }
//   }, 1000);
// }

jQuery("figure.highlight").click(function (e) {
  if ($(e.target).hasClass("icon-arrowdown")) {
    $(e.target).removeClass("icon-arrowdown").addClass("icon-arrowup");
    $(this).addClass("fold");
  } else if ($(e.target).hasClass("icon-arrowup")) {
    $(e.target).removeClass("icon-arrowup").addClass("icon-arrowdown");
    $(this).removeClass("fold");
  }
});

// jQuery("figure.highlight").each((idx, val) => {
//   $(val).addClass("fold");
// });

// 10s还没加载图片 手动吧srcset去掉
setTimeout(() => {
  for (const each of document.querySelectorAll("img[lazyload]")) {
    if (each.hasAttribute("srcset")) {
      each.removeAttribute("srcset");
      each.removeAttribute("lazyload");
    }
  }
}, 1000 * 10);
