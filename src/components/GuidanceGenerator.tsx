import React, { useState } from 'react';
import { useAppStore } from '../store';
import { Button } from './ui/button';
import { Wand2, Loader2, AlertCircle } from 'lucide-react';
import { GoogleGenAI } from '@google/genai';

export function GuidanceGenerator() {
  const { 
    language, 
    ingestedText, 
    selectedModel, 
    setSelectedModel,
    customPrompt,
    setCustomPrompt,
    setGeneratedMarkdown,
    addTelemetryLog
  } = useAppStore();

  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateGuidance = async () => {
    if (!ingestedText) {
      setError(language === 'en' ? 'Please ingest document text first.' : '請先匯入文件文字。');
      return;
    }

    setIsGenerating(true);
    setError(null);
    addTelemetryLog(`[${new Date().toISOString()}] Starting generation with model: ${selectedModel}`);

    try {
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        throw new Error('GEMINI_API_KEY is not set');
      }

      const ai = new GoogleGenAI({ apiKey });

      const targetLanguageStr = language === 'zh-TW' ? '繁體中文' : 'English';
      
      const prompt = `
請根據以下法規內容，生成一份結構化的醫療器材審查指引 (Review Guidance)。
內容長度需嚴格控制在 2000 到 3000 字之間。
請確保整份文件中「剛好包含 3 個 Markdown 表格」來整理關鍵數據或法規對照。
輸出語言：${targetLanguageStr}
用戶自訂附加指令：${customPrompt}

必備內容：
1. 適用範圍 (Scope)
2. 審查重點 (Key Review Points)
3. WOW 3 模擬退件風險評估：常見缺失與風險預測
4. WOW 2 國際法規智能對照：TFDA 規範對照美國 FDA 或歐盟 MDR
5. WOW 1 Mermaid 視覺化審查流程圖：請使用 \`\`\`mermaid 語法包裝
6. WOW 4 法規溯源熱區圖 (Traceability Heatmap) (此部分可作為其中一個表格)

法規內容：
${ingestedText}
      `;

      addTelemetryLog(`[${new Date().toISOString()}] Sending request to Gemini API...`);
      
      const response = await ai.models.generateContentStream({
        model: selectedModel,
        contents: prompt,
      });

      let fullText = '';
      for await (const chunk of response) {
        if (chunk.text) {
          fullText += chunk.text;
          setGeneratedMarkdown(fullText); // Stream to UI
          addTelemetryLog(`[${new Date().toISOString()}] Received chunk: ${chunk.text.length} chars`);
        }
      }

      addTelemetryLog(`[${new Date().toISOString()}] Generation complete. Total length: ${fullText.length} chars`);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'An error occurred during generation.');
      addTelemetryLog(`[${new Date().toISOString()}] ERROR: ${err.message}`);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="flex flex-col h-full space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">
          {language === 'en' ? 'Guidance Generator' : '指引生成器'}
        </h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full min-h-0">
        {/* Configuration Panel */}
        <div className="col-span-1 flex flex-col space-y-4 bg-card rounded-xl border border-border p-6 shadow-sm">
          <h3 className="text-lg font-semibold border-b border-border pb-2">
            {language === 'en' ? 'Configuration' : '設定'}
          </h3>

          <div className="space-y-2">
            <label className="text-sm font-medium">
              {language === 'en' ? 'LLM Model' : '語言模型'}
            </label>
            <select 
              className="w-full text-sm border border-input rounded-md p-2 bg-background focus:ring-2 focus:ring-primary outline-none"
              value={selectedModel}
              onChange={(e) => setSelectedModel(e.target.value as any)}
            >
              <option value="gemini-3-flash-preview">Gemini 3.1 Flash Preview (Recommended)</option>
              <option value="gemini-2.5-flash">Gemini 2.5 Flash</option>
              <option value="gemini-3.1-pro-preview">Gemini 3.1 Pro Preview (Complex)</option>
            </select>
          </div>

          <div className="space-y-2 flex-1 flex flex-col">
            <label className="text-sm font-medium">
              {language === 'en' ? 'Custom Prompt Override' : '自訂附加指令'}
            </label>
            <textarea
              className="flex-1 w-full bg-muted/30 border border-input rounded-md p-3 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary"
              value={customPrompt}
              onChange={(e) => setCustomPrompt(e.target.value)}
              placeholder={language === 'en' ? 'Add specific instructions here (e.g., "Focus heavily on software validation requirements")' : '在此加入特定指示 (例如：「請特別著重於軟體確效要求」)'}
            />
          </div>

          <Button 
            className="w-full py-6 text-lg" 
            onClick={generateGuidance}
            disabled={isGenerating || !ingestedText}
          >
            {isGenerating ? (
              <><Loader2 className="w-5 h-5 animate-spin mr-2" /> {language === 'en' ? 'Generating...' : '生成中...'}</>
            ) : (
              <><Wand2 className="w-5 h-5 mr-2" /> {language === 'en' ? 'Generate Guidance' : '生成審查指引'}</>
            )}
          </Button>

          {error && (
            <div className="p-3 bg-destructive/10 text-destructive rounded-md flex items-start gap-2 text-sm">
              <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
              <span>{error}</span>
            </div>
          )}
        </div>

        {/* Preview Panel */}
        <div className="col-span-2 flex flex-col bg-card rounded-xl border border-border p-6 shadow-sm h-full min-h-0">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">
              {language === 'en' ? 'Source Text Preview' : '來源文字預覽'}
            </h3>
            <span className="text-xs text-muted-foreground">
              {ingestedText.length} {language === 'en' ? 'characters' : '字元'}
            </span>
          </div>
          <div className="flex-1 overflow-y-auto bg-muted/20 rounded-lg border border-border p-4 text-sm font-mono whitespace-pre-wrap text-muted-foreground">
            {ingestedText || (language === 'en' ? 'No text ingested yet. Go to Doc Ingestion tab.' : '尚未匯入文字。請前往「文件匯入」分頁。')}
          </div>
        </div>
      </div>
    </div>
  );
}
