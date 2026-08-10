import { z } from "zod";

export const ProductSchema = z.object({
  slug: z.string(),
  name: z.string(),
  tagline: z.string(),
  description: z.string(),
  priceBgn: z.number().positive().optional(),
  images: z
    .array(
      z.object({
        src: z.string(),
        alt: z.string(),
      })
    )
    .default([]),
  specs: z
    .array(
      z.object({
        label: z.string(),
        value: z.string(),
      })
    )
    .default([]),
  buyUrl: z.string().url().optional(),
  status: z.enum(["draft", "published"]).default("draft"),
});

export type Product = z.infer<typeof ProductSchema>;

export type ProductWithCategory = Product & {
  categoryId: CategoryId;
  categorySlug: string;
};

export const CategoryIdSchema = z.enum([
  "kitchenware",
  "security",
  "wristbands",
  "vacuums",
]);

export type CategoryId = z.infer<typeof CategoryIdSchema>;
