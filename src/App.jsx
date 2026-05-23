import React, { useRef, useState, useEffect } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './App.css';

import logo from './assets/HS.jpg';
import bgMusic from './assets/ambient-music.mp3';

gsap.registerPlugin(ScrollTrigger);

function App() {
  const container = useRef(null);
  const audioRef = useRef(null);
  const canvasRef = useRef(null);
  const introRef = useRef(null);
  const hudRef = useRef(null);
  
  const [isMuted, setIsMuted] = useState(true);
  const [lockInput, setLockInput] = useState(true);

  // Mechanical hardware override to stop trackpads, wheels, and keys instantly
  useEffect(() => {
    window.scrollTo(0, 0);
    
    const preventScrollBehavior = (e) => {
      if (lockInput) {
        e.preventDefault();
        return false;
      }
    };

    const preventKeyScroll = (e) => {
      const keys = [' ', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'PageUp', 'PageDown', 'Home', 'End'];
      if (lockInput && keys.includes(e.key)) {
        e.preventDefault();
        return false;
      }
    };

    window.addEventListener('wheel', preventScrollBehavior, { passive: false });
    window.addEventListener('touchmove', preventScrollBehavior, { passive: false });
    window.addEventListener('keydown', preventKeyScroll, { passive: false });

    return () => {
      window.removeEventListener('wheel', preventScrollBehavior);
      window.removeEventListener('touchmove', preventScrollBehavior);
      window.removeEventListener('keydown', preventKeyScroll);
    };
  }, [lockInput]);

  // INITIAL MOUNT ENTRANCE: Fade and Glide in from opposite structural sides
  useGSAP(() => {
    const entryTl = gsap.timeline();
    
    entryTl.fromTo('.intro-brand-text', 
      { x: 70, opacity: 0 }, 
      { x: 0, opacity: 1, duration: 1.8, ease: 'power3.out' }, 
      0.3
    )
    .fromTo('.start-btn', 
      { x: -70, opacity: 0 }, 
      { x: 0, opacity: 1, duration: 1.8, ease: 'power3.out' }, 
      0.6
    );
  }, { scope: container });

  const handleStart = () => {
    if (audioRef.current) {
      audioRef.current.volume = 0.4;
      audioRef.current.play();
      setIsMuted(false);
    }

    const tl = gsap.timeline();

    // PHASE 1: Smoothly fade out the screen barrier along their split trajectories
    tl.to('.intro-brand-text', { x: -70, opacity: 0, duration: 1.4, ease: 'power3.inOut' }, 0)
      .to('.start-btn', { x: 70, opacity: 0, duration: 1.4, ease: 'power3.inOut' }, 0)
      .to(introRef.current, { opacity: 0, duration: 1.2, ease: 'power2.inOut' }, 0.4)
      .set(introRef.current, { display: 'none' });

    // PHASE 2: Gradual cinematic fade-in for all spinning matrix components
    tl.set(hudRef.current, { display: 'block', opacity: 0 }, 1.0)
      .to(hudRef.current, { opacity: 1, duration: 1.5, ease: 'power2.out' }, 1.0)
      .fromTo('.hud-grid-line.horiz', { scaleX: 0 }, { scaleX: 1, duration: 2.0, stagger: 0.15, ease: 'power3.out' }, 1.2)
      .fromTo('.hud-grid-line.vert', { scaleY: 0 }, { scaleY: 1, duration: 2.0, stagger: 0.15, ease: 'power3.out' }, 1.2)
      .fromTo('.matrix-bracket', { opacity: 0 }, { opacity: 1, duration: 1.2, ease: 'power2.out' }, 1.6)
      .fromTo('.log-line', { opacity: 0, x: -15 }, { opacity: 1, x: 0, stagger: 0.12, duration: 1.0, ease: 'power2.out' }, 1.5);

    // PHASE 3: THE GEOMETRIC BLOCK SWIPES
    tl.fromTo('.kinetic-block-swipe.block-primary', 
      { x: '-100%' }, 
      { x: '100%', duration: 3.2, ease: 'power2.inOut', repeat: 1, yoyo: true }, 
      1.2
    );
    tl.fromTo('.kinetic-block-swipe.block-secondary', 
      { x: '100%' }, 
      { x: '-100%', duration: 2.8, ease: 'power1.inOut', repeat: 1, yoyo: true }, 
      1.6
    );

    // Elongated system calibration progress counter (Cinematic Span Execution)
    let currentProgress = { value: 0 };
    tl.to(currentProgress, {
      value: 100,
      duration: 5.2,
      ease: 'power1.inOut',
      onUpdate: () => {
        const counterEl = document.querySelector('.boot-percentage');
        if (counterEl) { counterEl.innerText = `SYS.CALIBRATION // ${Math.floor(currentProgress.value).toString().padStart(3, '0')}%`; }
      }
    }, 1.2);

    // PHASE 4: Elegant dissolve out of diagnostic view
    tl.to(hudRef.current, { opacity: 0, y: -40, duration: 1.6, ease: 'power3.inOut' }, 6.6)
      .set(hudRef.current, { display: 'none' });

    // PHASE 5: Deploy Website Framework elements natively with zero visibility jumps
    tl.set('.main-viewport-content', { display: 'block' }, 7.4)
      .add(() => { window.scrollTo(0, 0); }, 7.4)
      .to('.main-viewport-content', { opacity: 1, duration: 1.6, ease: 'power2.out' }, 7.5)
      .fromTo('.glass-nav', { y: -50, opacity: 0 }, { y: 0, opacity: 1, duration: 1.6, ease: 'power4.out' }, 7.6)
      .fromTo('.lens-focus-text',
        { opacity: 0, y: 40, letterSpacing: '0.5rem' },
        { opacity: 1, y: 0, letterSpacing: '0.2rem', duration: 2.2, ease: 'power3.out' },
        7.8
      )
      .add(() => {
        setLockInput(false); // Structural input release sequence complete
        ScrollTrigger.refresh(); // Forces clean geometry calculations for triggers
      }, 8.6);
  };

  const toggleAudio = () => {
    if (audioRef.current) {
      if (isMuted) audioRef.current.play();
      else audioRef.current.pause();
      setIsMuted(!isMuted);
    }
  };

  // --- PROCEDURAL PARTICLES BACKGROUND ---
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;
    let particles = [];
    
    const config = {
      particleCount: window.innerWidth < 768 ? 30 : 75, 
      baseRadius: 1,
      connectionDistance: 150,
      mouseRepelRadius: 200,
      baseSpeed: 0.08, 
      colors: ['#ffffff', '#333333', '#666666']
    };

    let mouse = { x: null, y: null };
    const handleMouseMove = (e) => { mouse.x = e.clientX; mouse.y = e.clientY; };
    window.addEventListener('mousemove', handleMouseMove);

    class Particle {
      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.vx = (Math.random() - 0.5) * config.baseSpeed;
        this.vy = (Math.random() - 0.5) * config.baseSpeed;
        this.radius = Math.random() * config.baseRadius + 0.5;
        this.color = config.colors[Math.floor(Math.random() * config.colors.length)];
      }
      update() {
        this.x += this.vx;
        this.y += this.vy;
        if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
        if (this.y < 0 || this.y > canvas.height) this.vy *= -1;

        if (mouse.x != null && mouse.y != null) {
          let dx = mouse.x - this.x;
          let dy = mouse.y - this.y;
          let distance = Math.sqrt(dx * dx + dy * dy);
          if (distance < config.mouseRepelRadius) {
            const forceDirectionX = dx / distance;
            const forceDirectionY = dy / distance;
            const force = (config.mouseRepelRadius - distance) / config.mouseRepelRadius;
            this.x -= forceDirectionX * force * 1.2;
            this.y -= forceDirectionY * force * 1.2;
          }
        }
      }
      draw() { ctx.beginPath(); ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2); ctx.fillStyle = this.color; ctx.fill(); }
    }

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      particles = Array.from({ length: config.particleCount }, () => new Particle());
    };
    window.addEventListener('resize', handleResize);
    handleResize();

    const animate = () => {
      ctx.fillStyle = 'rgba(5, 5, 5, 0.4)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      particles.forEach(p => { p.update(); p.draw(); });

      for (let i = 0; i < particles.length; i++) {
        for (let j = i; j < particles.length; j++) {
          let dx = particles[i].x - particles[j].x;
          let dy = particles[i].y - particles[j].y;
          let dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < config.connectionDistance) {
            let op = 1 - (dist / config.connectionDistance);
            ctx.beginPath();
            ctx.strokeStyle = `rgba(255, 255, 255, ${op * 0.05})`;
            ctx.lineWidth = 0.8;
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }
      animationFrameId = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  useGSAP(() => {
    if (!lockInput) {
      // Clear, single direction scroll out blur without layout overlap flickering
      gsap.fromTo('.lens-focus-text', 
        { opacity: 1, filter: 'blur(0px)', scale: 1 },
        {
          opacity: 0,
          filter: 'blur(15px)',
          scale: 0.94,
          ease: 'none',
          scrollTrigger: {
            trigger: '.transparent-panel',
            start: 'top top',
            end: 'bottom center',
            scrub: true,
            invalidateOnRefresh: true
          }
        }
      );

      gsap.fromTo('.left-side', { x: -80, opacity: 0 }, {
        x: 0, opacity: 1,
        scrollTrigger: { trigger: '.river-panel', start: 'top 90%', end: 'top 30%', scrub: 1.5 }
      });

      gsap.fromTo('.right-side', { x: 80, opacity: 0 }, {
        x: 0, opacity: 1,
        scrollTrigger: { trigger: '.river-panel', start: 'top 90%', end: 'top 30%', scrub: 1.5 }
      });

      gsap.fromTo('.river-panel .fade-up', { y: 40, opacity: 0, filter: 'blur(10px)' }, {
        y: 0, opacity: 1, filter: 'blur(0px)', duration: 1.8, stagger: 0.2, ease: "power2.out",
        scrollTrigger: { trigger: '.river-panel', start: "top 70%", end: "center center", scrub: 1 }
      });

      gsap.fromTo('.tac-bracket, .footer-corner', { opacity: 0, scale: 0.95 }, {
        opacity: 1, scale: 1, duration: 2, ease: 'power2.out',
        scrollTrigger: { trigger: '.footer-panel', start: 'top 95%' }
      });
    }
  }, { scope: container, dependencies: [lockInput] });

  return (
    <div className={`app-container ${lockInput ? 'is-booting' : ''}`} ref={container}>
      <audio ref={audioRef} src={bgMusic} loop />

      {/* --- ENTRY LANDING SHIELD --- */}
      <div className="intro-overlay" ref={introRef}>
        <div className="intro-content">
          <h1 className="intro-brand-text">HANORYX<br/>SYSTEMS</h1>
          <button className="start-btn" onClick={handleStart}>START</button>
        </div>
      </div>

      {/* --- HIGH-KINETIC DIAGNOSTIC CORE CODESCAPE --- */}
      <div className="hud-boot-matrix" ref={hudRef}>
        
        {/* GEOMETRIC COHERENT BLOCK WAVE SWIPES */}
        <div className="kinetic-block-swipe block-primary"></div>
        <div className="kinetic-block-swipe block-secondary"></div>

        {/* COMBINED ROTATING & ZOOMING INFINITE MATRIX FIELDS */}
        <div className="kinetic-field chaotic-perspective-grids">
          <div className="persp-grid zoom-spin-1"></div>
          <div className="persp-grid zoom-spin-2"></div>
        </div>

        <div className="kinetic-field hud-objects-stream">
          <div className="kinetic-object flying-artifact fa-1"></div>
          <div className="kinetic-object flying-artifact fa-2"></div>
          <div className="kinetic-object vector-compass spin-rev"></div>
          <div className="kinetic-object scanner-bar vertical-sweep"></div>
        </div>

        {/* Clean System Grid Layout Guides */}
        <div className="hud-grid-line horiz h-1"></div>
        <div className="hud-grid-line horiz h-2"></div>
        <div className="hud-grid-line vert v-1"></div>
        <div className="hud-grid-line vert v-2"></div>

        <div className="matrix-bracket m-tl"></div>
        <div className="matrix-bracket m-tr"></div>
        <div className="matrix-bracket m-bl"></div>
        <div className="matrix-bracket m-br"></div>

        {/* ULTRA-CRISP READOUT FEED */}
        <div className="matrix-terminal-feed">
          <div className="log-line text-bright">** MASTER CORE CONFIG SEQUENCE V4.0 // CONNECTED **</div>
          <div className="log-line">INIT_CORE_VECTORS // CH_LOAD .................... [OK]</div>
          <div className="log-line">CALIBRATING STRUCTURAL HUD VOLUMETRICS ......... [STABLE]</div>
          <div className="log-line">NETWORK_ALIGNMENT // POSITION_LAT.42.083 ........ [ALIGNED]</div>
          <div className="log-line text-warn">WARNING // ENGAGING HIGH FREQUENCY TRANSITION MATRIX</div>
          <div className="log-line">MOUNTING VIEWPORT CORE FRAMEWORKS ............... [READY]</div>
        </div>

        <div className="boot-counter-display">
          <span className="boot-percentage">SYS.CALIBRATION // 000%</span>
          <div className="boot-pulse-indicator"></div>
        </div>
      </div>

      {/* Background Particle Layer */}
      <canvas ref={canvasRef} className="procedural-background"></canvas>

      {/* --- SITE VIEWPORT ARRAY --- */}
      <div className="main-viewport-content">
        <nav className="glass-nav">
          <div className="nav-col brand-lockup">
            <img src={logo} alt="Hanoryx Systems" className="brand-logo" />
            <span className="brand-name">HANORYX SYSTEMS</span>
          </div>
          
          <div className="nav-col nav-artifacts">
            <span className="status-dot"></span>
            SYS.OP // LN.026
          </div>

          <div className="nav-col audio-alignment-box">
            <button className={`audio-toggle-wrapper ${!isMuted ? 'is-playing' : ''}`} onClick={toggleAudio}>
              <div className="audio-visualizer">
                <span className="v-bar"></span>
                <span className="v-bar"></span>
                <span className="v-bar"></span>
              </div>
              <span className="audio-text">AUDIO // {isMuted ? 'MUTED' : 'LIVE'}</span>
            </button>
          </div>
        </nav>

        <main className="scroll-content">
          <section className="scroll-panel transparent-panel">
            <h1 className="cinematic-text lens-focus-text">
              ONLINE SYSTEMS<span className="flashing-red-dot"></span>
            </h1>
          </section>

          <section className="scroll-panel river-panel">
            <div className="side-decorator left-side">
              <div className="vertical-tracker"></div>
              <span className="telemetry-txt">SYS.ELEV // 1408M</span>
              <span className="telemetry-txt">FLOW_RATE.02</span>
            </div>
            
            <div className="side-decorator right-side">
              <div className="vertical-tracker"></div>
              <span className="telemetry-txt">INDEX.NW_ALIGN</span>
              <span className="telemetry-txt">LAT.42.083</span>
            </div>

            <div className="content-container">
              <h2 className="section-title fade-up">Development in the works.</h2>
              <p className="section-paragraph fade-up">
                We are currently architecting the next generation of digital infrastructure. 
                Our systems are undergoing rigorous structural upgrades to ensure uncompromising stability and scale. 
                Further documentation and access will be granted upon network alignment.
              </p>
            </div>
          </section>

          <footer className="footer-panel">
            <div className="tac-bracket tl-bracket"></div>
            <div className="tac-bracket tr-bracket"></div>
            <div className="tac-bracket bl-bracket"></div>
            <div className="tac-bracket br-bracket"></div>

            <div className="footer-corner bottom-left">
              <div className="rotating-dial"></div>
              <span className="corner-tag">NET.SYS_CONNECTED</span>
            </div>

            <p className="copyright-text">© 2026 Hanoryx Systems. All rights reserved.</p>

            <div className="footer-corner bottom-right">
              <span className="corner-tag">DATA_STREAM_IDLE</span>
              <div className="scanning-signal"></div>
            </div>
          </footer>
        </main>
      </div>
    </div>
  );
}

export default App;