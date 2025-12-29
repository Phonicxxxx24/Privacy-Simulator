import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Eye, Lock, Server, Users, Activity, ChevronRight, Zap, CheckCircle, AlertTriangle, Key, Database, CreditCard, FileCheck, Layers, Globe, Play, MousePointerClick, X, Skull, Ghost, Github } from 'lucide-react';

// --- Constants & Styles ---
// DARK THEME GLASS: Dark transparent bg with subtle beige borders
const GLASS_CLASSES = "bg-[#e8e3d5]/5 backdrop-blur-xl border border-[#e8e3d5]/10 shadow-2xl";

// --- Components ---

// Custom X (Twitter) Logo Component for accuracy
const XLogo = ({ size = 20, className = "" }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="currentColor" 
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z" />
  </svg>
);

const GlassCard = ({ children, title, className = "", delay = 0 }) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6, delay }}
    viewport={{ once: true }}
    className={`${GLASS_CLASSES} rounded-3xl p-8 ${className} hover:shadow-[0_20px_40px_-15px_rgba(169,221,211,0.1)] hover:-translate-y-2 transition-all duration-500 group`}
  >
    {title && <h3 className="font-bold text-xl text-[#e8e3d5] mb-4 font-mono uppercase tracking-wider">{title}</h3>}
    {children}
  </motion.div>
);

const ToggleSwitch = ({ value, onChange, labels }) => (
  <div className="flex items-center gap-4 bg-[#e8e3d5]/5 backdrop-blur-md p-1 rounded-full border border-[#e8e3d5]/10 cursor-pointer shadow-lg" onClick={() => onChange(!value)}>
    <div className={`px-6 py-2 rounded-full font-bold text-sm transition-all duration-300 ${!value ? 'bg-[#e8e3d5] text-[#010101] shadow-lg scale-105' : 'text-[#e8e3d5]/60'}`}>
      {labels[0]}
    </div>
    <div className={`px-6 py-2 rounded-full font-bold text-sm transition-all duration-300 ${value ? 'bg-[#a9ddd3] text-[#010101] shadow-lg scale-105' : 'text-[#e8e3d5]/60'}`}>
      {labels[1]}
    </div>
  </div>
);

// --- Mini Visualization Component for Cards ---
const UseCaseSimulation = ({ type }) => {
    let IconInput, IconOutput;
    
    if (type === 'auth') {
        IconInput = Key;
        IconOutput = CheckCircle;
    } else if (type === 'defi') {
        IconInput = CreditCard;
        IconOutput = Activity;
    } else {
        IconInput = Globe;
        IconOutput = FileCheck;
    }

    return (
        <div className="relative h-24 w-full bg-[#010101]/40 rounded-2xl overflow-hidden mb-6 border border-[#e8e3d5]/10 flex items-center justify-between px-4 sm:px-8">
            {/* Connecting Line */}
            <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-[#e8e3d5]/10" />

            {/* Input Node */}
            <div className="relative z-10 bg-[#010101] border border-[#e8e3d5]/20 p-2 rounded-full">
                <IconInput size={16} className="text-[#e8e3d5]" />
            </div>

            {/* Center Node (Enclave) */}
            <div className="relative z-10">
                <div className="bg-[#010101] border border-[#a9ddd3]/50 p-2 rounded-xl shadow-[0_0_15px_rgba(169,221,211,0.1)]">
                    <Lock size={20} className="text-[#a9ddd3]" />
                </div>
            </div>

            {/* Output Node */}
            <div className="relative z-10 bg-[#010101] border border-[#e8e3d5]/20 p-2 rounded-full">
                <IconOutput size={16} className="text-[#a9ddd3]" />
            </div>

            {/* Moving Packet Animation */}
            <motion.div
                className="absolute top-1/2 left-8 z-20 -mt-3"
                animate={{
                    left: ['10%', '50%', '90%'],
                    scale: [1, 0, 1], // Disappears in middle (privacy)
                    opacity: [1, 0, 1] 
                }}
                transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut",
                    times: [0, 0.5, 1]
                }}
            >
                <div className="w-6 h-6 bg-[#a9ddd3] rounded-lg flex items-center justify-center shadow-lg border border-[#010101]">
                    {/* Tiny visual change based on stage is implicit by scale/opacity */}
                </div>
            </motion.div>
        </div>
    );
};


