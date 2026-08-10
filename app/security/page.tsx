import type { Metadata } from "next";
import {
  CategoryPageContent,
  getCategoryMetadata,
} from "@/lib/category-page";

export const metadata: Metadata = getCategoryMetadata("security");

export default function SecurityPage() {
  return <CategoryPageContent categoryId="security" />;
}
