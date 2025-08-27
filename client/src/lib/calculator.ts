import { TvaRate, ProductType } from "@shared/schema";

// Fonction pour arrondir au 0,05 centime le plus proche
export function roundToNearestFiveCents(price: number): number {
  return Math.round(price * 20) / 20;
}

// Fonction pour obtenir le taux de TVA automatique selon le type de produit
export function getDefaultTvaRate(productType: ProductType): TvaRate {
  switch (productType) {
    case 'parapharmacie':
      return '20'; // TVA normale pour parapharmacie
    case 'homeopathie-tg':
    case 'homeopathie-dose':
      return '2.1'; // TVA réduite pour médicaments homéopathiques remboursables
    case 'homeopathie-magistral':
      return '10'; // TVA 10% pour préparations magistrales homéopathiques (majoritairement non remboursables depuis 2021)
    case 'pilule-contraceptive':
      return '5.5'; // TVA réduite pour contraceptifs
    case 'lait-infantile':
      return '5.5'; // TVA réduite pour produits de première nécessité
    case 'veterinaire':
      return '10'; // TVA intermédiaire pour produits vétérinaires
    default:
      return '20'; // TVA normale par défaut
  }
}

export function calculateCoefficient(
  productType: ProductType,
  tva: TvaRate
): number {
  // Pilule contraceptive à prix libre - coefficient forcé à 1.2
  if (productType === 'pilule-contraceptive') {
    return 1.2;
  }

  // Typologie spéciale - coefficient 1.2
  if (productType === 'lait-infantile' || productType === 'veterinaire') {
    return 1.2;
  }

  // Coefficient basé sur la TVA
  const tvaValue = parseFloat(tva);
  if (tvaValue === 2.1) return 1.5;
  if (tvaValue === 5.5 || tvaValue === 10) return 1.6;
  if (tvaValue === 20) return 1.7;

  return 1.7; // default
}

export function calculatePricing(
  phtRemise: number,
  coefficient: number,
  pvttcMarche?: number
) {
  // Calcul du PVTTC estimé à partir du prix HT remisé (arrondi au 0,05 centime)
  const pvttcEstime = roundToNearestFiveCents(phtRemise * coefficient);

  // Calcul du prix final basé sur la comparaison marché
  let pvttcFinal = pvttcEstime;
  let comparisonText = 'Prix final basé sur le calcul automatique';
  
  if (pvttcMarche && pvttcMarche > 0) {
    if (pvttcMarche < pvttcEstime) {
      // Moyenne entre prix marché et prix estimé
      pvttcFinal = (pvttcMarche + pvttcEstime) / 2;
      comparisonText = 'Prix final: moyenne entre prix marché et prix estimé';
    } else {
      // Prix marché retenu
      pvttcFinal = pvttcMarche;
      comparisonText = 'Prix final: prix marché retenu';
    }
  }

  // Arrondir le prix final au 0,05 centime le plus proche
  pvttcFinal = roundToNearestFiveCents(pvttcFinal);

  // Calcul de l'écart pour alerte
  const priceDifference = pvttcMarche && pvttcMarche > 0 
    ? Math.abs(pvttcEstime - pvttcMarche) / pvttcEstime 
    : 0;
  
  const showAlert = priceDifference > 0.2; // Alerte si écart > 20%

  return {
    pvttcEstime,
    pvttcFinal,
    comparisonText,
    showAlert,
    priceDifference
  };
}

export function getProductStatusText(productType: string): string {
  if (productType === 'pilule-contraceptive') {
    return 'Pilule contraceptive – prix libre';
  }
  
  if (productType === 'lait-infantile') {
    return 'Lait infantile (hors Gallia)';
  }
  
  if (productType === 'veterinaire') {
    return 'Produit vétérinaire';
  }
  
  if (productType.startsWith('homeopathie')) {
    const type = productType.split('-')[1]?.toUpperCase() || '';
    return `Homéopathie – ${type}`;
  }
  
  if (productType === 'parapharmacie') {
    return 'Produit parapharmacie';
  }
  
  return 'Veuillez sélectionner un type de produit';
}
