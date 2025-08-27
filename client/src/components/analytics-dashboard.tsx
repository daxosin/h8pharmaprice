import React, { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell, AreaChart, Area } from "recharts";
import { BarChart3, TrendingUp, PieChart as PieChartIcon, Calendar, Download, Filter } from "lucide-react";
import { CalculationHistory } from "@/types/calculator";
import { format, startOfWeek, startOfMonth, subDays, subWeeks, subMonths } from "date-fns";

interface AnalyticsDashboardProps {
  history: CalculationHistory[];
  onClose: () => void;
}

export function AnalyticsDashboard({ history, onClose }: AnalyticsDashboardProps) {
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '3m' | '1y'>('30d');
  const [selectedProductType, setSelectedProductType] = useState<string>('all');

  // Filter data based on time range
  const filteredHistory = useMemo(() => {
    const now = new Date();
    let startDate: Date;
    
    switch (timeRange) {
      case '7d':
        startDate = subDays(now, 7);
        break;
      case '30d':
        startDate = subDays(now, 30);
        break;
      case '3m':
        startDate = subMonths(now, 3);
        break;
      case '1y':
        startDate = subMonths(now, 12);
        break;
      default:
        startDate = subDays(now, 30);
    }

    return history.filter(item => {
      const itemDate = new Date(item.timestamp);
      const matchesTimeRange = itemDate >= startDate;
      const matchesProductType = selectedProductType === 'all' || item.productType === selectedProductType;
      return matchesTimeRange && matchesProductType;
    });
  }, [history, timeRange, selectedProductType]);

  // Analytics calculations
  const analytics = useMemo(() => {
    if (filteredHistory.length === 0) return null;

    // Pricing trends over time
    const pricingTrends = filteredHistory.reduce((acc, item) => {
      const date = format(new Date(item.timestamp), 'yyyy-MM-dd');
      if (!acc[date]) {
        acc[date] = { date, totalCalculations: 0, avgPrice: 0, avgCoefficient: 0, totalPrice: 0, totalCoeff: 0 };
      }
      acc[date].totalCalculations += 1;
      acc[date].totalPrice += item.pvttcFinal;
      acc[date].totalCoeff += item.coefficient;
      acc[date].avgPrice = acc[date].totalPrice / acc[date].totalCalculations;
      acc[date].avgCoefficient = acc[date].totalCoeff / acc[date].totalCalculations;
      return acc;
    }, {} as Record<string, any>);

    // Product type distribution
    const productTypeStats = filteredHistory.reduce((acc, item) => {
      if (!acc[item.productType]) {
        acc[item.productType] = { type: item.productType, count: 0, totalValue: 0, avgPrice: 0 };
      }
      acc[item.productType].count += 1;
      acc[item.productType].totalValue += item.pvttcFinal;
      acc[item.productType].avgPrice = acc[item.productType].totalValue / acc[item.productType].count;
      return acc;
    }, {} as Record<string, any>);

    // Coefficient usage distribution
    const coefficientStats = filteredHistory.reduce((acc, item) => {
      const coeffKey = `×${item.coefficient}`;
      if (!acc[coeffKey]) {
        acc[coeffKey] = { coefficient: coeffKey, count: 0, avgPrice: 0, totalPrice: 0 };
      }
      acc[coeffKey].count += 1;
      acc[coeffKey].totalPrice += item.pvttcFinal;
      acc[coeffKey].avgPrice = acc[coeffKey].totalPrice / acc[coeffKey].count;
      return acc;
    }, {} as Record<string, any>);

    // Price range distribution
    const priceRanges = filteredHistory.reduce((acc, item) => {
      let range: string;
      if (item.pvttcFinal < 10) range = '0-10€';
      else if (item.pvttcFinal < 25) range = '10-25€';
      else if (item.pvttcFinal < 50) range = '25-50€';
      else if (item.pvttcFinal < 100) range = '50-100€';
      else range = '100€+';

      if (!acc[range]) {
        acc[range] = { range, count: 0, percentage: 0 };
      }
      acc[range].count += 1;
      return acc;
    }, {} as Record<string, any>);

    // Calculate percentages for price ranges
    Object.values(priceRanges).forEach((range: any) => {
      range.percentage = ((range.count / filteredHistory.length) * 100).toFixed(1);
    });

    // Key metrics
    const avgPrice = filteredHistory.reduce((sum, item) => sum + item.pvttcFinal, 0) / filteredHistory.length;
    const avgCoefficient = filteredHistory.reduce((sum, item) => sum + item.coefficient, 0) / filteredHistory.length;
    const totalCalculations = filteredHistory.length;
    const mostUsedProductType = Object.values(productTypeStats).sort((a: any, b: any) => b.count - a.count)[0];

    return {
      pricingTrends: Object.values(pricingTrends).sort((a: any, b: any) => a.date.localeCompare(b.date)),
      productTypeStats: Object.values(productTypeStats),
      coefficientStats: Object.values(coefficientStats),
      priceRanges: Object.values(priceRanges),
      keyMetrics: {
        avgPrice: avgPrice.toFixed(2),
        avgCoefficient: avgCoefficient.toFixed(2),
        totalCalculations,
        mostUsedProductType: mostUsedProductType?.type || 'N/A'
      }
    };
  }, [filteredHistory]);

  if (!analytics) {
    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md bg-h8-card border-h8-border">
          <CardContent className="p-6 text-center">
            <BarChart3 className="w-12 h-12 text-h8-green mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">Aucune donnée disponible</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Effectuez quelques calculs pour voir les analyses de tendances tarifaires.
            </p>
            <Button onClick={onClose} className="bg-h8-green hover:bg-green-600">
              Fermer
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const COLORS = ['#22c55e', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4', '#84cc16'];

  const productTypeLabels: Record<string, string> = {
    'parapharmacie': 'Parapharmacie',
    'homeopathie-tg': 'Homéopathie TG',
    'homeopathie-dose': 'Homéopathie Dose',
    'homeopathie-magistral': 'Homéopathie Magistral',
    'pilule-contraceptive': 'Pilule contraceptive',
    'lait-infantile': 'Lait infantile',
    'veterinaire': 'Vétérinaire'
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-7xl max-h-[90vh] bg-h8-card border-h8-border overflow-hidden">
        <CardHeader className="border-b border-h8-border">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <BarChart3 className="w-6 h-6 text-h8-green" />
              <CardTitle className="text-h8-green font-montserrat">Tableau de bord analytique</CardTitle>
            </div>
            <div className="flex items-center space-x-2">
              <Select value={timeRange} onValueChange={(value: any) => setTimeRange(value)}>
                <SelectTrigger className="w-32">
                  <Calendar className="w-4 h-4 mr-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7d">7 jours</SelectItem>
                  <SelectItem value="30d">30 jours</SelectItem>
                  <SelectItem value="3m">3 mois</SelectItem>
                  <SelectItem value="1y">1 an</SelectItem>
                </SelectContent>
              </Select>
              
              <Select value={selectedProductType} onValueChange={setSelectedProductType}>
                <SelectTrigger className="w-48">
                  <Filter className="w-4 h-4 mr-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les produits</SelectItem>
                  {Object.entries(productTypeLabels).map(([key, label]) => (
                    <SelectItem key={key} value={key}>{label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <Button onClick={onClose} variant="outline">Fermer</Button>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <Card className="bg-gradient-to-br from-h8-green/10 to-green-600/10 border-h8-green/20">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-h8-green">{analytics.keyMetrics.totalCalculations}</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Calculs totaux</div>
              </CardContent>
            </Card>
            
            <Card className="bg-gradient-to-br from-blue-500/10 to-blue-600/10 border-blue-500/20">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-blue-600">{analytics.keyMetrics.avgPrice}€</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Prix moyen</div>
              </CardContent>
            </Card>
            
            <Card className="bg-gradient-to-br from-orange-500/10 to-orange-600/10 border-orange-500/20">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-orange-600">×{analytics.keyMetrics.avgCoefficient}</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Coefficient moyen</div>
              </CardContent>
            </Card>
            
            <Card className="bg-gradient-to-br from-purple-500/10 to-purple-600/10 border-purple-500/20">
              <CardContent className="p-4 text-center">
                <div className="text-lg font-bold text-purple-600">{productTypeLabels[analytics.keyMetrics.mostUsedProductType] || analytics.keyMetrics.mostUsedProductType}</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Type le + utilisé</div>
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue="trends" className="space-y-4">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="trends">Tendances</TabsTrigger>
              <TabsTrigger value="products">Produits</TabsTrigger>
              <TabsTrigger value="coefficients">Coefficients</TabsTrigger>
              <TabsTrigger value="prices">Prix</TabsTrigger>
            </TabsList>

            <TabsContent value="trends" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <TrendingUp className="w-5 h-5" />
                    <span>Évolution des prix moyens</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={analytics.pricingTrends}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip 
                        formatter={(value: any, name: string) => [
                          name === 'avgPrice' ? `${Number(value).toFixed(2)}€` : Number(value).toFixed(2),
                          name === 'avgPrice' ? 'Prix moyen' : 'Coefficient moyen'
                        ]}
                      />
                      <Legend />
                      <Line type="monotone" dataKey="avgPrice" stroke="#22c55e" strokeWidth={2} name="Prix moyen" />
                      <Line type="monotone" dataKey="avgCoefficient" stroke="#3b82f6" strokeWidth={2} name="Coefficient moyen" />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Volume de calculs par jour</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={200}>
                    <AreaChart data={analytics.pricingTrends}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip formatter={(value: any) => [value, 'Calculs']} />
                      <Area type="monotone" dataKey="totalCalculations" stroke="#22c55e" fill="#22c55e" fillOpacity={0.3} />
                    </AreaChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="products" className="space-y-4">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Répartition par type de produit</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <PieChart>
                        <Pie
                          data={analytics.productTypeStats}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={(entry) => `${productTypeLabels[entry.type] || entry.type} (${entry.count})`}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="count"
                        >
                          {analytics.productTypeStats.map((entry: any, index: number) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Prix moyens par type de produit</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={analytics.productTypeStats}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis 
                          dataKey="type" 
                          tick={{ fontSize: 12 }}
                          tickFormatter={(value) => productTypeLabels[value] || value}
                        />
                        <YAxis />
                        <Tooltip 
                          formatter={(value: any) => [`${Number(value).toFixed(2)}€`, 'Prix moyen']}
                          labelFormatter={(label) => productTypeLabels[label] || label}
                        />
                        <Bar dataKey="avgPrice" fill="#22c55e" />
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="coefficients" className="space-y-4">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Utilisation des coefficients</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={analytics.coefficientStats}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="coefficient" />
                        <YAxis />
                        <Tooltip formatter={(value: any) => [value, 'Utilisations']} />
                        <Bar dataKey="count" fill="#3b82f6" />
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Prix moyens par coefficient</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={analytics.coefficientStats}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="coefficient" />
                        <YAxis />
                        <Tooltip formatter={(value: any) => [`${Number(value).toFixed(2)}€`, 'Prix moyen']} />
                        <Bar dataKey="avgPrice" fill="#f59e0b" />
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="prices" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Distribution des gammes de prix</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={analytics.priceRanges}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="range" />
                      <YAxis />
                      <Tooltip 
                        formatter={(value: any, name: string) => [
                          name === 'count' ? value : `${value}%`,
                          name === 'count' ? 'Nombre de calculs' : 'Pourcentage'
                        ]}
                      />
                      <Legend />
                      <Bar dataKey="count" fill="#22c55e" name="Nombre de calculs" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}