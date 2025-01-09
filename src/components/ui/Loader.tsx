import React from 'react';
import { motion } from 'framer-motion';
import { Boxes } from 'lucide-react';
import { cn } from '../../utils/cn';

interface LoaderProps {
  variant?: 'primary' | 'light';
  state?: 'initial' | 'processing' | 'success' | 'error';
  text?: string;
  className?: string;
}

export const Loader = ({ 
  variant = 'primary',
  state = 'initial',
  text,
  className 
}: LoaderProps) => {
  const variants = {
    primary: {
      icon: "text-blue-600 dark:text-blue-400",
      text: "text-gray-600 dark:text-gray-300",
      glow: "bg-blue-400/30 dark:bg-blue-600/30"
    },
    light: {
      icon: "text-white",
      text: "text-white/90",
      glow: "bg-white/30"
    }
  };

  const stateConfig = {
    initial: {
      duration: 2,
      text: text || "Loading...",
    },
    processing: {
      duration: 1.5,
      text: text || "Processing...",
    },
    success: {
      duration: 1,
      text: text || "Complete!",
    },
    error: {
      duration: 1,
      text: text || "Error occurred",
    }
  };

  return (
    <div className={cn('flex flex-col items-center gap-3', className)}>
      <motion.div
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative"
      >
        <motion.div
          animate={{ 
            rotate: state !== 'success' ? 360 : 0,
            scale: [1, 1.1, 1],
          }}
          transition={{
            rotate: { 
              duration: stateConfig[state].duration, 
              repeat: state === 'initial' || state === 'processing' ? Infinity : 0, 
              ease: "linear" 
            },
            scale: { 
              duration: 1, 
              repeat: state === 'initial' || state === 'processing' ? Infinity : 0, 
              repeatType: "reverse" 
            }
          }}
          className="relative"
        >
          <Boxes className={cn(
            "h-8 w-8",
            variants[variant].icon,
            state === 'error' && "text-red-500"
          )} />
        </motion.div>
        
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{
            duration: 2,
            repeat: state === 'initial' || state === 'processing' ? Infinity : 0,
            repeatType: "reverse"
          }}
          className={cn(
            "absolute inset-0 rounded-full filter blur-lg",
            variants[variant].glow,
            state === 'error' && "bg-red-400/30 dark:bg-red-600/30"
          )}
        />
      </motion.div>

      <motion.p
        initial={{ opacity: 0, y: 5 }}
        animate={{ opacity: 1, y: 0 }}
        className={cn(
          "text-sm font-medium",
          variants[variant].text,
          state === 'error' && "text-red-500 dark:text-red-400"
        )}
      >
        {stateConfig[state].text}
      </motion.p>
    </div>
  );
};
