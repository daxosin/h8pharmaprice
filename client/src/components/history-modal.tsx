import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { XIcon, TrashIcon } from "lucide-react";
import { CalculationHistory } from "@/types/calculator";

interface HistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  history: CalculationHistory[];
  onDeleteItem: (id: string) => void;

  onClearHistory: () => void;
}

export function HistoryModal({
  isOpen,
  onClose,
  history,
  onDeleteItem,
  onClearHistory
}: HistoryModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] bg-h8-card border-h8-border">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-h8-green font-montserrat">
            Historique des calculs
          </DialogTitle>
        </DialogHeader>

        <div className="flex justify-between items-center mb-4">
          <span className="text-sm text-gray-400">
            {history.length} calcul{history.length > 1 ? 's' : ''} enregistré{history.length > 1 ? 's' : ''}
          </span>
          <div className="flex gap-2">
            <Button
              onClick={onClearHistory}
              variant="outline"
              size="sm"
              className="bg-red-600 hover:bg-red-700 text-white border-red-600"
            >
              <TrashIcon className="w-4 h-4 mr-1" />
              Vider
            </Button>
          </div>
        </div>

        <div className="overflow-y-auto max-h-[60vh] space-y-4">
          {history.length === 0 ? (
            <p className="text-gray-400 text-center py-8">
              Aucun calcul dans l'historique
            </p>
          ) : (
            history.map((item) => (
              <div
                key={item.id}
                className="bg-gray-800/80 rounded-lg p-4 border border-gray-600"
              >
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-semibold text-white">
                    {item.productName || 'Produit sans nom'}
                  </h4>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-400">
                      {new Date(item.timestamp).toLocaleString('fr-FR')}
                    </span>
                    <Button
                      onClick={() => onDeleteItem(item.id)}
                      variant="ghost"
                      size="sm"
                      className="h-6 w-6 p-0 text-gray-400 hover:text-red-400"
                    >
                      <XIcon className="w-3 h-3" />
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <span className="text-gray-400">Type:</span>
                    <div className="text-white">{item.productType}</div>
                  </div>
                  <div>
                    <span className="text-gray-400">PHT remisé:</span>
                    <div className="text-white">{item.phtRemise.toFixed(2)} €</div>
                  </div>
                  <div>
                    <span className="text-gray-400">Coefficient:</span>
                    <div className="text-h8-green">×{item.coefficient}</div>
                  </div>
                  <div>
                    <span className="text-gray-400">Prix final:</span>
                    <div className="text-h8-green font-semibold">
                      {item.pvttcFinal.toFixed(2)} €
                    </div>
                  </div>
                </div>

                {item.pvttcMarche && (
                  <div className="mt-2 pt-2 border-t border-gray-600 text-sm">
                    <span className="text-gray-400">Prix marché: </span>
                    <span className="text-white">{item.pvttcMarche.toFixed(2)} €</span>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
