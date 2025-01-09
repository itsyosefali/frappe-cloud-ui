import React, { useState, useEffect } from 'react';
import { Loader } from './ui/Loader';

const LoaderDemo = () => {
  const [demoState, setDemoState] = useState<'initial' | 'processing' | 'success' | 'error'>('initial');

  useEffect(() => {
    const sequence = async () => {
      await new Promise(resolve => setTimeout(resolve, 2000)); // Initial loading
      setDemoState('processing');
      await new Promise(resolve => setTimeout(resolve, 2000)); // Processing
      setDemoState('success');
      await new Promise(resolve => setTimeout(resolve, 2000)); // Success
      setDemoState('error');
      await new Promise(resolve => setTimeout(resolve, 2000)); // Error
      setDemoState('initial'); // Reset
    };

    sequence();
    const interval = setInterval(sequence, 8000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-8">
      <div className="max-w-2xl mx-auto space-y-12">
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-8">Loading States</h2>
        
        {/* Loading States */}
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Default Theme */}
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6">
              <div className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-4">Default Theme</div>
              <div className="flex items-center justify-center">
                <Loader state={demoState} />
              </div>
            </div>

            {/* Light Theme */}
            <div className="bg-blue-600 rounded-lg p-6">
              <div className="text-sm font-medium text-white/90 mb-4">Light Theme</div>
              <div className="flex items-center justify-center">
                <Loader variant="light" state={demoState} />
              </div>
            </div>

            {/* Custom Messages */}
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6">
              <div className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-4">Custom Messages</div>
              <div className="flex items-center justify-center">
                <Loader 
                  state={demoState}
                  text={
                    demoState === 'initial' ? 'Fetching data...' :
                    demoState === 'processing' ? 'Analyzing results...' :
                    demoState === 'success' ? 'Data retrieved!' :
                    'Failed to fetch data'
                  }
                />
              </div>
            </div>

            {/* Persistent State */}
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6">
              <div className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-4">Error State</div>
              <div className="flex items-center justify-center">
                <Loader state="error" text="Failed to connect to server" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoaderDemo;
