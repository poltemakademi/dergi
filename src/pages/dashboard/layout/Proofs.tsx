import { useState, useRef } from 'react';
import { Upload, FileDown, CheckCircle, Eye, Check } from 'lucide-react';
import { apiClient } from '../../../services/api/client';
import { toast } from 'sonner';

export default function Proofs() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      toast.error('Please select a PDF proof to upload.');
      return;
    }

    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', selectedFile);
      formData.append('articleId', 'JMS-2025-015');

      await apiClient.post('/api/layout/upload-proof', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      toast.success('Galley proof uploaded successfully. Marked as ready for production.');
      setSelectedFile(null);
    } catch (err: any) {
      console.error('Failed to upload proof:', err);
      toast.error(err?.response?.data?.message || 'Failed to upload galley proof.');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="mb-8">
        <h2 className="text-2xl font-black text-slate-800">Galley Proofs Manager</h2>
        <p className="text-slate-500">Upload and finalize formatted PDFs for publication.</p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 pb-6 border-b border-slate-100 gap-4">
          <div>
            <span className="font-mono text-sm font-bold text-amber-600 bg-amber-50 px-2 py-1 rounded mb-3 inline-block">JMS-2025-015</span>
            <h3 className="text-xl font-bold text-slate-800">Historical Analysis of Trade Routes</h3>
            <p className="text-sm text-slate-500 mt-1">Author: Dr. Emily Chen</p>
          </div>
          <button className="flex items-center justify-center gap-2 px-4 py-2 border border-slate-200 text-slate-700 rounded-lg hover:bg-slate-50 font-bold text-sm transition-colors w-full md:w-auto">
            <FileDown className="w-4 h-4" /> Download Raw Source
          </button>
        </div>

        <div className="mb-8">
          <h4 className="text-sm font-bold text-slate-800 mb-4">Upload Formatted Galley Proof (PDF)</h4>
          
          <input 
            type="file" 
            ref={fileInputRef}
            onChange={handleFileChange}
            accept=".pdf"
            className="hidden"
          />

          <button 
            onClick={() => fileInputRef.current?.click()}
            className={`w-full border-2 border-dashed rounded-xl p-10 flex flex-col items-center justify-center text-center transition-colors ${selectedFile ? 'border-indigo-400 bg-indigo-50/50' : 'border-indigo-200 bg-indigo-50/30 hover:bg-indigo-50 hover:border-indigo-300'}`}
          >
            {selectedFile ? (
              <>
                <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center shadow-sm mb-4">
                  <Check className="w-8 h-8 text-indigo-600" />
                </div>
                <h5 className="font-bold text-indigo-900 mb-1">{selectedFile.name}</h5>
                <p className="text-sm text-indigo-600/70">Ready to upload</p>
              </>
            ) : (
              <>
                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-sm mb-4 group-hover:scale-110 transition-transform">
                  <Upload className="w-8 h-8 text-indigo-500" />
                </div>
                <h5 className="font-bold text-indigo-900 mb-1">Click or drag PDF here</h5>
                <p className="text-sm text-indigo-600/70">Ensure all author affiliations and styling adhere to the journal guidelines.</p>
              </>
            )}
          </button>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 border-t border-slate-100 pt-6">
          <button 
            disabled={!selectedFile || isUploading}
            className="flex-1 py-3 bg-slate-100 text-slate-700 font-bold rounded-xl hover:bg-slate-200 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
          >
            <Eye className="w-5 h-5" /> Preview Upload
          </button>
          <button 
            onClick={handleUpload}
            disabled={!selectedFile || isUploading}
            className="flex-1 py-3 bg-emerald-600 text-white font-bold rounded-xl hover:bg-emerald-700 shadow-lg shadow-emerald-600/20 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
          >
            <CheckCircle className="w-5 h-5" /> {isUploading ? 'Uploading...' : 'Mark as READY_FOR_PRODUCTION'}
          </button>
        </div>
      </div>
    </div>
  );
}
