
import React, { useEffect, useRef, useState, useMemo } from "react";
import { useLanguage } from "../context/LanguageContext";
import { useSearch } from "../context/SearchContext";
import styles from "./Home.module.css";
import TestimonialSection from "../components/TestimonialSection";
import Newsletter from "../components/Newsletter";
import FAQ from "../components/FAQ";
import { useNavigate, useLocation } from "react-router-dom";

export default function Home() {
  const { t } = useLanguage();
  const { searchTerm } = useSearch();
  const home = t.home;
  const navigate = useNavigate();
  const { hash } = useLocation();
  // ⬅️ listen to #hash
  // 👇 add these with your other hooks/state near the top of Home()
  const leaderListRef = useRef(null);
  const [leaderIdx, setLeaderIdx] = useState(0);


  const heroImages = [
    "/images/mu.jpg",
    "/images/job.jpg",
    "/images/lang.jpg",
    "/images/education.jpg",
  ];

  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 767);

  // Services: autoplay → manual on click
  const [manualScroll, setManualScroll] = useState(false);
  const wrapperRef = useRef(null);

  // custom thin bar (optional)
  const [showBar, setShowBar] = useState(false);
  const [thumbW, setThumbW] = useState(60);
  const [thumbX, setThumbX] = useState(0);
  const trackRef = useRef(null);

  const enterManualMode = () => { if (!manualScroll) setManualScroll(true); };

  const recalcThumb = () => {
    const wr = wrapperRef.current;
    const tr = trackRef.current;
    if (!wr || !tr) return;

    const overflow = wr.scrollWidth > wr.clientWidth + 1;
    setShowBar(manualScroll && overflow);

    const trackW = tr.clientWidth || 1;
    const ratio = wr.clientWidth / wr.scrollWidth;
    const w = Math.max(40, trackW * ratio);
    const maxX = Math.max(0, trackW - w);
    const scrollable = Math.max(1, wr.scrollWidth - wr.clientWidth);
    const x = (wr.scrollLeft / scrollable) * maxX;

    setThumbW(w);
    setThumbX(Number.isFinite(x) ? x : 0);
  };

  useEffect(() => {
    const wr = wrapperRef.current;
    if (!wr) return;
    recalcThumb();
    const onScroll = () => recalcThumb();
    const onResize = () => recalcThumb();
    wr.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);
    return () => {
      wr.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
    };
  }, [manualScroll]);


  const onTrackDown = (e) => {
    enterManualMode();
    const wr = wrapperRef.current;
    const tr = trackRef.current;
    if (!wr || !tr) return;
    const rect = tr.getBoundingClientRect();
    const cx = (e.clientX ?? e.touches?.[0]?.clientX ?? 0) - rect.left;

    const trackW = tr.clientWidth || 1;
    const maxX = Math.max(0, trackW - thumbW);
    const nx = Math.max(0, Math.min(maxX, cx - thumbW / 2));
    setThumbX(nx);
    const scrollable = Math.max(1, wr.scrollWidth - wr.clientWidth);
    wr.scrollLeft = (nx / maxX) * scrollable;
  };

  const onThumbDown = (e) => {
    e.preventDefault();
    enterManualMode();
    const startX = e.clientX ?? e.touches?.[0]?.clientX ?? 0;
    const startThumbX = thumbX;

    const move = (ev) => {
      const wr = wrapperRef.current;
      const tr = trackRef.current;
      if (!wr || !tr) return;
      const clientX = ev.clientX ?? ev.touches?.[0]?.clientX ?? 0;
      const trackW = tr.clientWidth || 1;
      const maxX = Math.max(0, trackW - thumbW);
      const nx = Math.max(0, Math.min(maxX, startThumbX + (clientX - startX)));
      setThumbX(nx);
      const scrollable = Math.max(1, wr.scrollWidth - wr.clientWidth);
      wr.scrollLeft = (nx / maxX) * scrollable;
    };

    const up = () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
      window.removeEventListener("touchmove", move);
      window.removeEventListener("touchend", up);
    };

    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up, { once: true });
    window.addEventListener("touchmove", move, { passive: false });
    window.addEventListener("touchend", up, { once: true });
  };

  // hero rotator
  useEffect(() => {
    const id = setInterval(
      () => setCurrentImageIndex((p) => (p + 1) % heroImages.length),
      4000
    );
    return () => clearInterval(id);
  }, []);

  // mobile flag
  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth <= 767);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  // search highlight
  useEffect(() => {
    if (!searchTerm) return;
    const regex = new RegExp(`(${searchTerm})`, "gi");
    const els = document.querySelectorAll("h1, h2, h3, p, span, button, div");
    els.forEach((el) => {
      if (el.children.length > 0) return;
      el.innerHTML = el.textContent;
      if (regex.test(el.textContent)) {
        el.innerHTML = el.textContent.replace(
          regex,
          `<mark class="highlight">$1</mark>`
        );
        el.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    });
  }, [searchTerm]);

  // Back to Top
  const [showTop, setShowTop] = useState(false);
  useEffect(() => {
    const onScroll = () => setShowTop(window.scrollY > 400);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  // leadership (from translations if available)
  const leadershipTitle = home?.leadership?.title || "Our Leadership";
  const leadershipMembers = home?.leadership?.members || [];

  // Testimony-style statements
  const statements = useMemo(
    () =>
      [
        { key: "about", title: home.aboutTitle, text: home.aboutDescription },
        { key: "mission", title: home.missionTitle, text: home.missionDescription },
        { key: "values", title: home.valuesTitle, text: home.valuesDescription },
        { key: "purpose", title: home.purposeTitle, text: home.purposeDescription },
        { key: "vision", title: home.visionTitle, text: home.visionDescription },
      ].filter(Boolean),
    [home]
  );

  const [statementIdx, setStatementIdx] = useState(0);
  const [pauseStatements, setPauseStatements] = useState(false);

  useEffect(() => {
    if (pauseStatements || statements.length <= 1) return;
    const id = setInterval(() => {
      setStatementIdx((i) => (i + 1) % statements.length);
    }, 5000);
    return () => clearInterval(id);
  }, [pauseStatements, statements.length]);

  // ⬇️ Smooth-scroll to a section if URL has a hash (/#about or /#mission)
  useEffect(() => {
    if (!hash) return;
    const el = document.querySelector(hash);
    if (el) {
      // slight delay so layout settles
      setTimeout(() => el.scrollIntoView({ behavior: "smooth", block: "start" }), 60);
    }
  }, [hash]);

  return (
    <main id="top" className={styles.home}>
      {isMobile && (
        <div className={styles.donateBanner} onClick={() => navigate("/donate")}>
          {home.donateMessage}
        </div>
      )}

      <div className={styles.homeContainer}>
        {/* Hero */}
        <section className={styles.hero}>
          <div className={styles.heroMainContent}>
            <img
              src={heroImages[currentImageIndex]}
              alt="Supportive"
              className={styles.heroImage}
            />
            {/* centered overlay */}
            <div
              className={styles.heroTextBlock}
              style={{
                position: "absolute",
                inset: 0,
                display: "grid",
                placeItems: "center",
                zIndex: 1,
                pointerEvents: "none",
                padding: "clamp(12px, 2vw, 24px)",
                textAlign: "center",
              }}
            >
              <div style={{ maxWidth: "min(92vw, 1100px)" }}>
                <h1
                  className={styles.wel}
                  style={{
                    margin: 0,
                    lineHeight: 1.05,
                    letterSpacing: ".02em",
                    textTransform: "uppercase",
                    filter: "drop-shadow(0 2px 10px rgba(0,0,0,.45))",
                  }}
                >
                  {home.welcomeText}
                </h1>

                <p
                  style={{
                    margin: "10px auto 0",
                    fontWeight: 700,
                    fontSize: "clamp(1rem, 2.6vw, 1.55rem)",
                    lineHeight: 1.35,
                    textWrap: "balance",
                    color: "#f3f4f6",
                    textShadow: "0 2px 10px rgba(0,0,0,.45)",
                  }}
                >
                  {home.description}
                </p>
              </div>
            </div>
          </div>

          <div className={styles.testimonials}>
            <TestimonialSection />
          </div>
        </section>

        {/* ✅ About & Mission sections (targets for #about and #mission) */}
        <section className={styles.aboutMission}>
          <article id="about" className={`${styles.about} ${styles.anchorFix}`}>
            <p className={styles.subTitle}>{home.aboutLabel || "About us"}</p>
            <h2>{home.aboutTitle}</h2>
            <p>{home.aboutDescription}</p>
          </article>

          <article id="mission" className={`${styles.mission} ${styles.anchorFix}`}>
            <p className={styles.subTitle}>{home.missionLabel || "Mission"}</p>
            <h2>{home.missionTitle}</h2>
            <p>{home.missionDescription}</p>
          </article>
        </section>

        {/* Statements (testimony style) */}
        <section
          id="statements"
          className={`${styles.statementsCarousel} ${styles.anchorFix}`}
          onMouseEnter={() => setPauseStatements(true)}
          onMouseLeave={() => setPauseStatements(false)}
        >
          <div className={styles.statementsHeader}>
            <h2>{home?.statementsTitle || ""}</h2>
            <p className={styles.statementsSub}>{home?.statementsSubtitle ?? ""}</p>
          </div>

          <div className={styles.statementViewport}>
            <div
              className={styles.statementTrack}
              style={{ transform: `translateX(-${statementIdx * 100}%)` }}
            >
              {statements.map((s, i) => (
                <article key={s.key ?? i} className={styles.statementSlide}>
                  <div className={styles.statementCard}>
                    <div className={styles.statementBadge} />
                    <h3 className={styles.statementTitle}>{s.title}</h3>
                    <p className={styles.statementText}>{s.text}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>

          <div className={styles.statementDots} role="tablist" aria-label="Statements">
            {statements.map((_, i) => (
              <button
                key={i}
                role="tab"
                aria-selected={statementIdx === i}
                className={`${styles.statementDot} ${statementIdx === i ? styles.activeDot : ""}`}
                onClick={() => setStatementIdx(i)}
              />
            ))}
          </div>
        </section>

        {/* Leadership */}
        {/* Leadership */}
        <section id="leadership" className={`${styles.leadershipSection} ${styles.anchorFix}`}>
          <h2 className={styles.modalTitle}>{leadershipTitle}</h2>

          {leadershipMembers.length > 0 ? (
            <ul
              ref={leaderListRef}
              className={`${styles.leadershipList} ${styles.leaderCarousel}`} // ⬅️ add
              // these CSS vars feed the animation timing
              style={{
                // 4s per card; cycle is computed by CSS using delays, so this is optional
                "--step": "4s",
              }}
            >
              {leadershipMembers.map((m, idx) => (
                <li
                  key={m.name}
                  className={`${styles.leadershipItem} ${leaderIdx === idx ? styles.isVisible : ""}`} // ⬅️ add isVisible flag
                  style={{
                    "--i": idx, // ⬅️ used for staggered animation delay
                    background: m.cardColor || undefined,
                    borderColor: m.cardColor ? `${m.cardColor}` : undefined,
                    "--accent": m.accentColor || undefined,
                    "--delay": `${idx * 120}ms`,
                  }}
                >
                  <img src={m.image} alt={m.name} className={styles.leaderImg} />
                  <p className={styles.leaderName} style={{ color: m.titleColor || undefined }}>
                    {m.name}
                  </p>
                  <p className={styles.leaderRole} style={{ color: m.roleColor || "var(--accent)" }}>
                    {m.role}
                  </p>
                  <p className={styles.leaderText} style={{ color: m.textColor || undefined }}>
                    {m.bio}
                  </p>
                </li>
              ))}
            </ul>
          ) : (
            <p className={styles.leaderText}>Leadership details coming soon.</p>
          )}
        </section>


        {/* Services */}
        <section id="services" className={`${styles.services} ${styles.anchorFix}`}>
          <div className={styles.ser}>
            <h2>{home.servicesTitle}</h2>
          </div>

          <div
            ref={wrapperRef}
            className={`${styles.serviceWrapper} ${manualScroll ? styles.manualScroll : styles.hiddenScroll}`}
          >
            <div
              className={manualScroll ? styles.scroller : styles.scrollerMarquee}
              onClick={enterManualMode}
              onTouchStart={enterManualMode}
            >
              {[...home.services, ...home.services].map((service, idx) => (
                <div key={idx} className={styles.cardContainer}>
                  <div className={styles.flipCard}>
                    <div className={styles.flipCardInner}>
                      <div className={styles.flipCardFront}>
                        <img src={service.image} alt={service.title} className={styles.serviceImage} />
                        <h3>{service.title}</h3>
                      </div>
                      <div className={styles.flipCardBack}>
                        <h4>{service.title}</h4>
                        <p>{service.description}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div
              ref={trackRef}
              className={`${styles.stickyBar} ${showBar ? styles.showBar : ""}`}
              onPointerDown={onTrackDown}
              onTouchStart={onTrackDown}
            >
              <div
                className={styles.stickyThumb}
                style={{ width: `${thumbW}px`, transform: `translateX(${thumbX}px)` }}
                onPointerDown={onThumbDown}
                onTouchStart={onThumbDown}
              />
            </div>
          </div>
        </section>

        <Newsletter />

        {/* Location map */}
        <section id="location" className={`${styles.mapSection} ${styles.anchorFix}`}>
         <h2 className={styles.mapTitle}>{home.mapTitle}</h2>

          <div className={styles.mapCard}>
            <div className={styles.mapFrame}>
              <iframe
                title="Action Bilingual Services Location"
                src={
                  "https://www.google.com/maps?q=" +
                  encodeURIComponent("1380 Main Street, 4th Floor, Suite 408, Springfield MA 01103") +
                  "&output=embed"
                }
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                allowFullScreen
              />
            </div>

            <address className={styles.mapAddress}>
              1380 Main Street, 4th Floor, Suite 408, Springfield, MA 01103
            </address>

            <a
              className={styles.mapBtn}
              target="_blank"
              rel="noreferrer"
              href={
                "https://www.google.com/maps/dir/?api=1&destination=" +
                encodeURIComponent("1380 Main Street, 4th Floor, Suite 408, Springfield MA 01103")
              }
            >
             {home.mapOpenBtn}
            </a>
          </div>
        </section>



        <FAQ />
      </div>

      {/* Back to top */}
      <button
        className={`${styles.backToTop} ${showTop ? styles.showTop : ""}`}
        aria-label="Back to top"
        title="Back to top"
        onClick={scrollToTop}
      >
        ↑
      </button>
    </main>
  );
}
