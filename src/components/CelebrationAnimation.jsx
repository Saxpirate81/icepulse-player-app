import React, { useEffect, useState } from 'react';
import { Trophy, CheckCircle, Star, Zap } from 'lucide-react';

const CelebrationAnimation = ({ onComplete }) => {
  const [show, setShow] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShow(false);
      if (onComplete) onComplete();
    }, 3000);

    return () => clearTimeout(timer);
  }, [onComplete]);

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="relative">
        {/* Main celebration */}
        <div className="text-center animate-bounce">
          <div className="relative">
            <CheckCircle 
              size={120} 
              className="text-green-500 mx-auto animate-pulse drop-shadow-[0_0_30px_rgba(34,197,94,0.8)]" 
              fill="currentColor"
            />
            <div className="absolute inset-0 animate-ping">
              <Star size={100} className="text-yellow-400 mx-auto opacity-50" />
            </div>
          </div>
          
          <h2 className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-yellow-400 to-cyan-400 uppercase mt-6 animate-pulse">
            Complete!
          </h2>
          
          <div className="flex justify-center gap-4 mt-6">
            <Trophy size={32} className="text-yellow-400 animate-bounce" style={{ animationDelay: '0s' }} />
            <Zap size={32} className="text-cyan-400 animate-bounce" style={{ animationDelay: '0.2s' }} />
            <Star size={32} className="text-yellow-400 animate-bounce" style={{ animationDelay: '0.4s' }} />
          </div>
        </div>

        {/* Confetti effect */}
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-3 h-3 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              backgroundColor: ['#06b6d4', '#fbbf24', '#34d399', '#f87171'][Math.floor(Math.random() * 4)],
              animation: `confetti-fall ${1 + Math.random()}s linear forwards`,
              animationDelay: `${Math.random() * 0.5}s`,
            }}
          />
        ))}
      </div>
      
      <style>{`
        @keyframes confetti-fall {
          to {
            transform: translateY(100vh) rotate(360deg);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
};

export default CelebrationAnimation;

