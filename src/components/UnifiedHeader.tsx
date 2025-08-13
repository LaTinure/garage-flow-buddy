import React, { useEffect, useMemo, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useTheme } from '@/contexts/ThemeContext';
import NotificationCenter from './NotificationCenter';
import UserMenu from './UserMenu';
import styles from './UnifiedHeader.module.css';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiHome,
  FiUsers,
  FiSettings,
  FiTool,
  FiTruck,
  FiBox,
  FiBell,
  FiSun,
  FiMoon,
  FiMenu,
  FiX,
  FiChevronDown,
  FiChevronLeft,
} from 'react-icons/fi';
import { Button } from '@/components/ui/button';

interface UnifiedHeaderProps {
  showUserMenu?: boolean;
  showThemeToggle?: boolean;
}

interface NavItem {
  name: string;
  path?: string;
  icon?: keyof typeof ICONS;
  children?: { name: string; path: string }[];
}

const ICONS = {
  home: FiHome,
  clients: FiUsers,
  vehicules: FiTruck,
  reparations: FiTool,
  stock: FiBox,
  settings: FiSettings,
  bell: FiBell,
  sun: FiSun,
  moon: FiMoon,
  menu: FiMenu,
  close: FiX,
  back: FiChevronLeft,
  chevrondown: FiChevronDown,
};

const NAV_ITEMS: NavItem[] = [
  { name: 'Tableau de bord', path: '/dashboard', icon: 'home' },
  {
    name: 'Clients',
    icon: 'clients',
    children: [
      { name: 'Liste des clients', path: '/clients/liste' },
      { name: 'Ajouter un client', path: '/clients/ajouter' },
      { name: 'Historique', path: '/clients/historique' },
    ],
  },
  { name: 'Véhicules', path: '/vehicules', icon: 'vehicules' },
  { name: 'Réparations', path: '/reparations', icon: 'reparations' },
  { name: 'Stock', path: '/stock', icon: 'stock' },
];

const spring = { type: 'spring', stiffness: 400, damping: 30 } as const;

const itemVariants = {
  initial: { opacity: 0, y: -6 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.2 } },
} as const;

const underlineVariants = {
  initial: { width: 0, opacity: 0 },
  animate: { width: '100%', opacity: 1, transition: { duration: 0.25 } },
} as const;

const menuVariants = {
  hidden: { opacity: 0, y: -10, pointerEvents: 'none' as const },
  visible: { opacity: 1, y: 0, pointerEvents: 'auto' as const, transition: { duration: 0.2 } },
} as const;