// --- Visualization Engine ---

// The "Risk Dots" that swarm in public mode
const RiskDot = ({ delay }) => {
    return (
        <motion.div
            initial={{ x: Math.random() * 200 - 100, y: Math.random() * 150 - 75, opacity: 0 }}
            animate={{ 
                x: [Math.random() * 200 - 100, Math.random() * 200 - 100, Math.random() * 200 - 100],
                y: [Math.random() * 150 - 75, Math.random() * 150 - 75, Math.random() * 150 - 75],
                opacity: 1
            }}
            exit={{ scale: 0, opacity: 0, rotate: 720 }}
            transition={{ duration: 5, repeat: Infinity, repeatType: "mirror", delay }}
            className="absolute z-20"
        >
            <div className="bg-[#010101] p-1.5 rounded-full shadow-sm border border-red-900/50">
                {Math.random() > 0.7 ? <Skull size={12} className="text-red-500" /> : <Eye size={12} className="text-red-500" />}
            </div>
        </motion.div>
    );
};

// Represents the data packet traversing the network
const REXDataPacket = ({ id, useCase, isRialo, onComplete }) => {
  const [stage, setStage] = useState('spawn'); 

  useEffect(() => {
    // 1. Spawn & Travel (0s)
    
    // 2. Travel to Mempool (1s)
    const t1 = setTimeout(() => setStage('mempool'), 1000);
    
    // 3. Collision / Interruption (2.5s)
    const t2 = setTimeout(() => setStage('interruption'), 2200);

    // 4. Processing (4s)
    const t3 = setTimeout(() => setStage('processing'), 4000);

    // 5. Output (5.5s)
    const t4 = setTimeout(() => setStage('output'), 5500);

    // End
    const tEnd = setTimeout(() => onComplete(id), 7500);

    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); clearTimeout(t4); clearTimeout(tEnd); };
  }, [onComplete, id]);

  // Movement Logic
  const variants = {
    spawn: { left: '15%', top: '50%', scale: 1, opacity: 1 },
    mempool: { left: '35%', top: '50%', scale: 1, opacity: 1 }, 
    interruption: { left: '42%', top: '50%', scale: 1.2, opacity: 1, rotate: isRialo ? 0 : [0, -10, 10, -10, 0] }, 
    processing: { left: '50%', top: '50%', scale: 0, opacity: 0 }, 
    output: { left: '85%', top: '50%', scale: 1, opacity: 1 } 
  };

  return (
    <>
      <motion.div
        initial="spawn"
        animate={stage}
        variants={variants}
        transition={{ duration: stage === 'interruption' ? 0.3 : 1, ease: "easeInOut" }}
        className="absolute z-30 pointer-events-none"
        style={{ marginLeft: -32, marginTop: -32 }}
      >
        <PacketContent isRialo={isRialo} useCase={useCase} stage={stage} />
      </motion.div>

      <motion.div
        initial="spawn"
        animate={stage}
        variants={variants}
        transition={{ duration: stage === 'interruption' ? 0.3 : 1, ease: "easeInOut" }}
        className="absolute z-40 pointer-events-none w-48 text-center"
        style={{ marginLeft: -96, marginTop: 40 }}
      >
         <StatusLabel isRialo={isRialo} stage={stage} useCase={useCase} />
      </motion.div>
    </>
  );
};

