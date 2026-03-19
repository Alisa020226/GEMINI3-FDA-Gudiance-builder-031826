import React, { useState, useEffect } from 'react';
import { useAppStore } from '../store';
import { Button } from './ui/button';
import { Download, Send, Loader2, Bot, Code, Eye } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import mermaid from 'mermaid';
import { GoogleGenAI } from '@google/genai';

// Mermaid component
const Mermaid = ({ chart }: { chart: string }) => {
  useEffect(() => {
    mermaid.initialize({ startOnLoad: true, theme: 'default' });
    mermaid.contentLoaded();
  }, [chart]);

  return <div className="mermaid">{chart}</div>;
};

export function MarkdownEditor() {
  const { 
    language, 
    generatedMarkdown, 
    setGeneratedMarkdown,
    selectedModel,
    addTelemetryLog
  } = useAppStore();

  const [viewMode, setViewMode] = useState<'split' | 'edit' | 'preview'>('split');
  const [skillPrompt, setSkillPrompt] = useState('');
  const [isExecutingSkill, setIsExecutingSkill] = useState(false);
  const [chatHistory, setChatHistory] = useState<{role: 'user' | 'agent', content: string}[]>([]);

  const handleDownload = (format: 'md' | 'txt') => {
    const blob = new Blob([generatedMarkdown], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `SmartMed_Review_Guidance.${format}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const executeSkill = async () => {
    if (!skillPrompt.trim() || !generatedMarkdown) return;

    setIsExecutingSkill(true);
    setChatHistory(prev => [...prev, { role: 'user', content: skillPrompt }]);
    addTelemetryLog(`[${new Date().toISOString()}] Executing Agentic Skill: ${skillPrompt}`);

    try {
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) throw new Error('GEMINI_API_KEY is not set');

      const ai = new GoogleGenAI({ apiKey });
      
      const prompt = `
You are an expert Medical Device Regulatory Affairs Agent.
The user has provided a regulatory guidance document in Markdown format.
Apply the following skill/instruction to the document and return the ENTIRE modified document.
Do not include conversational filler, ONLY return the modified Markdown document.

Skill/Instruction:
${skillPrompt}

Original Document:
${generatedMarkdown}
      `;

      const response = await ai.models.generateContent({
        model: selectedModel,
        contents: prompt,
      });

      if (response.text) {
        setGeneratedMarkdown(response.text);
        setChatHistory(prev => [...prev, { role: 'agent', content: 'Skill applied successfully. Document updated.' }]);
        addTelemetryLog(`[${new Date().toISOString()}] Skill execution complete. Document updated.`);
      }
    } catch (err: any) {
      console.error(err);
      setChatHistory(prev => [...prev, { role: 'agent', content: `Error: ${err.message}` }]);
      addTelemetryLog(`[${new Date().toISOString()}] ERROR executing skill: ${err.message}`);
    } finally {
      setIsExecutingSkill(false);
      setSkillPrompt('');
    }
  };

  return (
    <div className="flex flex-col h-full space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">
          {language === 'en' ? 'Markdown Editor & Agent' : 'Markdown 編輯器與代理'}
        </h2>
        <div className="flex items-center gap-2">
          <div className="flex bg-muted rounded-md p-1 mr-4">
            <button 
              onClick={() => setViewMode('edit')}
              className={`px-3 py-1.5 text-sm font-medium rounded-sm flex items-center gap-2 ${viewMode === 'edit' ? 'bg-background shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}
            >
              <Code className="w-4 h-4" /> {language === 'en' ? 'Edit' : '編輯'}
            </button>
            <button 
              onClick={() => setViewMode('split')}
              className={`px-3 py-1.5 text-sm font-medium rounded-sm flex items-center gap-2 ${viewMode === 'split' ? 'bg-background shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}
            >
              <Eye className="w-4 h-4" /> {language === 'en' ? 'Split' : '分割'}
            </button>
            <button 
              onClick={() => setViewMode('preview')}
              className={`px-3 py-1.5 text-sm font-medium rounded-sm flex items-center gap-2 ${viewMode === 'preview' ? 'bg-background shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}
            >
              <Eye className="w-4 h-4" /> {language === 'en' ? 'Preview' : '預覽'}
            </button>
          </div>
          <Button variant="outline" size="sm" onClick={() => handleDownload('md')}>
            <Download className="w-4 h-4 mr-2" /> .md
          </Button>
          <Button variant="outline" size="sm" onClick={() => handleDownload('txt')}>
            <Download className="w-4 h-4 mr-2" /> .txt
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-full min-h-0">
        {/* Editor & Preview Area */}
        <div className={`col-span-1 lg:col-span-3 flex gap-4 h-full min-h-0 ${viewMode === 'split' ? 'flex-row' : 'flex-col'}`}>
          
          {/* Raw Editor */}
          {(viewMode === 'edit' || viewMode === 'split') && (
            <div className={`flex flex-col bg-card rounded-xl border border-border shadow-sm h-full min-h-0 ${viewMode === 'split' ? 'w-1/2' : 'w-full'}`}>
              <div className="p-3 border-b border-border bg-muted/30 font-medium text-sm flex items-center">
                <Code className="w-4 h-4 mr-2" />
                {language === 'en' ? 'Raw Markdown' : '原始 Markdown'}
              </div>
              <textarea
                className="flex-1 w-full bg-transparent p-4 text-sm font-mono resize-none focus:outline-none focus:ring-2 focus:ring-primary/50"
                value={generatedMarkdown}
                onChange={(e) => setGeneratedMarkdown(e.target.value)}
                placeholder={language === 'en' ? 'Markdown content will appear here...' : 'Markdown 內容將顯示於此...'}
              />
            </div>
          )}

          {/* Rendered Preview */}
          {(viewMode === 'preview' || viewMode === 'split') && (
            <div className={`flex flex-col bg-card rounded-xl border border-border shadow-sm h-full min-h-0 ${viewMode === 'split' ? 'w-1/2' : 'w-full'}`}>
              <div className="p-3 border-b border-border bg-muted/30 font-medium text-sm flex items-center">
                <Eye className="w-4 h-4 mr-2" />
                {language === 'en' ? 'Rendered Preview' : '渲染預覽'}
              </div>
              <div className="flex-1 overflow-y-auto p-6 prose prose-sm dark:prose-invert max-w-none">
                <ReactMarkdown 
                  remarkPlugins={[remarkGfm]}
                  components={{
                    code({node, inline, className, children, ...props}: any) {
                      const match = /language-(\w+)/.exec(className || '')
                      if (!inline && match && match[1] === 'mermaid') {
                        return <Mermaid chart={String(children).replace(/\n$/, '')} />
                      }
                      return <code className={className} {...props}>{children}</code>
                    }
                  }}
                >
                  {generatedMarkdown || (language === 'en' ? '*No content to preview*' : '*尚無內容可預覽*')}
                </ReactMarkdown>
              </div>
            </div>
          )}
        </div>

        {/* Agentic Skill Workspace */}
        <div className="col-span-1 flex flex-col bg-card rounded-xl border border-border shadow-sm h-full min-h-0">
          <div className="p-4 border-b border-border bg-primary/5 flex items-center gap-2">
            <Bot className="w-5 h-5 text-primary" />
            <h3 className="font-semibold">{language === 'en' ? 'Agentic Skill Workspace' : '代理技能工作區'}</h3>
          </div>
          
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-muted/10">
            {chatHistory.length === 0 ? (
              <div className="text-center text-muted-foreground text-sm mt-10">
                <Bot className="w-10 h-10 mx-auto mb-3 opacity-20" />
                <p>{language === 'en' ? 'Apply custom skills to modify the document.' : '套用自訂技能以修改文件。'}</p>
                <p className="mt-2 text-xs">
                  {language === 'en' ? 'Try: "Translate to layman terms" or "Extract testing standards into a table"' : '嘗試：「翻譯為白話文」或「將測試標準提取為表格」'}
                </p>
              </div>
            ) : (
              chatHistory.map((msg, i) => (
                <div key={i} className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                  <div className={`max-w-[85%] rounded-lg p-3 text-sm ${msg.role === 'user' ? 'bg-primary text-primary-foreground' : 'bg-muted border border-border'}`}>
                    {msg.content}
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="p-4 border-t border-border bg-background">
            <div className="flex gap-2">
              <textarea
                className="flex-1 bg-muted/50 border border-input rounded-md p-2 text-sm resize-none h-20 focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder={language === 'en' ? 'Describe skill to apply...' : '描述要套用的技能...'}
                value={skillPrompt}
                onChange={(e) => setSkillPrompt(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    executeSkill();
                  }
                }}
              />
              <Button 
                className="h-20 w-12 flex-shrink-0" 
                onClick={executeSkill}
                disabled={isExecutingSkill || !skillPrompt.trim() || !generatedMarkdown}
              >
                {isExecutingSkill ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
