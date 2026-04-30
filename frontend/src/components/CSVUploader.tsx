import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, File, X, CheckCircle, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
    <Card className="bg-slate-900 border-slate-700">
      <CardHeader>
        <CardTitle className="text-white">Import Transactions</CardTitle>
      </CardHeader>
      <CardContent>
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
            isDragActive ? 'border-amber-500 bg-amber-500/5' : 'border-slate-700 hover:border-slate-600'
          }`}
        >
          <input {...getInputProps()} />
          <Upload className="mx-auto h-12 w-12 text-slate-400" />
          <p className="mt-4 text-slate-400">
            {isDragActive ? 'Drop the CSV file here...' : 'Drag and drop a CSV file, or click to select'}
          </p>
          <p className="mt-2 text-sm text-slate-500">
            Supports bank statements from 40+ Indian banks
          </p>
        </div>

        <AnimatePresence>
          {file && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="mt-4 flex items-center justify-between p-4 bg-slate-800 rounded-lg"
            >
              <div className="flex items-center gap-3">
                <File className="h-5 w-5 text-slate-400" />
                <span className="font-medium text-white">{file.name}</span>
                <span className="text-sm text-slate-500">
                  ({(file.size / 1024).toFixed(1)} KB)
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Button 
                  onClick={handleUpload} 
                  disabled={uploading}
                  className="bg-amber-500 hover:bg-amber-600 text-slate-900"
                >
                  {uploading ? 'Uploading...' : 'Upload'}
                </Button>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={clearFile}
                  className="text-slate-400 hover:text-white"
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
            className="mt-4 flex items-center gap-2 text-green-500"
          >
            <CheckCircle className="h-5 w-5" />
            <span>Transactions imported successfully!</span>
          </motion.div>
        )}

        {uploadStatus === 'error' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-4 flex items-center gap-2 text-red-500"
          >
            <AlertCircle className="h-5 w-5" />
            <span>{errorMessage || 'Failed to import transactions. Please check your CSV format.'}</span>
          </motion.div>
        )}
      </CardContent>
    </Card>
  );
};