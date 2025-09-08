// This application uses localStorage on the client side only
// Server doesn't persist any data - it's a stateless API proxy
export interface IStorage {
  // No server-side storage needed for this application
}

export class MemStorage implements IStorage {
  constructor() {
    // No server-side storage implementation needed
  }
}

export const storage = new MemStorage();
