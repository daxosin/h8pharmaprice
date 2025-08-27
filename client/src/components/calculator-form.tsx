import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { EditIcon, CalculatorIcon } from "lucide-react";
import { CalculationState } from "@/types/calculator";

interface CalculatorFormProps {
  formData: CalculationState;
  onFormChange: (field: keyof CalculationState, value: any) => void;
  onCalculate: () => void;
}

export function CalculatorForm({
  formData,
  onFormChange,
  onCalculate
}: CalculatorFormProps) {


  return (
    <Card className="bg-h8-card/80 backdrop-blur-md border-h8-border">
      <CardContent className="p-6">
        <h3 className="text-xl font-semibold text-h8-green mb-6 flex items-center font-montserrat">
          <EditIcon className="w-5 h-5 mr-2" />
          Saisie des données
        </h3>

        <div className="space-y-4">
          <div>
            <Label htmlFor="productName" className="text-gray-700 dark:text-gray-300">Nom du produit</Label>
            <Input
              id="productName"
              value={formData.productName}
              onChange={(e) => onFormChange('productName', e.target.value)}
              placeholder="Ex: Cicaplast Baume LRP"
              className="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-800 dark:text-white focus:border-h8-green"
            />
          </div>

          <div>
            <Label htmlFor="productType" className="text-gray-700 dark:text-gray-300">Type de produit</Label>
            <Select value={formData.productType} onValueChange={(value) => onFormChange('productType', value)}>
              <SelectTrigger className="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-800 dark:text-white focus:border-h8-green">
                <SelectValue placeholder="Sélectionner..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="parapharmacie">Parapharmacie</SelectItem>
                <SelectItem value="homeopathie-tg">Homéopathie - TG</SelectItem>
                <SelectItem value="homeopathie-dose">Homéopathie - Dose</SelectItem>
                <SelectItem value="homeopathie-magistral">Homéopathie - Magistral</SelectItem>
                <SelectItem value="pilule-contraceptive">Pilule contraceptive à prix libre</SelectItem>
                <SelectItem value="lait-infantile">Lait infantile (hors Gallia)</SelectItem>
                <SelectItem value="veterinaire">Produit vétérinaire</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="phtRemise" className="text-gray-700 dark:text-gray-300">Prix HT remisé (€)</Label>
            <Input
              id="phtRemise"
              type="number"
              step="0.01"
              value={formData.phtRemise || ''}
              onChange={(e) => onFormChange('phtRemise', parseFloat(e.target.value) || 0)}
              placeholder="0.00"
              className="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-800 dark:text-white focus:border-h8-green"
            />
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Prix HT après application de la remise fournisseur
            </p>
          </div>

          <div>
            <Label htmlFor="tva" className="text-gray-700 dark:text-gray-300">
              TVA applicable (%)
              {formData.productType && (
                <span className="text-xs text-h8-green ml-2">• Auto-sélectionné</span>
              )}
            </Label>
            <Select 
              value={formData.tva} 
              onValueChange={(value) => onFormChange('tva', value)}
            >
              <SelectTrigger className="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-800 dark:text-white focus:border-h8-green">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="2.1">2,1% (Médicaments remboursables)</SelectItem>
                <SelectItem value="5.5">5,5% (Produits de santé)</SelectItem>
                <SelectItem value="10">10% (Médicaments non remboursables)</SelectItem>
                <SelectItem value="20">20% (Taux normal)</SelectItem>
              </SelectContent>
            </Select>
            {formData.productType && (
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                TVA automatiquement définie selon le type de produit sélectionné
              </p>
            )}
          </div>



          <Button
            onClick={onCalculate}
            className="w-full mt-6 bg-h8-green hover:bg-green-600 text-white font-semibold"
          >
            <CalculatorIcon className="w-5 h-5 mr-2" />
            Calculer le prix
          </Button>
        </div>


      </CardContent>
    </Card>
  );
}
