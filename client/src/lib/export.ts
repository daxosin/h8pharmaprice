import { CalculationHistory } from "@/types/calculator";

export function exportToJSON(calculation: any, filename?: string): void {
  const dataStr = JSON.stringify(calculation, null, 2);
  const dataBlob = new Blob([dataStr], { type: 'application/json' });
  const url = URL.createObjectURL(dataBlob);
  
  const link = document.createElement('a');
  link.href = url;
  link.download = filename || `h8pharmaprix_${new Date().toISOString().slice(0, 10)}.json`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  URL.revokeObjectURL(url);
}

export function exportToCSV(calculations: CalculationHistory[], filename?: string): void {
  const headers = [
    'Date',
    'Produit',
    'Type',
    'PHT Brut',
    'Remise %',
    'PHT Remisé',
    'TVA %',
    'Coefficient',
    'PVTTC Estimé',
    'PVTTC Marché',
    'PVTTC Final'
  ];

  const csvContent = [
    headers.join(','),
    ...calculations.map(calc => [
      new Date(calc.timestamp).toLocaleDateString('fr-FR'),
      `"${calc.productName}"`,
      calc.productType,
      calc.phtBrut.toFixed(2),
      calc.remise,
      calc.phtRemise.toFixed(2),
      calc.tva,
      calc.coefficient,
      calc.pvttcEstime.toFixed(2),
      calc.pvttcMarche?.toFixed(2) || '',
      calc.pvttcFinal.toFixed(2)
    ].join(','))
  ].join('\n');

  const dataBlob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(dataBlob);
  
  const link = document.createElement('a');
  link.href = url;
  link.download = filename || `h8pharmaprix_export_${new Date().toISOString().slice(0, 10)}.csv`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  URL.revokeObjectURL(url);
}

export function generatePDFData(calculation: any): string {
  // Return HTML content for PDF generation
  return `
    <div style="font-family: Arial, sans-serif; padding: 20px;">
      <div style="text-align: center; margin-bottom: 30px;">
        <h1 style="color: #4ade80; font-size: 24px;">H8Pharma - H8PharmaPrix</h1>
        <p style="color: #666;">Calcul tarifaire parapharmacie</p>
        <p style="font-size: 12px; color: #999;">Généré le ${new Date().toLocaleDateString('fr-FR')}</p>
      </div>
      
      <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
        <tr>
          <td style="border: 1px solid #ddd; padding: 8px; background-color: #f9f9f9;"><strong>Produit:</strong></td>
          <td style="border: 1px solid #ddd; padding: 8px;">${calculation.productName}</td>
        </tr>
        <tr>
          <td style="border: 1px solid #ddd; padding: 8px; background-color: #f9f9f9;"><strong>Type:</strong></td>
          <td style="border: 1px solid #ddd; padding: 8px;">${calculation.productType}</td>
        </tr>
        <tr>
          <td style="border: 1px solid #ddd; padding: 8px; background-color: #f9f9f9;"><strong>Prix HT remisé:</strong></td>
          <td style="border: 1px solid #ddd; padding: 8px;">${calculation.phtRemise?.toFixed(2)} €</td>
        </tr>
        <tr>
          <td style="border: 1px solid #ddd; padding: 8px; background-color: #f9f9f9;"><strong>TVA:</strong></td>
          <td style="border: 1px solid #ddd; padding: 8px;">${calculation.tva} %</td>
        </tr>
        <tr>
          <td style="border: 1px solid #ddd; padding: 8px; background-color: #f9f9f9;"><strong>Coefficient:</strong></td>
          <td style="border: 1px solid #ddd; padding: 8px;">×${calculation.coefficient}</td>
        </tr>
        <tr style="background-color: #e8f5e8;">
          <td style="border: 1px solid #ddd; padding: 8px;"><strong>PVTTC Final:</strong></td>
          <td style="border: 1px solid #ddd; padding: 8px; font-size: 18px; color: #4ade80;"><strong>${calculation.pvttcFinal?.toFixed(2)} €</strong></td>
        </tr>
      </table>
      
      <div style="margin-top: 30px; text-align: center; font-size: 12px; color: #666;">
        <p>© 2025 H8Pharma - Application de calcul tarifaire pour officines</p>
      </div>
    </div>
  `;
}
