import { useState, useEffect, useRef } from 'react'

// --- Reusable Glow Card Component ---
function GlowCard({ children, className }) {
  const cardRef = useRef(null)
  const [lightStyle, setLightStyle] = useState({ opacity: 0 })

  const handleMouseMove = (e) => {
    if (!cardRef.current) return
    const rect = cardRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    // Hover spotlight
    setLightStyle({
      opacity: 1,
      background: `radial-gradient(circle 600px at ${x}px ${y}px, rgba(56,189,248,0.15), transparent 40%)`
    })
  }

  const handleMouseLeave = () => {
    setLightStyle({ opacity: 0 })
  }

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`glass-panel rounded-2xl relative overflow-hidden transition-all duration-300 hover:shadow-[0_0_30px_rgba(6,182,212,0.15)] hover:border-cyan-500/30 ${className}`}
    >
      {/* Light Effect Overlay */}
      <div
        className="pointer-events-none absolute inset-0 z-0 transition-opacity duration-300"
        style={lightStyle}
      />
      {/* Content */}
      <div className="relative z-10 w-full h-full">
        {children}
      </div>
    </div>
  )
}

// --- New Real-Time Modular Components ---
function LiveCallToggle({ liveMode, setLiveMode }) {
  return (
    <div className="flex items-center gap-3 bg-slate-800/80 px-4 py-2 rounded-full border border-slate-700 w-fit cursor-pointer hover:shadow-[0_0_15px_rgba(56,189,248,0.2)] transition-shadow mx-auto mb-4" onClick={() => setLiveMode(!liveMode)}>
      <div className={`w-3 h-3 rounded-full transition-colors ${liveMode ? 'bg-rose-500 animate-pulse shadow-[0_0_8px_rgba(244,63,94,0.8)]' : 'bg-slate-500'}`} />
      <span className="font-mono text-xs uppercase text-slate-300 font-bold tracking-widest">{liveMode ? 'Live Call Mode Active' : 'Live Call Mode Off'}</span>
      <div className={`w-10 h-5 rounded-full relative transition-colors ${liveMode ? 'bg-cyan-600' : 'bg-slate-700'}`}>
        <div className={`absolute top-1 left-1 w-3 h-3 bg-white rounded-full transition-transform ${liveMode ? 'translate-x-5' : ''}`} />
      </div>
    </div>
  )
}

function FakeAudioVisualizer({ active }) {
  if (!active) return null;
  return (
    <div className="flex items-end gap-[2px] h-10 mt-4 justify-center">
      {[...Array(24)].map((_, i) => (
        <div
          key={i}
          className="w-1 bg-cyan-400 rounded-t-sm audio-bar"
          style={{ animationDuration: `${0.2 + Math.random() * 0.4}s`, animationDelay: `${Math.random() * -1}s` }}
        />
      ))}
    </div>
  )
}

function ScanningStatus({ loading }) {
  const [msgIdx, setMsgIdx] = useState(0);
  const msgs = ["Analyzing voice patterns...", "Detecting semantic patterns...", "Evaluating threat level...", "Generating risk score..."];
  useEffect(() => {
    if (!loading) { setMsgIdx(0); return; }
    const interval = setInterval(() => setMsgIdx(prev => (prev + 1) % msgs.length), 500);
    return () => clearInterval(interval);
  }, [loading]);

  if (!loading) return null;
  return (
    <div className="flex items-center gap-2 font-mono text-xs text-cyan-400 mt-2 animate-pulse mt-4">
      <div className="w-4 h-4 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin" />
      {msgs[msgIdx]}
    </div>
  )
}

function TerminalLogs({ loading, result }) {
  const [logs, setLogs] = useState([]);
  useEffect(() => {
    if (loading) {
      setLogs(["> Connection established...", "> Capturing voice stream..."]);
      const t1 = setTimeout(() => setLogs(l => [...l, "> Initializing NLP engine..."]), 400);
      const t2 = setTimeout(() => setLogs(l => [...l, "> Deep scanning keywords..."]), 800);
      return () => { clearTimeout(t1); clearTimeout(t2); };
    } else if (result) {
      if (result.score > 0) {
        setLogs(l => [...l, `> Keywords identified: ${result.detected_keywords.join(', ')}`, `> ALARM TRIGGERED.`]);
      } else {
        setLogs(l => [...l, "> Scan completed. No suspicious patterns.", "> Stream safe."]);
      }
    } else {
      setLogs([]);
    }
  }, [loading, result]);

  if (!loading && !result) return null;
  return (
    <div className="bg-black/60 border border-slate-700/50 rounded-lg p-3 font-mono text-[10px] text-emerald-400 w-full h-28 overflow-y-auto mt-4 shadow-inner">
      {logs.map((log, i) => (
        <div key={i} className="animate-in fade-in slide-in-from-bottom-2 duration-300 opacity-80">{log}</div>
      ))}
      {loading && <div className="animate-pulse">_</div>}
    </div>
  )
}

