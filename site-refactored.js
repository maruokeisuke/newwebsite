const reducedMotion=matchMedia('(prefers-reduced-motion: reduce)').matches;
document.querySelectorAll('.policy details').forEach(details=>{
  const measures=document.createElement('div');
  measures.className='measures';
  const heading=document.createElement('h4');
  heading.textContent=details.querySelector('summary').textContent;
  measures.append(heading,...[...details.children].filter(child=>child.tagName!=='SUMMARY'));
  details.replaceWith(measures);
});
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

const pageTurn=document.createElement('div');
pageTurn.className='page-turn';
pageTurn.setAttribute('aria-hidden','true');
pageTurn.innerHTML='<strong></strong>';
document.body.append(pageTurn);

if(!reducedMotion)document.documentElement.classList.add('motion-ready');
let furthest=0;
let currentIndex=0;

const setCurrent=index=>{
  if(index!==currentIndex&&!reducedMotion){
    const color=getComputedStyle(sections[index]).backgroundColor;
    pageTurn.style.setProperty('--turn-color',color);
    const rgb=(color.match(/\d+/g)||[255,255,255]).map(Number);
    pageTurn.style.setProperty('--turn-ink',(rgb[0]*299+rgb[1]*587+rgb[2]*114)/1000<145?'#ffffff':'#071d3f');
    pageTurn.querySelector('strong').textContent=sections[index].dataset.menu;
    pageTurn.classList.remove('run');
    void pageTurn.offsetWidth;
    pageTurn.classList.add('run');
  }
  currentIndex=index;
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
