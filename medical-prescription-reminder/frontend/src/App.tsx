import React, { useState } from 'react';
import { PrescriptionUpload } from './components/PrescriptionUpload';
import { VerificationInterface } from './components/VerificationInterface';

export default function App() {
  const [extractedData, setExtractedData] = useState<any>(null);

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans p-4">
      <header className="max-w-6xl mx-auto py-6 border-b border-gray-200 mb-8">
        <h1 className="text-3xl font-extrabold text-blue-900 tracking-tight">MedScript</h1>
        <p className="text-gray-500">AI-Powered Prescription Reader & Reminder</p>
      </header>
      
      <main>
        {!extractedData ? (
          <PrescriptionUpload onExtractSuccess={(data) => setExtractedData(data)} />
        ) : (
          <VerificationInterface 
            prescriptionId={extractedData.prescription_id} 
            initialData={extractedData.medicines} 
            onComplete={() => setExtractedData(null)}
          />
        )}
      </main>
    </div>
  );
}