const UnifiedHeader: React.FC<UnifiedHeaderProps> = ({
  showUserMenu = true,
  showThemeToggle = true,
}) => {
  const { isDark, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [unreadNotifications, setUnreadNotifications] = useState(0);
  const [isMobile, setIsMobile] = useState<boolean>(window.innerWidth < 768);
  const [garageName, setGarageName] = useState<string>('Garage Abidjan');
  const [navError, setNavError] = useState<string | null>(null);
  const [notifLoading, setNotifLoading] = useState(false);

  // Smart viewport detection
  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth < 768);
    const media = window.matchMedia('(max-width: 767px)');
    const mediaListener = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    window.addEventListener('resize', onResize);
    media.addEventListener('change', mediaListener);
    return () => {
      window.removeEventListener('resize', onResize);
      media.removeEventListener('change', mediaListener);
    };
  }, []);

  // Load garage data safely
  useEffect(() => {
    try {
      const stored = localStorage.getItem('garageData');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed?.name) setGarageName(parsed.name);
      }
    } catch {
      /* ignore */
    }
  }, []);

  // Notifications count with loading state
  useEffect(() => {
    setNotifLoading(true);
    try {
      const raw = localStorage.getItem('notifications');
      if (raw) {
        const notifications = JSON.parse(raw) as { read?: boolean }[];
        setUnreadNotifications(notifications.filter((n) => !n.read).length);
      } else {
        setUnreadNotifications(0);
      }
    } catch {
      setUnreadNotifications(0);
    } finally {
      setNotifLoading(false);
    }
  }, [isNotificationOpen]);

  // Body class lock for mobile menu
  useEffect(() => {
    if (isMobileMenuOpen) document.body.classList.add('menu-open');
    else document.body.classList.remove('menu-open');
    return () => document.body.classList.remove('menu-open');
  }, [isMobileMenuOpen]);

  const isActive = (path?: string) => (path ? location.pathname === path : false);

  const handleBack = () => {
    if (window.history.length > 1) {
      navigate(-1);
      return;
    }
    if (location.pathname !== '/') navigate('/', { replace: true });
  };

  const ActiveUnderline: React.FC<{ active: boolean }> = ({ active }) => (
    <AnimatePresence>
      {active && (
        <motion.div
          className={styles.activeUnderline}
          initial="initial"
          animate="animate"
          exit="initial"
          variants={underlineVariants}
          layoutId="nav-underline"
        />
      )}
    </AnimatePresence>
  );

  const IconFor = (key?: keyof typeof ICONS) => {
    if (!key) return null;
    const Cmp = ICONS[key];
    return <Cmp aria-hidden className={styles.navIcon} />;
  };

  // Ripple effect utility
  const withRipple = (e: React.MouseEvent<HTMLElement>) => {
    const target = e.currentTarget as HTMLElement;
    const ripple = document.createElement('span');
    ripple.className = styles.ripple;
    const rect = target.getBoundingClientRect();
    ripple.style.left = `${e.clientX - rect.left}px`;
    ripple.style.top = `${e.clientY - rect.top}px`;
    target.appendChild(ripple);
    setTimeout(() => ripple.remove(), 600);
  };

  const headerClass = useMemo(() => `${styles.header} ${isDark ? styles.dark : styles.light}`, [isDark]);

  return (
    <motion.header className={headerClass} initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={spring}>
      <div className={styles.inner}>
        {/* Left: Back + Brand */}
        <div className={styles.leftSection}>
          <button
            type="button"
            aria-label="Retour"
            onClick={(e) => {
              withRipple(e);
              handleBack();
            }}
            className={styles.iconButton}
          >
            <ICONS.back />
          </button>

          <div className={styles.brand} aria-label={garageName} role="heading" aria-level={1}>
            <motion.div className={styles.brandMark} whileHover={{ scale: 1.05 }} transition={spring} />
            <div className={styles.brandText}>
              <span className={styles.brandTitle}>{garageName}</span>
              <span className={styles.brandSubtitle}>Excellence Automobile</span>
            </div>
          </div>
        </div>

        {/* Center: Navigation */}
        <nav className={styles.nav} aria-label="Navigation principale">
          <ErrorBoundary onError={(msg) => setNavError(msg)}>
            <ul className={styles.navList} role="menubar">
              {NAV_ITEMS.map((item) => (
                <li key={item.name} role="none" className={styles.navItemWrapper}>
                  {item.path ? (
                    <motion.div variants={itemVariants} initial="initial" animate="animate" whileHover={{ scale: 1.05 }}>
                      <Link
                        to={item.path}
                        role="menuitem"
                        aria-current={isActive(item.path) ? 'page' : undefined}
                        className={`${styles.navItem} ${isActive(item.path) ? styles.active : ''}`}
                        onClick={withRipple}
                      >
                        {IconFor(item.icon)}
                        <span className={styles.navLabel}>{item.name}</span>
                        <ActiveUnderline active={isActive(item.path)} />
                      </Link>
                    </motion.div>
                  ) : (
                    <div className={styles.navDropdown}>
                      <button className={styles.navItem} aria-haspopup="true" aria-expanded="false">
                        {IconFor(item.icon)}
                        <span className={styles.navLabel}>{item.name}</span>
                        <ICONS.chevrondown className={styles.chevron} />
                      </button>
                      <motion.ul className={styles.dropdownMenu} variants={menuVariants} initial="hidden" whileHover="visible">
                        {item.children?.map((child) => (
                          <li key={child.path} role="none">
                            <Link
                              to={child.path}
                              role="menuitem"
                              className={`${styles.dropdownItem} ${isActive(child.path) ? styles.activeDropdown : ''}`}
                              onClick={withRipple}
                            >
                              {child.name}
                            </Link>
                          </li>
                        ))}
                      </motion.ul>
                    </div>
                  )}
                </li>
              ))}
            </ul>
          </ErrorBoundary>
          {navError && <span className={styles.navError} role="alert">{navError}</span>}
        </nav>

        {/* Right: Controls */}
        <div className={styles.rightSection}>
          {/* Notifications */}
          <div className={styles.badgeWrapper}>
            <button
              type="button"
              aria-label="Notifications"
              onClick={() => setIsNotificationOpen(true)}
              className={styles.iconButton}
            >
              <ICONS.bell />
              {!notifLoading && unreadNotifications > 0 && (
                <span className={styles.badge} aria-label={`${unreadNotifications} notifications non lues`}>{
                  unreadNotifications > 99 ? '99+' : unreadNotifications
                }</span>
              )}
            </button>
          </div>

          {/* Theme toggle */}
          {showThemeToggle && (
            <button
              type="button"
              aria-label="Changer de thème"
              onClick={(e) => {
                withRipple(e);
                toggleTheme();
              }}
              className={styles.iconButton}
            >
              {isDark ? <ICONS.sun /> : <ICONS.moon />}
            </button>
          )}

          {/* User menu */}
          {showUserMenu ? (
            <UserMenu />
          ) : (
            <Button variant="ghost" size="sm" className={styles.skeletonBtn} aria-disabled>
              Chargement...
            </Button>
          )}
        </div>

        {/* FAB for mobile */}
        <motion.button
          type="button"
          aria-label={isMobileMenuOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
          className={`${styles.fab} ${isMobile ? styles.fabVisible : styles.fabHidden}`}
          onClick={() => setIsMobileMenuOpen((v) => !v)}
          whileTap={{ scale: 0.95 }}
          animate={isMobileMenuOpen ? { rotate: 180, scale: 1.05 } : { rotate: 0, scale: 1 }}
          transition={spring}
        >
          {isMobileMenuOpen ? <ICONS.close /> : <ICONS.menu />}
        </motion.button>
      </div>

      {/* Mobile sheet/menu */}
      <AnimatePresence>
        {isMobile && isMobileMenuOpen && (
          <motion.div
            className={styles.mobileSheet}
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ type: 'spring', stiffness: 300, damping: 26 }}
          >
            <ul className={styles.mobileList} role="menu">
              {NAV_ITEMS.map((item) => (
                <li key={item.name} role="none">
                  {item.path ? (
                    <Link
                      to={item.path}
                      role="menuitem"
                      className={`${styles.mobileItem} ${isActive(item.path) ? styles.active : ''}`}
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      {IconFor(item.icon)}
                      <span>{item.name}</span>
                    </Link>
                  ) : (
                    <div className={styles.mobileGroup}>
                      <div className={styles.mobileGroupTitle}>
                        {IconFor(item.icon)}
                        <span>{item.name}</span>
                      </div>
                      <ul className={styles.mobileSubList}>
                        {item.children?.map((child) => (
                          <li key={child.path}>
                            <Link
                              to={child.path}
                              role="menuitem"
                              className={`${styles.mobileSubItem} ${isActive(child.path) ? styles.active : ''}`}
                              onClick={() => setIsMobileMenuOpen(false)}
                            >
                              {child.name}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Notification Center */}
      <NotificationCenter isOpen={isNotificationOpen} onClose={() => setIsNotificationOpen(false)} />
    </motion.header>
  );
};

class ErrorBoundary extends React.Component<{ onError?: (message: string) => void; children: React.ReactNode }, { hasError: boolean }>{
  constructor(props: any) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  componentDidCatch(error: Error) {
    this.props.onError?.(error.message);
  }
  render() {
    if (this.state.hasError) {
      return (
        <div role="alert" className={styles.navError}>
          Une erreur est survenue dans la navigation.
        </div>
      );
    }
    return this.props.children as any;
  }
}

export default React.memo(UnifiedHeader);
