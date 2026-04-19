import { useState, useEffect, useRef, useCallback } from 'react';
import * as THREE from 'three';
import heroimg from './assets/y.jpg';

const TEXTS = ['TECH ENTHUSIAST', 'WEB DEVELOPER', 'SYSADMIN', 'INTERNET OF THINGS', 'CYBERSECURITY'];
const LEFT_BINARY  = '10101010101010101010101010101010101010101010101010';
const RIGHT_BINARY = '01010101010101010101010101010101010101010101010101';
const ACCENT = '#2afa94';

function generateBinary(length) {
  return Array.from({ length }, () => (Math.random() < 0.5 ? '0' : '1')).join('');
}

/* ─── Three.js Particle Background ─────────────────────────────────────────── */
function ParticleCanvas() {
  const mountRef = useRef(null);

  useEffect(() => {
    const el = mountRef.current;
    const W = window.innerWidth, H = window.innerHeight;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: false });
    renderer.setSize(W, H);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    el.appendChild(renderer.domElement);

    const scene  = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, W / H, 0.1, 200);
    camera.position.z = 60;

    /* floating dots */
    const COUNT = 600;
    const geo   = new THREE.BufferGeometry();
    const pos   = new Float32Array(COUNT * 3);
    const sizes = new Float32Array(COUNT);
    for (let i = 0; i < COUNT; i++) {
      pos[i * 3]     = (Math.random() - 0.5) * 180;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 120;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 80;
      sizes[i] = Math.random() * 1.8 + 0.4;
    }
    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    geo.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

    const mat = new THREE.PointsMaterial({
      color: 0x2afa94,
      size: 0.35,
      transparent: true,
      opacity: 0.35,
      sizeAttenuation: true,
    });
    const points = new THREE.Points(geo, mat);
    scene.add(points);

    /* grid plane */
    const gridGeo = new THREE.BufferGeometry();
    const gridLines = [];
    const STEP = 8;
    const GRID_Z = -20;
    const rebuildGrid = () => {
      gridLines.length = 0;
      const distance = camera.position.z - GRID_Z;
      const halfHeight = Math.tan(THREE.MathUtils.degToRad(camera.fov / 2)) * distance;
      const halfWidth = halfHeight * camera.aspect;
      const pad = STEP * 2;
      const xMin = Math.floor((-halfWidth - pad) / STEP) * STEP;
      const xMax = Math.ceil((halfWidth + pad) / STEP) * STEP;
      const yMin = Math.floor((-halfHeight - pad) / STEP) * STEP;
      const yMax = Math.ceil((halfHeight + pad) / STEP) * STEP;

      for (let x = xMin; x <= xMax; x += STEP) {
        gridLines.push(x, yMin, GRID_Z, x, yMax, GRID_Z);
      }
      for (let y = yMin; y <= yMax; y += STEP) {
        gridLines.push(xMin, y, GRID_Z, xMax, y, GRID_Z);
      }
      gridGeo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(gridLines), 3));
      gridGeo.computeBoundingSphere();
    };

    rebuildGrid();
    const gridMat = new THREE.LineBasicMaterial({ color: 0x0d2a1a, transparent: true, opacity: 0.5 });
    scene.add(new THREE.LineSegments(gridGeo, gridMat));

    let frame;
    const tick = () => {
      frame = requestAnimationFrame(tick);
      points.rotation.y += 0.0003;
      points.rotation.x += 0.0001;
      renderer.render(scene, camera);
    };
    tick();

    const onResize = () => {
      const w = window.innerWidth, h = window.innerHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
      rebuildGrid();
    };
    window.addEventListener('resize', onResize);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('resize', onResize);
      renderer.dispose();
      if (el.contains(renderer.domElement)) el.removeChild(renderer.domElement);
    };
  }, []);

  return (
    <div
      ref={mountRef}
      style={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none' }}
    />
  );
}

/* ─── Burst particles on reveal ────────────────────────────────────────────── */
function spawnBurst(x, y) {
  const canvas = document.createElement('canvas');
  canvas.style.cssText = `position:fixed;inset:0;pointer-events:none;z-index:50`;
  canvas.width  = window.innerWidth;
  canvas.height = window.innerHeight;
  document.body.appendChild(canvas);
  const ctx = canvas.getContext('2d');
  const particles = Array.from({ length: 28 }, () => ({
    x, y,
    vx: (Math.random() - 0.5) * 6,
    vy: (Math.random() - 0.5) * 6,
    life: 1,
    r: Math.random() * 2.5 + 0.5,
  }));
  let running = true;
  const animate = () => {
    if (!running) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => {
      p.x += p.vx;
      p.y += p.vy;
      p.life -= 0.035;
      ctx.globalAlpha = Math.max(0, p.life);
      ctx.fillStyle = ACCENT;
      ctx.shadowBlur = 6;
      ctx.shadowColor = ACCENT;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fill();
    });
    if (particles.some(p => p.life > 0)) requestAnimationFrame(animate);
    else { running = false; canvas.remove(); }
  };
  animate();
}

