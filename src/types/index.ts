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
  apiResponse: ApiResponse | null;
  downloadUrl: string | null;
}
