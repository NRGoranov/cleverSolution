import type { Metadata } from "next";
import {
  CategoryPageContent,
  getCategoryMetadata,
} from "@/lib/category-page";

export const metadata: Metadata = getCategoryMetadata("kitchenware");

export default function KitchenPage() {
  return <CategoryPageContent categoryId="kitchenware" />;
}
