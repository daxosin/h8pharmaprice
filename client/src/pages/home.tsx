import React, { useState, useEffect, useCallback } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { CrossIcon } from "lucide-react";
import { CalculatorForm } from "@/components/calculator-form";
import { CalculationDisplay } from "@/components/calculation-display";
import { MarketComparison } from "@/components/market-comparison";
import { HistoryModal } from "@/components/history-modal";
import { ThemeToggle } from "@/components/theme-toggle";
import { AnalyticsDashboard } from "@/components/analytics-dashboard";
import { calculateCoefficient, calculatePricing, getDefaultTvaRate } from "@/lib/calculator";
import { saveToHistory, getHistory, clearHistory, deleteHistoryItem } from "@/lib/storage";

import { CalculationState, CalculationResults, CalculationHistory } from "@/types/calculator";

export default function Home() {
  const { toast } = useToast();

  const [formData, setFormData] = useState<CalculationState>({
    productName: '',
    productType: '',
    phtRemise: 0,
    tva: '20',
    pvttcMarche: 0
  });

  const [results, setResults] = useState<CalculationResults>();
  const [showHistory, setShowHistory] = useState(false);
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [history, setHistory] = useState<CalculationHistory[]>([]);

  // Load history on component mount
  useEffect(() => {
    setHistory(getHistory());
  }, []);

  // Auto-calculate when form data changes
  useEffect(() => {
    if (formData.productType && formData.phtRemise > 0) {
      performCalculation();
    }
  }, [formData]);

  const handleFormChange = useCallback((field: keyof CalculationState, value: any) => {
    setFormData(prev => {
      const newData = { ...prev, [field]: value };
      
      // Auto-sélection du taux de TVA quand le type de produit change
      if (field === 'productType' && value) {
        newData.tva = getDefaultTvaRate(value as any);
      }
      
      return newData;
    });
  }, []);

  const performCalculation = useCallback(() => {
    if (!formData.productType || formData.phtRemise <= 0) {
      setResults(undefined);
      return;
    }

    try {
      const coefficient = calculateCoefficient(
        formData.productType as any,
        formData.tva as any
      );

      const pricing = calculatePricing(
        formData.phtRemise,
        coefficient,
        formData.pvttcMarche || undefined
      );

      setResults({
        ...pricing,
        coefficient,
        phtRemise: formData.phtRemise
      });
    } catch (error) {
      console.error('Error calculating pricing:', error);
      toast({
        title: "Erreur de calcul",
        description: "Une erreur est survenue lors du calcul.",
        variant: "destructive"
      });
    }
  }, [formData, toast]);

  const handleSaveHistory = () => {
    if (!results || !formData.productName.trim()) {
      toast({
        title: "Sauvegarde impossible",
        description: "Veuillez saisir un nom de produit et effectuer un calcul.",
        variant: "destructive"
      });
      return;
    }

    const historyItem = {
      productName: formData.productName,
      productType: formData.productType,
      phtRemise: formData.phtRemise,
      tva: parseFloat(formData.tva),
      coefficient: results.coefficient,
      pvttcEstime: results.pvttcEstime,
      pvttcMarche: formData.pvttcMarche || undefined,
      pvttcFinal: results.pvttcFinal
    };

    saveToHistory(historyItem);
    setHistory(getHistory());
    
    toast({
      title: "Sauvegardé",
      description: "Le calcul a été ajouté à l'historique.",
    });
  };

  const handleDeleteHistoryItem = (id: string) => {
    deleteHistoryItem(id);
    setHistory(getHistory());
    toast({
      title: "Supprimé",
      description: "L'élément a été supprimé de l'historique.",
    });
  };

  const handleClearHistory = () => {
    clearHistory();
    setHistory([]);
    toast({
      title: "Historique vidé",
      description: "Tous les calculs ont été supprimés.",
    });
  };





  return (
    <div className="min-h-screen bg-h8-dark relative overflow-x-hidden">
      {/* Background with blur effect */}
      <div 
        className="fixed inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: "url('https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80')",
          filter: "blur(2px) brightness(0.3)"
        }}
      />
      
      <div className="relative z-10 min-h-screen bg-blur">
        {/* Header */}
        <header className="py-6 px-6">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Card className="bg-h8-green p-2 border-none">
                <CrossIcon className="w-8 h-8 text-white" />
              </Card>
              <div>
                <h1 className="text-2xl font-bold text-h8-green font-montserrat">H8Pharma</h1>
                <p className="text-sm text-gray-600 dark:text-gray-300">Système de gestion officine</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Button 
                onClick={() => setShowAnalytics(true)}
                variant="outline"
                size="icon"
                className="border-h8-green text-h8-green hover:bg-h8-green hover:text-white"
              >
                📊
              </Button>
              <ThemeToggle />
            </div>
          </div>
        </header>

        {/* Main Title Section */}
        <div className="px-6 mb-8">
          <div className="max-w-7xl mx-auto text-center">
            <h2 className="text-4xl font-bold text-h8-green mb-4 font-montserrat">H8PharmaPrix</h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Bienvenue sur <strong>H8PharmaPrix</strong>, l'outil de calcul tarifaire de la pharmacie <strong>H8Pharma</strong>. 
              Calculez en quelques clics le prix TTC applicable aux produits de parapharmacie, homéopathie et pilules contraceptives à partir du prix HT remisé.
            </p>
          </div>
        </div>

        {/* Main Application Grid */}
        <div className="px-6 pb-12">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left Column: Data Input */}
              <CalculatorForm
                formData={formData}
                onFormChange={handleFormChange}
                onCalculate={performCalculation}
              />

              {/* Center Column: Calculations */}
              <CalculationDisplay
                formData={formData}
                results={results}
              />

              {/* Right Column: Market Comparison */}
              <MarketComparison
                pvttcMarche={formData.pvttcMarche}
                onPvttcMarcheChange={(value) => handleFormChange('pvttcMarche', value)}
                results={results}

                onSaveHistory={handleSaveHistory}
                onViewHistory={() => setShowHistory(true)}
              />
            </div>
          </div>
        </div>

        {/* History Modal */}
        <HistoryModal
          isOpen={showHistory}
          onClose={() => setShowHistory(false)}
          history={history}
          onDeleteItem={handleDeleteHistoryItem}
          onClearHistory={handleClearHistory}
        />

        {/* Analytics Dashboard */}
        {showAnalytics && (
          <AnalyticsDashboard
            history={history}
            onClose={() => setShowAnalytics(false)}
          />
        )}

        {/* Footer */}
        <footer className="py-6 px-6 border-t border-gray-300 dark:border-gray-700">
          <div className="max-w-7xl mx-auto text-center">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              © 2025 H8Pharma - H8PharmaPrix | Application de calcul tarifaire pour officines
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
}
