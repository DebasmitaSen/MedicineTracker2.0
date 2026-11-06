import React, { useState } from 'react';
import api from '../services/api';
import { UploadCloud, Loader2 } from 'lucide-react';

export const PrescriptionUpload = ({ onExtractSuccess }: { onExtractSuccess: (data: any) => void }) => {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const handleUpload = async () => {
    if (!file) return;
    setLoading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await api.post('/prescriptions/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      onExtractSuccess(response.data);
    } catch (error) {
      alert("Failed to process prescription. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-10 p-8 border-2 border-dashed border-blue-300 rounded-lg bg-blue-50 text-center">
      <UploadCloud className="w-16 h-16 text-blue-500 mx-auto mb-4" />
      <h2 className="text-2xl font-bold mb-2">Upload Prescription</h2>
      <p className="text-gray-600 mb-6">Select a handwritten JPG, PNG, or PDF file</p>
      
      <input 
        type="file" 
        onChange={(e) => setFile(e.target.files?.[0] || null)} 
        className="mb-4 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-blue-100 file:text-blue-700 hover:file:bg-blue-200"
      />
      
      <button 
        onClick={handleUpload}
        disabled={!file || loading}
        className="w-full bg-blue-600 text-white font-bold py-3 rounded disabled:opacity-50 flex justify-center items-center gap-2"
      >
        {loading ? <Loader2 className="animate-spin" /> : "Process with AI"}
      </button>
    </div>
  );
};