function AnimatedProgress({ score, riskLevel }) {
  const [displayScore, setDisplayScore] = useState(0);
  const target = score === 0 ? 5 : score >= 3 ? 99 : 50;

  useEffect(() => {
    let current = 0;
    const interval = setInterval(() => {
      current += Math.max(1, Math.floor((target - current) / 4));
      if (current >= target) {
        current = target;
        clearInterval(interval);
      }
      setDisplayScore(current);
    }, 40);
    return () => clearInterval(interval);
  }, [target]);

  return (
    <div className="flex flex-col gap-1 w-full">
      <div className="flex justify-between items-end mb-4">
        <span className={`text-6xl font-black leading-none drop-shadow-md tracking-tighter ${riskLevel === 'Safe' ? 'text-emerald-400' : riskLevel === 'Suspicious' ? 'text-amber-400' : 'text-rose-500'}`}>
          {displayScore}%
        </span>
        <span className={`text-xl font-bold uppercase tracking-wider mb-1 ${riskLevel === 'Safe' ? 'text-emerald-500/80' : riskLevel === 'Suspicious' ? 'text-amber-500/80' : 'text-rose-500/80'}`}>
          {riskLevel}
        </span>
      </div>
      <div className="h-3 w-full bg-slate-800 rounded-full overflow-hidden shadow-inner border border-slate-700">
        <div
          className={`h-full transition-all duration-300 ease-out relative ${riskLevel === 'Safe' ? 'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.8)]' : riskLevel === 'Suspicious' ? 'bg-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.8)]' : 'bg-rose-500 shadow-[0_0_15px_rgba(225,29,72,0.8)]'}`}
          style={{ width: `${displayScore}%` }}
        >
          <div className="absolute top-0 bottom-0 right-0 w-2 bg-white/50" />
        </div>
      </div>
    </div>
  )
}

