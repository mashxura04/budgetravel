import { PlaneTakeoff, Home, Utensils, ShoppingBag, MessageCircleHeart } from "lucide-react";
import { useLanguage } from "../context/LanguageContext";

function JourneySection() {
  const { t } = useLanguage();

  const STOPS = [
    {
      icon: PlaneTakeoff,
      label: t("journeyStop1"),
      detail: "Touch down and start exploring",
      from: "#F0997B",
      to: "#D85A30",
    },
    {
      icon: Home,
      label: t("journeyStop2"),
      detail: "Real homes, real hospitality",
      from: "#5DCAA5",
      to: "#1D9E75",
    },
    {
      icon: Utensils,
      label: t("journeyStop3"),
      detail: "Home cooked, not tourist priced",
      from: "#F5B94D",
      to: "#E38A00",
    },
    {
      icon: ShoppingBag,
      label: t("journeyStop4"),
      detail: t("journeyStop4Detail"),
      from: "#AFA9EC",
      to: "#7F77DD",
    },
    {
      icon: MessageCircleHeart,
      label: t("journeyStop5"),
      detail: t("journeyStop5Detail"),
      from: "#ED93B1",
      to: "#D4537E",
    },
  ];

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

        {/* Desktop: The Great Journey */}
        <div className="hidden sm:block relative pb-20">
          
          {/* THE FLOATING LINE - Pushed below everything */}
          <div className="absolute left-0 right-0 w-full top-[160px] z-0">
            <svg viewBox="0 0 100 60" className="w-full h-full overflow-visible" preserveAspectRatio="none">
              {/* Glowing underlying aura */}
              <path 
                d="M 5 45 C 27 60, 50 30, 95 45" 
                fill="none" 
                stroke="#FF7A1A" 
                strokeWidth="6" 
                strokeLinecap="round" 
                className="journey-glow-line"
              />
              {/* The crisp moving ribbon */}
              <path 
                d="M 5 45 C 27 60, 50 30, 95 45" 
                fill="none" 
                stroke="#FF9E5E" 
                strokeWidth="3" 
                strokeLinecap="round" 
                className="journey-path-line"
              />
            </svg>
          </div>

          {/* The 5 Steps */}
          <div className="relative flex justify-between z-10" style={{ transformStyle: "preserve-3d" }}>
            {STOPS.map((stop, i) => {
              const Icon = stop.icon;
              
              return (
                <div 
                  key={stop.label} 
                  className="flex flex-col items-center w-32 text-center group cursor-default relative"
                  style={{ 
                    marginTop: i % 2 === 0 ? 60 : 25, // Creates the wave pattern
                    transform: "translateZ(30px)"
                  }}
                >
                  {/* Icon Bubble */}
                  <div 
                    className="relative w-[70px] h-[70px] rounded-full flex items-center justify-center transition-all duration-500 ease-out shadow-[0_15px_35px_-10px_rgba(0,0,0,0.15)] hover:shadow-[0_20px_45px_-10px_rgba(0,0,0,0.25)] hover:scale-110"
                    style={{
                      background: `linear-gradient(145deg, ${stop.from}, ${stop.to})`,
                    }}
                  >
                    <div className="absolute inset-0 rounded-full bg-white opacity-20 blur-md" style={{ top: '-2px', left: '-2px', width: '110%', height: '110%' }} />
                    <Icon size={28} color="#ffffff" strokeWidth={2} className="relative z-10 drop-shadow-md" />
                  </div>

                  {/* Text - Pushed WAY down so the line never touches */}
                  <div className="mt-6 h-[60px] flex flex-col justify-start items-center">
                    <p className="text-[15px] font-bold text-[#1a1a1a] tracking-wide">
                      {stop.label}
                    </p>
                    
                    {i === 0 && (
                      <p className="text-[13px] text-[#D85A30] font-medium mt-1 font-serif leading-tight">
                        Touch down and start<br />exploring
                      </p>
                    )}
                    {i === 1 && (
                      <p className="text-[13px] text-[#1D9E75] font-medium mt-1 font-serif leading-tight">
                        Real homes, real<br />hospitality
                      </p>
                    )}
                    {i === 2 && (
                      <p className="text-[13px] text-[#E38A00] font-medium mt-1 font-serif leading-tight">
                        Home cooked, not<br />tourist priced
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Mobile: Vertical Timeline */}
        <div className="sm:hidden relative pl-8">
          <div className="absolute left-[19px] top-2 bottom-2 w-[2px] bg-neutral-200 rounded-full" />
          <div className="space-y-8">
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
                  <div className="pt-1">
                    <p className="text-[15px] text-[#1a1a1a] font-bold">{stop.label}</p>
                    {i === 0 && <p className="text-xs mt-0.5 text-[#D85A30] font-serif leading-tight">Touch down and start exploring</p>}
                    {i === 1 && <p className="text-xs mt-0.5 text-[#1D9E75] font-serif leading-tight">Real homes, real hospitality</p>}
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
        /* The main line draws itself smoothly from Left to Right */
        .journey-path-line {
          stroke-dasharray: 200;
          stroke-dashoffset: 200;
          animation: drawLine 2.5s cubic-bezier(0.4, 0, 0.2, 1) forwards;
        }

        /* The glowing shadow appears with a slight delay for a magical effect */
        .journey-glow-line {
          stroke-dasharray: 200;
          stroke-dashoffset: 200;
          animation: drawLine 2.8s cubic-bezier(0.4, 0, 0.2, 1) forwards;
          opacity: 0.3;
        }

        @keyframes drawLine {
          0% { stroke-dashoffset: 200; opacity: 0; }
          20% { opacity: 1; }
          100% { stroke-dashoffset: 0; opacity: 1; }
        }
      `}</style>
    </section>
  );
}

export default JourneySection;