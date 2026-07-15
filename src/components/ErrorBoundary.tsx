import React from 'react';
import { ErrorBoundary as ReactErrorBoundary, type FallbackProps } from 'react-error-boundary';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import { motion } from 'framer-motion';

const ErrorFallback: React.FC<FallbackProps> = ({ error, resetErrorBoundary }) => {
  const message = error instanceof Error ? error.message : String(error);

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-effect rounded-lg p-6 max-w-md w-full"
      >
        <div className="flex items-center gap-3 mb-4">
          <AlertTriangle size={24} className="text-red-400" />
          <h2 className="text-xl font-semibold text-white">Something went wrong</h2>
        </div>
        
        <pre className="bg-dark/50 rounded-lg p-4 text-sm text-red-400 font-mono mb-4 overflow-auto">
          {message}
        </pre>
        
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={resetErrorBoundary}
          className="w-full bg-primary text-white rounded-lg py-2 px-4 flex items-center justify-center gap-2"
        >
          <RefreshCw size={16} />
          Try again
        </motion.button>
      </motion.div>
    </div>
  );
};

export const ErrorBoundary: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <ReactErrorBoundary
      FallbackComponent={ErrorFallback}
      onReset={() => {
        window.location.reload();
      }}
    >
      {children}
    </ReactErrorBoundary>
  );
};