// import React, { useState, useCallback } from 'react';
// import { FileUpload } from './components/FileUpload';
// import { VideoProcessor } from './components/VideoProcessor';
// import { SpreadsheetEditor } from './components/SpreadsheetEditor';
// import { Download, ArrowLeft } from 'lucide-react';
// import { UploadState } from './types';

// const API_PROCESS_URL = 'http://localhost:5678/webhook-test/bdef75c6-0881-4a7b-b3e8-1ed19306512c';
// const API_GENERATE_URL = 'http://localhost:5678/webhook-test/c00db252-0e0e-484c-94dd-c3f405825c10';

// function App() {
//   const [state, setState] = useState<UploadState>({
//     stage: 'upload',
//     selectedFile: null,
//     isProcessing: false,
//     isGenerating: false,
//     error: null,
//     apiResponse: null,
//     downloadUrl: null,
//   });

//   const processVideo = useCallback(async (file: File) => {
//     setState(prev => ({
//       ...prev,
//       isProcessing: true,
//       error: null,
//       stage: 'processing',
//     }));

//     try {
//       const formData = new FormData();
//       formData.append('video', file);

//       const response = await fetch(API_PROCESS_URL, {
//         method: 'POST',
//         body: formData,
//       });

//       if (!response.ok) {
//         throw new Error(`Failed to process video: ${response.statusText}`);
//       }

//       const data = await response.json();

//       setState(prev => ({
//         ...prev,
//         isProcessing: false,
//         apiResponse: data,
//         stage: 'editing',
//       }));
//     } catch (error) {
//       setState(prev => ({
//         ...prev,
//         isProcessing: false,
//         error: error instanceof Error ? error.message : 'Failed to process video',
//       }));
//     }
//   }, []);

//   const generateVideo = useCallback(async () => {
//     if (!state.apiResponse) return;
  
//     setState(prev => ({ ...prev, isGenerating: true, stage: 'generating', error: null }));
  
//     try {
//       const response = await fetch(API_GENERATE_URL, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({
//           spreadsheetId: state.apiResponse.spreadsheetId,
//           spreadsheetUrl: state.apiResponse.spreadsheetUrl,
//         }),
//       });
  
//       if (!response.ok) {
//         const errorText = await response.text().catch(() => response.statusText);
//         throw new Error(`Server error: ${response.status} - ${errorText}`);
//       }
  
//       // METHOD 1: Try to get response as text first (avoids automatic JSON parsing)
//       const responseClone = response.clone(); // Clone response for multiple reads
//       const responseText = await responseClone.text().catch(() => null);
      
//       // Check if it's JSON
//       if (responseText && responseText.trim().startsWith('{')) {
//         try {
//           const data = JSON.parse(responseText);
//           setState(prev => ({
//             ...prev,
//             isGenerating: false,
//             stage: 'complete',
//             downloadUrl: data.downloadUrl || data.videoUrl || data.url || '#',
//           }));
//           return;
//         } catch (e) {
//           // Not valid JSON, continue to binary handling
//           console.log('Response is not valid JSON, treating as binary');
//         }
//       }
  
//       // METHOD 2: Handle as binary data (direct video)
//       const blob = await response.blob();
      
//       // Check if blob is actually JSON disguised as blob
//       if (blob.type.includes('application/json')) {
//         const jsonText = await blob.text();
//         const data = JSON.parse(jsonText);
//         setState(prev => ({
//           ...prev,
//           isGenerating: false,
//           stage: 'complete',
//           downloadUrl: data.downloadUrl || data.videoUrl || data.url || '#',
//         }));
//       } else {
//         // It's actually a video file
//         const downloadUrl = window.URL.createObjectURL(blob);
//         setState(prev => ({
//           ...prev,
//           isGenerating: false,
//           stage: 'complete',
//           downloadUrl: downloadUrl,
//         }));
//       }
  
//     } catch (error) {
//       console.error('Generate video error:', error);
//       setState(prev => ({
//         ...prev,
//         isGenerating: false,
//         stage: 'editing',
//         error: error instanceof Error ? error.message : 'Failed to generate video',
//       }));
//     }
//   }, [state.apiResponse]);