/* ─── Binary Row ────────────────────────────────────────────────────────────── */
function BinaryRow({ text, idx, revealed, onReveal }) {
  const compactText = text.replace(/\s+/g, '');
  const [display, setDisplay] = useState(() => generateBinary(compactText.length));
  const [hovered, setHovered] = useState(false);
  const rowRef = useRef(null);

  const reveal = useCallback(() => {
    if (revealed) return;
    let step = 0;
    const chars = compactText.split('').map(() => (Math.random() < 0.5 ? '0' : '1'));
    setDisplay(chars.join(''));
    const iv = setInterval(() => {
      if (step < compactText.length) {
        chars[step] = compactText[step];
        setDisplay(chars.join(''));
        step++;
      } else {
        clearInterval(iv);
        onReveal(idx);
        /* burst at row center */
        if (rowRef.current) {
          const rect = rowRef.current.getBoundingClientRect();
          spawnBurst(rect.left + rect.width / 2, rect.top + rect.height / 2);
        }
      }
    }, 80);
  }, [revealed, compactText, idx, onReveal]);

  /* re-randomise when not revealed and not hovered */
  useEffect(() => {
    if (revealed || hovered) return;
    const iv = setInterval(() => setDisplay(generateBinary(compactText.length)), 400);
    return () => clearInterval(iv);
  }, [revealed, hovered, compactText]);

  return (
    <div
      ref={rowRef}
      onMouseEnter={() => { setHovered(true); reveal(); }}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: 'flex',
        alignItems: 'center',
        width: '100%',
        maxWidth: 700,
        cursor: 'pointer',
        position: 'relative',
        padding: '6px 0',
        transition: 'background .3s',
      }}
    >
      {/* glow underline */}
      <div style={{
        position: 'absolute',
        bottom: 0,
        left: revealed || hovered ? '0%' : '50%',
        width: revealed || hovered ? '100%' : '0%',
        height: 1,
        background: ACCENT,
        boxShadow: `0 0 8px ${ACCENT}`,
        transition: 'all .45s ease',
      }} />

      {/* left binary */}
      <div style={{ flex: 1, overflow: 'hidden', textAlign: 'right', paddingRight: 20 }}>
        <span style={{
          fontFamily: "'Orbitron', Sans-serif",
          fontSize: 13,
          color: hovered || revealed ? '#1a4a2e' : '#161616',
          letterSpacing: 1,
          textShadow: hovered ? `0 0 6px #0d2a1a` : 'none',
          transition: 'color .3s',
          whiteSpace: 'nowrap',
        }}>
          {LEFT_BINARY}
        </span>
      </div>

      {/* center text */}
      <div style={{ minWidth: 260, textAlign: 'center' }}>
        <span style={{ fontFamily: "'Orbitron', monospace", fontSize: 'clamp(12px,2vw,20px)', fontWeight: 700, letterSpacing: 0 }}>
          {display.split('').map((char, ci) => {
            const isLetter = revealed && char >= 'A' && char <= 'Z';
            return (
              <span key={ci} style={{
                color: isLetter ? '#ffffff' : (hovered ? '#2afa94' : '#222'),
                textShadow: isLetter ? `0 0 12px rgba(255,255,255,.5)` : (hovered ? `0 0 8px ${ACCENT}` : 'none'),
                transition: 'color .1s, text-shadow .1s',
              }}>
                {char}
              </span>
            );
          })}
        </span>
      </div>

      {/* right binary */}
      <div style={{ flex: 1, overflow: 'hidden', textAlign: 'left', paddingLeft: 20 }}>
        <span style={{
          fontFamily: "'Orbitron', Sans-serif",
          fontSize: 13,
          color: hovered || revealed ? '#1a4a2e' : '#161616',
          letterSpacing: 1,
          textShadow: hovered ? `0 0 6px #0d2a1a` : 'none',
          transition: 'color .3s',
          whiteSpace: 'nowrap',
        }}>
          {RIGHT_BINARY}
        </span>
      </div>
    </div>
  );
}