const PacketContent = ({ isRialo, useCase, stage }) => {
  let icon;
  if (useCase === 'Auth') icon = <Key size={20} />;
  else if (useCase === 'DeFi') icon = <CreditCard size={20} />;
  else icon = <Globe size={20} />;

  // RIALO FLOW VISUALS
  if (isRialo) {
    if (stage === 'spawn' || stage === 'mempool' || stage === 'interruption') {
      return (
        <div className="flex flex-col items-center">
            <div className="w-16 h-16 bg-[#010101] rounded-2xl border-2 border-[#a9ddd3] shadow-[0_0_20px_#a9ddd3] flex items-center justify-center relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-30"/>
                <Lock size={24} className="text-[#a9ddd3] z-10"/>
                <motion.div 
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 3, ease: "linear" }}
                    className="absolute inset-0 border-t-2 border-[#a9ddd3] rounded-2xl opacity-50"
                />
            </div>
        </div>
      );
    } 
    if (stage === 'output') {
       return (
        <div className="flex flex-col items-center">
             <div className="w-16 h-16 bg-[#a9ddd3] rounded-full border-4 border-[#010101] shadow-xl flex items-center justify-center">
                <CheckCircle size={32} className="text-[#010101]"/>
             </div>
        </div>
       );
    }
  } 
  
  // PUBLIC FLOW VISUALS
  else {
    if (stage === 'spawn') {
         return (
            <div className={`w-16 h-16 bg-[#010101] rounded-xl border-2 shadow-lg flex items-center justify-center ${useCase === 'DeFi' ? 'border-blue-400 text-blue-400' : 'border-amber-400 text-amber-400'}`}>
                {icon}
            </div>
         );
    }
    if (stage === 'mempool') {
        return (
            <div className="w-16 h-16 bg-red-900/20 rounded-xl border-2 border-red-500 shadow-[0_0_30px_#ef4444] flex items-center justify-center animate-pulse relative text-red-400">
                {icon}
                <div className="absolute -top-2 -right-2 bg-red-600 text-white text-[8px] px-1 rounded font-bold">VISIBLE</div>
            </div>
        );
    }
    if (stage === 'interruption') {
        return (
            <div className="relative">
                <motion.div 
                    animate={{ x: [-5, 5, -5, 5, 0], backgroundColor: "#450a0a" }} // dark red
                    transition={{ duration: 0.2 }}
                    className="w-16 h-16 rounded-xl border-4 border-red-600 flex items-center justify-center grayscale opacity-50 text-red-300"
                >
                    {icon}
                </motion.div>
                <motion.div 
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: [1, 1.5, 1], opacity: 1 }}
                    className="absolute -top-10 -right-10 z-50 pointer-events-none"
                >
                     <div className="bg-[#010101] text-red-500 p-3 rounded-full border-2 border-red-500 shadow-2xl flex items-center justify-center relative">
                        <Skull size={32} />
                        <div className="absolute -bottom-2 bg-red-600 text-white text-[8px] font-bold px-1 rounded">SNIPED!</div>
                     </div>
                </motion.div>
            </div>
        );
    }
    if (stage === 'output') {
        return (
             <div className="flex flex-col items-center">
                 <div className="w-16 h-16 bg-red-600 rounded-full border-4 border-[#010101] shadow-xl flex items-center justify-center">
                    <AlertTriangle size={32} className="text-white"/>
                 </div>
            </div>
        );
    }
  }

  return null;
};

const StatusLabel = ({ isRialo, stage, useCase }) => {
    let text = "";
    let color = "bg-[#010101] text-gray-400";

    if (isRialo) {
        if (stage === 'spawn') { text = "Encrypting Data..."; color = "bg-[#a9ddd3] text-[#010101]"; }
        else if (stage === 'mempool') { text = "Protected in Transit"; color = "bg-[#010101] text-[#a9ddd3] border border-[#a9ddd3]"; }
        else if (stage === 'interruption') { text = "Observers blocked by Enclave"; color = "bg-[#010101] text-[#a9ddd3]"; }
        else if (stage === 'processing') { text = "Decrypting in TEE..."; color = "bg-[#a9ddd3] text-[#010101]"; }
        else if (stage === 'output') { text = "Verified Proof Generated"; color = "bg-[#a9ddd3] text-[#010101] font-bold"; }
    } else {
        if (stage === 'spawn') { text = "Broadcasting Raw Data..."; color = "bg-[#e8e3d5]/10 text-[#e8e3d5]"; }
        else if (stage === 'mempool') { text = "Waiting in Public Mempool"; color = "bg-red-900/30 text-red-400 border border-red-800/50"; }
        else if (stage === 'interruption') { 
            text = "⚠️ ATTACKED BY BOTS!"; 
            color = "bg-red-600 text-white font-bold animate-bounce"; 
        }
        else if (stage === 'processing') { text = "Executing Leaked Data..."; color = "bg-red-900/20 text-red-300"; }
        else if (stage === 'output') { 
            text = "Data Permanently Leaked"; 
            color = "bg-red-600 text-white font-bold"; 
        }
    }

    if (!text) return null;

    return (
        <motion.div 
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            className={`inline-block px-3 py-1 rounded-full text-[10px] uppercase tracking-wide shadow-sm border border-transparent ${color}`}
        >
            {text}
        </motion.div>
    );
};

