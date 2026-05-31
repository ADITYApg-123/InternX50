'use client';

import { useState, useRef } from 'react';
import { Download, Upload, AlertTriangle } from 'lucide-react';

export function DataManager() {
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleExport = () => {
    try {
      const data = localStorage.getItem('internx50-storage-v2');
      if (!data) {
        setError('No data found to export.');
        return;
      }
      const blob = new Blob([data], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `internx50-backup-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      setError(null);
    } catch (err) {
      console.error(err);
      setError('Failed to export data.');
    }
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const result = event.target?.result as string;
        // Basic validation to see if it's JSON
        JSON.parse(result);
        
        if (window.confirm('Are you sure you want to import this backup? This will overwrite ALL your current data!')) {
          localStorage.setItem('internx50-storage-v2', result);
          window.location.reload();
        }
      } catch (err) {
        console.error(err);
        setError('Invalid backup file. Please select a valid JSON backup.');
      }
      
      // Reset input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="mt-4 border-t border-white/5 pt-4">
      <p className="text-xs font-semibold text-zinc-500 mb-2 px-2 uppercase tracking-wider">Data Settings</p>
      <div className="flex flex-col gap-1">
        <button
          onClick={handleExport}
          className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-zinc-400 hover:bg-white/5 hover:text-white transition-all duration-200"
        >
          <Download className="h-4 w-4" />
          Export Backup
        </button>
        <button
          onClick={handleImportClick}
          className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-zinc-400 hover:bg-white/5 hover:text-white transition-all duration-200"
        >
          <Upload className="h-4 w-4" />
          Import Backup
        </button>
        <input 
          type="file" 
          accept=".json" 
          ref={fileInputRef} 
          onChange={handleFileChange} 
          className="hidden" 
        />
      </div>
      {error && (
        <div className="mt-2 flex items-start gap-2 text-red-400 px-2 text-xs bg-red-400/10 p-2 rounded border border-red-400/20">
          <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
}
