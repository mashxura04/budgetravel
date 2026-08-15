import { PlaneTakeoff, Home, Utensils, ShoppingBag, MessageCircleHeart } from "lucide-react";
import { useLanguage } from "../context/LanguageContext";

function JourneySection() {
  const { t } = useLanguage();

  const STOPS = [
    {
      icon: PlaneTakeoff,
      label: t("journeyStop1"),
      detail: "Touch down and start exploring", // Hardcoded to match your image
      from: "#F0997B",
      to: "#D85A30",
    },
    {
      icon: Home,
      label: t("journeyStop2"),
      detail: t("journeyStop2Detail"),
      from: "#5DCAA5",
      to: "#1D9E75",
    },
    {
      icon: Utensils,
      label: t("journeyStop3"),
      detail: t("journeyStop3Detail"),
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
          <h2 className="font-display text-3xl md:text-5xl font-semibold text-[#1a1a1a]">
            {t("journeyTitle")}
          </h2>
        </div>

        {/* Desktop: 3D Animated Journey Map */}
        <div className="hidden sm:block relative">
          
          {/* 
             THE FIX: Pure CSS Wavy Line. 
             It sits absolutely behind everything. It will NEVER overlap text.
          */}
          <div 
            className="absolute left-0 right-0 z-0 top-[60px]"
            style={{ 
              height: '80px',
              background: `radial-gradient(ellipse at 50% 100%, rgba(255, 122, 26, 0.15) 0%, transparent 70%)`, // A soft 3D glow behind the line
              borderBottom: '3px solid #FF7A1A', // The thick orange road
              borderRadius: '50% 50% 50% 50% / 100% 100% 0% 0%', // A massive CSS curve that sweeps upwards
              boxShadow: '0 10px 20px -5px rgba(255, 122, 26, 0.3)',
              transform: 'scaleX(0.95)', /* Slightly shrink sides to match your curve */
              animation: 'drawLineCSS 2s ease-out forwards'
            }}
          />

          {/* The 5 Steps - Floating beautifully */}
          <div className="relative flex justify-between z-10" style={{ transformStyle: "preserve-3d" }}>
            {STOPS.map((stop, i) => {
              const Icon = stop.icon;
              const floatDelay = i * 0.15; 
              
              return (
                <div 
                  key={stop.label} 
                  className="flex flex-col items-center w-32 text-center group cursor-default relative"
                  style={{ 
                    marginTop: i % 2 === 0 ? 60 : 25, /* Even numbers lower, Odd numbers higher */
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
                    {/* Inner glow */}
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
                  <p className="mt-5 text-sm font-bold text-[#1a1a1a] tracking-wide">
                    {stop.label}
                  </p>
                  
                  {/* Subtext Details */}
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
        /* Floating */
        @keyframes floatUpDown {
          0%, 100% { transform: translateZ(30px) translateY(0px); }
          50% { transform: translateZ(30px) translateY(-10px); }
        }
        
        /* CSS Line drawing effect */
        @keyframes drawLineCSS {
          0% { transform: scaleX(0); opacity: 0; }
          100% { transform: scaleX(0.95); opacity: 1; }
        }
      `}</style>
    </section>
  );
}

export default JourneySection;