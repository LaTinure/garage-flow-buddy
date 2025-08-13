import React from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '@/contexts/ThemeContext';

interface AnimatedLogoProps {
  size?: number;
  className?: string;
}

const AnimatedLogo: React.FC<AnimatedLogoProps> = ({ size = 60, className = '' }) => {
  const { isDark } = useTheme();
  const primary = isDark ? '#25D366' : '#128C7E';
  const secondary = isDark ? '#DCF8C6' : '#ffffff';

  return (
    <div
      aria-label="Logo animé Garage"
      role="img"
      className={className}
      style={{ width: size, height: size }}
    >
      <motion.svg
        width={size}
        height={size}
        viewBox="0 0 64 64"
        initial={{ scale: 0.9, rotate: -5, opacity: 0.9 }}
        animate={{ scale: 1, rotate: 0, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 260, damping: 18 }}
      >
        <defs>
          <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={primary} />
            <stop offset="100%" stopColor={secondary} />
          </linearGradient>
        </defs>
        {/* Cercle de fond */}
        <motion.circle
          cx="32"
          cy="32"
          r="28"
          fill="url(#grad)"
          stroke={primary}
          strokeWidth="2"
          animate={{ rotate: [0, 6, 0] }}
          transition={{ repeat: Infinity, duration: 6, ease: 'easeInOut' }}
        />
        {/* Clé à molette */}
        <motion.path
          d="M20 34 l8 -8 a4 4 0 1 1 5 5 l-8 8 l-6 2 z"
          fill={secondary}
          stroke={primary}
          strokeWidth="2"
          initial={{ rotate: -20 }}
          animate={{ rotate: 0 }}
          transition={{ delay: 0.2, type: 'spring', stiffness: 200, damping: 16 }}
        />
        {/* Voiture simplifiée */}
        <motion.rect x="30" y="28" width="20" height="10" rx="3" fill={secondary} stroke={primary} strokeWidth="2" />
        <motion.circle cx="34" cy="40" r="3" fill={primary} />
        <motion.circle cx="48" cy="40" r="3" fill={primary} />
      </motion.svg>
    </div>
  );
};

export default AnimatedLogo;