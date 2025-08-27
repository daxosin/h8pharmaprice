import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  TrendingUpIcon, 
  ExternalLinkIcon, 
  SearchIcon, 
  SaveIcon, 
  HistoryIcon,
  AlertTriangleIcon 
} from "lucide-react";
import { CalculationResults } from "@/types/calculator";

interface MarketComparisonProps {
  pvttcMarche: number;
  onPvttcMarcheChange: (value: number) => void;
  results?: CalculationResults;
  onSaveHistory: () => void;
  onViewHistory: () => void;
}

export function MarketComparison({
  pvttcMarche,
  onPvttcMarcheChange,
  results,
  onSaveHistory,
  onViewHistory
}: MarketComparisonProps) {
  return (
    <Card className="bg-h8-card/80 backdrop-blur-md border-h8-border">
      <CardContent className="p-6">
        <h3 className="text-xl font-semibold text-h8-green mb-6 flex items-center font-montserrat">
          <TrendingUpIcon className="w-5 h-5 mr-2" />
          Comparaison marché
        </h3>

        {/* SantéStat Link */}
        <div className="mb-6 p-4 bg-blue-900/30 border border-blue-500/30 rounded-lg">
          <div className="flex items-center mb-2">
            <ExternalLinkIcon className="w-5 h-5 text-blue-400 mr-2" />
            <span className="text-sm font-semibold text-blue-400">Consultation SantéStat</span>
          </div>
          <Button
            asChild
            className="bg-blue-600 hover:bg-blue-700 text-white"
            size="sm"
          >
            <a 
              href="https://portal.santestat.fr/login" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center"
            >
              <SearchIcon className="w-4 h-4 mr-2" />
              Consulter les prix marché
            </a>
          </Button>
          <p className="text-xs text-gray-400 mt-2">
            Consultez les prix moyens observés sur le marché pour ce type de produit
          </p>
        </div>

        {/* Market Price Input */}
        <div className="mb-6">
          <Label htmlFor="pvttcMarche" className="text-gray-300">
            PVTTC moyen marché (saisie manuelle)
          </Label>
          <div className="relative mt-2">
            <Input
              id="pvttcMarche"
              type="number"
              step="0.01"
              value={pvttcMarche || ''}
              onChange={(e) => onPvttcMarcheChange(parseFloat(e.target.value) || 0)}
              placeholder="0,00"
              className="bg-gray-800 border-gray-600 text-white focus:border-h8-green pr-8"
            />
            <span className="absolute right-3 top-2 text-gray-400 text-sm">€</span>
          </div>
          <p className="text-xs text-gray-400 mt-1">
            Prix observé sur SantéStat ou études de marché
          </p>
        </div>

        {/* Final Price Calculation */}
        <div className="space-y-4">
          <div className="p-4 bg-gray-800/80 rounded-lg">
            <h4 className="text-sm font-semibold text-gray-300 mb-2">Analyse comparative</h4>
            <div className="text-sm text-gray-400 mb-3">
              {results?.comparisonText || 'Saisissez le prix marché pour voir l\'analyse'}
            </div>
            <div className="flex justify-between items-center border-t border-gray-600 pt-3">
              <span className="text-white font-semibold">Prix final recommandé:</span>
              <span className="text-h8-green font-bold text-xl">
                {results ? results.pvttcFinal.toFixed(2) : '0,00'} €
              </span>
            </div>
          </div>

          {/* Price Difference Alert */}
          {results?.showAlert && (
            <Alert className="bg-yellow-900/30 border-yellow-500/30">
              <AlertTriangleIcon className="h-4 w-4 text-yellow-400" />
              <AlertDescription className="text-yellow-200">
                <span className="font-semibold text-yellow-400">Écart important détecté</span>
                <br />
                L'écart entre le prix estimé et le prix marché dépasse 20%
              </AlertDescription>
            </Alert>
          )}
        </div>

        {/* History Actions */}
        <div className="mt-6 pt-6 border-t border-gray-600">
          <h4 className="text-sm font-semibold text-gray-300 mb-3">Actions</h4>
          <div className="space-y-2">
            <Button
              onClick={onSaveHistory}
              className="w-full bg-green-600 hover:bg-green-700 text-white"
              size="sm"
            >
              <SaveIcon className="w-4 h-4 mr-2" />
              Sauvegarder dans l'historique
            </Button>
            <Button
              onClick={onViewHistory}
              variant="outline"
              className="w-full bg-gray-600 hover:bg-gray-700 text-white border-gray-600"
              size="sm"
            >
              <HistoryIcon className="w-4 h-4 mr-2" />
              Voir l'historique
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
