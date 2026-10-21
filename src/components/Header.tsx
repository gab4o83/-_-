import React, { useState, useEffect, useRef } from 'react';
import {
  UserCheck,
  ShieldCheck,
  Sparkles,
  MapPin,
  BookOpen,
  HelpCircle,
  Trophy,
  Map,
  Menu,
  X,
  ChevronDown,
  ArrowUp,
  Check,
  LogIn,
  UserPlus,
  LogOut,
  Phone,
  Shield,
  AlertCircle,
  Flame,
  Award,
  ChevronRight
} from 'lucide-react';
import { VolunteerProfile } from '../types';

interface HeaderProps {
  activeTab: 'map' | 'submit' | 'reports' | 'leaderboard' | 'solved' | 'guide' | 'profile';
  setActiveTab: (tab: 'map' | 'submit' | 'reports' | 'leaderboard' | 'solved' | 'guide' | 'profile') => void;
  userRole: 'citizen' | 'official';
  setUserRole: (role: 'citizen' | 'official') => void;
  reportsCount: number;
  currentVolunteer?: VolunteerProfile | null;
  onOpenRegisterModal?: () => void;
  onOpenLogin?: () => void;
  onOpenSignUp?: () => void;
  onOpenProfile?: () => void;
  onLogout?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  userRole,
  setUserRole,
  reportsCount,
  currentVolunteer,
  onOpenRegisterModal,
  onOpenLogin,
  onOpenSignUp,
  onOpenProfile,
  onLogout
}) => {
  const mainHeaderRef = useRef<HTMLDivElement>(null);
  const menuPanelRef = useRef<HTMLDivElement>(null);

  const [isPastMainHeader, setIsPastMainHeader] = useState(false);
  const [scrollDirection, setScrollDirection] = useState<'up' | 'down'>('down');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [menuPosition, setMenuPosition] = useState<{ top: number; right: number }>({
    top: 88,
    right: 16
  });
  const lastScrollYRef = useRef(0);

  // Close dropdown on click outside or escape key
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;

      // Do nothing if click is inside the popover menu panel
      if (menuPanelRef.current && menuPanelRef.current.contains(target)) {
        return;
      }

      // Do nothing if click is on any element with data-menu-trigger="true"
      if ((event.target as HTMLElement)?.closest('[data-menu-trigger="true"]')) {
        return;
      }

      setIsDropdownOpen(false);
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsDropdownOpen(false);
      }
    };

    if (isDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isDropdownOpen]);

  // Close dropdown on scroll or resize so it doesn't detach
  useEffect(() => {
    if (!isDropdownOpen) return;
    const handleScrollOrResize = () => {
      setIsDropdownOpen(false);
    };
    window.addEventListener('scroll', handleScrollOrResize, { passive: true });
    window.addEventListener('resize', handleScrollOrResize, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScrollOrResize);
      window.removeEventListener('resize', handleScrollOrResize);
    };
  }, [isDropdownOpen]);

  // YouTube-like scroll direction & threshold detection
  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const currentScrollY = window.scrollY;

          // Check if the static main header has scrolled out of viewport
          if (mainHeaderRef.current) {
            const rect = mainHeaderRef.current.getBoundingClientRect();
            setIsPastMainHeader(rect.bottom <= 0);
          } else {
            setIsPastMainHeader(currentScrollY > 100);
          }

          // Direction tracking with 8px threshold to prevent jitter
          const diff = currentScrollY - lastScrollYRef.current;
          if (Math.abs(diff) > 8) {
            if (diff > 0) {
              setScrollDirection('down');
            } else {
              setScrollDirection('up');
            }
            lastScrollYRef.current = currentScrollY;
          }

          // When scrolled back to top
          if (currentScrollY <= 20) {
            setScrollDirection('down');
          }

          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setIsDropdownOpen(false);
  };

  const handleSelectTab = (tab: HeaderProps['activeTab']) => {
    setActiveTab(tab);
    setIsDropdownOpen(false);
  };

  const updateMenuPosition = (triggerEl?: HTMLElement | null) => {
    if (triggerEl) {
      const rect = triggerEl.getBoundingClientRect();
      const top = Math.round(rect.bottom + 8);
      const right = Math.max(12, Math.round(window.innerWidth - rect.right));
      setMenuPosition({ top, right });
      return;
    }
    // Fallback: measure active header
    if (isPastMainHeader) {
      setMenuPosition({ top: 58, right: 16 });
    } else if (mainHeaderRef.current) {
      const rect = mainHeaderRef.current.getBoundingClientRect();
      setMenuPosition({ top: Math.max(80, Math.round(rect.bottom + 8)), right: 16 });
    } else {
      setMenuPosition({ top: 88, right: 16 });
    }
  };

  const toggleMenu = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (!isDropdownOpen) {
      updateMenuPosition(e?.currentTarget as HTMLElement);
      setIsDropdownOpen(true);
    } else {
      setIsDropdownOpen(false);
    }
  };

  const tabOptions = [
    {
      id: 'map' as const,
      label: 'Карта на Враца',
      shortLabel: 'Карта',
      icon: Map,
      description: 'Интерактивна карта с AI сигнали и доброволчески зони',
      color: 'text-emerald-400'
    },
    {
      id: 'submit' as const,
      label: 'Подай сигнал',
      shortLabel: 'Сигнал',
      icon: Sparkles,
      description: 'AI анализ по снимка и автоматичен път към решение',
      color: 'text-emerald-400'
    },
    {
      id: 'reports' as const,
      label: 'Списък със сигнали',
      shortLabel: 'Сигнали',
      icon: AlertCircle,
      badge: reportsCount,
      description: 'Всички активни сигнали, класирани по AI наложителност',
      color: 'text-blue-400'
    },
    {
      id: 'leaderboard' as const,
      label: 'Седмична класация',
      shortLabel: 'Класация',
      icon: Trophy,
      description: 'Доброволци на Враца, седмични точки и значки',
      color: 'text-amber-400'
    },
    {
      id: 'solved' as const,
      label: 'Решени практики',
      shortLabel: 'Архив',
      icon: BookOpen,
      description: 'Завършени ремонти и снимки преди/след',
      color: 'text-cyan-400'
    },
    {
      id: 'guide' as const,
      label: 'Правила и безопасност',
      shortLabel: 'Правила',
      icon: HelpCircle,
      description: 'Наръчник за доброволци и регламент за сигурност',
      color: 'text-slate-300'
    },
    ...(currentVolunteer
      ? [
          {
            id: 'profile' as const,
            label: 'Моят профил',
            shortLabel: 'Профил',
            icon: UserCheck,
            description: 'Личен доброволчески панел, поети задачи и спечелени точки',
            color: 'text-amber-400',
            badge: `${currentVolunteer.weeklyPoints} т.`
          }
        ]
      : [])
  ];

  const currentTabInfo = tabOptions.find((t) => t.id === activeTab) || tabOptions[0];

  return (
    <>
      {/* =========================================================================
          1. MAIN FULL STATIC HEADER (in document flow at the top of the page)
          ========================================================================= */}
      <header
        ref={mainHeaderRef}
        className="relative z-30 bg-slate-900 border-b border-slate-800 w-full"
      >
        {/* Top civic announcement strip */}
        <div className="bg-gradient-to-r from-emerald-950/80 via-slate-900 to-slate-950 px-4 py-1.5 text-xs text-slate-300 border-b border-slate-800">
          <div className="max-w-7xl mx-auto flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block shrink-0 animate-pulse" />
              <span className="font-semibold text-emerald-300">
                Умна Враца • Платформа на ПТГ „Н. Й. Вапцаров“ & Община Враца
              </span>
              <span className="text-slate-500 hidden sm:inline">·</span>
              <span className="text-slate-400 hidden sm:inline">
                Интерактивна карта, AI сортиране по наложителност и седмична класация
              </span>
            </div>
            <div className="flex items-center gap-3 text-slate-300 shrink-0">
              <span className="flex items-center gap-1 text-slate-300">
                <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                <span>Враца, България</span>
              </span>
              <a
                href="tel:092624581"
                className="bg-slate-800 hover:bg-slate-700 px-2 py-0.5 rounded text-[11px] text-amber-300 border border-amber-500/20 font-mono tabular-nums transition-colors"
                title="Обади се на дежурния"
              >
                Дежурен: 092 / 62 45 81
              </a>
            </div>
          </div>
        </div>

        {/* Main Header navigation */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-3 sm:gap-4 flex-wrap">
          {/* Brand & Official Logo */}
          <div
            onClick={() => setActiveTab('map')}
            className="flex items-center gap-3 cursor-pointer group shrink-0"
            title="Умна Враца - Към началната карта"
          >
            <div className="relative w-11 h-11 sm:w-12 sm:h-12 rounded-full overflow-hidden bg-white border-2 border-emerald-400/80 shadow-md shadow-emerald-950/60 p-0.5 shrink-0 group-hover:scale-105 transition-transform duration-300">
              <img
                src="/logo.png"
                alt="Умна Враца - Платформа на ПТГ Н. Й. Вапцаров"
                className="w-full h-full object-contain rounded-full"
                referrerPolicy="no-referrer"
              />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-base sm:text-lg font-black tracking-tight text-white flex items-center gap-1.5">
                  УМНА <span className="text-emerald-400">ВРАЦА</span>
                </h1>
              </div>
              <p className="text-[11px] font-semibold text-slate-300">
                Платформа на ПТГ „Н. Й. Вапцаров“
              </p>
            </div>
          </div>

          {/* Navigation Tabs (desktop and tablets) */}
          <div className="hidden lg:flex items-center gap-1 bg-slate-950/80 p-1 rounded-xl border border-slate-800 text-xs sm:text-sm">
            {tabOptions.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => handleSelectTab(tab.id)}
                  className={`px-3 py-1.5 rounded-lg font-medium transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
                    isActive
                      ? 'bg-emerald-600 text-white shadow-md shadow-emerald-900/40 font-semibold'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-white' : tab.color}`} />
                  <span>{tab.label}</span>
                  {tab.badge !== undefined && (
                    <span className="bg-slate-800 text-emerald-300 px-1.5 py-0.2 rounded-full text-[11px] font-bold font-mono">
                      {tab.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Right side: Login & Sign Up buttons or Volunteer Profile + Role Switcher + Menu Trigger */}
          <div className="flex items-center gap-2">
            {currentVolunteer ? (
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => setActiveTab('profile')}
                  className={`flex items-center gap-2 px-2.5 py-1.5 rounded-xl border text-xs transition-colors cursor-pointer ${
                    activeTab === 'profile'
                      ? 'bg-amber-500/20 text-amber-200 border-amber-400 shadow-md shadow-amber-950/50'
                      : 'bg-slate-950 border-amber-500/30 text-white hover:border-amber-400'
                  }`}
                  title="Отвори моя доброволчески профил и поети задачи"
                >
                  <div className="w-5 h-5 rounded bg-amber-500/20 text-amber-300 flex items-center justify-center font-bold text-[10px]">
                    ★
                  </div>
                  <span className="font-bold text-white">{currentVolunteer.name.split(' ')[0]}</span>
                  <span className="font-mono text-amber-400 font-bold tabular-nums">
                    {currentVolunteer.weeklyPoints} т.
                  </span>
                </button>
                {onLogout && (
                  <button
                    onClick={onLogout}
                    className="p-1.5 text-slate-400 hover:text-red-400 hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
                    title="Изход от профила (Logout)"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-1.5">
                {/* 1. LOGIN BUTTON */}
                <button
                  type="button"
                  onClick={onOpenLogin || onOpenRegisterModal}
                  className="flex items-center gap-1.5 bg-slate-800/90 hover:bg-slate-700 text-slate-200 hover:text-white px-3 py-1.5 rounded-xl text-xs font-semibold border border-slate-700 hover:border-slate-600 transition-all cursor-pointer shadow-sm"
                  title="Вход в съществуващ профил (Login)"
                >
                  <LogIn className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Login</span>
                  <span className="text-[10px] text-slate-400 font-normal hidden sm:inline">(Вход)</span>
                </button>

                {/* 2. SIGN UP BUTTON */}
                <button
                  type="button"
                  onClick={onOpenSignUp || onOpenRegisterModal}
                  className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-500 text-white px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all shadow-md shadow-emerald-950/80 cursor-pointer"
                  title="Регистрация на нов доброволец (Sign Up)"
                >
                  <UserPlus className="w-3.5 h-3.5 text-emerald-100" />
                  <span>Sign Up</span>
                  <span className="text-[10px] text-emerald-200 font-medium hidden sm:inline">(Регистрация)</span>
                </button>
              </div>
            )}

            {/* Role Switcher (hidden on mobile, visible in menu) */}
            <div className="hidden sm:flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800">
              <button
                onClick={() => setUserRole('citizen')}
                className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  userRole === 'citizen'
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <UserCheck className="w-3.5 h-3.5" />
                <span>Гражданин</span>
              </button>
              <button
                onClick={() => setUserRole('official')}
                className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  userRole === 'official'
                    ? 'bg-amber-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Община</span>
              </button>
            </div>

            {/* TOP-RIGHT MENU BUTTON (Always present & accessible!) */}
            <button
              type="button"
              data-menu-trigger="true"
              onClick={toggleMenu}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border transition-all cursor-pointer shadow-sm select-none ${
                isDropdownOpen
                  ? 'bg-emerald-600 text-white border-emerald-500 shadow-md shadow-emerald-950 ring-2 ring-emerald-500/30'
                  : 'bg-slate-800/90 hover:bg-slate-700 text-slate-100 border-slate-700 hover:border-slate-600'
              }`}
              aria-expanded={isDropdownOpen}
              title="Отвори главното меню"
            >
              <Menu className="w-4 h-4 text-emerald-400" />
              <span className="font-semibold">Меню</span>
              <ChevronDown
                className={`w-3.5 h-3.5 transition-transform duration-200 ${
                  isDropdownOpen ? 'rotate-180 text-white' : 'text-slate-400'
                }`}
              />
            </button>
          </div>
        </div>
      </header>

      {/* =========================================================================
          2. SMART FIXED HEADER (YOUTUBE-STYLE EFFECT)
          Visible only after scrolling past the main static header
          ========================================================================= */}
      <div
        className={`fixed top-0 left-0 right-0 z-[1100] bg-slate-900/95 backdrop-blur-md border-b border-slate-800 shadow-xl shadow-black/50 transition-all duration-300 ease-in-out ${
          isPastMainHeader
            ? 'translate-y-0 opacity-100 pointer-events-auto'
            : '-translate-y-full opacity-0 pointer-events-none'
        }`}
      >
        <div className="max-w-7xl mx-auto px-3 sm:px-6">
          {scrollDirection === 'up' ? (
            /* A. When scrolling UP: The full "Доброволци Враца" header */
            <div className="py-2.5 flex items-center justify-between gap-2 sm:gap-4 flex-wrap animate-in fade-in slide-in-from-top-1 duration-200">
              {/* Brand & Logo */}
              <div
                onClick={scrollToTop}
                className="flex items-center gap-2.5 cursor-pointer group shrink-0"
                title="Умна Враца - Към началото"
              >
                <div className="relative w-9 h-9 sm:w-10 sm:h-10 rounded-full overflow-hidden bg-white border-2 border-emerald-400/80 shadow-md p-0.5 shrink-0 group-hover:scale-105 transition-transform duration-200">
                  <img
                    src="/logo.png"
                    alt="Умна Враца"
                    className="w-full h-full object-contain rounded-full"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <h1 className="text-sm sm:text-base font-black tracking-tight text-white flex items-center gap-1">
                      УМНА <span className="text-emerald-400">ВРАЦА</span>
                    </h1>
                  </div>
                  <p className="text-[10px] font-semibold text-slate-300 hidden sm:block">
                    ПТГ „Н. Й. Вапцаров“
                  </p>
                </div>
              </div>

              {/* Navigation Tabs (desktop and tablets) */}
              <div className="hidden md:flex items-center gap-1 bg-slate-950/90 p-1 rounded-xl border border-slate-800 text-xs overflow-x-auto max-w-full">
                {tabOptions.map((tab) => {
                  const Icon = tab.icon;
                  const isActive = activeTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => handleSelectTab(tab.id)}
                      className={`px-2.5 py-1.5 rounded-lg font-medium transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
                        isActive
                          ? 'bg-emerald-600 text-white shadow-sm font-semibold'
                          : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                      }`}
                    >
                      <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-white' : tab.color}`} />
                      <span>{tab.shortLabel}</span>
                      {tab.badge !== undefined && (
                        <span className="bg-slate-800 text-emerald-300 px-1 py-0.2 rounded-full text-[10px] font-bold font-mono">
                          {tab.badge}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Right side actions & Top-Right Menu Trigger */}
              <div className="flex items-center gap-2">
                {currentVolunteer ? (
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => setActiveTab('profile')}
                      className={`flex items-center gap-1.5 px-2 py-1 rounded-xl border text-xs transition-colors cursor-pointer ${
                        activeTab === 'profile'
                          ? 'bg-amber-500/20 text-amber-200 border-amber-400'
                          : 'bg-slate-950 border-amber-500/30 text-amber-300 hover:border-amber-400'
                      }`}
                      title="Моят профил"
                    >
                      <span className="font-bold text-white text-xs">{currentVolunteer.name.split(' ')[0]}</span>
                      <span className="font-mono text-amber-400 font-bold tabular-nums text-xs">
                        {currentVolunteer.weeklyPoints} т.
                      </span>
                    </button>
                    {onLogout && (
                      <button
                        onClick={onLogout}
                        className="p-1 text-slate-400 hover:text-red-400 hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
                        title="Изход (Logout)"
                      >
                        <LogOut className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                ) : (
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={onOpenLogin || onOpenRegisterModal}
                      className="flex items-center gap-1 bg-slate-800 hover:bg-slate-700 text-slate-200 px-2.5 py-1 rounded-lg text-xs font-semibold border border-slate-700 transition-all cursor-pointer"
                      title="Вход (Login)"
                    >
                      <LogIn className="w-3 h-3 text-emerald-400" />
                      <span>Login</span>
                    </button>
                    <button
                      type="button"
                      onClick={onOpenSignUp || onOpenRegisterModal}
                      className="flex items-center gap-1 bg-emerald-600 hover:bg-emerald-500 text-white px-2.5 py-1 rounded-lg text-xs font-bold transition-all shadow-sm cursor-pointer"
                      title="Регистрация (Sign Up)"
                    >
                      <UserPlus className="w-3 h-3 text-emerald-100" />
                      <span>Sign Up</span>
                    </button>
                  </div>
                )}

                {/* Top-Right Menu Button on Scroll-Up */}
                <button
                  type="button"
                  data-menu-trigger="true"
                  onClick={toggleMenu}
                  className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-bold border transition-all cursor-pointer shadow-sm ${
                    isDropdownOpen
                      ? 'bg-emerald-600 text-white border-emerald-500 shadow-md shadow-emerald-950 ring-2 ring-emerald-500/20'
                      : 'bg-slate-800/90 hover:bg-slate-700 text-slate-100 border-slate-700'
                  }`}
                  aria-expanded={isDropdownOpen}
                  title="Отвори меню"
                >
                  <Menu className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="hidden sm:inline">Меню</span>
                  <ChevronDown
                    className={`w-3 h-3 transition-transform duration-200 ${
                      isDropdownOpen ? 'rotate-180 text-white' : 'text-slate-400'
                    }`}
                  />
                </button>
              </div>
            </div>
          ) : (
            /* B. When scrolling DOWN: Compact header "Умна Враца" with Drop-Down Menu */
            <div className="py-2 flex items-center justify-between gap-3 animate-in fade-in duration-200">
              {/* Left: Brand title "Умна Враца" */}
              <div
                onClick={scrollToTop}
                className="group flex items-center gap-2 py-1 px-2.5 -ml-1 rounded-xl hover:bg-slate-800/60 transition-colors cursor-pointer select-none"
                title="Умна Враца - Към началото на страницата"
              >
                <div className="w-7 h-7 rounded-full overflow-hidden bg-white border border-emerald-400/80 p-0.5 shrink-0 group-hover:scale-105 transition-transform duration-200 shadow-sm">
                  <img
                    src="/logo.png"
                    alt="Умна Враца"
                    className="w-full h-full object-contain rounded-full"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <h1 className="text-base sm:text-lg font-black tracking-wider text-white group-hover:text-emerald-400 transition-colors">
                  Умна <span className="text-emerald-400">Враца</span>
                </h1>
              </div>

              {/* Center / Right: Active Section + Top-Right Menu Button */}
              <div className="flex items-center gap-2">
                {/* Active Tab Quick Badge */}
                <div className="hidden sm:flex items-center gap-1.5 text-xs text-slate-400 bg-slate-950/60 px-2.5 py-1 rounded-lg border border-slate-800">
                  <span className="text-slate-500">Секция:</span>
                  <span className="font-semibold text-emerald-300 flex items-center gap-1">
                    <currentTabInfo.icon className="w-3 h-3" />
                    {currentTabInfo.label}
                  </span>
                </div>

                {/* Top-Right Menu Button */}
                <button
                  type="button"
                  data-menu-trigger="true"
                  onClick={toggleMenu}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs sm:text-sm font-semibold border transition-all cursor-pointer shadow-sm ${
                    isDropdownOpen
                      ? 'bg-emerald-600 text-white border-emerald-500 shadow-emerald-950/60 ring-2 ring-emerald-500/20'
                      : 'bg-slate-800/90 hover:bg-slate-700/90 text-slate-100 border-slate-700 hover:border-slate-600'
                  }`}
                  aria-expanded={isDropdownOpen}
                  title="Отвори меню за навигация"
                >
                  <Menu className="w-4 h-4 text-emerald-400" />
                  <span className="font-medium">Меню</span>
                  <ChevronDown
                    className={`w-3.5 h-3.5 transition-transform duration-200 ${
                      isDropdownOpen ? 'rotate-180 text-white' : 'text-slate-400'
                    }`}
                  />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* =========================================================================
          3. TOP-RIGHT DROPDOWN MENU PANEL
          Anchor-positioned right below the active menu button with auto-scroll bounds!
          ========================================================================= */}
      {isDropdownOpen && (
        <>
          {/* Subtle click-outside backdrop */}
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs z-[1190] animate-in fade-in duration-150"
            onClick={() => setIsDropdownOpen(false)}
          />

          {/* Menu Popover Panel in Top-Right Corner */}
          <div
            ref={menuPanelRef}
            className="fixed w-[calc(100vw-1.5rem)] sm:w-[24rem] overflow-y-auto bg-slate-900/98 backdrop-blur-2xl border border-slate-700/90 rounded-2xl sm:rounded-3xl shadow-2xl shadow-black/95 p-3.5 sm:p-4 z-[1200] animate-in fade-in zoom-in-95 duration-150 ring-1 ring-white/10"
            style={{
              top: `${menuPosition.top}px`,
              right: `${menuPosition.right}px`,
              maxHeight: `calc(100vh - ${menuPosition.top + 16}px)`,
              overscrollBehavior: 'contain'
            }}
          >
            {/* Header inside dropdown */}
            <div className="pb-3 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-white border border-emerald-400 p-0.5 overflow-hidden shrink-0 shadow-sm">
                  <img src="/logo.png" alt="Умна Враца" className="w-full h-full object-contain rounded-full" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-sm font-black text-white">УМНА ВРАЦА</span>
                  </div>
                  <span className="text-[11px] text-emerald-400 font-semibold block -mt-0.5">
                    Главно навигационно меню
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsDropdownOpen(false)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
                title="Затвори менюто"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Navigation Options */}
            <div className="py-2.5 space-y-1">
              <div className="px-2 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center justify-between">
                <span>Основни раздели</span>
                <span className="text-slate-500 font-mono text-[9px]">{tabOptions.length} секции</span>
              </div>
              {tabOptions.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => handleSelectTab(tab.id)}
                    className={`w-full flex items-center justify-between p-2.5 rounded-xl text-left transition-all cursor-pointer group ${
                      isActive
                        ? 'bg-emerald-600/20 text-white font-semibold border border-emerald-500/40 shadow-sm'
                        : 'text-slate-300 hover:bg-slate-800/80 hover:text-white border border-transparent'
                    }`}
                  >
                    <div className="flex items-start gap-2.5 min-w-0">
                      <div
                        className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 mt-0.5 transition-colors ${
                          isActive
                            ? 'bg-emerald-500 text-slate-950 font-bold'
                            : 'bg-slate-800 text-slate-300 group-hover:bg-slate-700 group-hover:text-emerald-300'
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                      </div>
                      <div className="min-w-0">
                        <div className="text-xs sm:text-sm font-semibold flex items-center gap-1.5">
                          <span className={isActive ? 'text-emerald-300' : 'text-slate-200'}>{tab.label}</span>
                          {tab.badge !== undefined && (
                            <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-1.5 py-0.2 rounded-full text-[10px] font-mono font-bold">
                              {tab.badge}
                            </span>
                          )}
                        </div>
                        {tab.description && (
                          <p className="text-[10px] text-slate-400 truncate mt-0.5">
                            {tab.description}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="shrink-0 ml-2">
                      {isActive ? (
                        <Check className="w-4 h-4 text-emerald-400" />
                      ) : (
                        <ChevronRight className="w-3.5 h-3.5 text-slate-600 group-hover:text-slate-400 group-hover:translate-x-0.5 transition-all" />
                      )}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Role Switcher in Dropdown */}
            <div className="pt-2.5 border-t border-slate-800 px-1">
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5 flex items-center justify-between">
                <span>Преглед на платформата като</span>
                <span className="text-[10px] text-slate-500 font-normal">Роля</span>
              </div>
              <div className="grid grid-cols-2 gap-1.5 bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
                <button
                  type="button"
                  onClick={() => {
                    setUserRole('citizen');
                  }}
                  className={`flex items-center justify-center gap-1.5 py-2 rounded-lg font-semibold transition-all cursor-pointer ${
                    userRole === 'citizen'
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <UserCheck className="w-3.5 h-3.5" />
                  <span>Гражданин</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setUserRole('official');
                  }}
                  className={`flex items-center justify-center gap-1.5 py-2 rounded-lg font-semibold transition-all cursor-pointer ${
                    userRole === 'official'
                      ? 'bg-amber-600 text-white shadow-sm'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Община</span>
                </button>
              </div>
            </div>

            {/* Volunteer Auth / Profile Section */}
            <div className="mt-3 pt-2.5 border-t border-slate-800 space-y-2 px-1">
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center justify-between">
                <span>Доброволчески профил</span>
                {currentVolunteer && (
                  <span className="text-amber-400 font-mono text-[10px] font-bold">
                    {currentVolunteer.weeklyPoints} т.
                  </span>
                )}
              </div>
              {currentVolunteer ? (
                <div className="space-y-2">
                  <div className="p-2.5 rounded-xl bg-slate-950/80 border border-amber-500/30 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-300 flex items-center justify-center font-bold text-sm">
                        ★
                      </div>
                      <div>
                        <div className="text-xs font-bold text-white">{currentVolunteer.name}</div>
                        <div className="text-[10px] text-slate-400">
                          {currentVolunteer.rank} • {currentVolunteer.neighborhood || 'Враца'}
                        </div>
                      </div>
                    </div>
                    <span className="font-mono font-bold text-amber-400 tabular-nums text-xs">
                      {currentVolunteer.weeklyPoints} т.
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-1.5">
                    <button
                      type="button"
                      onClick={() => {
                        setIsDropdownOpen(false);
                        handleSelectTab('profile');
                      }}
                      className="flex items-center justify-center gap-1.5 py-2 px-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold transition-colors border border-slate-700 cursor-pointer"
                    >
                      <Award className="w-3.5 h-3.5 text-amber-400" />
                      <span>Моят профил</span>
                    </button>
                    {onLogout && (
                      <button
                        type="button"
                        onClick={() => {
                          setIsDropdownOpen(false);
                          onLogout();
                        }}
                        className="flex items-center justify-center gap-1.5 py-2 px-2 text-xs font-semibold text-red-400 hover:text-red-300 hover:bg-red-950/40 rounded-xl transition-colors border border-red-500/20 cursor-pointer"
                      >
                        <LogOut className="w-3.5 h-3.5" />
                        <span>Изход</span>
                      </button>
                    )}
                  </div>
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setIsDropdownOpen(false);
                        if (onOpenLogin) onOpenLogin();
                        else onOpenRegisterModal?.();
                      }}
                      className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-100 text-xs font-bold transition-colors border border-slate-700 cursor-pointer shadow-sm"
                    >
                      <LogIn className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Login (Вход)</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setIsDropdownOpen(false);
                        if (onOpenSignUp) onOpenSignUp();
                        else onOpenRegisterModal?.();
                      }}
                      className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-colors shadow-md shadow-emerald-950 cursor-pointer"
                    >
                      <UserPlus className="w-3.5 h-3.5 text-emerald-100" />
                      <span>Sign Up (+50 т.)</span>
                    </button>
                  </div>
                  <div className="p-2 rounded-xl bg-slate-950/60 border border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
                    <span>Тестов вход:</span>
                    <button
                      type="button"
                      onClick={() => {
                        setIsDropdownOpen(false);
                        if (onOpenLogin) onOpenLogin();
                      }}
                      className="text-emerald-400 hover:underline font-semibold cursor-pointer"
                    >
                      Демо акаунти (1 клик)
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Quick Contacts & Scroll to Top */}
            <div className="mt-3 pt-2.5 border-t border-slate-800 space-y-1 text-xs">
              <div className="flex items-center justify-between text-[11px] text-slate-400 px-1 py-1">
                <span className="flex items-center gap-1.5">
                  <Phone className="w-3 h-3 text-emerald-400" />
                  Дежурен по Община:
                </span>
                <a href="tel:092624581" className="text-amber-300 font-mono font-semibold hover:underline">
                  092 / 62 45 81
                </a>
              </div>
              <button
                type="button"
                onClick={scrollToTop}
                className="w-full flex items-center justify-center gap-1.5 py-2 text-xs text-slate-400 hover:text-emerald-300 hover:bg-slate-800/60 rounded-xl transition-colors cursor-pointer"
              >
                <ArrowUp className="w-3.5 h-3.5" />
                <span>Към началото на страницата</span>
              </button>
            </div>
          </div>
        </>
      )}
    </>
  );
};
