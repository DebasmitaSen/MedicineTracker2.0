// frontend/src/components/DashboardCalendar.tsx
import React, { useState } from 'react';
import { Clock, CheckCircle2, XCircle, AlertCircle, BellRing } from 'lucide-react';

// Define the structure of a scheduled dose
export interface ScheduledDose {
  id: string;
  medicineName: string;
  dosage: string;
  scheduledTime: string; // e.g., "08:00 AM"
  foodInstruction: string;
  status: 'pending' | 'completed' | 'missed';
}

interface DashboardCalendarProps {
  // In a real app, this would be fetched from the backend API
  initialSchedule?: ScheduledDose[];
}

export const DashboardCalendar: React.FC<DashboardCalendarProps> = ({ initialSchedule }) => {
  // Fallback to sample data if no props are provided to demonstrate UI
  const [schedule, setSchedule] = useState<ScheduledDose[]>(initialSchedule || [
    {
      id: '1',
      medicineName: 'Amoxicillin',
      dosage: '500mg',
      scheduledTime: '08:00 AM',
      foodInstruction: 'After Food',
      status: 'completed',
    },
    {
      id: '2',
      medicineName: 'Lisinopril',
      dosage: '10mg',
      scheduledTime: '02:00 PM',
      foodInstruction: 'Before Food',
      status: 'pending',
    },
    {
      id: '3',
      medicineName: 'Atorvastatin',
      dosage: '20mg',
      scheduledTime: '09:00 PM',
      foodInstruction: 'After Food',
      status: 'pending',
    },
  ]);

  const handleAcknowledge = (id: string) => {
    // Optimistic UI update. In production, this makes a POST request to /api/v1/reminders/acknowledge
    setSchedule((prev) =>
      prev.map((dose) => (dose.id === id ? { ...dose, status: 'completed' } : dose))
    );
  };

  const getStatusConfig = (status: ScheduledDose['status']) => {
    switch (status) {
      case 'completed':
        return {
          color: 'bg-green-100 border-green-500 text-green-800',
          icon: <CheckCircle2 className="w-6 h-6 text-green-600" />,
          label: 'Taken',
        };
      case 'missed':
        return {
          color: 'bg-red-100 border-red-500 text-red-800',
          icon: <XCircle className="w-6 h-6 text-red-600" />,
          label: 'Missed',
        };
      case 'pending':
      default:
        return {
          color: 'bg-blue-50 border-blue-500 text-blue-900',
          icon: <Clock className="w-6 h-6 text-blue-600" />,
          label: 'Upcoming',
        };
    }
  };

  // Get current date string for display
  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="max-w-4xl mx-auto mt-8 p-6 bg-white rounded-xl shadow-sm border border-gray-100">
      <div className="flex justify-between items-center mb-8 border-b pb-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Today's Schedule</h2>
          <p className="text-gray-500">{today}</p>
        </div>
        <div className="bg-blue-100 text-blue-800 px-4 py-2 rounded-full flex items-center gap-2 font-semibold">
          <BellRing className="w-5 h-5" />
          {schedule.filter(s => s.status === 'pending').length} Pending
        </div>
      </div>

      <div className="space-y-4">
        {schedule.length === 0 ? (
          <div className="text-center py-10 text-gray-500">
            <AlertCircle className="w-12 h-12 mx-auto mb-3 text-gray-400" />
            <p>No medicines scheduled for today.</p>
          </div>
        ) : (
          schedule.map((dose) => {
            const config = getStatusConfig(dose.status);
            
            return (
              <div
                key={dose.id}
                className={`flex flex-col sm:flex-row sm:items-center justify-between p-4 border-l-4 rounded-r-lg shadow-sm transition-all duration-200 ${config.color}`}
              >
                <div className="flex items-center gap-4 mb-4 sm:mb-0">
                  <div className="p-2 bg-white rounded-full shadow-sm">
                    {config.icon}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold">{dose.medicineName}</h3>
                    <p className="text-sm opacity-90">
                      {dose.dosage} • {dose.foodInstruction}
                    </p>
                    <div className="mt-1 font-semibold text-lg tracking-tight">
                      {dose.scheduledTime}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  {dose.status === 'pending' ? (
                    <>
                      <button
                        onClick={() => handleAcknowledge(dose.id)}
                        className="flex-1 sm:flex-none px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded shadow transition-colors"
                      >
                        Mark as Taken
                      </button>
                      <button 
                        className="flex-1 sm:flex-none px-4 py-2 bg-white text-blue-700 font-bold border border-blue-200 rounded hover:bg-blue-50 transition-colors"
                        onClick={() => alert("Snooze feature triggered")}
                      >
                        Snooze
                      </button>
                    </>
                  ) : (
                    <div className="px-4 py-2 font-bold opacity-80 flex items-center gap-2">
                      {config.icon}
                      {config.label}
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};