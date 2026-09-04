import React from 'react';
import portraitUrl from '../assets/maruo-portrait-cutout.png';
import articleThumbnailUrl from '../assets/interview-article-thumbnail.jpg';
import {
  biographyParagraphs,
  heroContent,
  links,
  visionContent,
} from './siteContent.js';
import { SLIDES } from './siteConfig.js';

export function Header({ activeIndex, goTo }) {
  const profileActive = activeIndex === SLIDES.profile;
  const policyActive = activeIndex >= SLIDES.policyStart && activeIndex <= SLIDES.policyEnd;
  const supportActive = activeIndex === SLIDES.support;

  return (
    <header className="site-header">
      <a className="brand" href="#top" onClick={(event) => { event.preventDefault(); goTo(SLIDES.hero); }}><i aria-hidden="true" />丸尾けいすけ</a>
      <nav aria-label="メインメニュー">
        <a className={profileActive ? 'is-active' : ''} aria-current={profileActive ? 'location' : undefined} href="#profile" onClick={(event) => { event.preventDefault(); goTo(SLIDES.profile); }}>プロフィール</a>
        <a className={policyActive ? 'is-active' : ''} aria-current={policyActive ? 'location' : undefined} href="#policy" onClick={(event) => { event.preventDefault(); goTo(SLIDES.policyStart); }}>丸尾けいすけの政策</a>
        <a className={supportActive ? 'is-active' : ''} aria-current={supportActive ? 'location' : undefined} href="#support" onClick={(event) => { event.preventDefault(); goTo(SLIDES.support); }}>応援</a>
        <a href="privacy.html">プライバシーポリシー</a>
      </nav>
    </header>
  );
}

export function PortraitLayer() {
  return <div className="portrait-stage" aria-hidden="true"><img src={portraitUrl} alt="" /></div>;
}

export function Hero() {
  return (
    <section className="hero" id="top">
      <div className="hero-copy">
        <p>{heroContent.affiliation.map((line, index) => <React.Fragment key={line}>{index > 0 && <br />}{line}</React.Fragment>)}</p>
        <h1>
          <small>{heroContent.lead}</small>
          <strong>
            <span>{heroContent.emphasis}</span>
            <svg className="hero-circle" viewBox="0 0 500 500" aria-hidden="true">
              <defs><filter id="brush-rough" x="-20%" y="-20%" width="140%" height="140%"><feTurbulence type="fractalNoise" baseFrequency=".012 .07" numOctaves="2" seed="8" result="noise" /><feDisplacementMap in="SourceGraphic" in2="noise" scale="10" /></filter></defs>
              <path className="brush-path" pathLength="1" d="M250 470 A220 220 0 1 1 250 30 A220 220 0 1 1 250 470" />
            </svg>
          </strong>
          {heroContent.ending}
        </h1>
      </div>
    </section>
  );
}

export function Vision() {
  return (
    <section className="vision" id="vision">
      <div className="vision-stage">
        <h2>{visionContent.heading.map((line, index) => <React.Fragment key={line}>{index > 0 && <br />}{line}</React.Fragment>)}</h2>
        <div className="body-copy">{visionContent.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}</div>
      </div>
    </section>
  );
}

function Biography() {
  return (
    <div className="profile-biography">
      {biographyParagraphs.map((lines) => (
        <p key={lines[0]}>{lines.map((line, index) => <React.Fragment key={line}>{index > 0 && <br />}{line}</React.Fragment>)}</p>
      ))}
    </div>
  );
}

function Interviews() {
  return (
    <div className="profile-interviews">
      <div className="profile-interview-item">
        <h3>インタビュー記事</h3>
        <a className="profile-article-link" href={links.interviewArticle}>
          <img src={articleThumbnailUrl} alt="インタビュー記事『一人ひとりの能力を最大限引き出す社会へ』" />
          <span>インタビューを読む&nbsp;→</span>
        </a>
      </div>
      <div className="profile-interview-item">
        <h3>インタビュー動画</h3>
        <div className="profile-video-frame"><iframe title="①【衆院選・福岡１区 中道候補 丸尾けいすけ】私の生い立ち、政治家を目指した理由" src={links.interviewVideo} loading="lazy" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowFullScreen /></div>
      </div>
    </div>
  );
}

function ProfileContents() {
  return <div><Biography /><Interviews /></div>;
}

export function MobileProfile() {
  return (
    <section className="sheet profile profile-mobile" id="profile">
      <div className="profile-panel"><div className="profile-scroll">
        <h2>プロフィール</h2>
        <div className="profile-layout"><ProfileContents /></div>
      </div></div>
    </section>
  );
}

export function DesktopProfile() {
  return (
    <section className="sheet profile profile-desktop" id="profile-desktop">
      <div className="profile-panel"><div className="profile-scroll">
        <h2>プロフィール</h2>
        <div className="profile-layout"><ProfileContents /></div>
      </div></div>
    </section>
  );
}

export function PolicySlide({ policy, isFirst }) {
  return (
    <section className="sheet policy policy-list policy-slide" id={isFirst ? 'policy' : undefined}>
      <article className="policy-card" data-policy={policy.number}>
        <b>{policy.number}</b>
        <span className="policy-icon material-symbols-outlined" aria-hidden="true">{policy.icon}</span>
        <h3>{policy.title}</h3>
        <p>{policy.lead}</p>
        <div className="measures"><h4>具体策</h4><ul>{policy.measures.map((measure) => <li key={measure}>{measure}</li>)}</ul></div>
      </article>
    </section>
  );
}

export function Support() {
  return (
    <section className="sheet support" id="support">
      <div><h2>応援</h2><p>ポスティングなどのボランティア、ポスターの掲示、ご親族、ご友人へのご紹介などを通じて丸尾けいすけの活動のご支援をお願いします。</p><a className="button" href={links.support}>→ 応援する</a></div>
      <div><h2>寄付</h2><p>ご寄付を通じて丸尾けいすけの活動へのご支援をお願いしております。 ぜひご協力をお願いします。<br />※寄付金控除の適用がございます。</p><a className="button" href={links.donation}>→ 寄付する</a></div>
      <div className="social">
        <h2>SNS</h2>
        <div className="social-grid">
          <section className="social-card social-card-link"><h3>Instagram</h3><a className="social-icon-link" href={links.instagram} target="_blank" rel="noopener noreferrer" aria-label="Instagramで丸尾けいすけのアカウントを開く"><span className="social-icon-mark social-icon-instagram material-symbols-outlined" aria-hidden="true">photo_camera</span><span><b>@maruokeisuke</b><small>Instagramで見る</small></span><span className="material-symbols-outlined social-link-arrow" aria-hidden="true">arrow_outward</span></a></section>
          <section className="social-card social-card-link"><h3>X</h3><a className="social-icon-link" href={links.x} target="_blank" rel="noopener noreferrer" aria-label="Xで丸尾けいすけのアカウントを開く"><span className="social-icon-mark social-icon-x" aria-hidden="true">X</span><span><b>@mroksk</b><small>Xで見る</small></span><span className="material-symbols-outlined social-link-arrow" aria-hidden="true">arrow_outward</span></a></section>
        </div>
      </div>
    </section>
  );
}

export function Footer() {
  return <footer className="site-footer"><b>丸尾けいすけ</b><a href="privacy.html">プライバシーポリシー</a></footer>;
}
