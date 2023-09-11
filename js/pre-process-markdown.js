var mdBody = document.querySelector(".markdown-body");

try {
  var changed = false;
  if (mdBody) {
    var innerHTML$ = mdBody.innerHTML.replace(/\[\[(.*)\]\]/g, (match, $1) => {
      changed = true;
      var [, year, month, day] = $1.match(/(\d{4})-(\d{2})-(\d{2})/) || [];
      var $1$Formatten = $1.replace(/\,|\s/g, "-").toLowerCase();
      var href = $1$Formatten;
      if (year && month && day) {
        href = `/${year}/${month}/${day}${
          $1.includes("/") ? "" : "/"
        }${$1$Formatten}`;
      }
      return `<a href="${href}">${$1}</a>`;
    });

    changed && (mdBody.innerHTML = innerHTML$);
  }
} catch (error) {
  console.error("处理双链出错", error);
}
