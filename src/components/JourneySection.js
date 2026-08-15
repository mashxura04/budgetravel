import { PlaneTakeoff, Home, Utensils, ShoppingBag, MessageCircleHeart } from "lucide-react";
import { useLanguage } from "../context/LanguageContext";

function JourneySection() {
  const { t } = useLanguage();

  const STOPS = [
    {
      icon: PlaneTakeoff,
      label: t("journeyStop1"),
      detail: t("journeyStop1Detail"), // "Touch down and start exploring"
      x: 5,
      y: 52,
      from: "#F0997B",
      to: "#D85A30",
      tint: "#FAECE7",
      dark: "#4A1B0C",
    },
    {
      icon: Home,
      label: t("journeyStop2"),
      detail: t("journeyStop2Detail"),
      x: 27,
      y: 18,
      from: "#5DCAA5",
      to: "#1D9E75",
      tint: "#E1F5EE",
      dark: "#04342C",
    },
    {
      icon: Utensils,
      label: t("journeyStop3"),
      detail: t("journeyStop3Detail"),
      x: 50,
      y: 52,
      from: "#F5B94D",
      to: "#E38A00",
      tint: "#FAEEDA",
      dark: "#412402",
    },
    {
      icon: ShoppingBag,
      label: t("journeyStop4"),
      detail: t("journeyStop4Detail"),
      x: 73,
      y: 18,
      from: "#AFA9EC",
      to: "#7F77DD",
      tint: "#EEEDFE",
      dark: "#26215C",
    },
    {
      icon: MessageCircleHeart,
      label: t("journeyStop5"),
      detail: t("journeyStop5Detail"),
      x: 95,
      y: 52,
      from: "#ED93B1",
      to: "#D4537E",
      tint: "#FBEAF0",
      dark: "#4B1528",
    },
  ];

  // Adjusted path to sit slightly lower so it doesn't eat the text
  const pathD = "M 5 55 Q 27 18 50 55 T 95 55";

  return (
    <section className="bg-[#FFFBF7] py-20 overflow-hidden">
      <div className="max-w-5xl mx-auto px-6">
        <div className="text-center mb-16">
          <p className="text-brand-600 font-bold text-xs tracking-[0.15em] uppercase mb-3">
            {t("journeyEyebrow")}
          </p>
          <h2 className="font-display text-3xl md:text-5xl font-semibold text-[#1a1a1a]">
            {t("journeyTitle")}
          </h2>
        </div>

        {/* Desktop: 3D Animated Journey Map */}
        <div 
          className="hidden sm:block relative overflow-visible" 
          style={{ height: 260, perspective: "1200px", transformStyle: "preserve-3d" }}
        >
          
          {/* 3D Tilted Line Container - sits beneath everything */}
          <div className="absolute inset-0 w-full" style={{ height: 150, top: 40, transform: "rotateX(10deg)" }}>
            <svg viewBox="0 0 100 80" className="w-full h-full overflow-visible" preserveAspectRatio="none">
              <path 
                d={pathD} 
                fill="none" 
                stroke="#FFB347" /* Matching light orange base color */
                strokeWidth="0.5" 
                strokeLinecap="round" 
                className="journey-base-line"
              />
              <path 
                d={pathD} 
                fill="none" 
                stroke="#FF7A1A" /* Bold orange fill */
                strokeWidth="1.2" 
                strokeLinecap="round" 
                className="journey-path-line"
              />
            </svg>
          </div>

          {/* The 5 Steps - Floating beautifully */}
          <div className="relative flex justify-between" style={{ marginTop: 20, transformStyle: "preserve-3d" }}>
            {STOPS.map((stop, i) => {
              const Icon = stop.icon;
              const floatDelay = i * 0.15; 
              
              return (
                <div 
                  key={stop.label} 
                  className="flex flex-col items-center w-32 text-center group cursor-default relative"
                  style={{ 
                    marginTop: i % 2 === 0 ? 50 : 15, /* Even numbers lower, Odd numbers higher */
                    animation: `floatUpDown 4s ease-in-out ${floatDelay}s infinite`,
                    transform: "translateZ(30px) rotateX(2deg)" // Extreme 3D pop out
                  }}
                >
                  {/* 3D Floating Bubble */}
                  <div 
                    className="relative w-[70px] h-[70px] rounded-full flex items-center justify-center transition-all duration-500 ease-out shadow-[0_15px_35px_-10px_rgba(0,0,0,0.15)] hover:shadow-[0_20px_45px_-10px_rgba(0,0,0,0.25)] hover:scale-110"
                    style={{
                      background: `linear-gradient(145deg, ${stop.from}, ${stop.to})`, // Gives it a glossy 3D sphere look
                      transform: "translateZ(20px)"
                    }}
                  >
                    {/* Inner glow ring */}
                    <div className="absolute inset-0 rounded-full bg-white opacity-10 blur-sm" style={{ top: '-4px', left: '-4px' }} />
                    
                    {/* Icon */}
                    <Icon
                      size={28}
                      color="#ffffff"
                      strokeWidth={2}
                      className="relative z-10 drop-shadow-md"
                    />
                  </div>

                  {/* Text Label - Pushed further down so line NEVER overlaps it */}
                  <p className="mt-5 text-sm font-bold text-[#1a1a1a] tracking-wide transform translateZ(10px)">
                    {stop.label}
                  </p>
                  
                  {/* Subtext Details (Only showing for specific ones per your design) */}
                  {i === 0 && (
                    <p className="text-xs text-[#D85A30] font-medium mt-1 font-serif tracking-wide">
                      Touch down and start exploring
                    </p>
                  )}
                  {i === 2 && (
                    <p className="text-xs text-[#E38A00] font-medium mt-1 font-serif tracking-wide">
                      {stop.detail}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Mobile: Vertical Timeline (Kept same) */}
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
                    {(i === 0 || i === 2) && <p className="text-xs mt-0.5 font-serif font-medium" style={{ color: stop.to }}>{stop.detail}</p>}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* CSS ANIMATIONS */}
      <style jsx>{`
        /* Gentle, dreamy floating */
        @keyframes floatUpDown {
          0%, 100% { transform: translateZ(30px) rotateX(2deg) translateY(0px); }
          50% { transform: translateZ(30px) rotateX(2deg) translateY(-10px); }
        }
        
        /* Line drawing animation - secondary line */
        .journey-path-line {
          stroke-dasharray: 350;
          stroke-dashoffset: 350;
          animation: drawLine 2.5s cubic-bezier(0.4, 0, 0.2, 1) forwards;
        }

        @keyframes drawLine {
          to { stroke-dashoffset: 0; }
        }
      `}</style>
    </section>
  );
}

export default JourneySection;