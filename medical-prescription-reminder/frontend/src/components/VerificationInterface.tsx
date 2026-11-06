import React, { useState } from 'react';
import api from '../services/api';

interface MedicineData {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
  food_instruction: string;
  has_uncertainty: boolean;
}

export const VerificationInterface = ({ prescriptionId, initialData, onComplete }: { prescriptionId: string, initialData: MedicineData[], onComplete: () => void }) => {
  const [medicines, setMedicines] = useState<MedicineData[]>(initialData);

  const handleUpdate = (index: number, field: keyof MedicineData, value: string) => {
    const updated = [...medicines];
    updated[index] = { ...updated[index], [field]: value };
    setMedicines(updated);
  };

  const handleActivateSchedule = async () => {
    const hasErrors = medicines.some(m => m.name.includes('UNREADABLE') || m.dosage.includes('UNREADABLE'));
    if (hasErrors) {
      alert("⚠️ Please correct 'UNREADABLE' fields manually before activating. Consult your doctor if unsure.");
      return;
    }

    try {
      await api.post(`/prescriptions/${prescriptionId}/verify`, { medicines });
      alert("Schedule verified and activated successfully.");
      onComplete();
    } catch (error) {
      alert("Failed to save schedule.");
    }
  };

  return (
    <div className="max-w-4xl mx-auto mt-10 p-6 bg-white rounded shadow-md border border-gray-200">
      <h2 className="text-2xl font-bold text-red-600 mb-2">⚠️ Medical Verification Required</h2>
      <p className="mb-6 text-gray-700">Review the extracted information against your physical prescription. Do not activate if unsure.</p>
      
      {medicines.map((med, idx) => (
        <div key={med.id} className={`p-4 mb-4 border rounded ${med.has_uncertainty ? 'border-red-400 bg-red-50' : 'border-gray-300'}`}>
          {med.has_uncertainty && <p className="text-red-700 font-bold mb-3 flex items-center gap-2">⚠️ Uncertain text detected! Please verify manually.</p>}
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Medicine Name</label>
              <input type="text" value={med.name} onChange={(e) => handleUpdate(idx, 'name', e.target.value)} className="w-full border border-gray-300 p-2 rounded focus:ring-blue-500 focus:border-blue-500" />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Dosage</label>
              <input type="text" value={med.dosage} onChange={(e) => handleUpdate(idx, 'dosage', e.target.value)} className="w-full border border-gray-300 p-2 rounded focus:ring-blue-500 focus:border-blue-500" />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Frequency</label>
              <input type="text" value={med.frequency} onChange={(e) => handleUpdate(idx, 'frequency', e.target.value)} className="w-full border border-gray-300 p-2 rounded focus:ring-blue-500 focus:border-blue-500" />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Instructions (Food)</label>
              <input type="text" value={med.food_instruction} onChange={(e) => handleUpdate(idx, 'food_instruction', e.target.value)} className="w-full border border-gray-300 p-2 rounded focus:ring-blue-500 focus:border-blue-500" />
            </div>
          </div>
        </div>
      ))}

      <button onClick={handleActivateSchedule} className="w-full bg-green-600 text-white font-bold py-3 rounded mt-4 hover:bg-green-700 transition-colors">
        Confirm & Activate Schedule
      </button>
    </div>
  );
};