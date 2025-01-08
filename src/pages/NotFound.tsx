import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Compass, Stars, Moon, Sun } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

const NotFound = () => {
  const navigate = useNavigate();
  const { theme } = useTheme();

  const starVariants = {
    animate: {
      scale: [1, 1.2, 1],
      opacity: [0.5, 1, 0.5],
      transition: {
        duration: 2,
        repeat: Infinity,
        repeatType: "reverse"
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-blue-50 to-indigo-50 dark:from-gray-900 dark:to-blue-950 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            variants={starVariants}
            animate="animate"
            custom={i}
            className="absolute"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
          >
            <Stars 
              className="h-4 w-4 text-indigo-300 dark:text-blue-400" 
              style={{ 
                animationDelay: `${Math.random() * 2}s`,
                opacity: Math.random() * 0.5 + 0.5
              }} 
            />
          </motion.div>
        ))}
      </div>

      <div className="relative z-10">
        <div className="text-center">
          {/* Theme indicator */}
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="absolute top-0 right-0 mt-4 mr-4"
          >
            {theme === 'dark' ? (
              <Moon className="h-6 w-6 text-yellow-300" />
            ) : (
              <Sun className="h-6 w-6 text-amber-500" />
            )}
          </motion.div>

          {/* Main 404 animation */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 260, damping: 20 }}
            className="relative"
          >
            <motion.div
              animate={{ 
                rotate: 360,
                transition: { duration: 8, repeat: Infinity, ease: "linear" }
              }}
              className="relative"
            >
              <Compass className="h-40 w-40 text-indigo-500 dark:text-blue-400 mx-auto filter drop-shadow-lg" />
              <motion.div
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.3, 0.6, 0.3],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  repeatType: "reverse"
                }}
                className="absolute inset-0 bg-indigo-300 dark:bg-blue-600 rounded-full filter blur-xl opacity-20"
              />
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
              className="absolute inset-0 flex items-center justify-center"
            >
              <span className="text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-blue-400 dark:to-purple-400">
                404
              </span>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mt-12"
          >
            <h1 className="text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-indigo-700 to-indigo-900 dark:from-white dark:to-gray-300">
              Lost in Space?
            </h1>
            <p className="text-xl text-indigo-900/70 dark:text-gray-300 mb-8 max-w-md mx-auto">
              The page you're looking for has drifted into a black hole. Let's get you back on track!
            </p>
            <motion.button
              whileHover={{ 
                scale: 1.05,
                boxShadow: "0 0 20px rgba(79, 70, 229, 0.4)"
              }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/')}
              className="px-8 py-4 bg-gradient-to-r from-indigo-600 to-indigo-700 dark:from-blue-500 dark:to-blue-600 text-white rounded-lg font-medium text-lg shadow-lg hover:shadow-xl transition-all duration-300"
            >
              Return to Earth
            </motion.button>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
