import { useNavigate } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext";

function Footer() {
  const navigate = useNavigate();
  const { t } = useLanguage();

  return (
    <footer className="relative bg-[#FFFBF7] border-t border-black/5 pt-16 pb-8 px-6 overflow-hidden">
      <div
        className="absolute inset-0 dot-grid opacity-50"
        style={{ maskImage: "radial-gradient(ellipse 60% 100% at 0% 0%, black 20%, transparent 80%)" }}
      />

      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-10 mb-12 relative z-10">
        <div>
          <button onClick={() => navigate("/")} className="font-display text-2xl font-semibold">
            <span className="text-brand-500">budge</span>
            <span className="text-ink">travel</span>
          </button>
          <p className="text-sm text-ink-muted mt-3 leading-relaxed max-w-xs">
            {t("footerTagline")}
          </p>
        </div>

        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-brand-600 mb-4">
            {t("footerExplore")}
          </p>
          <div className="flex flex-col gap-2.5 text-sm text-ink-soft">
            <button onClick={() => navigate("/homes")} className="text-left hover:text-ink transition-colors">
              {t("navHomes")}
            </button>
            <button onClick={() => navigate("/crafts")} className="text-left hover:text-ink transition-colors">
              {t("navCrafts")}
            </button>
            <button onClick={() => navigate("/cafes")} className="text-left hover:text-ink transition-colors">
              {t("navCafes")}
            </button>
          </div>
        </div>

        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-brand-600 mb-4">
            {t("footerCommunity")}
          </p>
          <div className="flex flex-col gap-2.5 text-sm text-ink-soft">
            <button onClick={() => navigate("/become-host")} className="text-left hover:text-ink transition-colors">
              {t("becomeHost")}
            </button>
            <button onClick={() => navigate("/activity")} className="text-left hover:text-ink transition-colors">
              {t("myActivity")}
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto pt-6 border-t border-black/8 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-ink-muted relative z-10">
        <span>© {new Date().getFullYear()} budgetravel. {t("footerRights")}</span>
        <span>{t("footerMadeWith")}</span>
      </div>
    </footer>
  );
}

export default Footer;