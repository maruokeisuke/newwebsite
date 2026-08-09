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
let furthest=0;

const setCurrent=index=>{
  furthest=Math.max(furthest,index);
  sections[index].classList.add('has-entered');
  links.forEach((link,linkIndex)=>{
    link.hidden=linkIndex>furthest;
    link.classList.toggle('is-past',linkIndex<index);
    link.setAttribute('aria-current',String(linkIndex===index));
  });
  links[index].scrollIntoView({behavior:'smooth',block:'nearest',inline:'end'});
};

const observer=new IntersectionObserver(entries=>{
  const current=entries.filter(entry=>entry.isIntersecting).sort((a,b)=>b.intersectionRatio-a.intersectionRatio)[0];
  if(current)setCurrent(sections.indexOf(current.target));
},{rootMargin:'-22% 0px -52% 0px',threshold:[0,.2,.5]});

sections.forEach(section=>observer.observe(section));
setCurrent(0);