//   const handleFileSelect = useCallback((file: File) => {
//     setState(prev => ({
//       ...prev,
//       selectedFile: file,
//     }));
//     processVideo(file);
//   }, [processVideo]);

//   const handleRetry = useCallback(() => {
//     if (state.stage === 'processing' && state.selectedFile) {
//       processVideo(state.selectedFile);
//     } else if (state.stage === 'generating') {
//       generateVideo();
//     }
//   }, [state.stage, state.selectedFile, processVideo, generateVideo]);

//   const handleReset = useCallback(() => {
//     setState({
//       stage: 'upload',
//       selectedFile: null,
//       isProcessing: false,
//       isGenerating: false,
//       error: null,
//       apiResponse: null,
//       downloadUrl: null,
//     });
//   }, []);

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
//       <div className="container mx-auto px-4 py-8">
//         <header className="text-center mb-12">
//           <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
//             Video Highlight Generator
//           </h1>
//           <p className="text-gray-400 text-lg">
//             Upload your video, edit highlights, and generate your final video
//           </p>
//         </header>

//         <div className="mb-8">
//           <div className="flex items-center justify-center gap-2 md:gap-4">
//             {['Upload', 'Processing', 'Editing', 'Generating', 'Complete'].map((step, index) => {
//               const stageNames: UploadState['stage'][] = ['upload', 'processing', 'editing', 'generating', 'complete'];
//               const currentIndex = stageNames.indexOf(state.stage);
//               const isActive = index === currentIndex;
//               const isCompleted = index < currentIndex;

//               return (
//                 <React.Fragment key={step}>
//                   <div className="flex flex-col items-center">
//                     <div
//                       className={`w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center font-semibold transition-all ${
//                         isActive
//                           ? 'bg-blue-600 text-white scale-110'
//                           : isCompleted
//                           ? 'bg-green-600 text-white'
//                           : 'bg-gray-700 text-gray-400'
//                       }`}
//                     >
//                       {index + 1}
//                     </div>
//                     <span className={`text-xs md:text-sm mt-2 ${
//                       isActive ? 'text-blue-400 font-semibold' : 'text-gray-500'
//                     }`}>
//                       {step}
//                     </span>
//                   </div>
//                   {index < 4 && (
//                     <div
//                       className={`h-1 w-8 md:w-16 rounded transition-all ${
//                         isCompleted ? 'bg-green-600' : 'bg-gray-700'
//                       }`}
//                     />
//                   )}
//                 </React.Fragment>
//               );
//             })}
//           </div>
//         </div>

//         <main className="min-h-[500px] flex items-center justify-center">
//           {state.stage === 'upload' && (
//             <FileUpload onFileSelect={handleFileSelect} />
//           )}

//           {state.stage === 'processing' && (
//             <VideoProcessor
//               isProcessing={state.isProcessing}
//               error={state.error}
//               onRetry={handleRetry}
//               stage="processing"
//             />
//           )}

//           {state.stage === 'editing' && state.apiResponse && (
//             <SpreadsheetEditor
//               spreadsheetUrl={state.apiResponse.spreadsheetUrl}
//               onContinue={generateVideo}
//             />
//           )}

//           {state.stage === 'generating' && (
//             <VideoProcessor
//               isProcessing={state.isGenerating}
//               error={state.error}
//               onRetry={handleRetry}
//               stage="generating"
//             />
//           )}

//           {state.stage === 'complete' && state.downloadUrl && (
//             <div className="w-full max-w-2xl mx-auto">
//               <div className="bg-gray-800 rounded-lg p-8 shadow-xl text-center">
//                 <div className="mb-6">
//                   <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
//                     <Download className="w-10 h-10 text-white" />
//                   </div>
//                   <h2 className="text-3xl font-bold text-white mb-2">
//                     Your Video is Ready!
//                   </h2>
//                   <p className="text-gray-400">
//                     Click the button below to download your highlight video
//                   </p>
//                 </div>