function App() {
  const [text, setText] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [liveMode, setLiveMode] = useState(false)

  // Custom cursor position state
  const [mousePos, setMousePos] = useState({ x: -100, y: -100 })

  useEffect(() => {
    const updateMousePos = (e) => {
      setMousePos({ x: e.clientX, y: e.clientY })
    }
    window.addEventListener('mousemove', updateMousePos)
    return () => window.removeEventListener('mousemove', updateMousePos)
  }, [])

  const handleAnalyze = async () => {
    if (!text.trim()) return

    setLoading(true)
    setResult(null)

    try {
      const response = await fetch('http://localhost:8000/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text }),
      })

      if (!response.ok) throw new Error('Analysis failed')

      const data = await response.json()

      // Artificial delay to show off scanning animation
      setTimeout(() => {
        setResult(data)
        setLoading(false)
      }, 1500)

    } catch (error) {
      console.error(error)
      alert("Failed to analyze. Is the backend running?")
      setLoading(false)
    }
  }

  const isFraud = result && result.risk_level === 'Fraud'

  // Realistic Alarm sound effect with Voice Announcement
  useEffect(() => {
    if (!result) return;

    let audioCtx;
    let masterGain;
    let voiceInterval;

    if (result.risk_level === 'Fraud') {
      // Voice Announcement Logic
      const announceFraud = () => {
        if ('speechSynthesis' in window) {
          // Cancel any ongoing speech so they don't pile up
          window.speechSynthesis.cancel();
          const utterance = new SpeechSynthesisUtterance("Warning. Fraud detected.");
          utterance.rate = 0.95; // Slightly slower, robotic feel
          utterance.pitch = 0.8;
          utterance.volume = 1.0; // Max volume for the voice
          window.speechSynthesis.speak(utterance);
        }
      };

      // Announce immediately, then repeat every 4 seconds
      announceFraud();
      voiceInterval = setInterval(announceFraud, 4000);

      // Background Siren Logic
      try {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        if (!AudioContext) return;
        audioCtx = new AudioContext();

        // Master output volume (fade in, kept low at 0.04 for BACKGROUND effect)
        masterGain = audioCtx.createGain();
        masterGain.gain.setValueAtTime(0, audioCtx.currentTime);
        masterGain.gain.linearRampToValueAtTime(0.04, audioCtx.currentTime + 1);
        masterGain.connect(audioCtx.destination);

        // Main tone oscillator
        const mainOsc = audioCtx.createOscillator();
        mainOsc.type = 'sawtooth';
        mainOsc.frequency.setValueAtTime(800, audioCtx.currentTime); // Base frequency

        // Lowpass filter to make it sound more like a physical siren horn
        const filter = audioCtx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.value = 1500;

        mainOsc.connect(filter);
        filter.connect(masterGain);

        // LFO (Low Frequency Oscillator) to sweep the pitch up and down
        const lfo = audioCtx.createOscillator();
        lfo.type = 'sine'; // Smooth sweeping shape
        lfo.frequency.setValueAtTime(0.4, audioCtx.currentTime); // Sweeps roughly every 2.5 seconds

        // Modulate depth (How far pitch sweeps)
        const lfoGain = audioCtx.createGain();
        lfoGain.gain.setValueAtTime(300, audioCtx.currentTime); // Sweeps between 500Hz and 1100Hz

        lfo.connect(lfoGain);
        lfoGain.connect(mainOsc.frequency); // Modulate the main oscillator's frequency

        // Start engines
        mainOsc.start();
        lfo.start();

      } catch (e) {
        console.error("Audio playback failed", e);
      }
    } else if (result.risk_level === 'Safe') {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance("Scan complete. No threats detected. You are safe.");
        utterance.rate = 1.0;
        utterance.pitch = 1.0; // Friendly normal pitch
        window.speechSynthesis.speak(utterance);
      }
    } else if (result.risk_level === 'Suspicious') {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance("Scan complete. Suspicious activity noticed. Please proceed with caution.");
        utterance.rate = 0.95;
        utterance.pitch = 0.9;
        window.speechSynthesis.speak(utterance);
      }
    }

    return () => {
      // Clean up intervals and voice
      if (voiceInterval) clearInterval(voiceInterval);
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }

      // Clean up synthesized background siren
      if (masterGain && audioCtx && audioCtx.state !== 'closed') {
        masterGain.gain.setTargetAtTime(0, audioCtx.currentTime, 0.3); // Fade out over 300ms
        setTimeout(() => {
          if (audioCtx.state !== 'closed') audioCtx.close().catch(console.error);
        }, 500);
      } else if (audioCtx && audioCtx.state !== 'closed') {
        audioCtx.close().catch(console.error);
      }
    };
  }, [result]);

  // Dynamic explanation builder
  const getAIExplanation = () => {
    if (!result) return "";
    if (result.score === 0) return "No known high-risk keywords detected in the transcript. Communication appears standard.";

    return `Detected ${result.detected_keywords.join(", ")} interaction patterns. ` +
      (isFraud ? "This combination heavily correlates with social engineering taking place. Extreme caution advised."
        : "While one or two keywords occasionally appear in normal communication, their presence warrants verification.")
  }

  return (
    <div className={`relative min-h-screen w-full transition-colors duration-1000 bg-cyber-grid
      ${isFraud ? 'bg-rose-950/20 animate-pulse-alarm' : ''}
    `}>

      {/* --- Global Custom Cursor Glow --- */}
      <div
        className="pointer-events-none fixed top-0 left-0 w-96 h-96 rounded-full mix-blend-screen z-50 transition-colors duration-500 ease-out"
        style={{
          transform: `translate(${mousePos.x - 192}px, ${mousePos.y - 192}px)`,
          background: isFraud
            ? 'radial-gradient(circle, rgba(244,63,94,0.15) 0%, transparent 70%)'
            : 'radial-gradient(circle, rgba(56,189,248,0.1) 0%, transparent 70%)',
          transition: 'transform 0.15s ease-out, background 0.5s' // Trial smooth following effect
        }}
      />

      {/* Extreme Alert Overlay for Fraud */}
      {isFraud && (
        <div className="pointer-events-none fixed inset-0 z-50 flex items-start justify-center pt-8 pointer-events-none">
          <div className="bg-rose-600 outline outline-[10px] outline-rose-500/30 text-white font-black text-2xl uppercase tracking-[0.3em] px-8 py-3 rounded-lg animate-pulse shadow-[0_0_100px_rgba(225,29,72,1)] will-change-transform transform transition-all duration-300 z-50">
            ⚠ FRAUD CALL DETECTED - HANG UP IMMEDIATELY
          </div>
          <div className="absolute inset-0 border-[16px] border-rose-600/50 animate-pulse shadow-[inset_0_0_150px_rgba(225,29,72,0.5)] z-40" />
        </div>
      )}

      {/* Main Container */}
      <div className={`relative z-10 p-6 md:p-12 flex flex-col items-center w-full min-h-screen
        ${isFraud ? 'animate-shake-violent' : ''}
      `}>
        <div className="w-full max-w-4xl flex flex-col gap-8">

          <header className="text-center space-y-4">
            <LiveCallToggle liveMode={liveMode} setLiveMode={setLiveMode} />
            <h1 className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-400 tracking-tighter text-glow-blue uppercase drop-shadow-lg">
              AI Fraud Call Detection
            </h1>
          </header>

          <GlowCard className="p-8 group hover:scale-[1.01] transition-transform duration-300">
            <div className="flex justify-between items-end mb-4">
              <label htmlFor="transcript" className="block font-mono text-cyan-400 uppercase tracking-widest text-sm text-glow-blue flex items-center gap-2">
                [INPUT] Intercepted Communication
              </label>
            </div>

            <div className="relative rounded-xl overflow-hidden">
              {/* Scanning visual effect */}
              {loading && <div className="scan-line" />}

              <textarea
                id="transcript"
                className={`w-full h-56 bg-[#0b101e]/80 border ${isFraud ? 'border-rose-500/50' : 'border-slate-700'} rounded-xl p-5 text-slate-200 placeholder-slate-600 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all resize-none font-mono text-sm leading-relaxed shadow-inner block relative z-0`}
                placeholder="Initialize intercept stream...&#10;(e.g. 'Hello, this is urgent from the bank, provide OTP for KYC...')"
                value={text}
                onChange={(e) => setText(e.target.value)}
              ></textarea>

              {/* Corner decoratives */}
              <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-cyan-500/50 pointer-events-none" />
              <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-cyan-500/50 pointer-events-none" />
              <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-cyan-500/50 pointer-events-none" />
              <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-cyan-500/50 pointer-events-none" />
            </div>

            <FakeAudioVisualizer active={liveMode} />
            <ScanningStatus loading={loading} />
            <TerminalLogs loading={loading} result={result} />

            <div className="mt-8 flex justify-end">
              <button
                onClick={handleAnalyze}
                disabled={loading || text.trim().length === 0}
                className={`
                  relative overflow-hidden font-mono uppercase tracking-widest text-sm font-bold py-3 px-10 rounded-lg transition-all duration-300 transform outline-none
                  disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:shadow-none
                  hover:scale-[1.05] hover:-translate-y-1 active:scale-[0.98] active:translate-y-0
                  ${!loading ? 'bg-gradient-to-r from-cyan-600 to-blue-700 text-white shadow-[0_0_20px_rgba(6,182,212,0.4)] hover:shadow-[0_0_40px_rgba(6,182,212,0.6)] border border-cyan-400/50'
                    : 'bg-slate-700 border border-slate-600 text-slate-300'}
                `}
              >
                {/* Button Inner Glow & Scan line effect on hover */}
                <div className="absolute inset-0 bg-white/10 opacity-0 hover:opacity-100 transition-opacity" />
                {loading ? 'ANALYZING THREATS...' : 'INITIALIZE SCAN'}
              </button>
            </div>
          </GlowCard>

          {/* Results Section */}
          {result && !loading && (
            <div className="space-y-6 animate-in slide-in-from-bottom-8 fade-in duration-700 fill-mode-both">

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Score & Meter Card */}
                <GlowCard className={`p-6 border-l-4 group hover:scale-[1.02] transition-transform duration-300 ${result.risk_level === 'Safe' ? 'border-l-emerald-500' :
                    result.risk_level === 'Suspicious' ? 'border-l-amber-500' : 'border-l-rose-500 shadow-[0_0_40px_rgba(225,29,72,0.3)]'
                  }`}>
                  <h3 className="text-slate-400 font-mono text-xs uppercase tracking-widest mb-6">Risk Assessment</h3>
                  <AnimatedProgress score={result.score} riskLevel={result.risk_level} />
                </GlowCard>

                {/* AI Explanation Card */}
                <GlowCard className="p-6 group hover:scale-[1.02] transition-transform duration-300">
                  <h3 className="text-slate-400 font-mono text-xs uppercase tracking-widest mb-4">AI Analysis Routine</h3>
                  <div className="font-mono text-sm text-slate-300 bg-slate-900/60 rounded-lg p-4 border border-slate-700 shadow-inner min-h-[100px]">
                    <span className="text-cyan-400 mr-2">&gt;</span>
                    {getAIExplanation()}
                  </div>

                  <div className="mt-6">
                    <h4 className="text-slate-500 font-mono text-[10px] uppercase tracking-widest mb-3">Extracted Flags</h4>
                    {result.detected_keywords.length > 0 ? (
                      <div className="flex flex-wrap gap-2">
                        {result.detected_keywords.map((kw, idx) => (
                          <div
                            key={idx}
                            style={{ animationDelay: `${idx * 100}ms` }}
                            className="animate-in fade-in zoom-in-95 duration-500 px-3 py-1 rounded bg-slate-800 border border-slate-600 text-cyan-300 font-mono text-xs uppercase tracking-widest cursor-default transition-all hover:bg-slate-700 hover:-translate-y-1 hover:shadow-[0_4px_12px_rgba(6,182,212,0.3)] hover:text-cyan-100 hover:border-cyan-500/50"
                          >
                            {kw}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <span className="text-slate-600 font-mono text-xs italic">[NO FLAGS DETECTED]</span>
                    )}
                  </div>
                </GlowCard>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  )
}

export default App