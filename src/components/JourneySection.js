import { useState } from "react";
import { PlaneTakeoff, Home, Utensils, ShoppingBag, MessageCircleHeart } from "lucide-react";
import { useLanguage } from "../context/LanguageContext";

function JourneySection() {
  const { t } = useLanguage();
  const [activeIndex, setActiveIndex] = useState(null);

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

  const toggleActive = (i) => {
    setActiveIndex((prev) => (prev === i ? null : i));
  };

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

        {/* Desktop: The Great Wavy Journey Road */}
        <div className="hidden sm:block relative pb-10">

          {/* THE FLOATING WAVY ROAD - now gently bobbing, not static */}
          <div className="absolute left-0 right-0 w-full top-[200px] z-0 journey-line-float">
            <svg viewBox="0 0 100 60" className="w-full h-full overflow-visible" preserveAspectRatio="none">
              <path
                d="M 2 35 C 25 50, 45 45, 50 35 S 75 25, 98 35"
                fill="none"
                stroke="#FF9E5E"
                strokeWidth="8"
                strokeLinecap="round"
                className="journey-shadow-line"
                opacity="0.4"
                filter="blur(6px)"
              />
              <path
                d="M 2 35 C 25 50, 45 45, 50 35 S 75 25, 98 35"
                fill="none"
                stroke="#FF7A1A"
                strokeWidth="6"
                strokeLinecap="round"
                className="journey-path-line"
              />
            </svg>
          </div>

          {/* The 5 Steps - Sitting perfectly above the road */}
          <div className="relative flex justify-between z-10" style={{ transformStyle: "preserve-3d" }}>
            {STOPS.map((stop, i) => {
              const Icon = stop.icon;
              const isActive = activeIndex === i;

              return (
                <div
                  key={stop.label}
                  className="flex flex-col items-center w-32 text-center group relative"
                  style={{
                    marginTop: i % 2 === 0 ? 60 : 25,
                    transform: "translateZ(30px)",
                  }}
                >
                  {/* 3D Icon Bubble - now clickable to reveal its caption */}
                  <button
                    type="button"
                    onClick={() => toggleActive(i)}
                    aria-pressed={isActive}
                    className="relative w-[70px] h-[70px] rounded-full flex items-center justify-center transition-all duration-500 ease-out shadow-[0_15px_35px_-10px_rgba(0,0,0,0.15)] hover:shadow-[0_20px_45px_-10px_rgba(0,0,0,0.25)] hover:scale-110 focus:outline-none focus:ring-2 focus:ring-offset-2"
                    style={{
                      background: `linear-gradient(145deg, ${stop.from}, ${stop.to})`,
                    }}
                  >
                    <div
                      className="absolute inset-0 rounded-full bg-white opacity-20 blur-md"
                      style={{ top: "-2px", left: "-2px", width: "110%", height: "110%" }}
                    />
                    <Icon size={28} color="#ffffff" strokeWidth={2} className="relative z-10 drop-shadow-md" />
                  </button>

                  {/* Text Section - label always visible, detail reveals on click */}
                  <div className="mt-5 h-[70px] flex flex-col justify-start items-center overflow-hidden">
                    <p className="text-[15px] font-bold text-[#1a1a1a] tracking-wide">
                      {stop.label}
                    </p>

                    <p
                      className={`text-[13px] font-medium mt-1 font-serif leading-tight transition-all duration-300 ease-out ${
                        isActive ? "opacity-100 max-h-10 translate-y-0" : "opacity-0 max-h-0 -translate-y-1"
                      }`}
                      style={{ color: stop.to }}
                    >
                      {stop.detail}
                    </p>
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
              const isActive = activeIndex === i;
              return (
                <div key={stop.label} className="relative flex items-start gap-4">
                  <button
                    type="button"
                    onClick={() => toggleActive(i)}
                    aria-pressed={isActive}
                    className="relative w-11 h-11 rounded-full border-2 border-white flex items-center justify-center shrink-0 z-10 shadow-md"
                    style={{ background: `linear-gradient(145deg, ${stop.from}, ${stop.to})` }}
                  >
                    <Icon size={18} color="#ffffff" strokeWidth={2} />
                  </button>
                  <div className="pt-1">
                    <p className="text-[15px] text-[#1a1a1a] font-bold">{stop.label}</p>
                    <p
                      className={`text-xs mt-0.5 font-serif leading-tight transition-all duration-300 ease-out overflow-hidden ${
                        isActive ? "opacity-100 max-h-10" : "opacity-0 max-h-0"
                      }`}
                      style={{ color: stop.to }}
                    >
                      {stop.detail}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* CSS ANIMATIONS */}
      <style jsx>{`
        /* The bold road draws itself smoothly from Left to Right */
        .journey-path-line {
          stroke-dasharray: 200;
          stroke-dashoffset: 200;
          animation: drawLine 2.5s cubic-bezier(0.4, 0, 0.2, 1) forwards;
        }

        @keyframes drawLine {
          0% { stroke-dashoffset: 200; opacity: 0; }
          20% { opacity: 1; }
          100% { stroke-dashoffset: 0; opacity: 1; }
        }

        /* Gentle continuous floating, independent of the draw-in animation */
        .journey-line-float {
          animation: floatGently 4.5s ease-in-out infinite;
        }

        @keyframes floatGently {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(8px); }
        }
      `}</style>
    </section>
  );
}

export default JourneySection;