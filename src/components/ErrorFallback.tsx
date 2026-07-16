import React from 'react';
import { AlertTriangle, RefreshCw, ArrowLeft } from 'lucide-react';

interface ErrorFallbackProps {
  message: string;
  onRetry: () => void;
  onReset: () => void;
}

export const ErrorFallback: React.FC<ErrorFallbackProps> = ({ message, onRetry, onReset }) => {
  return (
    <div className="card error-card glass animate-scale-in text-center">
      <div className="error-icon-wrapper">
        <AlertTriangle className="error-icon text-danger" size={48} />
      </div>
      
      <h2>Something went wrong</h2>
      
      <p className="error-message-text">
        {message || "The AI model encountered an error, or the network timed out."}
      </p>

      <div className="error-actions">
        <button onClick={onRetry} className="btn btn-primary">
          <RefreshCw size={16} />
          <span>Retry Request</span>
        </button>

        <button onClick={onReset} className="btn btn-secondary">
          <ArrowLeft size={16} />
          <span>Edit Study Notes</span>
        </button>
      </div>

      <div className="error-footer-hint">
        <p>
          Tip: If the error persists, you can try running in <strong>Mock AI Mode</strong> by temporarily disconnecting the API key, or double check your <code>GEMINI_API_KEY</code> setup.
        </p>
      </div>
    </div>
  );
};
