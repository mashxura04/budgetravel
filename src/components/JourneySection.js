import { useEffect, useMemo, useRef, useState } from "react";
import { PlaneTakeoff, Home, Utensils, ShoppingBag, MessageCircleHeart, MapPin } from "lucide-react";
import { useLanguage } from "../context/LanguageContext";

const ARRIVAL_INTERVAL = 2000;
const RESET_PAUSE = 900;

// Builds a smooth curve that passes through EVERY point exactly
// (Catmull-Rom -> cubic Bezier conversion). This replaces the old
// hand-typed "M ... Q ... T ..." path, which only guaranteed the
// curve touched 4 of the 5 stop coordinates — stop index 3
// ("Bring home a craft") was never actually ON the line, which is
// why the marker/line looked disconnected from that icon (and
// knock-on, the next one too).
function smoothPath(points) {
  if (points.length < 2) return "";
  let d = `M ${points[0].x} ${points[0].y}`;
  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[i - 1] || points[i];
    const p1 = points[i];
    const p2 = points[i + 1];
    const p3 = points[i + 2] || p2;
    const cp1x = p1.x + (p2.x - p0.x) / 6;
    const cp1y = p1.y + (p2.y - p0.y) / 6;
    const cp2x = p2.x - (p3.x - p1.x) / 6;
    const cp2y = p2.y - (p3.y - p1.y) / 6;
    d += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${p2.x} ${p2.y}`;
  }
  return d;
}

function JourneySection() {
  const { t } = useLanguage();

  // separate from the walking-line state below: this only controls
  // click-to-reveal captions under each icon, untouched from before
  const [activeIndex, setActiveIndex] = useState(null);

  // drives the auto-walking line + marker only, never touches icon styling
  const [walkStop, setWalkStop] = useState(0);
  const [walkAnimate, setWalkAnimate] = useState(false);

  const progressPathRef = useRef(null);
  const [pathLength, setPathLength] = useState(210); // real value measured on mount

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
      detail: "Real homes, real hospitality",
      x: 27,
      y: 15,
      from: "#5DCAA5",
      to: "#1D9E75",
    },
    {
      icon: Utensils,
      label: t("journeyStop3"),
      detail: "Home cooked, not tourist priced",
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

  // recomputed only when STOPS' coordinates would change (they don't at runtime,
  // but useMemo keeps this from rebuilding the path string every render)
  const pathD = useMemo(
    () => smoothPath(STOPS.map((s) => ({ x: s.x, y: s.y }))),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  // measure the ACTUAL rendered length of the curve once it's in the DOM,
  // instead of assuming a fixed "210" like before — the old constant was
  // a guess for the old path shape and was never exactly right
  useEffect(() => {
    if (progressPathRef.current) {
      setPathLength(progressPathRef.current.getTotalLength());
    }
  }, [pathD]);

  const toggleActive = (i) => {
    setActiveIndex((prev) => (prev === i ? null : i));
  };

  // auto-advancing walking marker, looping forever — same timing/logic as the old version
  useEffect(() => {
    let idx = 0;
    let timeout;

    function step() {
      if (idx === STOPS.length - 1) {
        timeout = setTimeout(() => {
          idx = 0;
          setWalkAnimate(false);
          setWalkStop(0);
          scheduleNext();
        }, RESET_PAUSE);
      } else {
        idx++;
        setWalkAnimate(true);
        setWalkStop(idx);
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

  const walkCurrent = STOPS[walkStop];

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

          {/* THE ROAD - now guaranteed to pass through all 5 icon coordinates exactly */}
          <div className="absolute left-0 right-0 w-full top-0 h-[150px] z-0 pointer-events-none overflow-visible">
            <svg viewBox="0 0 100 70" className="absolute inset-0 w-full h-full overflow-visible" preserveAspectRatio="none">
              <path d={pathD} fill="none" stroke="#FFD8A8" strokeWidth="0.7" strokeLinecap="round" />
              <path
                ref={progressPathRef}
                d={pathD}
                fill="none"
                stroke="#FF7A1A"
                strokeWidth="0.7"
                strokeLinecap="round"
                strokeDasharray={pathLength}
                strokeDashoffset={pathLength - (pathLength * walkStop) / (STOPS.length - 1)}
                style={{
                  transition: walkAnimate ? "stroke-dashoffset 1s cubic-bezier(0.3,0.7,0.3,1)" : "none",
                }}
              />
            </svg>

            <MapPin
              size={22}
              className="absolute z-20"
              style={{
                left: `${walkCurrent.x}%`,
                top: `${(walkCurrent.y / 70) * 150 - 22}px`,
                transform: "translateX(-50%)",
                color: walkCurrent.to,
                transition: walkAnimate
                  ? "left 1s cubic-bezier(0.3,0.7,0.3,1), top 1s cubic-bezier(0.3,0.7,0.3,1)"
                  : "none",
              }}
              fill={walkCurrent.to}
            />
          </div>

          {/* The 5 Steps */}
          <div className="relative flex justify-between z-10" style={{ transformStyle: "preserve-3d" }}>
            {STOPS.map((stop, i) => {
              const Icon = stop.icon;
              const isActive = activeIndex === i;
              // true once the walking marker has reached or passed this stop
              const isPassed = walkStop >= i;

              return (
                <div
                  key={stop.label}
                  className="flex flex-col items-center w-32 text-center group relative"
                  style={{
                    marginTop: i % 2 === 0 ? 60 : 25,
                    transform: "translateZ(30px)",
                  }}
                >
                  <div
                    className="journey-icon-float"
                    style={{ animationDelay: `${i * 0.3}s` }}
                  >
                    <button
                      type="button"
                      onClick={() => toggleActive(i)}
                      aria-pressed={isActive}
                      className={`relative w-[70px] h-[70px] rounded-full flex items-center justify-center transition-all duration-300 ease-out hover:scale-110 focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                        isPassed ? "scale-105" : ""
                      }`}
                      style={{
                        background: `linear-gradient(145deg, ${stop.from}, ${stop.to})`,
                        boxShadow: isPassed
                          ? `0 0 0 4px #ffffff, 0 0 0 7px ${stop.to}80, 0 15px 35px -10px rgba(0,0,0,0.3)`
                          : "0 15px 35px -10px rgba(0,0,0,0.15)",
                      }}
                    >
                      <div
                        className="absolute inset-0 rounded-full bg-white opacity-20 blur-md"
                        style={{ top: "-2px", left: "-2px", width: "110%", height: "110%" }}
                      />
                      <Icon size={28} color="#ffffff" strokeWidth={2} className="relative z-10 drop-shadow-md" />
                    </button>
                  </div>

                  <div className="mt-5 h-[70px] flex flex-col justify-start items-center">
                    <p className="text-[15px] font-bold text-[#1a1a1a] tracking-wide">
                      {stop.label}
                    </p>

                    <p
                      className={`text-[13px] font-medium mt-1 font-serif leading-tight transition-opacity duration-300 ease-out ${
                        isActive ? "opacity-100" : "opacity-0 pointer-events-none"
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

        {/* Mobile: Vertical Timeline - unchanged, still click-based */}
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
                      className={`text-xs mt-0.5 font-serif leading-tight transition-opacity duration-300 ease-out ${
                        isActive ? "opacity-100" : "opacity-0 pointer-events-none"
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

      {/* CSS ANIMATIONS - icon floating unchanged */}
      <style jsx>{`
        .journey-icon-float {
          animation: iconFloat 3.2s ease-in-out infinite;
        }

        @keyframes iconFloat {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-8px); }
        }
      `}</style>
    </section>
  );
}

export default JourneySection;