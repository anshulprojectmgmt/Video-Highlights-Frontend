export interface ApiResponse {
  message: string;
  spreadsheetId: string;
  spreadsheetUrl: string;
}

export interface UploadState {
  stage: 'upload' | 'processing' | 'editing' | 'generating' | 'complete';
  selectedFile: File | null;
  isProcessing: boolean;
  isGenerating: boolean;
  error: string | null;
  apiResponse: any | null;
  downloadUrl: string | null;
  heygenApiKey: string;
  avatarId: string;
  voiceId: string; // Add this
}
