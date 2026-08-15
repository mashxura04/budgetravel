import { PlaneTakeoff, Home, Utensils, ShoppingBag, MessageCircleHeart } from "lucide-react";
import { useLanguage } from "../context/LanguageContext";

function JourneySection() {
  const { t } = useLanguage();

  const STOPS = [
    {
      icon: PlaneTakeoff,
      label: t("journeyStop1"),
      detail: t("journeyStop1Detail"),
      x: 5,
      y: 50,
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
      y: 15,
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
      y: 50,
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
      y: 15,
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
      y: 50,
      from: "#ED93B1",
      to: "#D4537E",
      tint: "#FBEAF0",
      dark: "#4B1528",
    },
  ];

  const pathD = "M 5 50 Q 27 12 50 50 T 95 50";

  return (
    <section className="bg-[#FFFBF7] py-16 overflow-hidden">
      <div className="max-w-5xl mx-auto px-6">
        <div className="text-center mb-14">
          <p className="text-brand-600 font-bold text-xs tracking-[0.15em] uppercase mb-3">
            {t("journeyEyebrow")}
          </p>
          <h2 className="font-display text-3xl md:text-4xl font-semibold text-ink">
            {t("journeyTitle")}
          </h2>
        </div>

        {/* Desktop: 3D Animated Journey Map */}
        <div 
          className="hidden sm:block relative overflow-visible" 
          style={{ height: 220, perspective: "1000px", transformStyle: "preserve-3d" }}
        >
          
          {/* 3D Tilted Line */}
          <div className="absolute inset-0 w-full" style={{ height: 140, top: 25, transform: "rotateX(8deg)" }}>
            <svg viewBox="0 0 100 70" className="w-full h-full overflow-visible" preserveAspectRatio="none">
              <path 
                d={pathD} 
                fill="none" 
                stroke="#FF7A1A" 
                strokeWidth="0.7" 
                strokeLinecap="round" 
                className="journey-path-line"
              />
            </svg>
          </div>

          {/* The 5 Steps */}
          <div className="relative flex justify-between" style={{ marginTop: 40, transformStyle: "preserve-3d" }}>
            {STOPS.map((stop, i) => {
              const Icon = stop.icon;
              // Float delay makes them look like they are waving
              const floatDelay = i * 0.15; 
              
              return (
                <div 
                  key={stop.label} 
                  className="flex flex-col items-center w-32 text-center group cursor-default"
                  style={{ 
                    marginTop: i % 2 === 0 ? 38 : 0,
                    animation: `floatUpDown 3.5s ease-in-out ${floatDelay}s infinite`,
                    transform: "translateZ(20px)" 
                  }}
                >
                  {/* The 3D Bubble Container */}
                  <div 
                    className="relative w-[56px] h-[56px] rounded-full flex items-center justify-center transition-all duration-500 ease-out"
                    style={{
                      background: stop.tint,
                      boxShadow: "0 10px 25px -5px rgba(0,0,0,0.1), 0 8px 10px -6px rgba(0,0,0,0.05)",
                      transform: "translateZ(10px)"
                    }}
                  >
                    {/* Hover Glow */}
                    <div className="absolute inset-0 rounded-full opacity-0 transition-opacity duration-300 group-hover:opacity-20 blur-md" style={{ backgroundColor: stop.to }} />
                    
                    {/* Icon */}
                    <Icon
                      size={22}
                      color={stop.dark}
                      strokeWidth={1.5}
                      className="relative z-10 transition-transform duration-300 group-hover:scale-110"
                    />
                  </div>

                  {/* Text Label */}
                  <p
                    className={`mt-3 text-sm leading-snug text-[#1a1a1a] font-semibold transition-colors duration-300`}
                  >
                    {stop.label}
                  </p>
                  
                  {/* The "Memories that stay with you" text under the 3rd item */}
                  {i === 2 && (
                    <p className="text-xs text-[#b13e6f] font-medium mt-1 font-serif">
                      {stop.detail}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Mobile: Vertical Timeline (Kept untouched for responsiveness) */}
        <div className="sm:hidden relative pl-8">
          <div className="absolute left-[19px] top-2 bottom-2 w-[2px] bg-neutral-200 rounded-full" />
          <div className="space-y-7">
            {STOPS.map((stop, i) => {
              const Icon = stop.icon;
              return (
                <div key={stop.label} className="relative flex items-start gap-4">
                  <div
                    className="relative w-11 h-11 rounded-full border-2 border-white flex items-center justify-center shrink-0 z-10"
                    style={{ background: stop.tint }}
                  >
                    <Icon size={18} color={stop.dark} strokeWidth={2} />
                  </div>
                  <div className="pt-1.5">
                    <p className="text-sm text-[#1a1a1a] font-bold">{stop.label}</p>
                    {i === 2 && <p className="text-xs mt-0.5 text-[#b13e6f] font-medium">{stop.detail}</p>}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* INLINE CSS KEYFRAMES FOR ANIMATION */}
      <style jsx>{`
        @keyframes floatUpDown {
          0%, 100% { transform: translateZ(20px) translateY(0px); }
          50% { transform: translateZ(20px) translateY(-8px); }
        }
        
        /* Draw the line animation on page load */
        .journey-path-line {
          stroke-dasharray: 300;
          stroke-dashoffset: 300;
          animation: drawLine 2s cubic-bezier(0.4, 0, 0.2, 1) forwards;
        }

        @keyframes drawLine {
          to { stroke-dashoffset: 0; }
        }
      `}</style>
    </section>
  );
}

export default JourneySection;