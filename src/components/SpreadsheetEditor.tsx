import React from 'react';
import { ExternalLink, ArrowRight } from 'lucide-react';

interface SpreadsheetEditorProps {
  spreadsheetUrl: string;
  onContinue: () => void;
}

export const SpreadsheetEditor: React.FC<SpreadsheetEditorProps> = ({
  spreadsheetUrl,
  onContinue,
}) => {
  return (
    <div className="w-full max-w-6xl mx-auto">
      <div className="bg-gray-800 rounded-lg p-6 shadow-xl">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-100">Edit Your Highlights</h2>
          <a
            href={spreadsheetUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg text-sm font-medium transition-colors"
          >
            <ExternalLink className="w-4 h-4" />
            Open in New Tab
          </a>
        </div>

        <div className="bg-white rounded-lg overflow-hidden" style={{ height: '600px' }}>
          <iframe
            src={spreadsheetUrl}
            className="w-full h-full border-0"
            title="Google Sheets Editor"
          />
        </div>

        <div className="mt-6 flex justify-end">
          <button
            onClick={onContinue}
            className="flex items-center gap-2 px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-colors shadow-lg"
          >
            Continue to Generate Video
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};
