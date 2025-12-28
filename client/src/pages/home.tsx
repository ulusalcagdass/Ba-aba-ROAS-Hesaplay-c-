import { useState, useMemo, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";
import { useToast } from "@/hooks/use-toast";
import type { ProductInput } from "@shared/schema";
import {
  Calculator,
  TrendingUp,
  Target,
  Percent,
  DollarSign,
  CreditCard,
  Package,
  Plus,
  X,
  BarChart3,
  Copy,
  Save,
  History,
  Trash2,
  FolderOpen,
  Loader2,
  AlertTriangle,
  Share2,
  Download,
  Truck,
  Box,
  Wallet,
  ShoppingBag,
  Tag
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

import { useI18n } from "@/lib/i18n";
import { ModeToggle } from "@/components/mode-toggle";

interface Calculation {
  id: string;
  name: string;
  products: InputValues[];
  createdAt: string;
}
interface InputValues {
  id: string;
  productName: string;
  aov: number;
  productCost: number;
  creditCardFeePercent: number;
  paymentProcessingFee: number;
  shippingCost: number;
  fulfillmentCost: number;
}

interface CalculatedValues {
  creditCardFee: number;
  totalProductCostPlusFulfillment: number;
  costPercentage: number;
  grossMarginPercent: number;
  expectedGrossProfit: number;
  breakEvenRoas: number;
  targetRoas10: number;
  targetRoas15: number;
  targetRoas20: number;
  roasTargets: Array<{ margin: number; roas: number }>;
}

const createDefaultValues = (id: string, name: string): InputValues => ({
  id,
  productName: name,
  aov: 1000,
  productCost: 50,
  creditCardFeePercent: 2.40,
  paymentProcessingFee: 0.25,
  shippingCost: 15,
  fulfillmentCost: 3,
});

function calculateValues(values: InputValues): CalculatedValues {
  const creditCardFee = (values.aov * values.creditCardFeePercent) / 100;
  const totalProductCostPlusFulfillment =
    values.productCost +
    creditCardFee +
    values.paymentProcessingFee +
    values.shippingCost +
    values.fulfillmentCost;

  const expectedGrossProfit = values.aov - totalProductCostPlusFulfillment;
  const grossMarginPercent = (expectedGrossProfit / values.aov) * 100;
  const costPercentage = (totalProductCostPlusFulfillment / values.aov) * 100;

  const breakEvenRoas =
    expectedGrossProfit > 0 ? values.aov / expectedGrossProfit : 0;

  // Calculate ROAS for specific margins
  const calculateRoasForMargin = (targetMargin: number) => {
    const targetProfit = values.aov * (targetMargin / 100);
    // Profit = Revenue - Cost - AdSpend
    // AdSpend = Revenue - Cost - Profit
    const availableAdSpend = values.aov - totalProductCostPlusFulfillment - targetProfit;
    return availableAdSpend > 0 ? values.aov / availableAdSpend : 0;
  };

  const roasTargets = Array.from({ length: 10 }, (_, i) => {
    const margin = (i + 1) * 10;
    return { margin, roas: calculateRoasForMargin(margin) };
  });

  return {
    creditCardFee,
    totalProductCostPlusFulfillment,
    costPercentage,
    grossMarginPercent,
    expectedGrossProfit,
    breakEvenRoas,
    targetRoas10: calculateRoasForMargin(10), // Keep for backward compatibility if needed
    targetRoas15: calculateRoasForMargin(15),
    targetRoas20: calculateRoasForMargin(20),
    roasTargets
  };
}

function generateId(): string {
  return Math.random().toString(36).substring(2, 9);
}


interface ProductCardProps {
  product: InputValues;
  calculations: CalculatedValues;
  onUpdate: (field: keyof InputValues, value: string) => void;
  onRemove: () => void;
  onDuplicate: () => void;
  canRemove: boolean;
  index: number;
}

function ProductCard({ product, calculations, onUpdate, onRemove, onDuplicate, canRemove, index }: ProductCardProps) {
  const { t, formatCurrency, formatPercent, formatRoas, currency } = useI18n();
  const currencySymbol = currency === "TRY" ? "₺" : currency === "USD" ? "$" : currency === "EUR" ? "€" : "£";

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className="flex-1 min-w-[200px]">
          <Input
            data-testid={`input-product-name-${index}`}
            type="text"
            value={product.productName}
            onChange={(e) => onUpdate("productName", e.target.value)}
            className="text-lg font-semibold border-0 border-b rounded-none px-0 focus-visible:ring-0"
            placeholder={t("productNamePlaceholder")}
          />
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={onDuplicate}
            data-testid={`button-duplicate-${index}`}
          >
            <Copy className="w-4 h-4 mr-1" />
            {t("copy")}
          </Button>
          {canRemove && (
            <Button
              variant="ghost"
              size="icon"
              onClick={onRemove}
              className="text-destructive"
              data-testid={`button-remove-${index}`}
            >
              <X className="w-4 h-4" />
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2 text-xl">
              <Package className="w-5 h-5 text-primary" />
              {t("productInfo")}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor={`aov-${product.id}`} className="text-sm font-medium">
                {t("aov")}
              </Label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id={`aov-${product.id}`}
                  data-testid={`input-aov-${index}`}
                  type="number"
                  step="0.01"
                  value={product.aov}
                  onChange={(e) => onUpdate("aov", e.target.value)}
                  className="text-right pr-8 pl-9"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">{currencySymbol}</span>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor={`productCost-${product.id}`} className="text-sm font-medium">
                {t("productCost")}
              </Label>
              <div className="relative">
                <ShoppingBag className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id={`productCost-${product.id}`}
                  data-testid={`input-product-cost-${index}`}
                  type="number"
                  step="0.01"
                  value={product.productCost}
                  onChange={(e) => onUpdate("productCost", e.target.value)}
                  className="text-right pr-8 pl-9"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">{currencySymbol}</span>
              </div>
            </div>

          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2 text-xl">
              <CreditCard className="w-5 h-5 text-primary" />
              {t("fixedCosts")}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor={`creditCardFeePercent-${product.id}`} className="text-sm font-medium">
                {t("creditCardFeePercent")}
              </Label>
              <div className="relative">
                <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id={`creditCardFeePercent-${product.id}`}
                  data-testid={`input-credit-card-fee-${index}`}
                  type="number"
                  step="0.01"
                  value={product.creditCardFeePercent}
                  onChange={(e) => onUpdate("creditCardFeePercent", e.target.value)}
                  className="text-right pr-8 pl-9"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">%</span>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor={`paymentProcessingFee-${product.id}`} className="text-sm font-medium">
                {t("paymentProcessingFee")}
              </Label>
              <div className="relative">
                <Wallet className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id={`paymentProcessingFee-${product.id}`}
                  data-testid={`input-payment-fee-${index}`}
                  type="number"
                  step="0.01"
                  value={product.paymentProcessingFee}
                  onChange={(e) => onUpdate("paymentProcessingFee", e.target.value)}
                  className="text-right pr-8 pl-9"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">{currencySymbol}</span>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor={`shippingCost-${product.id}`} className="text-sm font-medium">
                {t("shippingCost")}
              </Label>
              <div className="relative">
                <Truck className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id={`shippingCost-${product.id}`}
                  data-testid={`input-shipping-cost-${index}`}
                  type="number"
                  step="0.01"
                  value={product.shippingCost}
                  onChange={(e) => onUpdate("shippingCost", e.target.value)}
                  className="text-right pr-8 pl-9"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">{currencySymbol}</span>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor={`fulfillmentCost-${product.id}`} className="text-sm font-medium">
                {t("fulfillmentCost")}
              </Label>
              <div className="relative">
                <Box className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id={`fulfillmentCost-${product.id}`}
                  data-testid={`input-fulfillment-cost-${index}`}
                  type="number"
                  step="0.01"
                  value={product.fulfillmentCost}
                  onChange={(e) => onUpdate("fulfillmentCost", e.target.value)}
                  className="text-right pr-8 pl-9"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">{currencySymbol}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-muted/30">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-xl">
            <DollarSign className="w-5 h-5 text-primary" />
            {t("calculatedValues")}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-4 bg-card rounded-lg border border-card-border">
              <p className="text-sm text-muted-foreground mb-1">{t("creditCardFee")}</p>
              <p key={calculations.creditCardFee} className="text-lg font-semibold animate-flash px-2 -mx-2" data-testid={`text-credit-card-fee-${index}`}>
                {formatCurrency(calculations.creditCardFee)}
              </p>
            </div>
            <div className="p-4 bg-card rounded-lg border border-card-border">
              <p className="text-sm text-muted-foreground mb-1">{t("totalCost")}</p>
              <p key={calculations.totalProductCostPlusFulfillment} className="text-lg font-semibold animate-flash px-2 -mx-2" data-testid={`text-total-cost-${index}`}>
                {formatCurrency(calculations.totalProductCostPlusFulfillment)}
              </p>
            </div>
            <div className="p-4 bg-card rounded-lg border border-card-border">
              <p className="text-sm text-muted-foreground mb-1">{t("costPercentage")}</p>
              <p key={calculations.costPercentage} className="text-lg font-semibold animate-flash px-2 -mx-2" data-testid={`text-cost-percentage-${index}`}>
                {formatPercent(calculations.costPercentage)}
              </p>
            </div>
            <div className="p-4 bg-card rounded-lg border border-card-border">
              <p className="text-sm text-muted-foreground mb-1">{t("grossMargin")}</p>
              <p
                key={calculations.grossMarginPercent}
                className={`text-lg font-semibold animate-flash px-2 -mx-2 ${calculations.grossMarginPercent < 0 ? "text-red-500 dark:text-red-400" :
                  calculations.grossMarginPercent < 20 ? "text-orange-500 dark:text-orange-400" :
                    calculations.grossMarginPercent < 50 ? "text-green-600 dark:text-green-400" :
                      "text-yellow-600 dark:text-yellow-400"
                  }`}
                data-testid={`text-gross-margin-${index}`}
              >
                {formatPercent(calculations.grossMarginPercent)}
              </p>
            </div>
          </div>
          <div className="mt-4 grid grid-cols-1 gap-4">
            <div className={`p-4 rounded-lg border transition-colors ${calculations.grossMarginPercent < 0 ? "bg-red-500/5 border-red-500/20" :
              calculations.grossMarginPercent < 20 ? "bg-orange-500/5 border-orange-500/20" :
                calculations.grossMarginPercent < 50 ? "bg-primary/5 border-primary/20" :
                  "bg-yellow-500/5 border-yellow-500/20"
              }`}>
              <p className="text-sm text-muted-foreground mb-1">{t("expectedProfit")}</p>
              <p
                key={calculations.expectedGrossProfit}
                className={`text-2xl font-bold animate-flash px-2 -mx-2 inline-block ${calculations.grossMarginPercent < 0 ? "text-red-600 dark:text-red-400" :
                  calculations.grossMarginPercent < 20 ? "text-orange-600 dark:text-orange-400" :
                    calculations.grossMarginPercent < 50 ? "text-primary" :
                      "text-yellow-600 dark:text-yellow-400"
                  }`}
                data-testid={`text-profit-per-order-${index}`}
              >
                {formatCurrency(calculations.expectedGrossProfit)}
              </p>
            </div>

          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        <Card className="border-2 border-primary/50 bg-primary/5 col-span-2 sm:col-span-1 md:col-span-1">
          <CardContent className="pt-6 text-center">
            <div className="flex justify-center mb-3">
              <div className="p-2 bg-primary/20 rounded-full">
                <Target className="w-5 h-5 text-primary" />
              </div>
            </div>
            <p key={calculations.breakEvenRoas} className="text-2xl font-bold text-primary mb-1 animate-flash px-2 -mx-2 inline-block" data-testid={`text-break-even-roas-${index}`}>
              {formatRoas(calculations.breakEvenRoas)}
            </p>
            <p className="text-xs text-muted-foreground font-medium">{t("breakEvenRoas")}</p>
          </CardContent>
        </Card>

        {calculations.roasTargets.map((target) => (
          <Card key={target.margin}>
            <CardContent className="pt-6 text-center">
              <div className="flex justify-center mb-3">
                <div className="p-2 bg-secondary rounded-full">
                  <TrendingUp className="w-4 h-4 text-foreground" />
                </div>
              </div>
              <p className="text-2xl font-bold text-foreground mb-1">
                {formatRoas(target.roas)}
              </p>
              <p className="text-xs text-muted-foreground font-medium">{t("marginRoas").replace("ROAS", "")} %{target.margin}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {calculations.expectedGrossProfit <= 0 ? (
        <div className="mt-4 p-4 bg-red-500/10 border border-red-500/20 rounded-lg flex items-start gap-3 text-red-600 dark:text-red-400">
          <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5" />
          <div className="text-sm">
            <p className="font-semibold">{t("lossWarningTitle")}</p>
            <p>{t("lossWarningDesc")}</p>
          </div>
        </div>
      ) : (
        <div className="mt-4 p-3 bg-muted/50 rounded-lg text-center text-sm text-muted-foreground">
          <p>
            {t("maxMarginInfo", { margin: formatPercent(calculations.grossMarginPercent) })}
            <br />
            <span className="text-xs opacity-75">{t("maxMarginHint")}</span>
          </p>
        </div>
      )}
    </div>
  );
}

interface ComparisonTableProps {
  products: InputValues[];
  allCalculations: Map<string, CalculatedValues>;
}

function ComparisonTable({ products, allCalculations }: ComparisonTableProps) {
  const { t, formatCurrency, formatPercent, formatRoas } = useI18n();

  if (products.length < 2) {
    return (
      <div className="flex flex-col items-center justify-center py-12 px-4 text-center border-2 border-dashed rounded-xl bg-muted/30">
        <div className="p-4 bg-background rounded-full mb-4 shadow-sm">
          <BarChart3 className="w-8 h-8 text-primary/60" />
        </div>
        <h3 className="text-lg font-semibold text-foreground mb-1">{t("comparisonTitle")}</h3>
        <p className="text-muted-foreground max-w-xs">{t("comparisonEmpty")}</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto -mx-4 px-4 md:mx-0 md:px-0 pb-4">
      <table className="w-full border-collapse min-w-[600px]">
        <thead>
          <tr className="border-b">
            <th className="text-left p-3 font-medium text-muted-foreground">{t("metric")}</th>
            {products.map((product, index) => (
              <th key={product.id} className="text-right p-3 font-semibold" data-testid={`comparison-header-${index}`}>
                {product.productName}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          <tr className="border-b">
            <td className="p-3 text-muted-foreground">{t("aov")}</td>
            {products.map((product, index) => (
              <td key={product.id} className="text-right p-3 font-medium" data-testid={`comparison-aov-${index}`}>
                {formatCurrency(product.aov)}
              </td>
            ))}
          </tr>
          <tr className="border-b">
            <td className="p-3 text-muted-foreground">{t("totalCost")}</td>
            {products.map((product, index) => {
              const calc = allCalculations.get(product.id);
              return (
                <td key={product.id} className="text-right p-3 font-medium" data-testid={`comparison-total-cost-${index}`}>
                  {calc ? formatCurrency(calc.totalProductCostPlusFulfillment) : "-"}
                </td>
              );
            })}
          </tr>
          <tr className="border-b">
            <td className="p-3 text-muted-foreground">{t("grossMargin")}</td>
            {products.map((product, index) => {
              const calc = allCalculations.get(product.id);
              return (
                <td key={product.id} className="text-right p-3 font-medium text-green-600 dark:text-green-400" data-testid={`comparison-margin-${index}`}>
                  {calc ? formatPercent(calc.grossMarginPercent) : "-"}
                </td>
              );
            })}
          </tr>
          <tr className="border-b">
            <td className="p-3 text-muted-foreground">{t("expectedProfit")}</td>
            {products.map((product, index) => {
              const calc = allCalculations.get(product.id);
              return (
                <td key={product.id} className="text-right p-3 font-medium" data-testid={`comparison-profit-${index}`}>
                  {calc ? formatCurrency(calc.expectedGrossProfit) : "-"}
                </td>
              );
            })}
          </tr>
          <tr className="border-b bg-primary/5">
            <td className="p-3 font-medium">{t("breakEvenRoas")}</td>
            {products.map((product, index) => {
              const calc = allCalculations.get(product.id);
              return (
                <td key={product.id} className="text-right p-3 font-bold text-primary" data-testid={`comparison-break-even-${index}`}>
                  {calc ? formatRoas(calc.breakEvenRoas) : "-"}
                </td>
              );
            })}
          </tr>
          <tr className="border-b">
            <td className="p-3 text-muted-foreground">{t("marginRoas").replace("ROAS", "")} %10</td>
            {products.map((product, index) => {
              const calc = allCalculations.get(product.id);
              const target = calc?.roasTargets.find(t => t.margin === 10);
              return (
                <td key={product.id} className="text-right p-3 font-medium text-green-600 dark:text-green-400" data-testid={`comparison-roas10-${index}`}>
                  {target ? formatRoas(target.roas) : "-"}
                </td>
              );
            })}
          </tr>

          <tr>
            <td className="p-3 text-muted-foreground">{t("marginRoas").replace("ROAS", "")} %20</td>
            {products.map((product, index) => {
              const calc = allCalculations.get(product.id);
              const target = calc?.roasTargets.find(t => t.margin === 20);
              return (
                <td key={product.id} className="text-right p-3 font-medium text-purple-600 dark:text-purple-400" data-testid={`comparison-roas20-${index}`}>
                  {target ? formatRoas(target.roas) : "-"}
                </td>
              );
            })}
          </tr>
        </tbody>
      </table>
    </div>
  );
}

interface RoasChartProps {
  products: InputValues[];
  allCalculations: Map<string, CalculatedValues>;
}

function RoasChart({ products, allCalculations }: RoasChartProps) {
  const { t, formatPercent, formatRoas } = useI18n();

  if (products.length < 2) {
    return null;
  }

  const chartData = products.map((product) => {
    const calc = allCalculations.get(product.id);
    return {
      name: product.productName.length > 12
        ? product.productName.substring(0, 12) + "..."
        : product.productName,
      [t("breakEvenRoas")]: calc?.breakEvenRoas || 0,
      [`%10 ${t("marginRoas").replace("ROAS", "")}`]: calc?.roasTargets.find(t => t.margin === 10)?.roas || 0,
      [`%20 ${t("marginRoas").replace("ROAS", "")}`]: calc?.roasTargets.find(t => t.margin === 20)?.roas || 0,
    };
  });

  const marginChartData = products.map((product) => {
    const calc = allCalculations.get(product.id);
    return {
      name: product.productName.length > 12
        ? product.productName.substring(0, 12) + "..."
        : product.productName,
      [t("grossMargin")]: calc?.grossMarginPercent || 0,
      [t("costPercentage")]: calc?.costPercentage || 0,
    };
  });

  return (
    <div className="space-y-8 mt-8">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Target className="w-5 h-5 text-primary" />
            {t("roasChartTitle")}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]" data-testid="chart-roas-comparison">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip
                  formatter={(value: number) => formatRoas(value)}
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '6px'
                  }}
                />
                <Legend />
                <Bar dataKey={t("breakEvenRoas")} fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                <Bar dataKey={`%10 ${t("marginRoas").replace("ROAS", "")}`} fill="#22c55e" radius={[4, 4, 0, 0]} />
                <Bar dataKey={`%20 ${t("marginRoas").replace("ROAS", "")}`} fill="#a855f7" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <TrendingUp className="w-5 h-5 text-primary" />
            {t("marginChartTitle")}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]" data-testid="chart-margin-comparison">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={marginChartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} unit="%" />
                <Tooltip
                  formatter={(value: number) => formatPercent(value)}
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '6px'
                  }}
                />
                <Legend />
                <Bar dataKey={t("grossMargin")} fill="#22c55e" radius={[4, 4, 0, 0]} />
                <Bar dataKey={t("costPercentage")} fill="#ef4444" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default function Home() {
  const { t, language, setLanguage, currency, setCurrency, formatCurrency } = useI18n();
  const { toast } = useToast();
  const [products, setProducts] = useState<InputValues[]>(() => {
    const saved = localStorage.getItem("roas-calculator-products");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error("Failed to parse saved products", e);
      }
    }
    return [createDefaultValues("1", `Ürün 1`)];
  });


  const [activeTab, setActiveTab] = useState(() => {
    // Start with the first product or 'comparison' if no products (shouldn't happen)
    // We can just rely on the first product id if we initialize products first.
    // However, products state isn't available here in the initializer closure easily if it relies on other state,
    // but here we are in the body.
    // Let's just default to the first product's ID from the initial state logic or a safe default.
    const saved = localStorage.getItem("roas-calculator-products");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed[0].id;
      } catch (e) { }
    }
    return "1";
  });

  // Ensure activeTab is valid when products change (e.g. deletion)
  useEffect(() => {
    if (activeTab === "comparison") return;
    if (!products.find(p => p.id === activeTab)) {
      // Current tab deleted, switch to first product or comparison
      if (products.length > 0) {
        setActiveTab(products[products.length - 1].id);
      } else {
        // Should not happen as we prevent deleting last product
      }
    }
  }, [products, activeTab]);

  const [saveDialogOpen, setSaveDialogOpen] = useState(false);
  const [historyDialogOpen, setHistoryDialogOpen] = useState(false);
  const [calculationName, setCalculationName] = useState("");

  // Persist products to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("roas-calculator-products", JSON.stringify(products));
  }, [products]);

  const allCalculations = useMemo(() => {
    const map = new Map<string, CalculatedValues>();
    products.forEach((p) => {
      map.set(p.id, calculateValues(p));
    });
    return map;
  }, [products]);

  const savedCalculations = useMemo(() => {
    const saved = localStorage.getItem("roas-calculator-saves");
    return saved ? JSON.parse(saved) as Calculation[] : [];
  }, [historyDialogOpen]); // Refresh when dialog opens

  const addProduct = () => {
    const newId = Math.random().toString(36).substr(2, 9);
    setProducts([...products, createDefaultValues(newId, `${t("newProduct")} ${products.length + 1}`)]);
    setTimeout(() => setActiveTab(newId), 0); // Switch to new tab
  };

  const removeProduct = (id: string) => {
    if (products.length > 1) {
      const newProducts = products.filter((p) => p.id !== id);
      setProducts(newProducts);
      // Logic to switch tab overlap handled by useEffect
    }
  };

  const duplicateProduct = (product: InputValues) => {
    const newId = Math.random().toString(36).substr(2, 9);
    const newProduct = {
      ...product,
      id: newId,
      productName: `${product.productName} (${t("copy")})`,
    };
    setProducts([...products, newProduct]);
  };

  const updateProduct = (id: string, field: keyof InputValues, value: string) => {
    setProducts(
      products.map((p) => {
        if (p.id === id) {
          return {
            ...p,
            [field]: field === "productName" ? value : parseFloat(value) || 0,
          };
        }
        return p;
      })
    );
  };

  // Share functionality
  const handleShare = async () => {
    const data = JSON.stringify(products);
    const encoded = btoa(encodeURIComponent(data));
    const url = `${window.location.origin}?data=${encoded}`;

    try {
      await navigator.clipboard.writeText(url);
      toast({
        title: t("successShared"),
        description: t("successSharedDesc"),
      });
    } catch (err) {
      toast({
        title: t("errorTitle"),
        description: t("errorShare"),
        variant: "destructive",
      });
    }
  };

  // Load from URL on mount
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const data = params.get("data");
    if (data) {
      try {
        const decoded = decodeURIComponent(atob(data));
        const parsed = JSON.parse(decoded);
        if (Array.isArray(parsed)) {
          setProducts(parsed);
          toast({
            title: t("successLoaded"),
            description: t("successLoadedUrl"),
          });
          // Clean URL
          window.history.replaceState({}, "", window.location.pathname);
        }
      } catch (e) {
        console.error("Failed to parse URL data", e);
      }
    }
  }, []);

  const handleSaveCalculation = () => {
    if (!calculationName.trim()) {
      toast({
        title: t("errorTitle"),
        description: t("errorNameRequired"),
        variant: "destructive",
      });
      return;
    }

    const newCalculation: Calculation = {
      id: Math.random().toString(36).substr(2, 9),
      name: calculationName,
      products: products,
      createdAt: new Date().toISOString(), // Keep as string if interface expects string, or change interface
    };

    const existingSaves = JSON.parse(localStorage.getItem("roas-calculator-saves") || "[]");
    localStorage.setItem("roas-calculator-saves", JSON.stringify([...existingSaves, newCalculation]));

    setSaveDialogOpen(false);
    setCalculationName("");
    toast({
      title: t("successSaved"),
      description: t("successSavedDesc"),
    });
  };

  const handleLoadCalculation = (calc: Calculation) => {
    // Ensure loaded products have IDs if missing (though they should have them)
    const loadedProducts = calc.products.map(p => ({
      ...p,
      id: p.id || Math.random().toString(36).substr(2, 9)
    }));
    setProducts(loadedProducts);
    if (loadedProducts.length > 0) {
      setActiveTab(loadedProducts[0].id);
    }
    setHistoryDialogOpen(false);
    toast({
      title: t("successLoaded"),
      description: t("successLoadedDesc", { name: calc.name }),
    });
  };

  const handleExport = (type: 'pdf' | 'excel') => {
    if (type === 'pdf') {
      const doc = new jsPDF();

      const tableData = products.map(p => {
        const c = allCalculations.get(p.id)!;
        return [
          p.productName,
          formatCurrency(p.aov),
          formatCurrency(c.totalProductCostPlusFulfillment),
          formatCurrency(c.expectedGrossProfit),
          `%${c.grossMarginPercent.toFixed(2)}`,
          `${c.breakEvenRoas.toFixed(2)}`
        ];
      });

      autoTable(doc, {
        head: [[t("productName"), t("salesPrice"), t("totalCost"), t("netProfit"), t("margin"), t("breakEvenRoas")]],
        body: tableData,
      });

      doc.save("roas-calculations.pdf");
    } else {
      const data = products.map(p => {
        const c = allCalculations.get(p.id)!;
        return {
          [t("productName")]: p.productName,
          [t("salesPrice")]: p.aov,
          [t("totalCost")]: c.totalProductCostPlusFulfillment,
          [t("netProfit")]: c.expectedGrossProfit,
          [t("margin")]: `${c.grossMarginPercent.toFixed(2)}%`,
          [t("breakEvenRoas")]: c.breakEvenRoas.toFixed(2)
        };
      });

      const ws = XLSX.utils.json_to_sheet(data);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "ROAS Calculations");
      XLSX.writeFile(wb, "roas-calculations.xlsx");
    }

    toast({
      title: t("successExport"),
      description: t("successExportDesc"),
    });
  };

  const handleDeleteCalculation = (id: string) => {
    const existingSaves = JSON.parse(localStorage.getItem("roas-calculator-saves") || "[]") as Calculation[];
    const newSaves = existingSaves.filter(c => c.id !== id);
    localStorage.setItem("roas-calculator-saves", JSON.stringify(newSaves));

    setHistoryDialogOpen(false);
    setTimeout(() => setHistoryDialogOpen(true), 0);

    toast({
      title: t("successDeleted"),
      description: t("successDeletedDesc"),
    });
  };

  return (
    <div className="min-h-screen bg-background p-4 md:p-8 pb-20">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
              {t("title")}
            </h1>
            <p className="text-muted-foreground mt-2 max-w-2xl">
              {t("subtitle")}
            </p>
          </div>
          <div className="flex items-center gap-3 flex-wrap">
            <div className="flex items-center border rounded-md overflow-hidden">
              <button
                onClick={() => setLanguage("tr")}
                className={`px-3 py-1.5 text-sm font-medium transition-colors ${language === "tr" ? "bg-primary text-primary-foreground" : "bg-background hover:bg-muted"}`}
              >
                TR
              </button>
              <button
                onClick={() => setLanguage("en")}
                className={`px-3 py-1.5 text-sm font-medium transition-colors ${language === "en" ? "bg-primary text-primary-foreground" : "bg-background hover:bg-muted"}`}
              >
                EN
              </button>
            </div>

            <div className="flex items-center border rounded-md overflow-hidden">
              <button
                onClick={() => setCurrency("TRY")}
                className={`px-3 py-1.5 text-sm font-medium transition-colors ${currency === "TRY" ? "bg-primary text-primary-foreground" : "bg-background hover:bg-muted"}`}
              >
                ₺
              </button>
              <button
                onClick={() => setCurrency("USD")}
                className={`px-3 py-1.5 text-sm font-medium transition-colors ${currency === "USD" ? "bg-primary text-primary-foreground" : "bg-background hover:bg-muted"}`}
              >
                $
              </button>
              <button
                onClick={() => setCurrency("EUR")}
                className={`px-3 py-1.5 text-sm font-medium transition-colors ${currency === "EUR" ? "bg-primary text-primary-foreground" : "bg-background hover:bg-muted"}`}
              >
                €
              </button>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="icon" onClick={handleShare} title={t("share")}>
                <Share2 className="w-4 h-4" />
              </Button>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="icon" title={t("export")}>
                    <Download className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => handleExport('excel')}>
                    Excel (.xlsx)
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleExport('pdf')}>
                    PDF (.pdf)
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            <Dialog open={saveDialogOpen} onOpenChange={setSaveDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" className="gap-2">
                  <Save className="w-4 h-4" />
                  {t("save")}
                </Button>
              </DialogTrigger>
              <DialogContent className="w-[95vw] max-w-sm rounded-xl">
                <DialogHeader>
                  <DialogTitle>{t("saveDialogTitle")}</DialogTitle>
                  <DialogDescription>
                    {t("saveDialogDesc")}
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="name">
                      {t("nameLabel")}
                    </Label>
                    <Input
                      id="name"
                      value={calculationName}
                      onChange={(e) => setCalculationName(e.target.value)}
                      placeholder={t("namePlaceholder")}
                      className="h-11"
                    />
                  </div>
                </div>
                <DialogFooter className="gap-2 sm:gap-0">
                  <Button variant="outline" onClick={() => setSaveDialogOpen(false)} className="h-11">
                    {t("cancel")}
                  </Button>
                  <Button onClick={handleSaveCalculation} className="h-11">
                    {t("save")}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            <Dialog open={historyDialogOpen} onOpenChange={setHistoryDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" className="gap-2">
                  <History className="w-4 h-4" />
                  {t("history")}
                </Button>
              </DialogTrigger>
              <DialogContent className="w-[95vw] max-w-lg rounded-xl">
                <DialogHeader>
                  <DialogTitle>{t("historyDialogTitle")}</DialogTitle>
                  <DialogDescription>
                    {t("historyDialogDesc")}
                  </DialogDescription>
                </DialogHeader>
                <div className="py-4">
                  {savedCalculations.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      <FolderOpen className="w-12 h-12 mx-auto mb-3 opacity-50" />
                      <p>{t("noSavedCalculations")}</p>
                      <p className="text-sm mt-1">{t("savePrompt")}</p>
                    </div>
                  ) : (
                    <ScrollArea className="h-[300px] pr-4">
                      <div className="space-y-3">
                        {savedCalculations.map((calc) => (
                          <div key={calc.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg border">
                            <div>
                              <p className="font-medium">{calc.name}</p>
                              <p className="text-xs text-muted-foreground">
                                {new Date(calc.createdAt).toLocaleDateString()} • {calc.products.length} {t("productInfo").split(" ")[0]}
                              </p>
                            </div>
                            <div className="flex items-center gap-2">
                              <Button size="sm" variant="secondary" onClick={() => handleLoadCalculation(calc)}>
                                {t("load")}
                              </Button>
                              <Button size="icon" variant="ghost" className="text-destructive h-8 w-8" onClick={() => handleDeleteCalculation(calc.id)}>
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </ScrollArea>
                  )}
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>

      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar">
          <TabsList className="h-auto p-1 bg-muted/50 flex w-auto min-w-max">
            {products.map((product) => (
              <TabsTrigger
                key={product.id}
                value={product.id}
                className="gap-2 data-[state=active]:bg-background data-[state=active]:shadow-sm"
              >
                <Calculator className="w-3 h-3" />
                {product.productName}
              </TabsTrigger>
            ))}

            <TabsTrigger value="comparison" className="gap-2 ml-2 bg-primary/5 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <BarChart3 className="w-3 h-3" />
              {t("comparisonTab")}
            </TabsTrigger>
          </TabsList>

          <Button
            variant="outline"
            size="sm"
            onClick={addProduct}
            className="h-7 px-3 gap-1 rounded-full border-dashed shrink-0 hover:bg-primary hover:text-primary-foreground ml-2"
          >
            <Plus className="w-3 h-3" />
            <span className="text-xs font-medium">{t("newProduct")}</span>
          </Button>
        </div>

        {products.map((product, index) => (
          <TabsContent key={product.id} value={product.id} className="space-y-6 mt-0">
            <div className="relative">
              <ProductCard
                index={index}
                product={product}
                calculations={allCalculations.get(product.id)!}
                onUpdate={(field, value) => updateProduct(product.id, field, value)}
                onRemove={() => removeProduct(product.id)}
                onDuplicate={() => duplicateProduct(product)}
                canRemove={products.length > 1}
              />
            </div>
          </TabsContent>
        ))}

        <TabsContent value="comparison" className="mt-0">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-primary" />
                {t("comparisonTitle")}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ComparisonTable products={products} allCalculations={allCalculations} />
              <div className="mt-8 h-[400px]">
                <RoasChart products={products} allCalculations={allCalculations} />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <footer className="text-center text-sm text-muted-foreground py-8">
        <div className="flex items-center justify-center gap-2">
          <span>{t("footerText")}</span>
          <span className="opacity-50">|</span>
          <span className="text-xs">v2.2</span>
          <span style={{ color: 'red' }}>●</span>
          <span style={{ color: 'green' }}>●</span>
          <span style={{ color: 'gold' }}>●</span>
        </div>
      </footer>
    </div>
  );
}