/* ─── Main App ──────────────────────────────────────────────────────────────── */
export default function App({ navigate }) {
  const [revealed, setRevealed] = useState({});
  const [glitch, setGlitch]     = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [redirecting, setRedirecting] = useState(false);
  const [progress, setProgress] = useState(0);
  const idleTimer = useRef(null);

  const handleReveal = useCallback((idx) => {
    setRevealed(prev => ({ ...prev, [idx]: true }));
    /* reset idle */
    setShowHint(false);
    clearTimeout(idleTimer.current);
    idleTimer.current = setTimeout(() => setShowHint(true), 5000);
  }, []);

  const revealedCount = Object.keys(revealed).length;

  /* auto-redirect when all revealed */
  useEffect(() => {
    if (revealedCount < TEXTS.length) return;
    const delay = setTimeout(() => {
      setRedirecting(true);
      /* animate progress bar then navigate */
      let p = 0;
      const iv = setInterval(() => {
        p += 2;
        setProgress(p);
        if (p >= 100) {
          clearInterval(iv);

          if (typeof navigate === 'function') navigate('/mainpage');
          else window.location.hash = '#/main'; /* fallback */
        }
      }, 30);
    }, 800);
    return () => clearTimeout(delay);
  }, [revealedCount, navigate]);

  /* idle hint timer – starts on mount */
  useEffect(() => {
    idleTimer.current = setTimeout(() => setShowHint(true), 5000);
    return () => clearTimeout(idleTimer.current);
  }, []);

  /* glitch effect */
  useEffect(() => {
    const iv = setInterval(() => {
      setGlitch(true);
      setTimeout(() => setGlitch(false), 120);
    }, 4000);
    return () => clearInterval(iv);
  }, []);

  return (
    <div style={{ background: '#000', minHeight: '100vh', height: '100vh', position: 'relative', overflow: 'hidden' }}>

      {/* ── Google Fonts ── */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&family=Share+Tech+Mono&display=swap');
        @keyframes glitch-skew {
          0%   { clip-path: inset(0 0 98% 0); transform: skewX(0deg); }
          20%  { clip-path: inset(30% 0 50% 0); transform: skewX(-4deg); }
          40%  { clip-path: inset(60% 0 20% 0); transform: skewX(3deg); }
          60%  { clip-path: inset(10% 0 70% 0); transform: skewX(-2deg); }
          80%  { clip-path: inset(80% 0 5% 0);  transform: skewX(5deg); }
          100% { clip-path: inset(0 0 98% 0); transform: skewX(0deg); }
        }
        @keyframes hint-pulse {
          0%, 100% { opacity: .5; transform: translateX(-50%) translateY(0); }
          50%       { opacity: 1;  transform: translateX(-50%) translateY(-4px); }
        }
        @keyframes scanmove {
          0%   { top: -4px; }
          100% { top: 100%; }
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(6px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      {/* Three.js background */}
      <ParticleCanvas />

      {/* scanlines */}
      <div style={{
        position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 2,
        backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(42,250,148,.018) 3px, rgba(42,250,148,.018) 4px)',
      }} />

      {/* moving scan bar */}
      <div style={{
        position: 'fixed', left: 0, right: 0, height: 3, pointerEvents: 'none', zIndex: 3,
        background: 'linear-gradient(transparent, rgba(42,250,148,.12), transparent)',
        animation: 'scanmove 6s linear infinite',
      }} />

      {/* glitch overlay */}
      {glitch && (
        <div style={{
          position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 4,
          background: 'rgba(42,250,148,.04)',
          animation: 'glitch-skew .12s steps(1) forwards',
        }} />
      )}

      {/* ── Content ── */}
      <div style={{
        position: 'relative', zIndex: 5,
        display: 'flex', flexDirection: 'column', alignItems: 'center',
        paddingTop: 30,
        animation: 'fadeIn .8s ease both',
      }}>

        {/* top label */}
        <div style={{ marginBottom: 6 }}>
          <span style={{
            fontFamily: "'Share Tech Mono', monospace",
            fontSize: 10, letterSpacing: 6, color: '#2afa94', opacity: .6,
          }}>
            ── SYSTEM BOOT v2.4.1 ──
          </span>
        </div>

        {/* main title */}
        <h1 style={{
          fontFamily: "'Stalinist One', Sans-serif",
          fontWeight: 900,
          color: '#fff',
          letterSpacing: 'clamp(8px, 2vw, 18px)',
          textShadow: '0 0 30px rgba(42,250,148,.2)',
          marginBottom: 14,
          textAlign: 'center',
        }} className='text-5xl'>
          HELLO WORLD
        </h1>

        {/* sub labels */}
        <div style={{ display: 'flex', gap: 32, marginBottom: 6 }}>
          {['FIAN', 'PORTFOLIO', 'WEB'].map(s => (
            <span key={s} style={{
              fontFamily: "'Share Tech Mono', monospace",
              fontSize: 12, letterSpacing: 5, color: '#2afa94', opacity: .8,
            }}>{s}</span>
          ))}
        </div>

        {/* divider */}
        <div style={{ width: 320, height: 1, background: 'linear-gradient(90deg, transparent, #2afa94, transparent)', margin: '12px 0 20px', opacity: .4 }} />

        {/* hero image */}
        <div style={{
          position: 'relative',
          width: '760px',
          aspectRatio: '736 / 175',
          maxWidth: '92vw',
          border: '1px solid #0d2a1a',
          marginBottom: 28,
          overflow: 'hidden',
        }}>
          {/* corner accents */}
          {[['0','0','top','left'],['0','auto','top','right'],['auto','0','bottom','left'],['auto','auto','bottom','right']].map(([r,ri,t,l],i) => (
            <div key={i} style={{
              position:'absolute', width:14, height:14, zIndex:2,
              top: t==='top' ? 4 : 'auto', bottom: t==='bottom' ? 4 : 'auto',
              left: l==='left' ? 4 : 'auto', right: l==='right' ? 4 : 'auto',
              borderTop: t==='top' ? `1px solid ${ACCENT}` : 'none',
              borderBottom: t==='bottom' ? `1px solid ${ACCENT}` : 'none',
              borderLeft: l==='left' ? `1px solid ${ACCENT}` : 'none',
              borderRight: l==='right' ? `1px solid ${ACCENT}` : 'none',
            }}/>
          ))}
          <img className=''
            src={heroimg}
            alt="Fian"
            style={{
              display: 'block',
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              filter: 'grayscale(20%) contrast(1.05)',
              opacity: .9,
            }}
          />
          {/* scan line on image */}
          <div style={{
            position:'absolute', left:0, right:0, height:2,
            background:'rgba(42,250,148,.15)',
            animation:'scanmove 3s linear infinite',
            pointerEvents:'none',
          }}/>
        </div>

        {/* binary rows */}
        <div style={{
          display: 'flex', flexDirection: 'column', alignItems: 'center',
          gap: 4, width: '100%', padding: '0 16px',
        }}>
          {TEXTS.map((text, idx) => (
            <BinaryRow
              key={idx}
              text={text}
              idx={idx}
              revealed={!!revealed[idx]}
              onReveal={handleReveal}
            />
          ))}
        </div>

        {/* progress indicator */}
        <div style={{ marginTop: 24, display: 'flex', gap: 8 }}>
          {TEXTS.map((_, i) => (
            <div key={i} style={{
              width: revealed[i] ? 24 : 8,
              height: 2,
              background: revealed[i] ? ACCENT : '#1a1a1a',
              boxShadow: revealed[i] ? `0 0 6px ${ACCENT}` : 'none',
              transition: 'all .4s ease',
            }}/>
          ))}
        </div>

        <div style={{ height: 60 }} />
      </div>

      {/* ── Idle Hint ── */}
      {showHint && revealedCount < TEXTS.length && (
        <div style={{
          position: 'fixed', bottom: 18, left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 20, pointerEvents: 'none',
          textAlign: 'center',
          animation: 'hint-pulse 2s ease-in-out infinite',
        }}>
          <div style={{
            fontFamily: "'Share Tech Mono', monospace",
            fontSize: 11, letterSpacing: 3,
            color: ACCENT, opacity: .8,
          }}>
            ▲ HOVER THE BINARY LINES TO DECODE ▲
          </div>
          <div style={{
            fontFamily: "'Share Tech Mono', monospace",
            fontSize: 10, letterSpacing: 2, marginTop: 4,
            color: '#2afa94', opacity: .4,
          }}>
            {revealedCount} / {TEXTS.length} DECODED
          </div>
        </div>
      )}

      {/* ── Redirect Overlay ── */}
      {redirecting && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 100,
          background: '#000',
          display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center',
          animation: 'fadeIn .4s ease both',
        }}>
          <div style={{ fontFamily: "'Orbitron', monospace", fontSize: 11, letterSpacing: 6, color: ACCENT, marginBottom: 20 }}>
            IDENTITY CONFIRMED
          </div>
          <div style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: 14, letterSpacing: 4, color: '#fff', marginBottom: 24 }}>
            ENTERING MAINFRAME...
          </div>
          {/* progress bar */}
          <div style={{ width: 280, height: 2, background: '#0d2a1a', position: 'relative', overflow: 'hidden' }}>
            <div style={{
              position: 'absolute', left: 0, top: 0, height: '100%',
              width: `${progress}%`,
              background: ACCENT,
              boxShadow: `0 0 10px ${ACCENT}`,
              transition: 'width .03s linear',
            }}/>
          </div>
          <div style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: 10, color: '#2afa94', opacity: .5, marginTop: 10, letterSpacing: 2 }}>
            {progress}%
          </div>
        </div>
      )}
    </div>
  );
}