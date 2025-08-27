export interface CalculationHistory {
  id: string;
  timestamp: string;
  productName: string;
  productType: string;
  phtRemise: number;
  tva: number;
  coefficient: number;
  pvttcEstime: number;
  pvttcMarche?: number;
  pvttcFinal: number;
}

export interface CalculationState {
  productName: string;
  productType: string;
  phtRemise: number;
  tva: string;
  pvttcMarche: number;
}

export interface CalculationResults {
  phtRemise: number;
  coefficient: number;
  pvttcEstime: number;
  pvttcFinal: number;
  comparisonText: string;
  showAlert: boolean;
  priceDifference: number;
}
