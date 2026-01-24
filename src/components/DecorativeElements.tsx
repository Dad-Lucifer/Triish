import { motion } from "framer-motion";

export const FloralDivider = () => (
  <div className="flex items-center justify-center gap-4 py-8">
    <div className="h-px w-16 sm:w-24 bg-gradient-to-r from-transparent to-champagne-dark" />
    <motion.span
      animate={{ rotate: [0, 10, -10, 0] }}
      transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
      className="text-2xl"
    >
      🌹
    </motion.span>
    <div className="h-px w-16 sm:w-24 bg-gradient-to-l from-transparent to-champagne-dark" />
  </div>
);

export const SectionTitle = ({ 
  title, 
  subtitle 
}: { 
  title: string; 
  subtitle?: string;
}) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.6 }}
    className="text-center mb-8"
  >
    <h2 className="font-display text-3xl sm:text-4xl text-primary mb-2">{title}</h2>
    {subtitle && (
      <p className="text-muted-foreground text-elegant text-lg">{subtitle}</p>
    )}
  </motion.div>
);

export const HeartPattern = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-5">
    <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <pattern id="hearts" x="0" y="0" width="60" height="60" patternUnits="userSpaceOnUse">
          <text x="30" y="35" textAnchor="middle" fontSize="20" fill="currentColor">♥</text>
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#hearts)" />
    </svg>
  </div>
);
