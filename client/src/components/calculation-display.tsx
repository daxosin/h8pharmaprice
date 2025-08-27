import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { CalculatorIcon, InfoIcon, BookOpenIcon } from "lucide-react";
import { CalculationResults } from "@/types/calculator";
import { getProductStatusText } from "@/lib/calculator";

interface CalculationDisplayProps {
  formData: {
    productType: string;
    phtRemise: number;
    tva: string;
  };
  results?: CalculationResults;
}

export function CalculationDisplay({ formData, results }: CalculationDisplayProps) {
  const statusText = getProductStatusText(formData.productType);

  return (
    <Card className="bg-h8-card/80 backdrop-blur-md border-h8-border">
      <CardContent className="p-6">
        <h3 className="text-xl font-semibold text-h8-green mb-6 flex items-center font-montserrat">
          <CalculatorIcon className="w-5 h-5 mr-2" />
          Calculs automatiques
        </h3>

        {/* Product Status */}
        <div className="mb-6 p-4 bg-gray-100 dark:bg-gray-800/80 rounded-lg border-l-4 border-h8-green">
          <div className="flex items-center">
            <InfoIcon className="w-5 h-5 text-h8-green mr-2" />
            <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">Statut:</span>
          </div>
          <p className="text-gray-800 dark:text-white font-semibold mt-1">{statusText}</p>
        </div>

        {/* Calculations Table */}
        <div className="space-y-4">
          <div className="bg-gray-100 dark:bg-gray-800/80 rounded-lg p-4">
            <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">Détail des calculs</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between border-b border-gray-300 dark:border-gray-600 pb-2">
                <span className="text-gray-600 dark:text-gray-400">Prix HT remisé:</span>
                <span className="text-gray-800 dark:text-white font-semibold">
                  {formData.phtRemise.toFixed(2)} €
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">TVA:</span>
                <span className="text-gray-800 dark:text-white">{formData.tva} %</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Coefficient appliqué:</span>
                <span className="text-h8-green font-bold text-lg">
                  ×{results ? results.coefficient : '1,7'}
                </span>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-h8-green/20 to-green-600/20 border border-h8-green rounded-lg p-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-800 dark:text-white font-semibold">PVTTC estimé:</span>
              <span className="text-h8-green font-bold text-2xl">
                {results ? results.pvttcEstime.toFixed(2) : '0,00'} €
              </span>
            </div>
            <p className="text-xs text-gray-600 dark:text-gray-400 mt-2 text-center">
              Prix automatiquement arrondi au 0,05 centime le plus proche
            </p>
          </div>

          {/* Coefficient Rules Table */}
          <div className="bg-gray-100 dark:bg-gray-800/80 rounded-lg p-4 mt-6">
            <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 flex items-center">
              <BookOpenIcon className="w-4 h-4 mr-2" />
              Règles de coefficient
            </h4>
            <div className="text-xs space-y-1 text-gray-600 dark:text-gray-400">
              <div className="flex justify-between">
                <span>Pilule contraceptive prix libre:</span>
                <span className="text-h8-green">×1,2</span>
              </div>
              <div className="flex justify-between">
                <span>Lait infantile (hors Gallia):</span>
                <span className="text-h8-green">×1,2</span>
              </div>
              <div className="flex justify-between">
                <span>Produit vétérinaire:</span>
                <span className="text-h8-green">×1,2</span>
              </div>
              <div className="flex justify-between">
                <span>TVA 2,1%:</span>
                <span className="text-yellow-400">×1,5</span>
              </div>
              <div className="flex justify-between">
                <span>TVA 5,5% ou 10%:</span>
                <span className="text-orange-400">×1,6</span>
              </div>
              <div className="flex justify-between">
                <span>TVA 20%:</span>
                <span className="text-red-400">×1,7</span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
