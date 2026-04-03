/* ============================================================
   head.js — Common <head> injector
   Adds preconnect hint + Pretendard font shared across all pages.
   Kept separate so each HTML only needs:
     <script src="js/head.js"></script>
     <link rel="stylesheet" href="css/style.css" />
   ============================================================ */
(function () {
  var head = document.head;

  var preconnect = document.createElement('link');
  preconnect.rel = 'preconnect';
  preconnect.href = 'https://cdn.jsdelivr.net';
  head.appendChild(preconnect);

  var font = document.createElement('link');
  font.rel = 'stylesheet';
  font.href = 'https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable.min.css';
  head.appendChild(font);
})();
