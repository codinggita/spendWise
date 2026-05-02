import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, File, X, CheckCircle, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import api from '@/services/api';

export const CSVUploader = () => {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState<string>('');

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      setFile(acceptedFiles[0]);
      setUploadStatus('idle');
      setErrorMessage('');
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'text/csv': ['.csv'] },
    maxFiles: 1,
  });

  const handleUpload = async () => {
    if (!file) return;
    
    setUploading(true);
    setErrorMessage('');
    const formData = new FormData();
    formData.append('file', file);
    
    try {
      await api.post('/import/csv', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setUploadStatus('success');
      setFile(null);
    } catch (error: unknown) {
      setUploadStatus('error');
      const err = error as { response?: { data?: { error?: string } } };
      setErrorMessage(err.response?.data?.error || 'Failed to import transactions');
    } finally {
      setUploading(false);
    }
  };

  const clearFile = () => {
    setFile(null);
    setUploadStatus('idle');
    setErrorMessage('');
  };

  return (
    <div className="bg-card border-4 border-black p-6 sm:p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
      <h2 className="text-lg sm:text-xl font-bold text-tertiary font-['Lexend'] uppercase tracking-wider mb-6 flex items-center gap-2">
        <Upload className="h-5 w-5" />
        Import Transactions
      </h2>
      <div className="space-y-6">
        <div
          {...getRootProps()}
          className={`border-4 border-dashed p-8 text-center cursor-pointer transition-all ${
            isDragActive ? 'border-primary bg-primary/5' : 'border-border hover:border-primary'
          }`}
        >
          <input {...getInputProps()} />
          <Upload className="mx-auto h-12 w-12 text-muted-foreground" />
          <p className="mt-4 text-foreground font-bold uppercase tracking-tight">
            {isDragActive ? 'Drop the CSV file here...' : 'Drag and drop a CSV file, or click to select'}
          </p>
          <p className="mt-2 text-xs font-bold text-muted-foreground uppercase tracking-widest">
            Supports bank statements from 40+ Indian banks
          </p>
        </div>

        <AnimatePresence>
          {file && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="mt-4 flex items-center justify-between p-4 bg-surface-low border-2 border-black"
            >
              <div className="flex items-center gap-3">
                <File className="h-5 w-5 text-primary" />
                <div>
                  <p className="font-bold text-foreground truncate max-w-[200px]">{file.name}</p>
                  <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">
                    {(file.size / 1024).toFixed(1)} KB
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button 
                  onClick={handleUpload} 
                  disabled={uploading}
                  className="neo-btn bg-tertiary text-tertiary-foreground border-2 border-black"
                >
                  {uploading ? 'Uploading...' : 'Upload'}
                </Button>
                <Button 
                  variant="outline" 
                  size="icon" 
                  onClick={clearFile}
                  className="border-2 border-black bg-background text-foreground hover:bg-surface-high"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {uploadStatus === 'success' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-4 flex items-center gap-2 text-green-500 font-bold uppercase text-sm tracking-tight"
          >
            <CheckCircle className="h-5 w-5" />
            <span>Transactions imported successfully!</span>
          </motion.div>
        )}

        {uploadStatus === 'error' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-4 flex items-center gap-2 text-destructive font-bold uppercase text-sm tracking-tight"
          >
            <AlertCircle className="h-5 w-5" />
            <span>{errorMessage || 'Failed to import transactions. Please check your CSV format.'}</span>
          </motion.div>
        )}
      </div>
    </div>
  );
};