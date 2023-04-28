var OriginTitle = document.title;
var titleTime;

function changeTitle() {
  if (document.hidden) {
    $('[rel="icon"]').attr("href", "/img/TEP.ico");
    document.title = "╭(°A°`)╮ 页面崩溃啦 ~";
    clearTimeout(titleTime);
  } else {
    $('[rel="icon"]').attr("href", "/favicon.ico");
    document.title = "(ฅ>ω<*ฅ) 骗你的啦~" + OriginTitle;
    // titleTime = setTimeout(function () {
    //   document.title = OriginTitle;
    // }, 2000);
  }
}

document.addEventListener("visibilitychange", changeTitle);

changeTitle();
