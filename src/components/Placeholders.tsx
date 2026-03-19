import React from 'react';
import { useAppStore } from '../store';
import { Filter, FileCheck } from 'lucide-react';

export function SubmissionTriage() {
  const { language } = useAppStore();
  return (
    <div className="flex flex-col h-full space-y-6 items-center justify-center text-muted-foreground">
      <Filter className="w-16 h-16 mb-4 opacity-20" />
      <h2 className="text-2xl font-bold">
        {language === 'en' ? 'Submission Triage' : '案件分類'}
      </h2>
      <p>{language === 'en' ? 'Original logic maintained. Placeholder for V3.' : '保留原始邏輯。V3 佔位符。'}</p>
    </div>
  );
}

export function ReviewReport() {
  const { language } = useAppStore();
  return (
    <div className="flex flex-col h-full space-y-6 items-center justify-center text-muted-foreground">
      <FileCheck className="w-16 h-16 mb-4 opacity-20" />
      <h2 className="text-2xl font-bold">
        {language === 'en' ? 'Review Report Generator' : '審查報告生成器'}
      </h2>
      <p>{language === 'en' ? 'Original logic maintained. Placeholder for V3.' : '保留原始邏輯。V3 佔位符。'}</p>
    </div>
  );
}
