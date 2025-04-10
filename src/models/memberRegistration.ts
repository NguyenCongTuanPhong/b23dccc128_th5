import { useState } from 'react';
import { IMemberRegistration, IActionHistory } from '@/interfaces/member';

export default () => {
  const [registrations, setRegistrations] = useState<IMemberRegistration[]>([]);
  const [actionHistory, setActionHistory] = useState<IActionHistory[]>([]);

  const addRegistration = (registration: IMemberRegistration) => {
    setRegistrations([...registrations, registration]);
  };

  const updateRegistration = (id: string, updatedData: Partial<IMemberRegistration>) => {
    setRegistrations(registrations.map(reg =>
      reg.id === id ? { ...reg, ...updatedData } : reg
    ));
  };

  const deleteRegistration = (id: string) => {
    setRegistrations(registrations.filter(reg => reg.id !== id));
  };

  const addActionHistory = (history: IActionHistory) => {
    setActionHistory([...actionHistory, history]);
  };

  const getRegistrationHistory = (registrationId: string) => {
    return actionHistory.filter(history => history.registrationId === registrationId);
  };

  const bulkUpdateStatus = (ids: string[], status: 'approved' | 'rejected', reason?: string) => {
    const updatedRegistrations = registrations.map(reg => {
      if (ids.includes(reg.id)) {
        return {
          ...reg,
          status,
          ...(reason && { rejectReason: reason }),
        };
      }
      return reg;
    });
    setRegistrations(updatedRegistrations);

    // Add action history for each registration
    const newHistories = ids.map(id => ({
      id: Date.now().toString(),
      registrationId: id,
      action: status as 'approve' | 'reject',
      actionBy: 'Admin',
      actionAt: new Date().toISOString(),
      ...(reason && { reason }),
    }));
    setActionHistory([...actionHistory, ...newHistories]);
  };

  return {
    registrations,
    actionHistory,
    addRegistration,
    updateRegistration,
    deleteRegistration,
    addActionHistory,
    getRegistrationHistory,
    bulkUpdateStatus,
  };
}; 