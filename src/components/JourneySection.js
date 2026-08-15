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
      tint: "#FAECE7",
      dark: "#4A1B0C",
    },
    {
      icon: Home,
      label: t("journeyStop2"),
      detail: "Real homes, real hospitality", // Hardcoded to match your image
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

  const pathD = "M 5 55 Q 27 18 50 55 T 95 55";

  return (
    <section className="journey-section">
      <div className="journey-container">
        <div className="journey-header-wrapper">
          <p className="journey-eyebrow">{t("journeyEyebrow")}</p>
          <h2 className="journey-title">{t("journeyTitle")}</h2>
        </div>

        {/* Desktop */}
        <div className="journey-desktop-wrapper">
          
          {/* The SVG Line - given explicit z-index: 0 so it stays BEHIND everything */}
          <div className="journey-svg-container">
            <svg viewBox="0 0 100 80" className="journey-svg" preserveAspectRatio="none">
              <path d={pathD} fill="none" stroke="#FFB347" strokeWidth="0.5" strokeLinecap="round" className="journey-base-line"/>
              <path d={pathD} fill="none" stroke="#FF7A1A" strokeWidth="1.2" strokeLinecap="round" className="journey-path-line"/>
            </svg>
          </div>

          {/* The 5 Steps - Highly visible z-index: 10 */}
          <div className="journey-steps-wrapper">
            {STOPS.map((stop, i) => {
              const Icon = stop.icon;
              const floatDelay = i * 0.15; 
              
              return (
                <div key={stop.label} className={`journey-step journey-step-${i}`} style={{ animationDelay: `${floatDelay}s` }}>
                  <div className="journey-icon-bubble" style={{ background: `linear-gradient(145deg, ${stop.from}, ${stop.to})` }}>
                    <div className="journey-inner-glow" />
                    <Icon size={28} color="#ffffff" strokeWidth={2} className="journey-icon" />
                  </div>

                  <p className="journey-label">{stop.label}</p>
                  
                  {/* Specific detail texts per your images */}
                  {i === 0 && (
                    <p className="journey-detail orange-text">Touch down and start exploring</p>
                  )}
                  {i === 1 && (
                    <p className="journey-detail green-text">Real homes, real hospitality</p>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Mobile - kept simple */}
        <div className="journey-mobile-wrapper">
          <div className="journey-mobile-line" />
          <div className="journey-mobile-steps">
            {STOPS.map((stop, i) => {
              const Icon = stop.icon;
              return (
                <div key={stop.label} className="journey-mobile-step">
                  <div className="journey-mobile-bubble" style={{ background: `linear-gradient(145deg, ${stop.from}, ${stop.to})` }}>
                    <Icon size={18} color="#ffffff" strokeWidth={2} />
                  </div>
                  <div className="journey-mobile-text">
                    <p className="journey-mobile-label">{stop.label}</p>
                    {i === 0 && <p className="journey-mobile-detail orange-text">Touch down and start exploring</p>}
                    {i === 1 && <p className="journey-mobile-detail green-text">Real homes, real hospitality</p>}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* RAW CSS THAT ALWAYS WORKS - NO TAILWIND DEPENDENCY */}
      <style>{`
        .journey-section { background-color: #FFFBF7; padding: 80px 0; overflow: hidden; font-family: sans-serif; }
        .journey-container { max-width: 1024px; margin: 0 auto; padding: 0 24px; }
        
        .journey-header-wrapper { text-align: center; margin-bottom: 60px; }
        .journey-eyebrow { color: #c75613; font-weight: bold; font-size: 12px; letter-spacing: 1.5px; text-transform: uppercase; margin-bottom: 12px; display: block; }
        .journey-title { font-family: Georgia, serif; font-size: 40px; font-weight: 600; color: #1a1a1a; margin: 0; }

        /* DESKTOP LAYOUT */
        .journey-desktop-wrapper { position: relative; display: none; height: 280px; }
        @media (min-width: 640px) { .journey-desktop-wrapper { display: block; } }

        /* THE SVG LINE - FORCED BEHIND EVERYTHING */
        .journey-svg-container { position: absolute; inset: 0; width: 100%; height: 150px; top: 40px; z-index: 0; }
        .journey-svg { width: 100%; height: 100%; overflow: visible; }
        .journey-path-line { stroke-dasharray: 350; stroke-dashoffset: 350; animation: drawLine 2.5s ease forwards; }

        /* THE STEPS - FORCED ON TOP */
        .journey-steps-wrapper { position: relative; display: flex; justify-content: space-between; z-index: 10; margin-top: 20px; transform-style: preserve-3d; }
        
        .journey-step { display: flex; flex-direction: column; align-items: center; width: 128px; text-align: center; animation: floatUpDown 4s ease-in-out infinite; transform: translateZ(30px); }
        .journey-step-0 { margin-top: 50px; }
        .journey-step-1 { margin-top: 15px; }
        .journey-step-2 { margin-top: 50px; }
        .journey-step-3 { margin-top: 15px; }
        .journey-step-4 { margin-top: 50px; }

        .journey-icon-bubble { position: relative; width: 70px; height: 70px; border-radius: 50%; display: flex; align-items: center; justify-content: center; box-shadow: 0 15px 35px -10px rgba(0,0,0,0.15); transition: transform 0.3s; }
        .journey-icon-bubble:hover { transform: scale(1.1); }
        .journey-inner-glow { position: absolute; inset: 0; border-radius: 50%; background: white; opacity: 0.2; filter: blur(4px); top: -2px; left: -2px; width: 110%; height: 110%; }
        .journey-icon { position: relative; z-index: 10; filter: drop-shadow(0 4px 4px rgba(0,0,0,0.2)); }

        .journey-label { margin-top: 20px; font-size: 14px; font-weight: bold; color: #1a1a1a; letter-spacing: 0.5px; }
        .journey-detail { margin-top: 4px; font-size: 13px; font-family: Georgia, serif; font-weight: 500; }
        
        .orange-text { color: #D85A30; }
        .green-text { color: #1D9E75; }

        /* MOBILE LAYOUT */
        .journey-mobile-wrapper { position: relative; padding-left: 32px; display: block; }
        @media (min-width: 640px) { .journey-mobile-wrapper { display: none; } }
        
        .journey-mobile-line { position: absolute; left: 19px; top: 8px; bottom: 8px; width: 2px; background: #e5e5e5; border-radius: 9999px; }
        .journey-mobile-steps { display: flex; flex-direction: column; gap: 28px; }
        .journey-mobile-step { position: relative; display: flex; align-items: flex-start; gap: 16px; }
        .journey-mobile-bubble { position: relative; width: 44px; height: 44px; border-radius: 50%; border: 2px solid white; display: flex; align-items: center; justify-content: center; flex-shrink: 0; z-index: 10; box-shadow: 0 4px 6px rgba(0,0,0,0.05); }
        .journey-mobile-text { padding-top: 6px; }
        .journey-mobile-label { font-size: 14px; font-weight: bold; color: #1a1a1a; margin: 0; }
        .journey-mobile-detail { font-size: 12px; font-family: Georgia, serif; font-weight: 500; margin-top: 2px; }

        /* ANIMATIONS */
        @keyframes floatUpDown {
          0%, 100% { transform: translateZ(30px) translateY(0px); }
          50% { transform: translateZ(30px) translateY(-10px); }
        }
        @keyframes drawLine {
          to { stroke-dashoffset: 0; }
        }
      `}</style>
    </section>
  );
}

export default JourneySection;