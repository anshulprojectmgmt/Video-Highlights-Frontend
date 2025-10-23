# Video Highlight Generator

## Overview

A React-based web application that processes videos to automatically generate highlight clips. The application provides a three-stage workflow: video upload, spreadsheet-based editing of detected highlights, and final video generation. Built with React, TypeScript, and Vite, the frontend integrates with external webhook APIs for video processing and generation tasks.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Technology Stack**
- **Framework**: React 18 with TypeScript for type-safe component development
- **Build Tool**: Vite for fast development and optimized production builds
- **Styling**: Tailwind CSS for utility-first styling approach
- **Icons**: Lucide React for consistent iconography

**Component Structure**
The application follows a component-based architecture with clear separation of concerns:

- **App.tsx**: Central state management hub that orchestrates the multi-stage workflow (upload → processing → editing → generating → complete)
- **FileUpload.tsx**: Handles video file selection via drag-and-drop or file input
- **VideoProcessor.tsx**: Displays processing/generation status with loading states and error handling
- **SpreadsheetEditor.tsx**: Embeds Google Sheets iframe for user editing of highlight timestamps

**State Management**
Uses React's built-in `useState` and `useCallback` hooks for local state management. A centralized `UploadState` interface tracks the application's stage, file data, processing states, API responses, and error conditions. This simple approach is suitable given the linear workflow and absence of complex cross-component state sharing.

**Type Safety**
TypeScript is enforced with strict compiler options (`strict: true`, `noUnusedLocals`, `noUnusedParameters`) to catch errors early and improve code maintainability.

### API Integration

**Webhook-Based Architecture**
The application communicates with backend services via HTTP webhooks rather than traditional REST APIs:

- **Processing Endpoint** (`/webhook-test/bdef75c6-0881-4a7b-b3e8-1ed19306512c`): Accepts video file uploads via FormData and returns spreadsheet information
- **Generation Endpoint** (`/webhook-test/c00db252-0e0e-484c-94dd-c3f405825c10`): Accepts spreadsheet ID to trigger final video generation

This webhook approach suggests integration with workflow automation tools (likely n8n or similar), where each webhook triggers a specific backend workflow.

**Data Flow**
1. User uploads video file → sent to processing webhook
2. Processing returns `ApiResponse` with `spreadsheetId` and `spreadsheetUrl`
3. User edits highlights in embedded Google Sheets
4. User triggers generation → spreadsheet ID sent to generation webhook
5. Generation returns download URL for final video

**Error Handling**
HTTP responses are validated with error messages displayed to users. Retry functionality is provided for failed operations.

### Build Configuration

**Development Server**
Vite dev server configured to:
- Bind to `0.0.0.0` for network access (important for containerized/remote environments like Replit)
- Use port 5000 with strict port enforcement
- Enable hot module replacement for rapid development

**Production Builds**
TypeScript compilation targets ES2020 with DOM libraries. Vite bundles with module resolution set to "bundler" mode, tree-shaking unused code for optimal bundle sizes.

**PostCSS Pipeline**
Tailwind CSS processes utility classes through PostCSS with Autoprefixer for cross-browser compatibility.

## External Dependencies

### Third-Party Libraries

**React Ecosystem**
- `react` & `react-dom` (v18.2.0): Core framework for UI rendering
- `lucide-react` (v0.463.0): Icon library providing Upload, FileVideo, Loader2, CheckCircle, XCircle, RefreshCw, Download, ArrowLeft, ExternalLink, and ArrowRight icons

**Build & Development Tools**
- `vite` (v4.0.0): Fast build tool and dev server
- `@vitejs/plugin-react` (v4.0.0): Enables React Fast Refresh and JSX transformation
- `typescript` (v5.0.0): Type checking and compilation

**Styling Tools**
- `tailwindcss` (v3.3.0): Utility-first CSS framework
- `autoprefixer` (v10.4.0): Adds vendor prefixes for CSS
- `postcss` (v8.4.0): CSS transformation tool

### External Services

**Google Sheets**
The application embeds Google Sheets iframes for collaborative editing of video highlight timestamps. The spreadsheet URL is provided by the backend processing webhook and must be publicly accessible or properly authenticated for iframe embedding.

**Backend Webhook Services**
- Hardcoded localhost URLs suggest a local backend service (likely running on port 5678)
- The webhook pattern indicates integration with automation platforms (possibly n8n, Zapier, or custom Node.js services)
- Video processing and generation logic is entirely backend-managed

**Media Handling**
- Client-side file selection and upload (FormData multipart)
- Backend handles actual video processing (likely FFmpeg or similar)
- Final video delivery via direct download URLs