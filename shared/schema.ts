import { z } from "zod";

export const productTypeSchema = z.enum([
  "parapharmacie",
  "homeopathie-tg",
  "homeopathie-dose", 
  "homeopathie-magistral",
  "pilule-contraceptive",
  "lait-infantile",
  "veterinaire"
]);

export const tvaRateSchema = z.enum(["2.1", "5.5", "10", "20"]);

export const calculationSchema = z.object({
  id: z.string().optional(),
  productName: z.string().min(1, "Le nom du produit est requis"),
  productType: productTypeSchema,
  phtRemise: z.number().min(0, "Le prix HT remisé doit être positif"),
  tva: tvaRateSchema,
  pvttcMarche: z.number().min(0).optional(),
  timestamp: z.string().optional()
});

export const calculationResultSchema = calculationSchema.extend({
  coefficient: z.number(),
  pvttcEstime: z.number(),
  pvttcFinal: z.number(),
  comparisonText: z.string(),
  priceDifference: z.number().optional()
});

export type ProductType = z.infer<typeof productTypeSchema>;
export type TvaRate = z.infer<typeof tvaRateSchema>;
export type Calculation = z.infer<typeof calculationSchema>;
export type CalculationResult = z.infer<typeof calculationResultSchema>;
