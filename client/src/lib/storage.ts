import { CalculationHistory } from "@/types/calculator";

const STORAGE_KEY = 'h8pharmaprix_history';
const MAX_HISTORY_ITEMS = 50;

export function saveToHistory(calculation: Omit<CalculationHistory, 'id' | 'timestamp'>): void {
  const history = getHistory();
  const newItem: CalculationHistory = {
    ...calculation,
    id: Date.now().toString(),
    timestamp: new Date().toISOString()
  };
  
  history.unshift(newItem);
  
  // Garder seulement les 50 derniers calculs
  const trimmedHistory = history.slice(0, MAX_HISTORY_ITEMS);
  
  localStorage.setItem(STORAGE_KEY, JSON.stringify(trimmedHistory));
}

export function getHistory(): CalculationHistory[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Error loading history:', error);
    return [];
  }
}

export function clearHistory(): void {
  localStorage.removeItem(STORAGE_KEY);
}

export function deleteHistoryItem(id: string): void {
  const history = getHistory();
  const filteredHistory = history.filter(item => item.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(filteredHistory));
}
