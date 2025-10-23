import React from 'react';
import { Loader2, CheckCircle, XCircle, RefreshCw } from 'lucide-react';

interface VideoProcessorProps {
  isProcessing: boolean;
  error: string | null;
  onRetry: () => void;
  stage: 'processing' | 'generating';
}

export const VideoProcessor: React.FC<VideoProcessorProps> = ({
  isProcessing,
  error,
  onRetry,
  stage,
}) => {
  const message = stage === 'processing' 
    ? 'Processing your video...' 
    : 'Generating final video...';

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="bg-gray-800 rounded-lg p-8 shadow-xl">
        <div className="flex flex-col items-center justify-center space-y-6">
          {isProcessing && !error && (
            <>
              <Loader2 className="w-16 h-16 text-blue-500 animate-spin" />
              <p className="text-xl font-semibold text-gray-200">{message}</p>
              <p className="text-sm text-gray-400">
                This may take a few moments...
              </p>
            </>
          )}

          {!isProcessing && !error && (
            <>
              <CheckCircle className="w-16 h-16 text-green-500" />
              <p className="text-xl font-semibold text-gray-200">
                {stage === 'processing' ? 'Processing Complete!' : 'Video Generated!'}
              </p>
            </>
          )}

          {error && (
            <>
              <XCircle className="w-16 h-16 text-red-500" />
              <p className="text-xl font-semibold text-red-400">Error</p>
              <p className="text-sm text-gray-300 text-center max-w-md">
                {error}
              </p>
              <button
                onClick={onRetry}
                className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
              >
                <RefreshCw className="w-4 h-4" />
                Retry
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
