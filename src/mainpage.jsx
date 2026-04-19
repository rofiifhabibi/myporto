import { useNavigate } from 'react-router-dom';
import heroimg from './assets/y.jpg';

const ACCENT = '#2afa94';

const MainPage = () => {
  const navigate = useNavigate();

  return (
    <div style={{ minHeight: '100vh', position: 'relative', overflow: 'hidden', background: '#000', color: '#fff' }}>
      <style>{`
        @keyframes scanmove {
          0% { top: -4px; }
          100% { top: 100%; }
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(14px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      <div style={{ position: 'fixed', inset: 0, background: 'radial-gradient(circle at top, rgba(42,250,148,.13), transparent 42%), radial-gradient(circle at bottom right, rgba(42,250,148,.08), transparent 28%), #000', zIndex: 0 }} />
      <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 1, backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(42,250,148,.018) 3px, rgba(42,250,148,.018) 4px)' }} />
      <div style={{ position: 'fixed', left: 0, right: 0, height: 3, pointerEvents: 'none', zIndex: 2, background: 'linear-gradient(transparent, rgba(42,250,148,.12), transparent)', animation: 'scanmove 6s linear infinite' }} />

      <main style={{ position: 'relative', zIndex: 3, maxWidth: 1120, margin: '0 auto', padding: '28px 20px 48px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 16, marginBottom: 28 }}>
          <div>
            <div style={{ fontFamily: '"Share Tech Mono", monospace', fontSize: 10, letterSpacing: 6, color: ACCENT, opacity: .7 }}>── MAINFRAME HOME ──</div>
            <h1 style={{ fontFamily: '"Stalinist One", sans-serif', fontWeight: 400, letterSpacing: 'clamp(4px, 1.2vw, 12px)', margin: '10px 0 0', fontSize: 'clamp(30px, 5vw, 64px)', textShadow: '0 0 30px rgba(42,250,148,.16)' }}>Fian Portfolio</h1>
          </div>

          <button
            type="button"
            onClick={() => navigate('/')}
            style={{
              border: `1px solid ${ACCENT}`,
              background: 'rgba(42,250,148,.06)',
              color: '#fff',
              padding: '12px 18px',
              fontFamily: '"Share Tech Mono", monospace',
              letterSpacing: 3,
              cursor: 'pointer',
              boxShadow: `0 0 16px rgba(42,250,148,.12)`,
            }}
          >
            OPEN BOOT
          </button>
        </div>

        <section style={{ display: 'grid', gridTemplateColumns: '1.2fr .8fr', gap: 20, alignItems: 'stretch' }}>
          <div style={{ border: '1px solid rgba(42,250,148,.22)', background: 'rgba(8,16,12,.72)', backdropFilter: 'blur(6px)', padding: 24, animation: 'fadeInUp .7s ease both' }}>
            <div style={{ fontFamily: '"Share Tech Mono", monospace', fontSize: 11, letterSpacing: 4, color: ACCENT, marginBottom: 16 }}>WELCOME / OVERVIEW</div>
            <p style={{ margin: 0, lineHeight: 1.8, color: 'rgba(255,255,255,.82)', fontFamily: 'Montserrat, sans-serif' }}>
              Ini adalah halaman utama portofolio dengan tema cyber yang sama seperti halaman boot. Dari sini kamu bisa lihat ringkasan profil, lalu lanjut ke mode boot sequence untuk membuka intro interaktif.
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginTop: 22 }}>
              {[
                ['ROLE', 'Web Developer'],
                ['FOCUS', 'UI, Frontend, System'],
                ['STYLE', 'Cyber / Minimal'],
              ].map(([label, value]) => (
                <div key={label} style={{ border: '1px solid rgba(42,250,148,.16)', padding: 14, background: 'rgba(0,0,0,.34)' }}>
                  <div style={{ fontFamily: '"Share Tech Mono", monospace', fontSize: 10, letterSpacing: 3, color: ACCENT, opacity: .75 }}>{label}</div>
                  <div style={{ marginTop: 8, fontFamily: 'Orbitron, sans-serif', fontSize: 14 }}>{value}</div>
                </div>
              ))}
            </div>
          </div>

          <div style={{ border: '1px solid rgba(42,250,148,.22)', background: 'rgba(8,16,12,.72)', overflow: 'hidden', animation: 'fadeInUp .85s ease both' }}>
            <img
              src={heroimg}
              alt="Hero visual"
              style={{ display: 'block', width: '100%', height: 280, objectFit: 'cover', filter: 'grayscale(18%) contrast(1.06)', opacity: .9 }}
            />
            <div style={{ padding: 20 }}>
              <div style={{ fontFamily: '"Share Tech Mono", monospace', fontSize: 11, letterSpacing: 4, color: ACCENT }}>CONTACT</div>
              <div style={{ marginTop: 12, color: 'rgba(255,255,255,.86)', lineHeight: 1.8, fontFamily: 'Montserrat, sans-serif' }}>
                Email: example@example.com<br />
                Phone: 123-456-7890
              </div>
            </div>
          </div>
        </section>

        <section style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 20, marginTop: 20 }}>
          <div style={{ border: '1px solid rgba(42,250,148,.18)', padding: 20, background: 'rgba(0,0,0,.32)' }}>
            <div style={{ fontFamily: '"Share Tech Mono", monospace', fontSize: 11, letterSpacing: 4, color: ACCENT, marginBottom: 10 }}>ABOUT</div>
            <p style={{ margin: 0, lineHeight: 1.8, color: 'rgba(255,255,255,.78)', fontFamily: 'Montserrat, sans-serif' }}>
              Halaman ini dirancang sebagai landing page utama yang tenang, tapi tetap satu bahasa visual dengan halaman boot di App.
            </p>
          </div>

          <div style={{ border: '1px solid rgba(42,250,148,.18)', padding: 20, background: 'rgba(0,0,0,.32)' }}>
            <div style={{ fontFamily: '"Share Tech Mono", monospace', fontSize: 11, letterSpacing: 4, color: ACCENT, marginBottom: 10 }}>STATUS</div>
            <p style={{ margin: 0, lineHeight: 1.8, color: 'rgba(255,255,255,.78)', fontFamily: 'Montserrat, sans-serif' }}>
              Boot sequence tersedia di route terpisah, lalu setelah semua teks didecode akan otomatis kembali ke halaman utama ini.
            </p>
          </div>
        </section>
      </main>
    </div>
  );
};

export default MainPage;