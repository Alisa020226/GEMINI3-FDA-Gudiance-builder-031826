import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type ThemeName =
  | 'classic-blue'
  | 'very-peri'
  | 'emerald'
  | 'rose-quartz'
  | 'illuminating'
  | 'living-coral'
  | 'ultra-violet'
  | 'greenery'
  | 'marsala'
  | 'radiand-orchid';

export type Language = 'en' | 'zh-TW';
export type Model = 'gemini-2.5-flash' | 'gemini-3-flash-preview';
export type OCREngine = 'python' | 'llm';

interface AppState {
  theme: ThemeName;
  setTheme: (theme: ThemeName) => void;
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  language: Language;
  setLanguage: (lang: Language) => void;
  
  // Document Ingestion
  ingestedText: string;
  setIngestedText: (text: string) => void;
  uploadedFile: File | null;
  setUploadedFile: (file: File | null) => void;
  selectedPages: number[];
  setSelectedPages: (pages: number[]) => void;
  ocrEngine: OCREngine;
  setOcrEngine: (engine: OCREngine) => void;
  
  // Guidance Generator
  selectedModel: Model;
  setSelectedModel: (model: Model) => void;
  customPrompt: string;
  setCustomPrompt: (prompt: string) => void;
  generatedMarkdown: string;
  setGeneratedMarkdown: (md: string) => void;
  
  // Telemetry
  telemetryLogs: string[];
  addTelemetryLog: (log: string) => void;
  clearTelemetryLogs: () => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      theme: 'classic-blue',
      setTheme: (theme) => set({ theme }),
      isDarkMode: false,
      toggleDarkMode: () => set((state) => ({ isDarkMode: !state.isDarkMode })),
      language: 'en',
      setLanguage: (language) => set({ language }),
      
      ingestedText: '',
      setIngestedText: (ingestedText) => set({ ingestedText }),
      uploadedFile: null,
      setUploadedFile: (uploadedFile) => set({ uploadedFile }),
      selectedPages: [],
      setSelectedPages: (selectedPages) => set({ selectedPages }),
      ocrEngine: 'llm',
      setOcrEngine: (ocrEngine) => set({ ocrEngine }),
      
      selectedModel: 'gemini-3-flash-preview',
      setSelectedModel: (selectedModel) => set({ selectedModel }),
      customPrompt: '',
      setCustomPrompt: (customPrompt) => set({ customPrompt }),
      generatedMarkdown: '',
      setGeneratedMarkdown: (generatedMarkdown) => set({ generatedMarkdown }),
      
      telemetryLogs: [],
      addTelemetryLog: (log) => set((state) => ({ telemetryLogs: [...state.telemetryLogs, log] })),
      clearTelemetryLogs: () => set({ telemetryLogs: [] }),
    }),
    {
      name: 'smartmed-storage',
      partialize: (state) => ({
        theme: state.theme,
        isDarkMode: state.isDarkMode,
        language: state.language,
        selectedModel: state.selectedModel,
        ocrEngine: state.ocrEngine,
      }),
    }
  )
);
