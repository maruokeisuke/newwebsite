import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import {
  clamp,
  DESKTOP_MEDIA_QUERY,
  MAX_TRACK_SHIFT,
  POLICY_PALETTE,
  SLIDE_COUNT,
  SLIDES,
} from './siteConfig.js';

const desktopMedia = matchMedia(DESKTOP_MEDIA_QUERY);

export function useDesktopMode() {
  const [isDesktop, setIsDesktop] = useState(desktopMedia.matches);

  useEffect(() => {
    const updateMode = (event) => setIsDesktop(event.matches);
    desktopMedia.addEventListener('change', updateMode);
    return () => desktopMedia.removeEventListener('change', updateMode);
  }, []);

  return isDesktop;
}

export function useDesktopScrollReset(isDesktop) {
  useLayoutEffect(() => {
    if (!isDesktop) return undefined;
    const root = document.documentElement;
    root.style.scrollBehavior = 'auto';
    window.scrollTo(0, 0);
    const timer = window.setTimeout(() => { root.style.scrollBehavior = ''; }, 80);
    return () => window.clearTimeout(timer);
  }, [isDesktop]);
}

export function useMobileActiveSection(isDesktop, setActiveIndex) {
  useEffect(() => {
    if (isDesktop) return undefined;

    const targets = [
      [document.querySelector('#profile'), SLIDES.profile],
      ...[...document.querySelectorAll('.policy-slide')].map((element) => [element, SLIDES.policyStart]),
      [document.querySelector('#support'), SLIDES.support],
    ].filter(([element]) => element);

    const observer = new IntersectionObserver((entries) => {
      const visible = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

      if (!visible) {
        if (window.scrollY < window.innerHeight) setActiveIndex(SLIDES.hero);
        return;
      }

      const match = targets.find(([element]) => element === visible.target);
      if (match) setActiveIndex(match[1]);
    }, { rootMargin: '-25% 0px -55% 0px', threshold: [0, .1, .3] });

    targets.forEach(([element]) => observer.observe(element));
    return () => observer.disconnect();
  }, [isDesktop, setActiveIndex]);
}

export function useDesktopCarousel(isDesktop, trackRef, setActiveIndex) {
  const frameRef = useRef(0);

  useEffect(() => {
    if (!isDesktop) {
      trackRef.current?.style.removeProperty('--carousel-x');
      return undefined;
    }

    const update = () => {
      frameRef.current = 0;
      const max = Math.max((SLIDE_COUNT - 1) * window.innerHeight, 1);
      const progress = clamp(window.scrollY / max, 0, 1);
      trackRef.current?.style.setProperty('--carousel-x', `${progress * -MAX_TRACK_SHIFT}%`);
      setActiveIndex(clamp(Math.round(progress * (SLIDE_COUNT - 1)), 0, SLIDE_COUNT - 1));
    };

    const requestUpdate = () => {
      if (!frameRef.current) frameRef.current = requestAnimationFrame(update);
    };

    update();
    addEventListener('scroll', requestUpdate, { passive: true });
    addEventListener('resize', requestUpdate);
    return () => {
      removeEventListener('scroll', requestUpdate);
      removeEventListener('resize', requestUpdate);
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
    };
  }, [isDesktop, setActiveIndex, trackRef]);
}

