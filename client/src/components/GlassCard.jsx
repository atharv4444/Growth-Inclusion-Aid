import { motion } from 'framer-motion';

export default function GlassCard({
  children,
  className = '',
  hover = true,
  glow = '',
  delay = 0,
  onClick,
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay, ease: [0.22, 1, 0.36, 1] }}
      whileHover={hover ? {
        y: -10,
        scale: 1.02,
        borderColor: 'rgba(255,255,255,0.18)',
        boxShadow: glow === 'cyan'
          ? '0 0 30px rgba(6,214,160,0.25), 0 0 80px rgba(6,214,160,0.08)'
          : glow === 'blue'
          ? '0 0 30px rgba(76,201,240,0.25), 0 0 80px rgba(76,201,240,0.08)'
          : glow === 'purple'
          ? '0 0 30px rgba(123,104,238,0.25), 0 0 80px rgba(123,104,238,0.08)'
          : glow === 'red'
          ? '0 0 30px rgba(239,68,68,0.3), 0 0 80px rgba(239,68,68,0.1)'
          : glow === 'amber'
          ? '0 0 30px rgba(244,162,97,0.25), 0 0 80px rgba(244,162,97,0.08)'
          : '0 0 30px rgba(255,255,255,0.08), 0 20px 40px rgba(0,0,0,0.3)',
        transition: { duration: 0.3, ease: 'easeOut' }
      } : {}}
      whileTap={onClick ? { scale: 0.98 } : {}}
      onClick={onClick}
      className={`glass-elevated ${glow ? `glow-${glow}` : ''} ${className}`}
      style={{ cursor: onClick ? 'pointer' : 'default' }}
    >
      {children}
    </motion.div>
  );
}