//                 <div className="space-y-4">
//                   <a
//                     href={state.downloadUrl}
//                     download
//                     className="inline-flex items-center gap-2 px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-colors shadow-lg"
//                   >
//                     <Download className="w-5 h-5" />
//                     Download Video
//                   </a>

//                   <div>
//                     <button
//                       onClick={handleReset}
//                       className="inline-flex items-center gap-2 px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg font-medium transition-colors"
//                     >
//                       <ArrowLeft className="w-4 h-4" />
//                       Create Another Video
//                     </button>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           )}
//         </main>
//       </div>
//     </div>
//   );
// }

// export default App;


import React, { useState, useCallback } from 'react';
import { FileUpload } from './components/FileUpload';
import { VideoProcessor } from './components/VideoProcessor';
import { SpreadsheetEditor } from './components/SpreadsheetEditor';
import { Download, ArrowLeft } from 'lucide-react';
import { UploadState } from './types';

// Replace these hardcoded URLs:
const API_PROCESS_URL = 'http://43.205.125.175:5678/webhook/bdef75c6-0881-4a7b-b3e8-1ed19306512c';
const API_GENERATE_URL = 'http://43.205.125.175:5678/webhook/c00db252-0e0e-484c-94dd-c3f405825c10';

// Add this right after the URL declarations:
console.log('🔧 Environment URLs:', {
  processUrl: import.meta.env.VITE_API_PROCESS_URL,
  generateUrl: import.meta.env.VITE_API_GENERATE_URL,
  usingProcessUrl: API_PROCESS_URL,
  usingGenerateUrl: API_GENERATE_URL
});

