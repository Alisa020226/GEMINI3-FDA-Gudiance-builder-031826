import React, { useEffect, useRef } from 'react';
import { useAppStore } from '../store';
import { Terminal, Trash2, StopCircle } from 'lucide-react';
import { Button } from './ui/button';

export function TelemetryTerminal() {
  const { language, telemetryLogs, clearTelemetryLogs } = useAppStore();
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [telemetryLogs]);

  return (
    <div className="flex flex-col h-full space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <Terminal className="w-6 h-6" />
          {language === 'en' ? 'Telemetry Terminal' : '遙測終端'}
        </h2>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={clearTelemetryLogs}>
            <Trash2 className="w-4 h-4 mr-2" />
            {language === 'en' ? 'Clear Logs' : '清除日誌'}
          </Button>
          <Button variant="destructive" size="sm">
            <StopCircle className="w-4 h-4 mr-2" />
            {language === 'en' ? 'Abort Process' : '中止程序'}
          </Button>
        </div>
      </div>

      <div className="flex-1 bg-black text-green-500 font-mono text-sm p-4 rounded-xl border border-border shadow-inner overflow-hidden flex flex-col">
        <div className="flex-1 overflow-y-auto space-y-1">
          {telemetryLogs.length === 0 ? (
            <div className="text-green-500/50 italic">
              {language === 'en' ? '> System initialized. Waiting for operations...' : '> 系統已初始化。等待操作中...'}
            </div>
          ) : (
            telemetryLogs.map((log, i) => (
              <div key={i} className="break-words">
                <span className="text-blue-400 mr-2">{'>'}</span>
                {log}
              </div>
            ))
          )}
          <div ref={bottomRef} />
        </div>
      </div>
    </div>
  );
}
