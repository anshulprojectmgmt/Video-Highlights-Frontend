
import React, { useCallback, useState } from 'react';
import { Upload, FileVideo, Play } from 'lucide-react';

interface FileUploadProps {
  onFileSelect: (file: File) => void;
  heygenApiKey: string;
  avatarId: string;
  onHeygenApiKeyChange: (key: string) => void;
  onAvatarIdChange: (id: string) => void;
  isProcessing?: boolean;
}

export const FileUpload: React.FC<FileUploadProps> = ({ 
  onFileSelect, 
  heygenApiKey, 
  avatarId, 
  onHeygenApiKeyChange, 
  onAvatarIdChange,
  isProcessing = false
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDragIn = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.dataTransfer.items && e.dataTransfer.items.length > 0) {
      setIsDragging(true);
    }
  }, []);

  const handleDragOut = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      if (file.type.startsWith('video/')) {
        setSelectedFile(file);
      }
    }
  }, []);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setSelectedFile(file);
    }
  }, []);

  const handleProcessVideo = useCallback(() => {
    if (selectedFile && heygenApiKey) {
      onFileSelect(selectedFile);
    }
  }, [selectedFile, heygenApiKey, onFileSelect]);

  const isFormValid = selectedFile && heygenApiKey;

  return (
    <div className="w-full max-w-2xl mx-auto space-y-6">
      {/* File Upload Section */}
      <div
        className={`relative border-2 border-dashed rounded-lg p-12 transition-all duration-200 ${
          isDragging
            ? 'border-blue-500 bg-blue-500/10'
            : 'border-gray-600 hover:border-gray-500 bg-gray-800/50'
        }`}
        onDragEnter={handleDragIn}
        onDragLeave={handleDragOut}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          type="file"
          id="file-upload"
          className="hidden"
          accept="video/*"
          onChange={handleFileInput}
        />
        <label
          htmlFor="file-upload"
          className="flex flex-col items-center justify-center cursor-pointer"
        >
          {selectedFile ? (
            <FileVideo className="w-16 h-16 text-green-500 mb-4" />
          ) : (
            <Upload className="w-16 h-16 text-gray-400 mb-4" />
          )}
          <p className="text-xl font-semibold text-gray-200 mb-2">
            {selectedFile ? selectedFile.name : 'Drop your video file here'}
          </p>
          <p className="text-sm text-gray-400 mb-4">
            or click to browse
          </p>
          <p className="text-xs text-gray-500">
            Supported formats: MP4, MOV, AVI, WebM
          </p>
        </label>
      </div>

      {/* Heygen API Key Input */}
      <div className="bg-gray-800 rounded-lg p-6">
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Heygen API Key *
        </label>
        <input
          type="password"
          required
          value={heygenApiKey}
          onChange={(e) => onHeygenApiKeyChange(e.target.value)}
          className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Enter your Heygen API key"
        />
        <p className="text-xs text-gray-400 mt-2">
          Required for video generation. Get it from your Heygen dashboard.
        </p>
      </div>

      {/* Avatar ID Input */}
      <div className="bg-gray-800 rounded-lg p-6">
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Avatar ID (Optional)
        </label>
        <input
          type="text"
          value={avatarId}
          onChange={(e) => onAvatarIdChange(e.target.value)}
          className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Enter your Avatar ID (optional)"
        />
        <p className="text-xs text-gray-400 mt-2">
          Optional. If not provided, default avatar will be used.
        </p>
      </div>

      {/* Process Video Button */}
      <div className="flex justify-center">
        <button
          onClick={handleProcessVideo}
          disabled={!isFormValid || isProcessing}
          className={`flex items-center gap-2 px-8 py-4 rounded-lg font-semibold transition-all ${
            isFormValid && !isProcessing
              ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg transform hover:scale-105'
              : 'bg-gray-700 text-gray-400 cursor-not-allowed'
          }`}
        >
          <Play className="w-5 h-5" />
          {isProcessing ? 'Processing Video...' : 'Process Video'}
        </button>
      </div>

      {/* Validation Message */}
      {!isFormValid && (
        <div className="text-center text-yellow-400 text-sm">
          {!selectedFile && "Please select a video file"}
          {selectedFile && !heygenApiKey && "Please enter your Heygen API key"}
        </div>
      )}
    </div>
  );
};