export function useMobileStory(isDesktop) {
  useEffect(() => {
    if (isDesktop) return undefined;

    const portrait = document.querySelector('.portrait-stage');
    const name = document.querySelector('.portrait-name');
    const vision = document.querySelector('.vision');
    const heading = vision?.querySelector('h2');
    const body = vision?.querySelector('.body-copy');
    const profile = document.querySelector('.profile');
    const profilePanel = profile?.querySelector('.profile-panel');
    const profileScroller = profile?.querySelector('.profile-scroll');
    const policy = document.querySelector('#policy');
    const policyArticles = [...document.querySelectorAll('.policy-card')];
    const policyWipe = document.querySelector('.policy-wipe');
    const policyChrome = document.querySelector('.policy-chrome');
    const policyLabel = document.querySelector('.policy-label');
    const policyNumber = document.querySelector('.policy-label-current');
    const support = document.querySelector('.support');

    if (!portrait || !name || !vision || !heading || !body || !profile || !profilePanel || !profileScroller || !policy || !policyWipe || !policyChrome || !policyLabel || !policyNumber || !support) return undefined;

    vision.classList.add('is-scroll-story');
    let frame = 0;
    const smoothstep = (value) => value * value * (3 - 2 * value);
    const mix = (from, to, amount) => Math.round(from + (to - from) * amount);

    const updateStory = () => {
      frame = 0;
      const viewport = innerHeight;
      const visionTop = vision.getBoundingClientRect().top;
      const blurProgress = smoothstep(clamp((viewport - visionTop) / (viewport * .58), 0, 1));
      const fadeProgress = smoothstep(clamp((viewport - visionTop) / (viewport * 1.5), 0, 1));
      const centeredProgress = smoothstep(clamp(-visionTop / Math.max(viewport * .7, 1), 0, 1));
      const profileTop = profile.getBoundingClientRect().top;
      const restoreProgress = smoothstep(clamp((viewport - profileTop) / (viewport * .75), 0, 1));
      const panelReveal = smoothstep(clamp((viewport * .6 - profileTop) / Math.max(viewport * .3, 1), 0, 1));
      const profileBottom = profile.getBoundingClientRect().bottom;
      const panelExit = smoothstep(clamp((viewport * .45 - profileBottom) / Math.max(viewport * .4, 1), 0, 1));
      const panelVisibility = panelReveal * (1 - panelExit);
      const profileProgress = clamp(-profileTop / Math.max(profile.offsetHeight - viewport, 1), 0, 1);
      const innerDistance = Math.max(profileScroller.scrollHeight - profileScroller.clientHeight, 0);
      const policyTop = policy.getBoundingClientRect().top;
      const headerBottom = document.querySelector('.site-header')?.getBoundingClientRect().bottom ?? 0;
      const wipeProgress = smoothstep(clamp((viewport * .96 - policyTop) / Math.max(viewport * .92 - headerBottom, 1), 0, 1));
      const supportTop = support.getBoundingClientRect().top;
      const supportProgress = smoothstep(clamp((viewport * 1.15 - supportTop) / (viewport * .22), 0, 1));
      const nameRect = name.getBoundingClientRect();
      const nameExit = smoothstep(clamp((nameRect.bottom + viewport * .08 - supportTop) / Math.max(nameRect.height + viewport * .11, 1), 0, 1));
      const darkScene = clamp((wipeProgress - .78) / .22, 0, 1) * (1 - nameExit);
      const sceneLine = viewport * .52;
      const blendDistance = viewport * .32;
      let toneIndex = 0;
      let toneBlend = 0;

      for (let index = 1; index < policyArticles.length; index += 1) {
        const nextTop = policyArticles[index].getBoundingClientRect().top;
        if (nextTop <= sceneLine) {
          toneIndex = index;
          continue;
        }
        if (toneIndex === index - 1 && nextTop < sceneLine + blendDistance) {
          toneBlend = smoothstep((sceneLine + blendDistance - nextTop) / blendDistance);
        }
        break;
      }

      const from = POLICY_PALETTE[toneIndex];
      const to = POLICY_PALETTE[Math.min(toneIndex + 1, POLICY_PALETTE.length - 1)];
      document.documentElement.style.setProperty('--policy-scene-color', `rgb(${mix(from[0], to[0], toneBlend)}, ${mix(from[1], to[1], toneBlend)}, ${mix(from[2], to[2], toneBlend)})`);
      portrait.style.setProperty('--portrait-blur', `${blurProgress * (1 - restoreProgress) * .72}rem`);
      portrait.style.setProperty('--portrait-opacity', `${1 - fadeProgress * .72 * (1 - restoreProgress)}`);
      heading.style.setProperty('--vision-heading-blur', `${centeredProgress * .7}rem`);
      heading.style.setProperty('--vision-heading-opacity', `${(1 - centeredProgress * .82) * (1 - restoreProgress)}`);
      body.style.setProperty('--vision-body-opacity', `${centeredProgress * (1 - restoreProgress)}`);
      body.style.setProperty('--vision-body-shift', `${(1 - centeredProgress) * 2.5}rem`);
      profilePanel.style.setProperty('--profile-panel-opacity', `${panelVisibility}`);
      profilePanel.style.setProperty('--profile-panel-visibility', panelVisibility > .001 ? 'visible' : 'hidden');
      profilePanel.style.pointerEvents = panelVisibility > .9 ? 'auto' : 'none';
      profileScroller.scrollTop = innerDistance * profileProgress;
      policyWipe.style.setProperty('--policy-wipe-width', `${wipeProgress * 100}%`);
      policyWipe.style.setProperty('--policy-wipe-opacity', `${Math.min(1, wipeProgress * 1.8)}`);
      policyChrome.style.setProperty('--policy-chrome-opacity', `${wipeProgress * (1 - supportProgress)}`);
      policyLabel.style.setProperty('--policy-label-opacity', `${Math.min(1, wipeProgress / .22) * (1 - supportProgress)}`);
      policyLabel.style.setProperty('--policy-label-shift', `${(1 - Math.min(1, wipeProgress / .22)) * -1.25}rem`);
      policyNumber.textContent = String(toneIndex + 1).padStart(2, '0');
      name.style.setProperty('--portrait-name-color', `rgb(${mix(9, 255, darkScene)}, ${mix(37, 255, darkScene)}, ${mix(75, 255, darkScene)})`);
      name.style.setProperty('--portrait-name-light-shadow', `${.95 * (1 - darkScene)}`);
      name.style.setProperty('--portrait-name-dark-shadow', `${.34 * darkScene}`);
    };

    const requestUpdate = () => {
      if (!frame) frame = requestAnimationFrame(updateStory);
    };

    updateStory();
    addEventListener('scroll', requestUpdate, { passive: true });
    addEventListener('resize', requestUpdate);
    return () => {
      vision.classList.remove('is-scroll-story');
      removeEventListener('scroll', requestUpdate);
      removeEventListener('resize', requestUpdate);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [isDesktop]);
}
