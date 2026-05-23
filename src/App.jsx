import React, { useRef, useState, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import './App.css';

import logo from './assets/HS.jpg';
import bgMusic from './assets/ambient-music.mp3';

gsap.registerPlugin(ScrollTrigger);

function App() {
  const container = useRef(null);
  const audioRef = useRef(null);
  const canvasRef = useRef(null);
  const introRef = useRef(null);
  
  const [isMuted, setIsMuted] = useState(true);
  const [hasStarted, setHasStarted] = useState(false);

  const handleStart = () => {
    if (audioRef.current) {
      audioRef.current.volume = 0.4;
      audioRef.current.play();
      setIsMuted(false);
    }

    const tl = gsap.timeline({
      onComplete: () => setHasStarted(true)
    });

    tl.to('.intro-brand-text', { y: -50, opacity: 0, filter: 'blur(20px)', duration: 2, ease: 'power3.inOut' }, 0)
      .to('.start-btn', { y: 50, opacity: 0, filter: 'blur(10px)', duration: 2, ease: 'power3.inOut' }, 0)
      .to(introRef.current, { opacity: 0, duration: 2.5, ease: 'power3.inOut' }, 0.5);
  };

  const toggleAudio = () => {
    if (audioRef.current) {
      if (isMuted) audioRef.current.play();
      else audioRef.current.pause();
      setIsMuted(!isMuted);
    }
  };

  // --- ENGINE ANIMATIONS ---
  useGSAP(() => {
    if (!hasStarted) {
      if (introRef.current) {
        gsap.fromTo('.intro-content', 
          { opacity: 0, y: 15 },
          { opacity: 1, y: 0, duration: 3.5, ease: 'power2.out', delay: 0.5 }
        );
      }
    } else {
      // 1. Header reveal
      gsap.fromTo('.glass-nav',
        { y: -30, opacity: 0 },
        { y: 0, opacity: 1, duration: 2, ease: 'power2.out' }
      );

      // 2. Clear Initial Entry + Smooth Scroll Cycle for the Title Block
      const titleTl = gsap.timeline();
      titleTl.fromTo('.lens-focus-text',
        { opacity: 0, filter: 'blur(30px)', scale: 1.1, letterSpacing: '0.6rem' },
        { opacity: 1, filter: 'blur(0px)', scale: 1, letterSpacing: '0.2rem', duration: 2.5, ease: 'power2.out' }
      );

      // Bind scroll dissolution without breaking state reversals
      gsap.fromTo('.lens-focus-text', 
        { opacity: 1, filter: 'blur(0px)', scale: 1 },
        {
          opacity: 0,
          filter: 'blur(15px)',
          scale: 0.92,
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

      // 3. Side Telemetry Panels (Glide out seamlessly from screen edge fields)
      gsap.fromTo('.left-side',
        { x: -100, opacity: 0 },
        {
          x: 0, opacity: 1,
          scrollTrigger: {
            trigger: '.river-panel',
            start: 'top 90%',
            end: 'top 30%',
            scrub: 1.5
          }
        }
      );

      gsap.fromTo('.right-side',
        { x: 100, opacity: 0 },
        {
          x: 0, opacity: 1,
          scrollTrigger: {
            trigger: '.river-panel',
            start: 'top 90%',
            end: 'top 30%',
            scrub: 1.5
          }
        }
      );

      // 4. Content Elements In River Block
      gsap.fromTo('.river-panel .fade-up', 
        { y: 40, opacity: 0, filter: 'blur(10px)' },
        {
          y: 0, opacity: 1, filter: 'blur(0px)', duration: 1.8, stagger: 0.2, ease: "power2.out",
          scrollTrigger: {
            trigger: '.river-panel',
            start: "top 70%",
            end: "center center",
            scrub: 1
          }
        }
      );

      // 5. High-End Framework Reveal
      gsap.fromTo('.tac-bracket, .footer-corner',
        { opacity: 0, scale: 0.95 },
        {
          opacity: 1, scale: 1, duration: 2, ease: 'power2.out',
          scrollTrigger: {
            trigger: '.footer-panel',
            start: 'top 95%',
          }
        }
      );
    }
  }, { scope: container, dependencies: [hasStarted] });

  // --- BACKGROUND PARTICLE MATRIX ---
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
    const handleMouseMove = (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };
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
      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
      }
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

  return (
    <div className="app-container" ref={container}>
      <audio ref={audioRef} src={bgMusic} loop />

      {/* --- INTRO OVERLAY --- */}
      {!hasStarted && (
        <div className="intro-overlay" ref={introRef}>
          <div className="intro-content">
            <h1 className="intro-brand-text">HANORYX<br/>SYSTEMS</h1>
            <button className="start-btn" onClick={handleStart}>
              START
            </button>
          </div>
        </div>
      )}

      <canvas ref={canvasRef} className="procedural-background"></canvas>

      {hasStarted && (
        <>
          {/* --- FIXED HEADER --- */}
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
            {/* BLOCK 1 */}
            <section className="scroll-panel transparent-panel">
              <h1 className="cinematic-text lens-focus-text">
                ONLINE SYSTEMS<span className="flashing-red-dot"></span>
              </h1>
            </section>

            {/* BLOCK 2 */}
            <section className="scroll-panel river-panel">
              
              {/* Sliding Interface Rails */}
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

            {/* FOOTER WITH HUD CORNER BRACKET WRAPS */}
            <footer className="footer-panel">
              
              {/* Unified Cyber Brackets */}
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
        </>
      )}
    </div>
  );
}

export default App;