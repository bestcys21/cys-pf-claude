(() => {
 const diagrams=document.querySelectorAll('.sf-ia');
 if(!diagrams.length || matchMedia('(prefers-reduced-motion: reduce)').matches)return;
 const observer=new IntersectionObserver(entries=>{entries.forEach(entry=>{
   if(!entry.isIntersecting)return;
   entry.target.classList.add('is-playing');observer.unobserve(entry.target);
 });},{threshold:0,rootMargin:'0px 0px -80px 0px'});
 diagrams.forEach(diagram=>observer.observe(diagram));
})();
