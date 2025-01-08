import React from 'react';
import { AlertTriangle } from 'lucide-react';
import { motion } from 'framer-motion';

interface Props {
  children: React.ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

class ErrorBoundary extends React.Component<Props, State> {
  public state: State = {
    hasError: false
  };

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <motion.div
              animate={{ 
                rotate: [0, -10, 10, -10, 0],
                transition: { repeat: Infinity, duration: 2 }
              }}
            >
              <AlertTriangle className="h-16 w-16 text-red-500 mx-auto mb-4" />
            </motion.div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Oops! Something went wrong
            </h1>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              {this.state.error?.message || "An unexpected error occurred"}
            </p>
            <button 
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Try Again
            </button>
          </motion.div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
