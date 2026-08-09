const reducedMotion=matchMedia('(prefers-reduced-motion: reduce)').matches;
const sections=[...document.querySelectorAll('main>section[data-menu]')];
const nav=document.createElement('nav');
nav.className='sheet-nav';
nav.setAttribute('aria-label','ページ内メニュー');

const links=sections.map((section,index)=>{
  const link=document.createElement('a');
  link.href=`#${section.id}`;
  link.textContent=section.dataset.menu;
  link.hidden=index>0;
  link.addEventListener('click',event=>{
    event.preventDefault();
    section.scrollIntoView({behavior:reducedMotion?'auto':'smooth',block:'start'});
  });
  nav.append(link);
  return link;
});
document.body.append(nav);
if(!reducedMotion)document.documentElement.classList.add('motion-ready');

let currentIndex=-1;
let furthest=0;
let ticking=false;

function updateCurrent(){
  ticking=false;
  const guide=innerHeight*.34;
  let next=0;
  sections.forEach((section,index)=>{if(section.getBoundingClientRect().top<=guide)next=index});
  if(next===currentIndex)return;
  currentIndex=next;
  furthest=Math.max(furthest,next);
  sections[next].classList.add('has-entered');
  links.forEach((link,index)=>{
    link.hidden=index>furthest;
    link.classList.toggle('is-past',index<next);
    link.setAttribute('aria-current',String(index===next));
  });
  const active=links[next];
  nav.scrollTo({left:Math.max(0,active.offsetLeft-nav.clientWidth+active.offsetWidth+16),behavior:reducedMotion?'auto':'smooth'});
}

function requestUpdate(){if(ticking)return;ticking=true;requestAnimationFrame(updateCurrent)}
const revealObserver=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting)entry.target.classList.add('has-entered')}),{rootMargin:'0px 0px -18% 0px',threshold:.08});
sections.forEach(section=>revealObserver.observe(section));
addEventListener('scroll',requestUpdate,{passive:true});
addEventListener('resize',requestUpdate);
updateCurrent();
