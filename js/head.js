/* ============================================================
   head.js — Common <head> injector
   Preloads the locally hosted Pretendard font shared across all pages.
   Kept separate so each HTML only needs:
     <script src="js/head.js"></script>
     <link rel="stylesheet" href="css/style.css" />
   ============================================================ */
(function () {
  var head = document.head;

  var font = document.createElement('link');
  font.rel = 'preload';
  font.as = 'font';
  font.type = 'font/woff2';
  font.href = 'fonts/PretendardVariable.woff2';
  font.crossOrigin = 'anonymous';
  head.appendChild(font);
})();
