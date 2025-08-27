// This calculator app uses local storage for data persistence
// Server storage interface simplified for future extensions

export interface IStorage {
  // Future storage methods can be added here if needed
  // Currently the app uses client-side localStorage for calculations
}

export class MemStorage implements IStorage {
  constructor() {
    // Basic storage setup for future server-side features
  }
}

export const storage = new MemStorage();
