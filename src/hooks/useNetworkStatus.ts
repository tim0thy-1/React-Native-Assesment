import { useState, useEffect, useCallback } from 'react';
import { AsyncStorage, STORAGE_KEYS } from '../services/storage';

type NetworkListener = (isOnline: boolean) => void;

const listeners = new Set<NetworkListener>();

// Read offline override state from storage or default to browser online state
let simulatedOffline = AsyncStorage.getItemSync(STORAGE_KEYS.OFFLINE_OVERRIDE) === 'true';

export function setSimulatedOffline(offline: boolean) {
  simulatedOffline = offline;
  AsyncStorage.setItem(STORAGE_KEYS.OFFLINE_OVERRIDE, offline ? 'true' : 'false').catch(() => {});
  const effectiveOnline = !simulatedOffline && (typeof navigator !== 'undefined' ? navigator.onLine : true);
  listeners.forEach((listener) => listener(effectiveOnline));
}

export function isCurrentlyOnline(): boolean {
  if (simulatedOffline) return false;
  if (typeof navigator !== 'undefined') {
    return navigator.onLine;
  }
  return true;
}

export function isOfflineSimulated(): boolean {
  return simulatedOffline;
}

/**
 * Hook to monitor online/offline connectivity.
 * Compatible with NetInfo behavior.
 */
export function useNetworkStatus() {
  const [isOnline, setIsOnline] = useState<boolean>(isCurrentlyOnline());
  const [isSimulated, setIsSimulated] = useState<boolean>(simulatedOffline);

  useEffect(() => {
    const updateStatus = () => {
      const online = isCurrentlyOnline();
      setIsOnline(online);
      setIsSimulated(simulatedOffline);
    };

    const handleBrowserOnline = () => updateStatus();
    const handleBrowserOffline = () => updateStatus();

    window.addEventListener('online', handleBrowserOnline);
    window.addEventListener('offline', handleBrowserOffline);

    const customListener: NetworkListener = (newStatus) => {
      setIsOnline(newStatus);
      setIsSimulated(simulatedOffline);
    };
    listeners.add(customListener);

    updateStatus();

    return () => {
      window.removeEventListener('online', handleBrowserOnline);
      window.removeEventListener('offline', handleBrowserOffline);
      listeners.delete(customListener);
    };
  }, []);

  const toggleAirplaneMode = useCallback(() => {
    const nextState = !simulatedOffline;
    setSimulatedOffline(nextState);
  }, []);

  return {
    isOnline,
    isOffline: !isOnline,
    isSimulatedOffline: isSimulated,
    toggleAirplaneMode,
  };
}
