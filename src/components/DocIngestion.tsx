import React, { useState, useRef } from 'react';
import { useAppStore } from '../store';
import { UploadCloud, FileText, CheckCircle2, Loader2 } from 'lucide-react';
import { Button } from './ui/button';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

// Set worker URL for react-pdf
pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.mjs',
  import.meta.url,
).toString();

export function DocIngestion() {
  const { 
    language, 
    ingestedText, 
    setIngestedText, 
    uploadedFile, 
    setUploadedFile,
    selectedPages,
    setSelectedPages,
    ocrEngine,
    setOcrEngine
  } = useAppStore();

  const [numPages, setNumPages] = useState<number | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadedFile(file);
      setSelectedPages([]);
      if (file.type === 'text/plain' || file.name.endsWith('.md')) {
        const reader = new FileReader();
        reader.onload = (event) => {
          setIngestedText(event.target?.result as string);
        };
        reader.readAsText(file);
      }
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) {
      setUploadedFile(file);
      setSelectedPages([]);
      if (file.type === 'text/plain' || file.name.endsWith('.md')) {
        const reader = new FileReader();
        reader.onload = (event) => {
          setIngestedText(event.target?.result as string);
        };
        reader.readAsText(file);
      }
    }
  };

  const togglePageSelection = (pageNumber: number) => {
    setSelectedPages(
      selectedPages.includes(pageNumber) 
        ? selectedPages.filter(p => p !== pageNumber)
        : [...selectedPages, pageNumber].sort((a, b) => a - b)
    );
  };

  const selectAllPages = () => {
    if (numPages) {
      setSelectedPages(Array.from({ length: numPages }, (_, i) => i + 1));
    }
  };

  const processPDF = async () => {
    if (!uploadedFile || selectedPages.length === 0) return;
    setIsProcessing(true);
    
    try {
      // Simulate OCR processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // In a real app, we would send the selected pages to the chosen OCR engine
      // For now, we'll just set a placeholder text indicating success
      setIngestedText(`[Simulated ${ocrEngine.toUpperCase()} OCR Output for pages ${selectedPages.join(', ')}]\n\nExtracted text from ${uploadedFile.name}...`);
    } catch (error) {
      console.error("OCR Error:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="flex flex-col h-full space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">
          {language === 'en' ? 'Document Ingestion & OCR' : '文件匯入與 OCR'}
        </h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-full min-h-0">
        {/* Left Column: Upload & Text Input */}
        <div className="flex flex-col space-y-4 h-full">
          <div 
            className="border-2 border-dashed border-border rounded-xl p-8 flex flex-col items-center justify-center bg-card hover:bg-accent/50 transition-colors cursor-pointer"
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
          >
            <input 
              type="file" 
              ref={fileInputRef} 
              className="hidden" 
              accept=".txt,.md,.pdf"
              onChange={handleFileChange}
            />
            <UploadCloud className="w-12 h-12 text-muted-foreground mb-4" />
            <p className="text-lg font-medium">
              {language === 'en' ? 'Drag & Drop or Click to Upload' : '拖曳或點擊上傳'}
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              {language === 'en' ? 'Supports TXT, MD, PDF (Max 100MB)' : '支援 TXT, MD, PDF (最大 100MB)'}
            </p>
          </div>

          <div className="flex-1 flex flex-col bg-card rounded-xl border border-border p-4 shadow-sm min-h-0">
            <div className="flex justify-between items-center mb-2">
              <label className="text-sm font-medium">
                {language === 'en' ? 'Raw Text / OCR Output' : '原始文字 / OCR 輸出'}
              </label>
              {ingestedText && (
                <span className="text-xs text-green-600 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" />
                  {language === 'en' ? 'Ready' : '準備就緒'}
                </span>
              )}
            </div>
            <textarea
              className="flex-1 w-full bg-muted/30 border border-input rounded-md p-3 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary"
              value={ingestedText}
              onChange={(e) => setIngestedText(e.target.value)}
              placeholder={language === 'en' ? 'Paste regulatory guidance here...' : '在此貼上法規指引...'}
            />
          </div>
        </div>

        {/* Right Column: PDF Preview & OCR Settings */}
        <div className="flex flex-col bg-card rounded-xl border border-border p-4 shadow-sm h-full min-h-0 overflow-hidden">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">
              {language === 'en' ? 'PDF Preview & OCR' : 'PDF 預覽與 OCR'}
            </h3>
            {uploadedFile?.type === 'application/pdf' && (
              <div className="flex items-center gap-2 flex-wrap justify-end">
                <select 
                  className="text-sm border border-input rounded-md p-1.5 bg-background"
                  value={ocrEngine}
                  onChange={(e) => setOcrEngine(e.target.value as any)}
                >
                  <option value="python">{language === 'en' ? 'Python Packages (PyMuPDF)' : 'Python 套件 (PyMuPDF)'}</option>
                  <option value="llm">{language === 'en' ? 'LLM Vision (Gemini)' : 'LLM 視覺 (Gemini)'}</option>
                </select>
                {ocrEngine === 'llm' && (
                  <select 
                    className="text-sm border border-input rounded-md p-1.5 bg-background"
                    defaultValue="gemini-3-flash-preview"
                  >
                    <option value="gemini-3-flash-preview">Gemini 3.1 Flash Preview</option>
                    <option value="gemini-2.5-flash">Gemini 2.5 Flash</option>
                    <option value="gemini-3.1-pro-preview">Gemini 3.1 Pro Preview</option>
                  </select>
                )}
                <Button 
                  size="sm" 
                  onClick={processPDF} 
                  disabled={selectedPages.length === 0 || isProcessing}
                >
                  {isProcessing ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <FileText className="w-4 h-4 mr-2" />}
                  {language === 'en' ? 'Process Selected' : '處理選定頁面'}
                </Button>
              </div>
            )}
          </div>

          <div className="flex-1 overflow-y-auto bg-muted/20 rounded-lg border border-border p-4">
            {!uploadedFile ? (
              <div className="h-full flex items-center justify-center text-muted-foreground text-sm">
                {language === 'en' ? 'Upload a PDF to preview pages' : '上傳 PDF 以預覽頁面'}
              </div>
            ) : uploadedFile.type !== 'application/pdf' ? (
              <div className="h-full flex items-center justify-center text-muted-foreground text-sm">
                {language === 'en' ? 'Preview only available for PDF files' : '僅支援 PDF 預覽'}
              </div>
            ) : (
              <div className="flex flex-col">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-sm font-medium">
                    {language === 'en' ? `Selected: ${selectedPages.length} pages` : `已選: ${selectedPages.length} 頁`}
                  </span>
                  <Button variant="outline" size="sm" onClick={selectAllPages}>
                    {language === 'en' ? 'Select All' : '全選'}
                  </Button>
                </div>
                <Document
                  file={uploadedFile}
                  onLoadSuccess={({ numPages }) => setNumPages(numPages)}
                  className="flex flex-wrap gap-4 justify-center"
                  loading={<div className="flex justify-center p-4"><Loader2 className="w-6 h-6 animate-spin text-primary" /></div>}
                >
                  {Array.from(new Array(numPages || 0), (el, index) => (
                    <div 
                      key={`page_${index + 1}`} 
                      className={`relative cursor-pointer transition-transform hover:scale-105 ${selectedPages.includes(index + 1) ? 'ring-2 ring-primary ring-offset-2 rounded-sm' : ''}`}
                      onClick={() => togglePageSelection(index + 1)}
                    >
                      <Page 
                        pageNumber={index + 1} 
                        width={150} 
                        renderTextLayer={false} 
                        renderAnnotationLayer={false}
                        className="shadow-md border border-border"
                      />
                      <div className="absolute bottom-1 right-1 bg-black/60 text-white text-xs px-1.5 py-0.5 rounded">
                        {index + 1}
                      </div>
                      {selectedPages.includes(index + 1) && (
                        <div className="absolute top-1 right-1 bg-primary text-primary-foreground rounded-full p-0.5">
                          <CheckCircle2 className="w-4 h-4" />
                        </div>
                      )}
                    </div>
                  ))}
                </Document>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