function App() {
  const [state, setState] = useState<UploadState>({
    stage: 'upload',
    selectedFile: null,
    isProcessing: false,
    isGenerating: false,
    error: null,
    apiResponse: null,
    downloadUrl: null,
  });

  const processVideo = useCallback(async (file: File) => {
    setState(prev => ({
      ...prev,
      isProcessing: true,
      error: null,
      stage: 'processing',
    }));

    try {
      const formData = new FormData();
      formData.append('video', file);

      console.log('🔄 PROCESSING: Sending video to:', API_PROCESS_URL);

      const response = await fetch(API_PROCESS_URL, {
        method: 'POST',
        body: formData,
      });

      console.log('📨 PROCESSING: Response status:', response.status);
      console.log('📨 PROCESSING: Response ok:', response.ok);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ PROCESSING: Error response:', errorText);
        throw new Error(`Failed to process video: ${response.statusText}`);
      }

      const data = await response.json();
      console.log('✅ PROCESSING: Success response:', data);

      setState(prev => ({
        ...prev,
        isProcessing: false,
        apiResponse: data,
        stage: 'editing',
      }));
    } catch (error) {
      console.error('❌ PROCESSING: Catch error:', error);
      setState(prev => ({
        ...prev,
        isProcessing: false,
        error: error instanceof Error ? error.message : 'Failed to process video',
      }));
    }
  }, []);

  const generateVideo = useCallback(async () => {
    if (!state.apiResponse) return;
  
    setState(prev => ({ ...prev, isGenerating: true, stage: 'generating', error: null }));
  
    try {
      console.log('🔄 GENERATING: Sending request to:', API_GENERATE_URL);
      console.log('🔄 GENERATING: Spreadsheet ID:', state.apiResponse.spreadsheetId);
      console.log('🔄 GENERATING: Spreadsheet URL:', state.apiResponse.spreadsheetUrl);
  
      const response = await fetch(API_GENERATE_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          spreadsheetId: state.apiResponse.spreadsheetId,
          spreadsheetUrl: state.apiResponse.spreadsheetUrl,
        }),
      });
  
      console.log('📨 GENERATING: Response status:', response.status);
      console.log('📨 GENERATING: Response ok:', response.ok);
      console.log('📨 GENERATING: Response headers:', Object.fromEntries(response.headers.entries()));
      console.log('📨 GENERATING: Response type:', response.type);
  
      if (!response.ok) {
        const errorText = await response.text().catch(() => response.statusText);
        console.error('❌ GENERATING: Error response:', errorText);
        throw new Error(`Server error: ${response.status} - ${errorText}`);
      }
  
      // METHOD 1: Try to get response as text first (avoids automatic JSON parsing)
      const responseClone = response.clone();
      const responseText = await responseClone.text().catch(() => null);
      
      console.log('📝 GENERATING: Response text preview:', responseText?.substring(0, 200));
      console.log('📝 GENERATING: Response starts with {:', responseText?.trim().startsWith('{'));
      
      // Check if it's JSON (AWS S3 link case)
      if (responseText && responseText.trim().startsWith('{')) {
        try {
          console.log('🔍 GENERATING: Trying to parse as JSON...');
          const data = JSON.parse(responseText);
          console.log('✅ GENERATING: JSON parse successful:', data);
          
          // Handle AWS S3 URL response
          if (data.downloadUrl && data.downloadUrl.includes('amazonaws.com')) {
            console.log('☁️ GENERATING: Detected AWS S3 URL');
            console.log('☁️ GENERATING: AWS S3 URL:', data.downloadUrl);
            
            setState(prev => ({
              ...prev,
              isGenerating: false,
              stage: 'complete',
              downloadUrl: data.downloadUrl,
            }));
          } else if (data.videoUrl || data.downloadUrl || data.url) {
            console.log('🔗 GENERATING: Detected other video URL');
            setState(prev => ({
              ...prev,
              isGenerating: false,
              stage: 'complete',
              downloadUrl: data.downloadUrl || data.videoUrl || data.url,
            }));
          } else {
            console.warn('⚠️ GENERATING: JSON response but no valid URL found');
            throw new Error('No video URL found in response');
          }
          return;
        } catch (e) {
          console.log('❌ GENERATING: JSON parse failed, treating as binary:', e);
        }
      }
  
      // METHOD 2: Handle as binary data (direct video)
      console.log('🔍 GENERATING: Getting response as blob...');
      const blob = await response.blob();
      
      console.log('📦 GENERATING: Blob type:', blob.type);
      console.log('📦 GENERATING: Blob size:', blob.size);
      
      // Check if blob is actually JSON disguised as blob
      if (blob.type.includes('application/json')) {
        console.log('🔍 GENERATING: Blob is JSON, parsing...');
        const jsonText = await blob.text();
        const data = JSON.parse(jsonText);
        console.log('✅ GENERATING: Blob JSON parse successful:', data);
        
        // Handle AWS S3 URL response from blob
        if (data.downloadUrl && data.downloadUrl.includes('amazonaws.com')) {
          console.log('☁️ GENERATING: Detected AWS S3 URL from blob');
          setState(prev => ({
            ...prev,
            isGenerating: false,
            stage: 'complete',
            downloadUrl: data.downloadUrl,
          }));
        } else {
          setState(prev => ({
            ...prev,
            isGenerating: false,
            stage: 'complete',
            downloadUrl: data.downloadUrl || data.videoUrl || data.url || '#',
          }));
        }
      } else {
        // It's actually a video file (direct binary response)
        console.log('🎥 GENERATING: Creating object URL for video blob');
        const downloadUrl = window.URL.createObjectURL(blob);
        setState(prev => ({
          ...prev,
          isGenerating: false,
          stage: 'complete',
          downloadUrl: downloadUrl,
        }));
        console.log('✅ GENERATING: Video URL created successfully');
      }
  
    } catch (error) {
      console.error('❌ GENERATING: Catch error:', error);
      setState(prev => ({
        ...prev,
        isGenerating: false,
        stage: 'editing',
        error: error instanceof Error ? error.message : 'Failed to generate video',
      }));
    }
  }, [state.apiResponse]);

  const handleFileSelect = useCallback((file: File) => {
    console.log('📁 FILE SELECTED:', file.name, file.size, file.type);
    setState(prev => ({
      ...prev,
      selectedFile: file,
    }));
    processVideo(file);
  }, [processVideo]);

  const handleRetry = useCallback(() => {
    console.log('🔄 RETRYING current stage:', state.stage);
    if (state.stage === 'processing' && state.selectedFile) {
      processVideo(state.selectedFile);
    } else if (state.stage === 'generating') {
      generateVideo();
    }
  }, [state.stage, state.selectedFile, processVideo, generateVideo]);

  const handleReset = useCallback(() => {
    console.log('🔄 RESETTING application');
    setState({
      stage: 'upload',
      selectedFile: null,
      isProcessing: false,
      isGenerating: false,
      error: null,
      apiResponse: null,
      downloadUrl: null,
    });
  }, []);

  console.log('🏠 APP RENDER - Current state:', {
    stage: state.stage,
    isProcessing: state.isProcessing,
    isGenerating: state.isGenerating,
    error: state.error,
    hasApiResponse: !!state.apiResponse,
    hasDownloadUrl: !!state.downloadUrl,
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <div className="container mx-auto px-4 py-8">
        <header className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Video Highlight Generator
          </h1>
          <p className="text-gray-400 text-lg">
            Upload your video, edit highlights, and generate your final video
          </p>
        </header>

        <div className="mb-8">
          <div className="flex items-center justify-center gap-2 md:gap-4">
            {['Upload', 'Processing', 'Editing', 'Generating', 'Complete'].map((step, index) => {
              const stageNames: UploadState['stage'][] = ['upload', 'processing', 'editing', 'generating', 'complete'];
              const currentIndex = stageNames.indexOf(state.stage);
              const isActive = index === currentIndex;
              const isCompleted = index < currentIndex;

              return (
                <React.Fragment key={step}>
                  <div className="flex flex-col items-center">
                    <div
                      className={`w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center font-semibold transition-all ${
                        isActive
                          ? 'bg-blue-600 text-white scale-110'
                          : isCompleted
                          ? 'bg-green-600 text-white'
                          : 'bg-gray-700 text-gray-400'
                      }`}
                    >
                      {index + 1}
                    </div>
                    <span className={`text-xs md:text-sm mt-2 ${
                      isActive ? 'text-blue-400 font-semibold' : 'text-gray-500'
                    }`}>
                      {step}
                    </span>
                  </div>
                  {index < 4 && (
                    <div
                      className={`h-1 w-8 md:w-16 rounded transition-all ${
                        isCompleted ? 'bg-green-600' : 'bg-gray-700'
                      }`}
                    />
                  )}
                </React.Fragment>
              );
            })}
          </div>
        </div>

        <main className="min-h-[500px] flex items-center justify-center">
          {state.stage === 'upload' && (
            <FileUpload onFileSelect={handleFileSelect} />
          )}

          {state.stage === 'processing' && (
            <VideoProcessor
              isProcessing={state.isProcessing}
              error={state.error}
              onRetry={handleRetry}
              stage="processing"
            />
          )}

          {state.stage === 'editing' && state.apiResponse && (
            <SpreadsheetEditor
              spreadsheetUrl={state.apiResponse.spreadsheetUrl}
              onContinue={generateVideo}
            />
          )}

          {state.stage === 'generating' && (
            <VideoProcessor
              isProcessing={state.isGenerating}
              error={state.error}
              onRetry={handleRetry}
              stage="generating"
            />
          )}

          {state.stage === 'complete' && state.downloadUrl && (
            <div className="w-full max-w-2xl mx-auto">
              <div className="bg-gray-800 rounded-lg p-8 shadow-xl text-center">
                <div className="mb-6">
                  <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Download className="w-10 h-10 text-white" />
                  </div>
                  <h2 className="text-3xl font-bold text-white mb-2">
                    Your Video is Ready!
                  </h2>
                  <p className="text-gray-400">
                    Click the button below to download your highlight video
                  </p>
                </div>

                <div className="space-y-4">
                  <a
                    href={state.downloadUrl}
                    download="highlight-video.mp4"
                    className="inline-flex items-center gap-2 px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-colors shadow-lg"
                  >
                    <Download className="w-5 h-5" />
                    Download Video
                  </a>

                  <div>
                    <button
                      onClick={handleReset}
                      className="inline-flex items-center gap-2 px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg font-medium transition-colors"
                    >
                      <ArrowLeft className="w-4 h-4" />
                      Create Another Video
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default App;
