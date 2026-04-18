import { useState, useEffect } from 'react';
import heroimg from './assets/y.jpg';

function App() {
  const texts = ['TECH ENTHUSIAST', 'WEB DEVELOPER', 'SYSADMIN', 'INTERNET OF THINGS', 'CYBERSECURITY'];
  
  const [animatedTexts, setAnimatedTexts] = useState({});
  const [glitch, setGlitch] = useState(false);

  // Binary kiri dan kanan
  const leftBinary = '10101010101010101010101010101010101010101010101010';
  const rightBinary = '01010101010101010101010101010101010101010101010101';

  const generateBinary = (length) => {
    let result = '';
    for (let i = 0; i < length; i++) {
      result += Math.random() < 0.5 ? '0' : '1';
    }
    return result;
  };

  const animateOnHover = (rowIndex, targetText) => {
    if (animatedTexts[rowIndex]) return;
    
    let step = 0;
    let binaryEffect = targetText.split('').map(() => Math.random() < 0.5 ? '0' : '1');
    
    setAnimatedTexts(prev => ({
      ...prev,
      [rowIndex]: binaryEffect.join('')
    }));
    
    const interval = setInterval(() => {
      if (step < targetText.length) {
        binaryEffect[step] = targetText[step];
        setAnimatedTexts(prev => ({
          ...prev,
          [rowIndex]: binaryEffect.join('')
        }));
        step++;
      } else {
        clearInterval(interval);
      }
    }, 100);
  };

  // Efek glitch random
  useEffect(() => {
    const glitchInterval = setInterval(() => {
      setGlitch(true);
      setTimeout(() => setGlitch(false), 150);
    }, 3000);
    
    return () => clearInterval(glitchInterval);
  }, []);

  return (
    <div className="bg-black flex flex-col min-h-screen relative overflow-hidden">
      {/* Efek scanline vertikal */}
      <div className="absolute inset-0 pointer-events-none z-10"
        style={{
          backgroundImage: 'repeating-linear-gradient(90deg, rgba(42, 250, 148, 0.03) 0px, rgba(42, 250, 148, 0.03) 2px, transparent 2px, transparent 8px)'
        }}
      />
      
      {/* Efek glitch acak */}
      {glitch && (
        <div className="absolute inset-0 pointer-events-none z-20"
          style={{
            background: 'rgba(42, 250, 148, 0.05)',
            transform: 'skewX(5deg)',
            animation: 'glitch 0.1s infinite'
          }}
        />
      )}
      
      <style>{`
        @keyframes glitch {
          0% { transform: translate(0, 0); opacity: 0.3; }
          50% { transform: translate(-2px, 1px); opacity: 0.5; }
          100% { transform: translate(2px, -1px); opacity: 0.3; }
        }
      `}</style>
      
      <div className="flex flex-col gap-5 mt-24 relative z-0">
        <h1 className='stalinist-one-regular font-bold text-5xl text-center tracking-[16px] text-white'>
          HELLO WORD
        </h1>
        <h3 className='orbitron text-white text-bold text-xl text-center'>/// WELCOMEPAGE         FIAN         PORTOFOLIO</h3>
        <div className="flex justify-center">
          <img src={heroimg} alt="Hero Image" className="w-[700px]" />
        </div>
      </div>
      
      <div className='flex flex-col mt-10 gap-2 items-center relative z-0'>
        {texts.map((text, idx) => (
          <div 
            key={idx}
            className="w-[700px] cursor-pointer"
            onMouseEnter={() => animateOnHover(idx, text)}
          >
            <div className="flex items-center justify-center">
              {/* Binary kiri */}
              <div className="w-[280px] overflow-hidden">
                <p className='orbitron text-[#2E2E2E] text-right text-2xl font-mono'>
                  {leftBinary}
                </p>
              </div>
              
              {/* Teks tengah */}
              <div className="text-center">
                <p className='orbitron text-2xl font-mono tracking-wider whitespace-nowrap'>
                  {(animatedTexts[idx] || generateBinary(text.length)).split('').map((char, charIdx) => (
                    <span 
                      key={charIdx} 
                      className={animatedTexts[idx] && char >= 'A' && char <= 'Z' ? 'text-[#2AFA94]' : 'text-[#2E2E2E]'}
                    >
                      {char}
                    </span>
                  ))}
                </p>
              </div>
              
              {/* Binary kanan */}
              <div className="w-[280px] overflow-hidden">
                <p className='orbitron text-[#2E2E2E] text-left text-2xl font-mono'>
                  {rightBinary}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;