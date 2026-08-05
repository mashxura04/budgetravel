import { useEffect, useState } from "react";
import { PlaneTakeoff, Home, Utensils, ShoppingBag, MessageCircleHeart, MapPin } from "lucide-react";
import { useLanguage } from "../context/LanguageContext";

const ARRIVAL_INTERVAL = 2000;
const RESET_PAUSE = 900;

function JourneySection() {
  const { t } = useLanguage();
  const [activeStop, setActiveStop] = useState(0);
  const [animate, setAnimate] = useState(false);

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

  useEffect(() => {
    let idx = 0;
    let timeout;

    function step() {
      if (idx === STOPS.length - 1) {
        timeout = setTimeout(() => {
          idx = 0;
          setAnimate(false);
          setActiveStop(0);
          scheduleNext();
        }, RESET_PAUSE);
      } else {
        idx++;
        setAnimate(true);
        setActiveStop(idx);
        scheduleNext();
      }
    }

    function scheduleNext() {
      timeout = setTimeout(step, ARRIVAL_INTERVAL);
    }

    scheduleNext();
    return () => clearTimeout(timeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const current = STOPS[activeStop];
  const pathD = "M 5 50 Q 27 12 50 50 T 95 50";

  return (
    <section className="bg-gradient-to-b from-white via-[#FFFBF7] to-[#FFF6EC] py-16">
      <div className="max-w-5xl mx-auto px-6">
        <div className="text-center mb-14">
          <p className="text-brand-600 font-bold text-xs tracking-[0.15em] uppercase mb-3">
            {t("journeyEyebrow")}
          </p>
          <h2 className="font-display text-3xl md:text-4xl font-semibold text-ink">
            {t("journeyTitle")}
          </h2>
        </div>

        {/* Desktop / tablet: curved path with badges */}
        <div className="hidden sm:block relative overflow-visible" style={{ height: 220 }}>
          <svg viewBox="0 0 100 70" className="absolute inset-0 w-full overflow-visible" style={{ height: 140, top: 25 }} preserveAspectRatio="none">
            <path d={pathD} fill="none" stroke="#FFD8A8" strokeWidth="0.7" strokeLinecap="round" />
            <path
              d={pathD}
              fill="none"
              stroke="#FF7A1A"
              strokeWidth="0.7"
              strokeLinecap="round"
              strokeDasharray="210"
              strokeDashoffset={210 - (210 * activeStop) / (STOPS.length - 1)}
              style={{ transition: animate ? "stroke-dashoffset 1s cubic-bezier(0.3,0.7,0.3,1)" : "none" }}
            />
          </svg>

          <MapPin
            size={26}
            className="absolute z-20"
            style={{
              left: `${current.x}%`,
              top: `${25 + (current.y / 100) * 140 - 26}px`,
              transform: "translateX(-50%)",
              color: current.to,
              transition: animate ? "left 1s cubic-bezier(0.3,0.7,0.3,1), top 1s cubic-bezier(0.3,0.7,0.3,1)" : "none",
            }}
            fill={current.to}
          />

          <div className="relative flex justify-between" style={{ marginTop: 40 }}>
            {STOPS.map((stop, i) => {
              const Icon = stop.icon;
              const isActive = activeStop === i;
              const isPast = i < activeStop;
              return (
                <div key={stop.label} className="flex flex-col items-center w-32 text-center" style={{ marginTop: i % 2 === 0 ? 38 : 0 }}>
                  <div className="relative w-[52px] h-[52px] flex items-center justify-center">
                    {isActive && (
                      <span
                        className="absolute inset-0 rounded-full animate-ping opacity-30"
                        style={{ backgroundColor: stop.to }}
                      />
                    )}
                    <div
                      className="relative w-[46px] h-[46px] rounded-full flex items-center justify-center transition-all duration-400"
                      style={{
                        background: isActive
                          ? `linear-gradient(135deg, ${stop.from}, ${stop.to})`
                          : isPast
                          ? stop.tint
                          : "#F7F7F5",
                        border: isActive || isPast ? "none" : "1px solid #E8E4DD",
                        transform: isActive ? "scale(1.15)" : "scale(1)",
                      }}
                    >
                      <Icon
                        size={20}
                        color={isActive ? "#fff" : isPast ? stop.dark : "#9CA3AF"}
                        strokeWidth={2}
                      />
                    </div>
                  </div>
                  <p
                    className={`mt-2.5 text-xs leading-snug transition-colors duration-300 ${
                      isActive ? "text-ink font-bold" : isPast ? "text-ink-soft font-medium" : "text-neutral-400 font-medium"
                    }`}
                  >
                    {stop.label}
                  </p>
                </div>
              );
            })}
          </div>

          <p className="text-center text-sm font-medium mt-3 h-5" style={{ color: current.to }}>
            {current.detail}
          </p>
        </div>

        {/* Mobile: vertical timeline, driven by the same live activeStop state */}
        <div className="sm:hidden relative pl-8">
          <div className="absolute left-[19px] top-2 bottom-2 w-[2px] bg-neutral-200 rounded-full" />
          <div className="space-y-7">
            {STOPS.map((stop, i) => {
              const Icon = stop.icon;
              const isActive = activeStop === i;
              const isPast = i < activeStop;
              return (
                <div key={stop.label} className="relative flex items-start gap-4">
                  {isActive && (
                    <span
                      className="absolute left-0 top-0 w-11 h-11 rounded-full animate-ping opacity-30"
                      style={{ backgroundColor: stop.to }}
                    />
                  )}
                  <div
                    className="relative w-11 h-11 rounded-full border-2 border-white flex items-center justify-center shrink-0 z-10 transition-all duration-400"
                    style={{
                      background: isActive
                        ? `linear-gradient(135deg, ${stop.from}, ${stop.to})`
                        : isPast
                        ? stop.tint
                        : "#F7F7F5",
                      boxShadow: isActive ? `0 6px 14px ${stop.to}55` : "none",
                      transform: isActive ? "scale(1.08)" : "scale(1)",
                    }}
                  >
                    <Icon
                      size={18}
                      color={isActive ? "#fff" : isPast ? stop.dark : "#9CA3AF"}
                      strokeWidth={2}
                    />
                  </div>
                  <div className="pt-1.5">
                    <p
                      className={`text-sm transition-colors duration-300 ${
                        isActive ? "text-ink font-bold" : isPast ? "text-ink-soft font-semibold" : "text-neutral-400 font-semibold"
                      }`}
                    >
                      {stop.label}
                    </p>
                    {isActive && (
                      <p className="text-xs mt-0.5 font-medium" style={{ color: stop.to }}>
                        {stop.detail}
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

export default JourneySection;