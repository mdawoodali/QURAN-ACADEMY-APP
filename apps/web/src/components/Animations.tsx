"use client";

import { motion } from "framer-motion";

export const FadeIn = ({ children, delay = 0, className = "" }: { children: React.ReactNode, delay?: number, className?: string }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay, ease: [0.25, 0.25, 0, 1] }}
    className={className}
  >
    {children}
  </motion.div>
);

export const StaggerContainer = ({ children, className = "" }: { children: React.ReactNode, className?: string }) => (
  <motion.div
    initial="hidden"
    animate="visible"
    variants={{
      hidden: { opacity: 0 },
      visible: {
        opacity: 1,
        transition: {
          staggerChildren: 0.1
        }
      }
    }}
    className={className}
  >
    {children}
  </motion.div>
);

export const StaggerItem = ({ children, className = "" }: { children: React.ReactNode, className?: string }) => (
  <motion.div
    variants={{
      hidden: { opacity: 0, y: 20 },
      visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.25, 0.25, 0, 1] } }
    }}
    className={className}
  >
    {children}
  </motion.div>
);

export const ScaleIn = ({ children, delay = 0, className = "" }: { children: React.ReactNode, delay?: number, className?: string }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.95 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ duration: 0.5, delay, ease: [0.25, 0.25, 0, 1] }}
    className={className}
  >
    {children}
  </motion.div>
);
