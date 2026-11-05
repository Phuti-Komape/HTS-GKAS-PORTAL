/* ═══════════════════════════════════════════════════════════
   PROGRESSIVE WEB APP (PWA) SERVICE
   Handles Service Worker registration, install prompts,
   and standalone home screen detection.
═══════════════════════════════════════════════════════════ */

import { showToast } from '../components/toast.js';

class PWAService {
  constructor() {
    this.deferredPrompt = null;
    this.isInstalled = false;
    this.listeners = [];
  }

  init() {
    // 1. Detect if already running in standalone mode (installed)
    this.isInstalled = 
      window.matchMedia('(display-mode: standalone)').matches ||
      window.navigator.standalone === true ||
      document.referrer.includes('android-app://');

    if (this.isInstalled) {
      console.log('✓ GKAS Portal running in standalone PWA mode');
    }

    // 2. Register Service Worker
    this.registerServiceWorker();

    // 3. Listen for BeforeInstallPrompt event (Chrome, Edge, Android)
    window.addEventListener('beforeinstallprompt', (e) => {
      // Prevent the mini-infobar from appearing on mobile
      e.preventDefault();
      // Stash the event so it can be triggered later.
      this.deferredPrompt = e;
      console.log('✓ PWA install prompt captured and ready');
      this.notifyListeners();
    });

    // 4. Listen for AppInstalled event
    window.addEventListener('appinstalled', () => {
      this.deferredPrompt = null;
      this.isInstalled = true;
      console.log('✓ GKAS Residence PWA successfully installed to home screen');
      showToast('📲', 'GKAS Residence App installed to home screen!', 'success');
      this.notifyListeners();
    });

    // 5. Watch for display-mode changes
    window.matchMedia('(display-mode: standalone)').addEventListener('change', (evt) => {
      this.isInstalled = evt.matches;
      this.notifyListeners();
    });
  }

  registerServiceWorker() {
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js', { scope: '/' })
          .then((registration) => {
            console.log('✓ Service Worker registered successfully with scope:', registration.scope);

            // Handle updates
            registration.onupdatefound = () => {
              const installingWorker = registration.installing;
              if (installingWorker) {
                installingWorker.onstatechange = () => {
                  if (installingWorker.state === 'installed') {
                    if (navigator.serviceWorker.controller) {
                      console.log('New content is available; please refresh.');
                    } else {
                      console.log('Content is cached for offline use.');
                    }
                  }
                };
              }
            };
          })
          .catch((error) => {
            console.warn('Service Worker registration failed:', error);
          });
      });
    }
  }

  canInstall() {
    return !this.isInstalled && this.deferredPrompt !== null;
  }

  async promptInstall() {
    if (!this.deferredPrompt) {
      // If iOS Safari, explain how to install via Share -> Add to Home Screen
      const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
      if (isIOS) {
        showToast('📲', 'To install on iOS: Tap Share (⎋) then "Add to Home Screen (+)"', 'info');
      } else {
        showToast('ℹ', 'App can be installed from your browser menu ("Install App" or "Add to Home screen")', 'info');
      }
      return false;
    }

    try {
      // Show the browser's install prompt
      this.deferredPrompt.prompt();
      // Wait for the user to respond to the prompt
      const choiceResult = await this.deferredPrompt.userChoice;
      if (choiceResult.outcome === 'accepted') {
        console.log('User accepted the PWA install prompt');
        showToast('✓', 'Installing GKAS Residence App...', 'success');
      } else {
        console.log('User dismissed the PWA install prompt');
      }
      this.deferredPrompt = null;
      this.notifyListeners();
      return choiceResult.outcome === 'accepted';
    } catch (err) {
      console.warn('Error during install prompt:', err);
      return false;
    }
  }

  subscribe(listener) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  notifyListeners() {
    this.listeners.forEach(fn => {
      try { fn({ canInstall: this.canInstall(), isInstalled: this.isInstalled }); } catch (e) {}
    });
  }
}

export const pwaService = new PWAService();
