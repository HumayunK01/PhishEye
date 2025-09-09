class EncryptionService {
  private key: CryptoKey | null = null;
  private readonly keyName = 'phishEyeEncryptionKey';

  async initializeKey(): Promise<boolean> {
    try {
      // Try to get existing key
      const existingKey = await crypto.subtle.importKey(
        'raw',
        new TextEncoder().encode(this.keyName),
        { name: 'PBKDF2' },
        false,
        ['deriveKey']
      );

      this.key = await crypto.subtle.deriveKey(
        {
          name: 'PBKDF2',
          salt: new TextEncoder().encode('phishEyeSalt'),
          iterations: 100000,
          hash: 'SHA-256'
        },
        existingKey,
        { name: 'AES-GCM', length: 256 },
        false,
        ['encrypt', 'decrypt']
      );

      return true;
    } catch (error) {
      console.warn('Failed to initialize encryption key:', error);
      return false;
    }
  }

  async encrypt(data: string): Promise<string> {
    if (!this.key) {
      const initialized = await this.initializeKey();
      if (!initialized) {
        console.warn('Encryption not available, storing data unencrypted');
        return data;
      }
    }

    try {
      const iv = crypto.getRandomValues(new Uint8Array(12));
      const encodedData = new TextEncoder().encode(data);
      
      const encryptedData = await crypto.subtle.encrypt(
        {
          name: 'AES-GCM',
          iv: iv
        },
        this.key!,
        encodedData
      );

      // Combine IV and encrypted data
      const combined = new Uint8Array(iv.length + encryptedData.byteLength);
      combined.set(iv);
      combined.set(new Uint8Array(encryptedData), iv.length);

      // Convert to base64
      return btoa(String.fromCharCode(...combined));
    } catch (error) {
      console.error('Encryption failed:', error);
      return data; // Return unencrypted data as fallback
    }
  }

  async decrypt(encryptedData: string): Promise<string> {
    if (!this.key) {
      const initialized = await this.initializeKey();
      if (!initialized) {
        console.warn('Decryption not available, returning data as-is');
        return encryptedData;
      }
    }

    try {
      // Convert from base64
      const combined = new Uint8Array(
        atob(encryptedData).split('').map(char => char.charCodeAt(0))
      );

      // Extract IV and encrypted data
      const iv = combined.slice(0, 12);
      const encrypted = combined.slice(12);

      const decryptedData = await crypto.subtle.decrypt(
        {
          name: 'AES-GCM',
          iv: iv
        },
        this.key!,
        encrypted
      );

      return new TextDecoder().decode(decryptedData);
    } catch (error) {
      console.error('Decryption failed:', error);
      return encryptedData; // Return as-is if decryption fails
    }
  }

  anonymizeData(data: any): any {
    if (typeof data !== 'object' || data === null) {
      return data;
    }

    const anonymized = { ...data };

    // Remove or hash identifying information
    const sensitiveFields = ['ip', 'userAgent', 'referrer', 'timestamp', 'id'];
    
    for (const field of sensitiveFields) {
      if (field in anonymized) {
        if (field === 'timestamp') {
          // Round timestamp to nearest hour
          anonymized[field] = new Date(
            Math.floor(new Date(anonymized[field]).getTime() / (1000 * 60 * 60)) * (1000 * 60 * 60)
          ).toISOString();
        } else if (field === 'id') {
          // Hash the ID
          anonymized[field] = this.hashString(anonymized[field]);
        } else {
          // Remove other sensitive fields
          delete anonymized[field];
        }
      }
    }

    // Recursively anonymize nested objects
    for (const key in anonymized) {
      if (typeof anonymized[key] === 'object' && anonymized[key] !== null) {
        anonymized[key] = this.anonymizeData(anonymized[key]);
      }
    }

    return anonymized;
  }

  private hashString(str: string): string {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return Math.abs(hash).toString(36);
  }

  async processDataForStorage(data: any, encrypt: boolean, anonymize: boolean): Promise<any> {
    let processedData = data;

    if (anonymize) {
      processedData = this.anonymizeData(processedData);
    }

    if (encrypt) {
      const jsonString = JSON.stringify(processedData);
      const encryptedString = await this.encrypt(jsonString);
      return { encrypted: true, data: encryptedString };
    }

    return processedData;
  }

  async processDataFromStorage(data: any): Promise<any> {
    if (data && typeof data === 'object' && data.encrypted) {
      try {
        const decryptedString = await this.decrypt(data.data);
        return JSON.parse(decryptedString);
      } catch (error) {
        console.error('Failed to decrypt data:', error);
        return data;
      }
    }

    return data;
  }
}

export const encryptionService = new EncryptionService();
