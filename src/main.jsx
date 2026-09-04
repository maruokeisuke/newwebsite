import React, { useCallback, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import {
  DesktopProfile,
  Footer,
  Header,
  Hero,
  MobileProfile,
  PolicySlide,
  PortraitLayer,
  Support,
  Vision,
} from './SiteSections.jsx';
import { policies } from './siteContent.js';
import { clamp, SLIDE_COUNT, SLIDES } from './siteConfig.js';
import {
  useDesktopCarousel,
  useDesktopMode,
  useDesktopScrollReset,
  useMobileActiveSection,
  useMobileStory,
} from './useSiteMotion.js';
import '../site-refactored.css?react=21';

function App() {
  const [activeIndex, setActiveIndex] = useState(SLIDES.hero);
  const trackRef = useRef(null);
  const isDesktop = useDesktopMode();

  const goTo = useCallback((index, behavior = 'smooth') => {
    const next = clamp(index, 0, SLIDE_COUNT - 1);

    if (!isDesktop) {
      const mobileTargets = {
        [SLIDES.hero]: '#top',
        [SLIDES.profile]: '#profile',
        [SLIDES.policyStart]: '#policy',
        [SLIDES.support]: '#support',
      };
      document.querySelector(mobileTargets[next] ?? '#top')?.scrollIntoView({ behavior, block: 'start' });
      return;
    }

    setActiveIndex(next);
    window.scrollTo({ top: next * window.innerHeight, behavior });
  }, [isDesktop]);

  useDesktopScrollReset(isDesktop);
  useMobileActiveSection(isDesktop, setActiveIndex);
  useDesktopCarousel(isDesktop, trackRef, setActiveIndex);
  useMobileStory(isDesktop);

  const policyIndex = activeIndex >= SLIDES.policyStart && activeIndex <= SLIDES.policyEnd
    ? activeIndex - SLIDES.policyStart
    : -1;

  return (
    <>
      <Header activeIndex={activeIndex} goTo={goTo} />
      <span className="portrait-name">丸尾けいすけ</span>
      <span className={`policy-label ${policyIndex >= 0 ? 'is-visible' : ''}`} aria-hidden="true">
        <span>政策</span>
        <b className="policy-label-current">{policyIndex >= 0 ? String(policyIndex + 1).padStart(2, '0') : '01'}</b>
      </span>
      <div className="policy-chrome" aria-hidden="true" />
      <div className="policy-wipe" aria-hidden="true" />

      <main>
        <div className="intro-stage">
          <PortraitLayer />
          <div className="intro-copy">
            <div className="desktop-carousel-track" ref={trackRef}>
              <Hero />
              <Vision />
              <MobileProfile />
              <DesktopProfile />
              {policies.map((policy, index) => <PolicySlide policy={policy} isFirst={index === 0} key={policy.number} />)}
              <Support />
            </div>

            <div className="desktop-carousel-controls" aria-label="メインコンテンツ切り替え">
              <button className="desktop-carousel-arrow" type="button" onClick={() => goTo(activeIndex - 1)} disabled={activeIndex === 0} aria-label="前の項目"><span className="material-symbols-outlined" aria-hidden="true">arrow_back</span></button>
              <div className="desktop-carousel-pages"><b>{String(activeIndex + 1).padStart(2, '0')}</b><span>/</span><span>{String(SLIDE_COUNT).padStart(2, '0')}</span></div>
              <button className="desktop-carousel-arrow" type="button" onClick={() => goTo(activeIndex + 1)} disabled={activeIndex === SLIDE_COUNT - 1} aria-label="次の項目"><span className="material-symbols-outlined" aria-hidden="true">arrow_forward</span></button>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}

createRoot(document.getElementById('root')).render(<React.StrictMode><App /></React.StrictMode>);
