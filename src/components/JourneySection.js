import { PlaneTakeoff, Home, Utensils, ShoppingBag, MessageCircleHeart } from "lucide-react";
import { useLanguage } from "../context/LanguageContext";

function JourneySection() {
  const { t } = useLanguage();

  const STOPS = [
    {
      icon: PlaneTakeoff,
      label: t("journeyStop1"),
      detail: "Touch down and start exploring",
      x: 5,
      y: 50,
      from: "#F0997B",
      to: "#D85A30",
    },
    {
      icon: Home,
      label: t("journeyStop2"),
      detail: t("journeyStop2Detail"),
      x: 27,
      y: 15,
      from: "#5DCAA5",
      to: "#1D9E75",
    },
    {
      icon: Utensils,
      label: t("journeyStop3"),
      detail: "Home cooked, not tourist priced", // Exact text from your screenshot
      x: 50,
      y: 50,
      from: "#F5B94D",
      to: "#E38A00",
    },
    {
      icon: ShoppingBag,
      label: t("journeyStop4"),
      detail: t("journeyStop4Detail"),
      x: 73,
      y: 15,
      from: "#AFA9EC",
      to: "#7F77DD",
    },
    {
      icon: MessageCircleHeart,
      label: t("journeyStop5"),
      detail: t("journeyStop5Detail"),
      x: 95,
      y: 50,
      from: "#ED93B1",
      to: "#D4537E",
    },
  ];

  // A soft, undulating 'S' wave that dips beautifully between the dots
  const pathD = "M 5 55 C 20 20, 35 80, 50 55 C 65 30, 80 80, 95 55";

  return (
    <section className="bg-[#FFFBF7] py-20 overflow-hidden">
      <div className="max-w-5xl mx-auto px-6">
        <div className="text-center mb-16">
          <p className="text-brand-600 font-bold text-xs tracking-[0.15em] uppercase mb-3">
            {t("journeyEyebrow")}
          </p>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-[#1a1a1a]">
            {t("journeyTitle")}
          </h2>
        </div>

        {/* Desktop: Glowing 3D Journey Wave */}
        <div className="hidden sm:block relative">
          
          {/* FLOATING 3D GLOW BEHIND THE LINE */}
          <div 
            className="absolute left-0 right-0 top-[60px] z-0 opacity-40 blur-xl"
            style={{ 
              height: '30px',
              background: 'linear-gradient(90deg, #D85A30, #1D9E75, #E38A00, #7F77DD, #D4537E)',
              filter: 'blur(25px)',
              transform: 'translateY(10px)'
            }}
          />

          {/* THE WAVY FLOATING LINE */}
          <div className="absolute left-0 right-0 w-full z-0" style={{ height: '80px', top: '40px' }}>
            <svg viewBox="0 0 100 80" className="w-full h-full overflow-visible" preserveAspectRatio="none">
              {/* The glowing 'S' wave */}
              <path 
                d={pathD} 
                fill="none" 
                stroke="#FF7A1A" 
                strokeWidth="1.8" 
                strokeLinecap="round" 
                className="journey-path-line"
              />
            </svg>
          </div>

          {/* The 5 Steps - Floating beautifully above the line */}
          <div className="relative flex justify-between z-10" style={{ transformStyle: "preserve-3d" }}>
            {STOPS.map((stop, i) => {
              const Icon = stop.icon;
              const floatDelay = i * 0.15; 
              
              return (
                <div 
                  key={stop.label} 
                  className="flex flex-col items-center w-32 text-center group cursor-default relative"
                  style={{ 
                    marginTop: i % 2 === 0 ? 55 : 15, /* Creates the up/down wave pattern */
                    animation: `floatUpDown 4s ease-in-out ${floatDelay}s infinite`,
                    transform: "translateZ(30px)"
                  }}
                >
                  {/* 3D Floating Bubble */}
                  <div 
                    className="relative w-[70px] h-[70px] rounded-full flex items-center justify-center transition-all duration-500 ease-out shadow-[0_15px_35px_-10px_rgba(0,0,0,0.15)] hover:shadow-[0_20px_45px_-10px_rgba(0,0,0,0.25)] hover:scale-110"
                    style={{
                      background: `linear-gradient(145deg, ${stop.from}, ${stop.to})`,
                      transform: "translateZ(20px)"
                    }}
                  >
                    {/* Inner glow to make it 3D */}
                    <div className="absolute inset-0 rounded-full bg-white opacity-20 blur-md" style={{ top: '-2px', left: '-2px', width: '110%', height: '110%' }} />
                    
                    {/* Icon */}
                    <Icon
                      size={28}
                      color="#ffffff"
                      strokeWidth={2}
                      className="relative z-10 drop-shadow-md"
                    />
                  </div>

                  {/* Text Label */}
                  <p className="mt-4 text-[15px] font-bold text-[#1a1a1a] tracking-wide">
                    {stop.label}
                  </p>
                  
                  {/* Subtext Details */}
                  {i === 0 && (
                    <p className="text-[13px] text-[#D85A30] font-medium mt-0.5 font-serif tracking-wide">
                      Touch down and start exploring
                    </p>
                  )}
                  {i === 2 && (
                    <p className="text-[13px] text-[#E38A00] font-medium mt-0.5 font-serif tracking-wide text-center leading-snug">
                      Home cooked, not<br />tourist priced
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Mobile: Vertical Timeline */}
        <div className="sm:hidden relative pl-8">
          <div className="absolute left-[19px] top-2 bottom-2 w-[2px] bg-neutral-200 rounded-full" />
          <div className="space-y-7">
            {STOPS.map((stop, i) => {
              const Icon = stop.icon;
              return (
                <div key={stop.label} className="relative flex items-start gap-4">
                  <div
                    className="relative w-11 h-11 rounded-full border-2 border-white flex items-center justify-center shrink-0 z-10 shadow-md"
                    style={{ background: `linear-gradient(145deg, ${stop.from}, ${stop.to})` }}
                  >
                    <Icon size={18} color="#ffffff" strokeWidth={2} />
                  </div>
                  <div className="pt-1.5">
                    <p className="text-sm text-[#1a1a1a] font-bold">{stop.label}</p>
                    {i === 0 && <p className="text-xs mt-0.5 text-[#D85A30] font-serif">Touch down and start exploring</p>}
                    {i === 2 && <p className="text-xs mt-0.5 text-[#E38A00] font-serif leading-tight">Home cooked, not tourist priced</p>}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* CSS ANIMATIONS */}
      <style jsx>{`
        /* Gentle, graceful floating */
        @keyframes floatUpDown {
          0%, 100% { transform: translateZ(30px) translateY(0px); }
          50% { transform: translateZ(30px) translateY(-10px); }
        }
        
        /* Line draws itself seamlessly from left to right */
        .journey-path-line {
          stroke-dasharray: 400;
          stroke-dashoffset: 400;
          animation: drawLine 3s cubic-bezier(0.4, 0, 0.2, 1) forwards;
        }

        @keyframes drawLine {
          to { stroke-dashoffset: 0; }
        }
      `}</style>
    </section>
  );
}

export default JourneySection;