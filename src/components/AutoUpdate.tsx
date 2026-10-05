'use client';

import { useEffect, useState } from 'react';

const POLL_INTERVAL = 30 * 60 * 1000; // 30 minutos
const API_VERSION_URL = '/api/version';

interface VersionResponse {
  version: string;
  buildDate: string;
  timestamp: string;
}

export function AutoUpdate() {
  const [localVersion, setLocalVersion] = useState<string>('');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    // Get initial version from when the page loaded
    const storedVersion = sessionStorage.getItem('webtense-version');
    if (!storedVersion && globalThis.window) {
      // Set the initial version from script
      const script = document.querySelector('script[data-version]');
      if (script?.getAttribute('data-version')) {
        setLocalVersion(script.getAttribute('data-version') || '');
        sessionStorage.setItem('webtense-version', script.getAttribute('data-version') || '');
      }
    }

    // Check for updates every 30 minutes
    const checkVersion = async () => {
      try {
        const response = await fetch(API_VERSION_URL, { cache: 'no-store' });
        if (!response.ok) return;

        const data: VersionResponse = await response.json();
        const currentVersion = storedVersion || localVersion;

        // If version mismatch detected, reload page to get latest
        if (currentVersion && data.version !== currentVersion) {
          console.log(`WebtenseEnergy update available: ${currentVersion} → ${data.version}`);
          // Show notification and reload
          showUpdateNotification();
          setTimeout(() => {
            window.location.reload();
          }, 3000);
        }
      } catch (error) {
        console.error('Failed to check for updates:', error);
      }
    };

    // Initial check after a delay
    const initialCheckTimer = setTimeout(() => {
      checkVersion();
    }, 5000);

    // Then check periodically
    const interval = setInterval(checkVersion, POLL_INTERVAL);

    return () => {
      clearTimeout(initialCheckTimer);
      clearInterval(interval);
    };
  }, [localVersion]);

  if (!mounted) return null;
  return null;
}

function showUpdateNotification() {
  // Create a subtle notification
  const notification = document.createElement('div');
  notification.className =
    'fixed bottom-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg animate-pulse z-50';
  notification.textContent = '🔄 Actualizando WebtenseEnergy...';
  document.body.appendChild(notification);
}
