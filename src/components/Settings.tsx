import React from 'react';
import { useAppStore, ThemeName } from '../store';
import { Button } from './ui/button';
import { Moon, Sun, Globe, Palette, HelpCircle } from 'lucide-react';

export function Settings() {
  const { 
    theme, 
    setTheme, 
    isDarkMode, 
    toggleDarkMode, 
    language, 
    setLanguage 
  } = useAppStore();

  const themes: { id: ThemeName; name: string; color: string }[] = [
    { id: 'classic-blue', name: 'Classic Blue (Pantone 19-4052)', color: '#0f4c81' },
    { id: 'very-peri', name: 'Very Peri (Pantone 17-3938)', color: '#6667AB' },
    { id: 'emerald', name: 'Emerald (Pantone 17-5641)', color: '#009473' },
    { id: 'rose-quartz', name: 'Rose Quartz & Serenity', color: '#F7CAC9' },
    { id: 'illuminating', name: 'Illuminating Yellow & Ultimate Gray', color: '#F5DF4D' },
    { id: 'living-coral', name: 'Living Coral (Pantone 16-1546)', color: '#FF6F61' },
    { id: 'ultra-violet', name: 'Ultra Violet (Pantone 18-3838)', color: '#5F4B8B' },
    { id: 'greenery', name: 'Greenery (Pantone 15-0343)', color: '#88B04B' },
    { id: 'marsala', name: 'Marsala (Pantone 18-1438)', color: '#955251' },
    { id: 'radiand-orchid', name: 'Radiant Orchid (Pantone 18-3224)', color: '#AD5E99' },
  ];

  const followUpQuestions = [
    "1. For the PDF preview and page selection feature, do you expect users to upload files larger than 100MB, and should we implement client-side chunking/pagination to prevent browser crashes?",
    "2. When a user selects \"Python packages\" for OCR, should this run purely in the browser via WebAssembly (Pyodide), or do you prefer a lightweight local Python server (e.g., FastAPI) to handle heavier documents?",
    "3. If the LLM Vision OCR encounters highly complex, nested tables in a PDF, what is the fallback strategy if the extraction format breaks?",
    "4. Should the system persist the original uploaded PDF in local browser storage (IndexedDB) so the user doesn't have to re-upload if they refresh the page?",
    "5. You requested exactly 3 tables in the generated markdown. Are these 3 tables always strictly defined (e.g., Table 1: Scope, Table 2: Traceability, Table 3: Risk), or should the LLM dynamically decide their content based on the text?",
    "6. The target word count is 2000-3000 words. Since LLMs can sometimes struggle with strict word count boundaries, how should the UI handle outputs that fall short of 2000 words? (e.g., auto-prompting it to expand?)",
    "7. When translating regulatory nuances from Traditional Chinese to English (or vice versa), should we append a specific glossary prompt to ensure standard medical device terminology (e.g., using \"Premarket Notification\" consistently)?",
    "8. For the Agentic Skill feature, will users be inputting simple text prompts, or should we support uploading formal .skill files structured with YAML/Markdown?",
    "9. When an Agent modifies the generated Markdown document, should it overwrite the text directly in the editor, or generate a \"Diff/Compare\" view so the user can see what the agent changed?",
    "10. Do you want the downloaded .md or .txt files to include metadata headers (e.g., timestamp, model used, original guidance filename)?",
    "11. For the 10 Pantone color palettes, should these colors also reflect inside the generated Mermaid charts and PDF export styling, or just the application's UI buttons and backgrounds?",
    "12. Should the system remember the user's selected Pantone theme, language, and model preference via localStorage for their next session?",
    "13. Is accessibility (WCAG compliance, high contrast text) a strict requirement when mapping out these specific Pantone colors to the UI elements?",
    "14. Because gemini-3-flash-preview and Vision OCR can consume significant tokens, do you need an interface within the Settings Tab for users to input their own Google API key, or will this be a centralized enterprise key?",
    "15. Should the Telemetry Terminal capture and display the exact JSON schema validation steps when the Submission Triage module parses the LLM output?",
    "16. How should the application handle rate-limiting (e.g., HTTP 429 errors) from the Gemini API if a user runs multiple OCR pages and guidance generations in rapid succession?",
    "17. Are there any specific data-privacy disclaimers or \"AI usage warnings\" that must be permanently displayed on the UI to comply with internal RA compliance standards?",
    "18. For the Submission Triage module, do you plan to eventually allow users to upload the actual submission documents (e.g., the manufacturer's clinical evaluation report) for the AI to cross-reference against the generated guidance?",
    "19. Would you like a feature to export the entire workspace (the uploaded PDF, the generated Markdown, and the Review Report) as a single compressed .zip package?",
    "20. As we introduce LLM-based OCR, should we add a \"Confidence Score\" or \"Review Needed\" highlighter for text where the LLM was unsure about a blurry PDF scan?"
  ];

  return (
    <div className="flex flex-col h-full space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">
          {language === 'en' ? 'Settings & WOW UI' : '設定與 WOW UI'}
        </h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-full min-h-0 overflow-y-auto pb-10">
        
        {/* Appearance & Localization */}
        <div className="flex flex-col space-y-6">
          <div className="bg-card rounded-xl border border-border p-6 shadow-sm">
            <h3 className="text-lg font-semibold flex items-center gap-2 mb-4 border-b border-border pb-2">
              <Globe className="w-5 h-5" />
              {language === 'en' ? 'Localization' : '語系設定'}
            </h3>
            <div className="flex items-center gap-4">
              <Button 
                variant={language === 'en' ? 'default' : 'outline'} 
                onClick={() => setLanguage('en')}
              >
                English
              </Button>
              <Button 
                variant={language === 'zh-TW' ? 'default' : 'outline'} 
                onClick={() => setLanguage('zh-TW')}
              >
                繁體中文
              </Button>
            </div>
          </div>

          <div className="bg-card rounded-xl border border-border p-6 shadow-sm">
            <h3 className="text-lg font-semibold flex items-center gap-2 mb-4 border-b border-border pb-2">
              {isDarkMode ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
              {language === 'en' ? 'Appearance' : '外觀設定'}
            </h3>
            <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg border border-border">
              <div>
                <p className="font-medium">{language === 'en' ? 'Dark Mode' : '深色模式'}</p>
                <p className="text-sm text-muted-foreground">
                  {language === 'en' ? 'Toggle between light and dark themes' : '切換淺色與深色主題'}
                </p>
              </div>
              <Button variant="outline" onClick={toggleDarkMode}>
                {isDarkMode ? (language === 'en' ? 'Switch to Light' : '切換至淺色') : (language === 'en' ? 'Switch to Dark' : '切換至深色')}
              </Button>
            </div>
          </div>

          <div className="bg-card rounded-xl border border-border p-6 shadow-sm">
            <h3 className="text-lg font-semibold flex items-center gap-2 mb-4 border-b border-border pb-2">
              <Palette className="w-5 h-5" />
              {language === 'en' ? 'Pantone Themes (WOW 7)' : 'Pantone 主題 (WOW 7)'}
            </h3>
            <div className="grid grid-cols-2 gap-3">
              {themes.map((t) => (
                <button
                  key={t.id}
                  onClick={() => setTheme(t.id)}
                  className={`flex items-center gap-3 p-3 rounded-lg border transition-all ${theme === t.id ? 'border-primary ring-2 ring-primary/20 bg-primary/5' : 'border-border hover:border-primary/50 bg-card'}`}
                >
                  <div 
                    className="w-6 h-6 rounded-full shadow-sm border border-border" 
                    style={{ backgroundColor: t.color }}
                  />
                  <span className="text-sm font-medium text-left">{t.name}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Follow-up Questions */}
        <div className="flex flex-col bg-card rounded-xl border border-border p-6 shadow-sm h-[800px]">
          <h3 className="text-lg font-semibold flex items-center gap-2 mb-4 border-b border-border pb-2">
            <HelpCircle className="w-5 h-5" />
            {language === 'en' ? '20 Comprehensive Follow-Up Questions' : '20 個綜合後續問題'}
          </h3>
          <div className="flex-1 overflow-y-auto pr-4 space-y-4 text-sm text-muted-foreground">
            {followUpQuestions.map((q, i) => (
              <div key={i} className="p-3 bg-muted/20 rounded-lg border border-border">
                {q}
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