const VisualizerCanvas = ({ isRialo, isStriking }) => {
  const [activePacket, setActivePacket] = useState(null);
  const [selectedUseCase, setSelectedUseCase] = useState('Auth');
  const packetIdCounter = useRef(0);

  const startSimulation = useCallback(() => {
    if (activePacket) return; 
    const id = packetIdCounter.current++;
    setActivePacket({ id, useCase: selectedUseCase });
  }, [activePacket, selectedUseCase]);

  const completeSimulation = () => {
    setActivePacket(null);
  };

  const useCases = [
    { id: 'Auth', label: 'API Key', icon: <Key size={16}/> },
    { id: 'DeFi', label: 'Trade', icon: <CreditCard size={16}/> },
    { id: 'Policy', label: 'Passport', icon: <Globe size={16}/> },
  ];

  return (
    <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
      
      {/* 0. USE CASE SELECTOR */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-50 w-[90%] max-w-lg">
           <div className="flex justify-center p-1 bg-[#e8e3d5]/10 backdrop-blur-md rounded-2xl border border-[#e8e3d5]/10 shadow-xl">
              {useCases.map(uc => (
                  <button
                    key={uc.id}
                    onClick={() => !activePacket && setSelectedUseCase(uc.id)}
                    className={`flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-bold transition-all ${selectedUseCase === uc.id ? 'bg-[#e8e3d5] text-[#010101] shadow-md' : 'text-[#e8e3d5]/60 hover:bg-[#e8e3d5]/10'} ${activePacket ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                      {uc.icon} {uc.label}
                  </button>
              ))}
          </div>
      </div>

      {/* 2. NODES */}
      
      {/* Left: User */}
      <div className="absolute left-[10%] top-1/2 -translate-y-1/2 flex flex-col items-center z-20 group">
        <div 
            onClick={startSimulation}
            className={`w-24 h-24 rounded-full shadow-2xl flex flex-col items-center justify-center border-4 transition-all cursor-pointer relative z-10 ${activePacket ? 'scale-95 border-gray-700 bg-[#010101]' : 'scale-100 hover:scale-105 border-[#e8e3d5] bg-[#010101]'}`}
        >
            {activePacket ? <Activity className="animate-spin text-gray-400" /> : <Play className="ml-1 text-[#e8e3d5] fill-[#e8e3d5]" />}
        </div>
        
        <span className="mt-4 font-bold text-[#e8e3d5] bg-[#e8e3d5]/10 px-3 py-1 rounded-full text-xs backdrop-blur-sm border border-[#e8e3d5]/20">
            {activePacket ? "Simulating..." : "Click to Send"}
        </span>
      </div>

      {/* Center: The Black Box / Mempool */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
          
          {/* THE STRIKE EFFECT LAYER */}
          <AnimatePresence>
            {isStriking && (
                <motion.div 
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1.5 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 z-50 flex items-center justify-center pointer-events-none"
                >
                    <Zap size={200} className="text-[#a9ddd3] fill-[#a9ddd3] animate-pulse drop-shadow-[0_0_50px_#a9ddd3]" />
                    <div className="absolute inset-0 bg-[#e8e3d5]/20 mix-blend-overlay" />
                </motion.div>
            )}
          </AnimatePresence>

          {/* The Environment */}
          <motion.div 
            initial={false}
            animate={{ 
                scale: activePacket ? 1.05 : 1,
                borderColor: isRialo ? '#a9ddd3' : '#7f1d1d'
            }}
            className={`w-64 h-48 rounded-3xl border-2 border-dashed flex items-center justify-center relative transition-colors duration-500 ${isRialo ? 'bg-[#010101]/90 border-[#a9ddd3]/50' : 'bg-[#010101]/40 border-red-900/50'}`}
          >
             {isRialo ? (
                // RIALO MODE: Enclave Protected
                <motion.div 
                    initial={{ scale: 0 }} 
                    animate={{ scale: 1 }} 
                    transition={{ type: "spring", stiffness: 200, damping: 20 }}
                    className="relative w-full h-full flex items-center justify-center"
                >
                    <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20" />
                    <Shield size={64} className="text-[#a9ddd3] opacity-20" />
                    <div className="absolute bottom-4 text-[#a9ddd3] text-[9px] font-mono border border-[#a9ddd3]/30 px-2 py-1 rounded">
                        SECURE TEE ENCLAVE
                    </div>
                </motion.div>
             ) : (
                // PUBLIC MODE: Risk Dots
                <>
                    <div className="text-red-900 text-5xl font-bold opacity-30 rotate-[-10deg] select-none absolute">PUBLIC</div>
                    <div className="absolute top-2 right-2 flex gap-1 z-10">
                        <div className="w-2 h-2 bg-red-600 rounded-full animate-ping" />
                        <span className="text-[9px] text-red-500 font-bold">UNSAFE</span>
                    </div>
                    
                    {/* CHAOTIC RISK DOTS */}
                    <AnimatePresence>
                        {!isStriking && Array.from({ length: 8 }).map((_, i) => (
                            <RiskDot key={i} delay={i * 0.2} />
                        ))}
                    </AnimatePresence>
                </>
             )}
          </motion.div>
      </div>

      {/* Right: Ledger */}
      <div className="absolute right-[10%] top-1/2 -translate-y-1/2 flex flex-col items-center z-20">
         <div className={`w-24 h-24 rounded-full shadow-xl flex flex-col items-center justify-center border-4 transition-colors duration-500 bg-[#010101] relative z-10 ${isRialo ? 'border-[#a9ddd3]' : 'border-red-900'}`}>
            <Database size={32} className={isRialo ? "text-[#a9ddd3]" : "text-red-600"}/>
        </div>
        <span className="mt-4 font-bold text-[#e8e3d5] bg-[#e8e3d5]/10 px-3 py-1 rounded-full text-xs backdrop-blur-sm border border-[#e8e3d5]/20">
            Immutable Ledger
        </span>
      </div>

      {/* 3. DYNAMIC PACKET ANIMATION */}
      <AnimatePresence>
        {activePacket && (
          <REXDataPacket 
            key={activePacket.id} 
            id={activePacket.id} 
            useCase={activePacket.useCase} 
            isRialo={isRialo} 
            onComplete={completeSimulation}
          />
        )}
      </AnimatePresence>

    </div>
  );
};

// --- Main App Component ---

export default function RialoVizApp() {
  const [isRialo, setIsRialo] = useState(false);
  const [isStriking, setIsStriking] = useState(false);

  // Animation Trigger for switching modes
  const handleToggle = (val) => {
    if (val === true) {
        setIsStriking(true);
        setTimeout(() => {
            setIsRialo(true);
            setIsStriking(false);
        }, 800);
    } else {
        setIsRialo(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#010101] font-sans selection:bg-[#a9ddd3] selection:text-[#010101]">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&display=swap');
        body { font-family: 'Space Grotesk', sans-serif; }
        .scrollbar-none::-webkit-scrollbar { display: none; }
        .scrollbar-none { -ms-overflow-style: none; scrollbar-width: none; }
        .snap-x { scroll-snap-type: x mandatory; }
        .snap-center { scroll-snap-align: center; }
      `}</style>

      {/* --- Hero Section --- */}
      <section className="relative h-screen flex flex-col justify-center items-center overflow-hidden">
        {/* Animated Background Gradients */}
        <div className="absolute inset-0 bg-[#010101]" />
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#a9ddd3]/10 rounded-full blur-[100px] animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-[#e8e3d5]/5 rounded-full blur-[80px]" />

        <div className="relative z-10 text-center px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-6xl md:text-8xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#e8e3d5] via-[#a9ddd3] to-[#e8e3d5] mb-6 drop-shadow-sm tracking-tighter">
              Building<br/>Native Privacy
            </h1>
          </motion.div>
          
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="text-xl md:text-2xl text-[#e8e3d5]/80 max-w-2xl mx-auto backdrop-blur-sm bg-[#e8e3d5]/5 rounded-2xl p-6 border border-[#e8e3d5]/10 shadow-lg"
          >
            "Public blockchains expose secrets. <br/>
            <span className="font-bold border-b-2 border-[#a9ddd3] text-[#a9ddd3]">Rialo REX</span> keeps them confidential."
          </motion.p>
          
          <motion.button 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.5 }}
            onClick={() => window.scrollTo({ top: window.innerHeight, behavior: 'smooth' })}
            className="mt-16 flex flex-col items-center group cursor-pointer focus:outline-none mx-auto"
          >
            <div className="w-16 h-16 rounded-full border-2 border-[#e8e3d5]/20 bg-[#e8e3d5]/5 backdrop-blur-md flex items-center justify-center group-hover:bg-[#a9ddd3] group-hover:border-[#a9ddd3] group-hover:scale-110 transition-all duration-300 shadow-xl animate-bounce">
              <ChevronRight className="rotate-90 text-[#e8e3d5]/60 group-hover:text-[#010101] transition-colors" size={32} strokeWidth={2.5} />
            </div>
            <span className="mt-4 text-xs font-mono uppercase tracking-widest text-[#e8e3d5]/40 group-hover:text-[#e8e3d5] transition-colors font-bold">Scroll to Simulate</span>
          </motion.button>
        </div>
      </section>

      {/* --- Controls Bar --- */}
      <div className="sticky top-0 z-50 backdrop-blur-xl bg-[#010101]/80 border-b border-[#e8e3d5]/10 py-4 px-4 shadow-sm transition-all">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-6 justify-between items-center">
          <div className="flex items-center gap-2">
            <Shield className={`transition-colors ${isRialo ? 'text-[#a9ddd3]' : 'text-[#e8e3d5]/30'}`} size={24}/>
            <h2 className="text-lg font-bold text-[#e8e3d5]">Privacy Simulator</h2>
          </div>
          
          <ToggleSwitch 
            value={isRialo} 
            onChange={handleToggle} 
            labels={["Public Blockchain", "Rialo REX"]} 
          />
          
          <button 
            onClick={() => {
                window.scrollTo({top: window.innerHeight, behavior: 'smooth'});
            }}
            className="hidden md:block glass-btn px-6 py-2 rounded-xl font-semibold bg-[#e8e3d5] text-[#010101] hover:scale-105 transition-all shadow-xl"
          >
            Start Demo
          </button>
        </div>
      </div>

      {/* --- Main Canvas --- */}
      <div className="min-h-screen py-10 px-4 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Visualizer (Left - 66%) */}
          <div className="lg:col-span-2 h-[60vh] lg:h-[70vh] rounded-[2.5rem] border-4 border-[#e8e3d5]/10 bg-[#e8e3d5]/5 backdrop-blur-2xl relative overflow-hidden shadow-2xl">
            <VisualizerCanvas isRialo={isRialo} isStriking={isStriking} />
          </div>

          {/* METRICS (Right - 33%) */}
          <div className="space-y-6 lg:sticky lg:top-32 h-auto lg:h-[70vh] overflow-y-auto scrollbar-none pb-20">
            
            {/* 1. Architecture Metric */}
            <GlassCard title="Execution Model">
                <div className={`flex items-center gap-4 mb-4 p-4 rounded-xl ${isRialo ? 'bg-[#a9ddd3]/10 border border-[#a9ddd3]/30' : 'bg-red-900/10 border border-red-900/30'}`}>
                    {isRialo ? <Lock size={32} className="text-[#a9ddd3]" /> : <Eye size={32} className="text-red-500" />}
                    <div>
                        <h4 className="font-bold text-lg text-[#e8e3d5]">{isRialo ? "Confidential (REX)" : "Public EVM"}</h4>
                        <p className="text-xs opacity-70 text-[#e8e3d5]">{isRialo ? "Using TEEs/MPC/FHE" : "Standard Transparent"}</p>
                    </div>
                </div>
                <p className="text-xs text-[#e8e3d5]/60 leading-relaxed">
                    {isRialo 
                        ? "Inputs are encrypted with a network key. Computation happens inside a shielded enclave (TEE), ensuring no data leaks."
                        : "Inputs are sent in clear text. All nodes and observers can see the data before and after execution."}
                </p>
            </GlassCard>

            {/* 2. Security Status */}
             <GlassCard title="Input Privacy">
                 <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-[#e8e3d5]">Data Exposure Risk</span>
                    <span className={`font-bold ${isRialo ? 'text-[#a9ddd3]' : 'text-red-500'}`}>
                        {isRialo ? "NONE" : "HIGH"}
                    </span>
                 </div>
                 <div className="w-full bg-[#e8e3d5]/10 h-2 rounded-full overflow-hidden">
                    <motion.div 
                        initial={{ width: '0%' }}
                        animate={{ width: isRialo ? '0%' : '100%' }}
                        className="h-full bg-red-500"
                    />
                 </div>
                 <p className="text-xs mt-4 text-[#e8e3d5]/50">
                    {isRialo ? "Native encryption enables 'Supermodularity'." : "Lack of privacy causes 'Compound Marginalization'."}
                 </p>
            </GlassCard>

             {/* 3. Output Validity */}
            <GlassCard className="bg-[#010101] border-none">
                <div className="flex items-center gap-4 text-[#e8e3d5]">
                    <FileCheck size={24} className="text-[#a9ddd3]" />
                    <div>
                        <h4 className="font-bold">Execution Integrity</h4>
                        <p className="text-sm opacity-70">
                            Cryptographically Attested
                        </p>
                    </div>
                </div>
            </GlassCard>
          </div>
        </div>
      </div>

      {/* --- Pin-Scroll Use Cases (From Text) --- */}
      <section className="py-32 bg-gradient-to-b from-[#e8e3d5]/5 to-[#010101] overflow-hidden">
        <h2 className="text-4xl md:text-5xl font-bold text-[#e8e3d5] text-center mb-10">Real-World Use Cases</h2>
        
        <div className="text-center mb-20 max-w-2xl mx-auto px-4">
            <p className="text-[#e8e3d5]/60 mb-4 text-lg">
                Native privacy enables applications that were previously impossible on public blockchains.
            </p>
            <p className="text-sm text-[#e8e3d5]/40 italic border-t border-[#e8e3d5]/10 pt-4">
                * The following scenarios illustrate potential applications inferred from Rialo's architectural capabilities, serving as a conceptual demonstration rather than confirmed roadmap items.
            </p>
        </div>
        
        {/* Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 px-4 md:px-20 pb-12 w-full max-w-6xl mx-auto">
            {/* Case 1: Authenticated Interaction */}
            <GlassCard className="flex-none h-auto bg-[#e8e3d5]/5">
                <UseCaseSimulation type="auth" />
                <div>
                    <div className="w-12 h-12 rounded-full bg-[#a9ddd3] flex items-center justify-center mb-6">
                        <Key className="text-[#010101]" />
                    </div>
                    <h3 className="text-2xl font-bold mb-2 text-[#e8e3d5]">Authenticated Services</h3>
                    <p className="text-[#e8e3d5]/70 text-lg leading-relaxed">
                        "Securely use API Keys on-chain"
                    </p>
                </div>
                <div className="bg-[#010101]/50 p-4 rounded-xl border border-[#e8e3d5]/10 mt-4">
                    <p className="text-xs font-bold text-[#e8e3d5]">Example:</p>
                    <p className="text-xs mt-1 text-[#e8e3d5]/60">
                        An Instagram challenge app stores API credentials securely. Rialo nodes fetch participation data to award points without leaking the user's key or data.
                    </p>
                </div>
            </GlassCard>

            {/* Case 2: Private DeFi */}
            <GlassCard className="flex-none h-auto bg-[#e8e3d5]/5">
                 <UseCaseSimulation type="defi" />
                 <div>
                    <div className="w-12 h-12 rounded-full bg-[#e8e3d5] border border-[#010101]/10 flex items-center justify-center mb-6">
                        <Layers className="text-[#010101]" />
                    </div>
                    <h3 className="text-2xl font-bold mb-2 text-[#e8e3d5]">Private Financial Markets</h3>
                    <p className="text-[#e8e3d5]/70 text-lg leading-relaxed">
                        "Prevent Front-Running"
                    </p>
                </div>
                <div className="bg-[#010101]/50 p-4 rounded-xl border border-[#e8e3d5]/10 mt-4">
                    <p className="text-xs font-bold text-[#e8e3d5]">Example:</p>
                    <p className="text-xs mt-1 text-[#e8e3d5]/60">
                        Traders submit encrypted orders. Execution happens in a shielded environment. Only the final settlement is revealed, preventing MEV and copy-trading.
                    </p>
                </div>
            </GlassCard>

            {/* Case 3: Policy Enforcement */}
            <GlassCard className="flex-none h-auto bg-[#e8e3d5]/5 md:col-span-2 md:w-1/2 md:mx-auto">
                 <UseCaseSimulation type="policy" />
                 <div>
                    <div className="w-12 h-12 rounded-full bg-[#010101] flex items-center justify-center mb-6">
                        <Globe className="text-[#a9ddd3]" />
                    </div>
                    <h3 className="text-2xl font-bold mb-2 text-[#e8e3d5]">Policy Enforcement</h3>
                    <p className="text-[#e8e3d5]/70 text-lg leading-relaxed">
                        "Nationality Checks / PII"
                    </p>
                </div>
                 <div className="bg-[#010101]/50 p-4 rounded-xl border border-[#e8e3d5]/10 mt-4">
                    <p className="text-xs font-bold text-[#e8e3d5]">Example:</p>
                    <p className="text-xs mt-1 text-[#e8e3d5]/60">
                        Verify a user's country of origin for compliance (e.g., sanctioned countries) without publicly storing their passport data on-chain.
                    </p>
                </div>
            </GlassCard>
        </div>
      </section>

      {/* --- Footer CTA --- */}
      <footer className="py-20 text-center bg-[#010101] text-[#e8e3d5] mt-20 relative overflow-hidden border-t border-[#e8e3d5]/10">
          <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
          <div className="relative z-10">
            <h2 className="text-3xl md:text-5xl font-bold mb-8">Rialo: Native Privacy</h2>
            <div className="flex flex-col md:flex-row gap-4 justify-center items-center mb-12">
                <a 
                    href="https://www.rialo.io/posts/building-native-privacy-for-real-world-blockchain-adoption"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-8 py-4 rounded-full border border-[#e8e3d5]/30 text-[#e8e3d5] font-bold text-lg hover:bg-[#e8e3d5]/10 transition-colors flex items-center gap-2"
                >
                    Read the Research <Zap size={16} />
                </a>
            </div>
            
            {/* Created By Section */}
            <div className="flex flex-col items-center gap-4 mb-8">
                <span className="text-xs font-mono tracking-widest text-[#e8e3d5]/40 uppercase">Created by </span>
                <div className="flex gap-4">
                    <a href="https://x.com/gaminggop24" target="_blank" rel="noopener noreferrer" className="p-3 rounded-full bg-[#e8e3d5]/5 hover:bg-[#e8e3d5]/20 transition-colors text-[#e8e3d5]">
                        <XLogo size={20} />
                    </a>
                    <a href="https://github.com/Phonicxxxx24" target="_blank" rel="noopener noreferrer" className="p-3 rounded-full bg-[#e8e3d5]/5 hover:bg-[#e8e3d5]/20 transition-colors text-[#e8e3d5]">
                        <Github size={20} />
                    </a>
                </div>
            </div>

            <p className="mt-8 text-sm opacity-40 font-mono px-4">
                Visualizer based on "Building Native Privacy for Real-World Blockchain Adoption" <br/>
                <span className="italic text-[#e8e3d5]/50">Disclaimer: This visualization is an interpretive representation of Rialo's privacy architecture based on available research.</span>
            </p>
          </div>
      </footer>
    </div>
  );
}