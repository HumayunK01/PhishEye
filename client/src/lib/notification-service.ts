class NotificationService {
  private permission: NotificationPermission = 'default';
  private audioContext: AudioContext | null = null;

  constructor() {
    this.initializeAudioContext();
  }

  private initializeAudioContext() {
    try {
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    } catch (error) {
      console.warn('Audio context not supported:', error);
    }
  }

  async requestPermission(): Promise<boolean> {
    if (!('Notification' in window)) {
      console.warn('This browser does not support notifications');
      return false;
    }

    if (this.permission === 'granted') {
      return true;
    }

    if (this.permission === 'denied') {
      return false;
    }

    try {
      this.permission = await Notification.requestPermission();
      return this.permission === 'granted';
    } catch (error) {
      console.error('Error requesting notification permission:', error);
      return false;
    }
  }

  async showNotification(title: string, options: NotificationOptions = {}) {
    if (!this.permission || this.permission !== 'granted') {
      const granted = await this.requestPermission();
      if (!granted) {
        console.warn('Notification permission denied');
        return;
      }
    }

    try {
      const notification = new Notification(title, {
        icon: '/favicon.ico',
        badge: '/favicon.ico',
        ...options
      });

      // Auto-close after 5 seconds
      setTimeout(() => {
        notification.close();
      }, 5000);

      return notification;
    } catch (error) {
      console.error('Error showing notification:', error);
    }
  }

  async playSound(type: 'success' | 'warning' | 'error' = 'success') {
    if (!this.audioContext) return;

    try {
      const oscillator = this.audioContext.createOscillator();
      const gainNode = this.audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(this.audioContext.destination);

      // Different frequencies for different types
      const frequencies = {
        success: [523.25, 659.25, 783.99], // C5, E5, G5
        warning: [440, 554.37], // A4, C#5
        error: [220, 196] // A3, G3
      };

      const freq = frequencies[type];
      const duration = 0.2;

      oscillator.frequency.setValueAtTime(freq[0], this.audioContext.currentTime);
      gainNode.gain.setValueAtTime(0.1, this.audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + duration);

      oscillator.start(this.audioContext.currentTime);
      oscillator.stop(this.audioContext.currentTime + duration);

      // Play chord for success
      if (type === 'success' && freq.length > 1) {
        setTimeout(() => {
          const osc2 = this.audioContext!.createOscillator();
          const gain2 = this.audioContext!.createGain();
          
          osc2.connect(gain2);
          gain2.connect(this.audioContext!.destination);
          
          osc2.frequency.setValueAtTime(freq[1], this.audioContext!.currentTime);
          gain2.gain.setValueAtTime(0.1, this.audioContext!.currentTime);
          gain2.gain.exponentialRampToValueAtTime(0.01, this.audioContext!.currentTime + duration);
          
          osc2.start(this.audioContext!.currentTime);
          osc2.stop(this.audioContext!.currentTime + duration);
        }, 100);
      }
    } catch (error) {
      console.error('Error playing sound:', error);
    }
  }

  vibrate(pattern: number | number[] = [200, 100, 200]) {
    if ('vibrate' in navigator) {
      try {
        navigator.vibrate(pattern);
      } catch (error) {
        console.error('Error vibrating:', error);
      }
    }
  }

  async notifyThreatDetected(score: number, url: string, verdict: string) {
    const isHighRisk = score >= 70;
    const isMediumRisk = score >= 40 && score < 70;
    
    const title = isHighRisk ? '🚨 High Risk Detected' : 
                  isMediumRisk ? '⚠️ Suspicious Activity' : 
                  '✅ Analysis Complete';
    
    const body = `${verdict} - ${url}`;
    
    const notification = await this.showNotification(title, {
      body,
      tag: 'threat-detection',
      requireInteraction: isHighRisk,
      actions: [
        {
          action: 'view',
          title: 'View Details'
        },
        {
          action: 'dismiss',
          title: 'Dismiss'
        }
      ]
    });

    return notification;
  }

  async notifyAnalysisComplete(score: number, url: string, verdict: string) {
    const title = 'Analysis Complete';
    const body = `${verdict} - ${url}`;
    
    return this.showNotification(title, {
      body,
      tag: 'analysis-complete'
    });
  }

  async notifyError(message: string) {
    const title = 'Analysis Error';
    
    return this.showNotification(title, {
      body: message,
      tag: 'analysis-error',
      requireInteraction: true
    });
  }
}

export const notificationService = new NotificationService();
