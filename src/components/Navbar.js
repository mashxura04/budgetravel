import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { Home, Gift, Coffee, Sparkles, LogOut, ChevronDown, BookMarked, Shield, Menu as MenuIcon, X } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useLanguage } from "../context/LanguageContext";
import LanguageSwitcher from "./LanguageSwitcher";

const AVATAR_COLORS = [
  "from-orange-400 to-orange-600",
  "from-rose-400 to-rose-600",
  "from-violet-400 to-violet-600",
  "from-sky-400 to-sky-600",
  "from-emerald-400 to-emerald-600",
];

function avatarColorFor(email) {
  const hash = [...email].reduce((sum, ch) => sum + ch.charCodeAt(0), 0);
  return AVATAR_COLORS[hash % AVATAR_COLORS.length];
}

function displayNameFor(email) {
  const handle = email.split("@")[0];
  return handle.charAt(0).toUpperCase() + handle.slice(1);
}

function Navbar() {
  const navigate = useNavigate();
  const { user, signOut, openSignIn, isAdmin } = useAuth();
  const { t } = useLanguage();
  const [menuOpen, setMenuOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const TABS = [
    { label: t("navHomes"), path: "/homes", icon: Home },
    { label: t("navCrafts"), path: "/crafts", icon: Gift },
    { label: t("navCafes"), path: "/cafes", icon: Coffee },
    { label: "AI Guide", path: "/ai-guide", icon: Sparkles },
  ];

  const handleSignOut = async () => {
    await signOut();
    setMenuOpen(false);
    setMobileOpen(false);
    navigate("/");
  };

  const goTo = (path) => {
    navigate(path);
    setMenuOpen(false);
    setMobileOpen(false);
  };

  const initial = user?.email?.charAt(0).toUpperCase() ?? "?";
  const gradient = user ? avatarColorFor(user.email) : "";
  const name = user ? displayNameFor(user.email) : "";

  return (
    <header className="sticky top-0 z-50 bg-[#FFFBF7]/90 backdrop-blur-md border-b border-black/[0.06]">
      <div className="max-w-7xl mx-auto px-6 h-24 flex items-center justify-between gap-4">
        <button
          onClick={() => navigate("/")}
          className="font-display text-[26px] font-semibold shrink-0 tracking-tight"
        >
          <span className="text-brand-500">budge</span>
          <span className="text-ink">travel</span>
        </button>

        <nav className="hidden md:flex items-center gap-1.5 bg-white rounded-full p-1.5 border border-black/[0.06] shadow-[0_1px_2px_rgba(0,0,0,0.04)]">
          {TABS.map(({ label, path, icon: Icon }) => (
            <NavLink
              key={path}
              to={path}
              className={({ isActive }) =>
                `flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-200 ${
                  isActive
                    ? "bg-gradient-to-br from-brand-500 to-brand-600 text-white shadow-brand-glow"
                    : "text-ink-soft hover:bg-neutral-50"
                }`
              }
            >
              <Icon size={16} strokeWidth={2.25} />
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="relative flex items-center gap-2.5 shrink-0">
          <div className="hidden lg:block">
            <LanguageSwitcher />
          </div>

          <button
            onClick={() => navigate("/become-host")}
            className="hidden sm:block px-4 py-2.5 rounded-full text-sm font-semibold text-ink hover:bg-white transition-colors"
          >
            {t("becomeHost")}
          </button>

          {!user ? (
            <button
              onClick={openSignIn}
              className="hidden md:block px-5 py-2.5 rounded-full text-sm font-semibold text-white bg-gradient-to-br from-brand-500 to-brand-600 shadow-brand-glow hover:brightness-105 transition-all"
            >
              {t("logIn")}
            </button>
          ) : (
            <div className="hidden md:block relative">
              <button
                onClick={() => setMenuOpen((prev) => !prev)}
                className="flex items-center gap-2 pl-1.5 pr-2.5 py-1.5 rounded-full border border-black/[0.08] hover:shadow-card transition-shadow bg-white"
              >
                <span
                  className={`w-8 h-8 rounded-full bg-gradient-to-br ${gradient} text-white text-sm font-bold flex items-center justify-center shrink-0`}
                >
                  {initial}
                </span>
                <ChevronDown
                  size={14}
                  className={`text-ink-muted transition-transform duration-200 ${menuOpen ? "rotate-180" : ""}`}
                />
              </button>

              <AnimatePresence>
                {menuOpen && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setMenuOpen(false)} />
                    <motion.div
                      initial={{ opacity: 0, y: -8, scale: 0.97 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -8, scale: 0.97 }}
                      transition={{ duration: 0.15, ease: [0.2, 0.8, 0.2, 1] }}
                      className="absolute top-full right-0 mt-2 w-72 bg-white border border-black/[0.08] rounded-2xl shadow-soft overflow-hidden z-50"
                    >
                      <div className="flex items-center gap-3 px-4 py-4 bg-gradient-to-br from-neutral-50 to-white">
                        <span
                          className={`w-11 h-11 rounded-full bg-gradient-to-br ${gradient} text-white text-base font-bold flex items-center justify-center shrink-0`}
                        >
                          {initial}
                        </span>
                        <div className="min-w-0">
                          <p className="font-display font-semibold text-ink text-[15px] truncate">
                            Hey, {name}
                          </p>
                          <p className="text-xs text-ink-muted truncate">{user.email}</p>
                        </div>
                      </div>
                      <div className="h-px bg-black/[0.08]" />
                      <div className="p-2">
                        {isAdmin ? (
                          <button
                            onClick={() => goTo("/admin")}
                            className="w-full flex items-center gap-3 text-left px-3 py-2.5 rounded-xl text-sm font-semibold text-ink hover:bg-neutral-50 transition-colors"
                          >
                            <Shield size={16} className="text-ink-muted" />
                            Admin Panel
                          </button>
                        ) : (
                          <button
                            onClick={() => goTo("/activity")}
                            className="w-full flex items-center gap-3 text-left px-3 py-2.5 rounded-xl text-sm font-semibold text-ink hover:bg-neutral-50 transition-colors"
                          >
                            <BookMarked size={16} className="text-ink-muted" />
                            {t("myActivity")}
                          </button>
                        )}
                        <button
                          onClick={handleSignOut}
                          className="w-full flex items-center gap-3 text-left px-3 py-2.5 rounded-xl text-sm font-semibold text-ink hover:bg-neutral-50 transition-colors"
                        >
                          <LogOut size={16} className="text-ink-muted" />
                          {t("signOut")}
                        </button>
                      </div>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>
          )}

          <button
            onClick={() => setMobileOpen((prev) => !prev)}
            className="md:hidden w-11 h-11 rounded-full border border-black/[0.08] flex items-center justify-center bg-white"
            aria-label="Menu"
          >
            {mobileOpen ? <X size={20} /> : <MenuIcon size={20} />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: [0.2, 0.8, 0.2, 1] }}
            className="md:hidden overflow-hidden border-t border-black/[0.06] bg-[#FFFBF7]"
          >
            <div className="px-6 py-4 space-y-1">
              <div className="flex justify-center pb-2">
                <LanguageSwitcher />
              </div>

              {TABS.map(({ label, path, icon: Icon }) => (
                <NavLink
                  key={path}
                  to={path}
                  onClick={() => setMobileOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-colors ${
                      isActive
                        ? "bg-gradient-to-br from-brand-500 to-brand-600 text-white"
                        : "text-ink-soft hover:bg-white"
                    }`
                  }
                >
                  <Icon size={18} strokeWidth={2.25} />
                  {label}
                </NavLink>
              ))}

              <div className="h-px bg-black/[0.08] my-2" />

              <button
                onClick={() => goTo("/become-host")}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-ink-soft hover:bg-white transition-colors"
              >
                {t("becomeHost")}
              </button>

              {!user ? (
                <button
                  onClick={() => {
                    openSignIn();
                    setMobileOpen(false);
                  }}
                  className="w-full mt-1 px-4 py-3 rounded-full text-sm font-semibold text-white bg-gradient-to-br from-brand-500 to-brand-600 text-center"
                >
                  {t("logIn")}
                </button>
              ) : (
                <>
                  <div className="flex items-center gap-3 px-4 py-3">
                    <span
                      className={`w-9 h-9 rounded-full bg-gradient-to-br ${gradient} text-white text-sm font-bold flex items-center justify-center shrink-0`}
                    >
                      {initial}
                    </span>
                    <p className="text-sm font-semibold text-ink truncate">{name}</p>
                  </div>
                  {isAdmin ? (
                    <button
                      onClick={() => goTo("/admin")}
                      className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-ink-soft hover:bg-white transition-colors"
                    >
                      <Shield size={16} />
                      Admin Panel
                    </button>
                  ) : (
                    <button
                      onClick={() => goTo("/activity")}
                      className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-ink-soft hover:bg-white transition-colors"
                    >
                      <BookMarked size={16} />
                      {t("myActivity")}
                    </button>
                  )}
                  <button
                    onClick={handleSignOut}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-ink-soft hover:bg-white transition-colors"
                  >
                    <LogOut size={16} />
                    {t("signOut")}
                  </button>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

export default Navbar;