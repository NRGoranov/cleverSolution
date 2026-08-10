import type { Metadata } from "next";
import {
  CategoryPageContent,
  getCategoryMetadata,
} from "@/lib/category-page";

export const metadata: Metadata = getCategoryMetadata("vacuums");

export default function VacuumsPage() {
  return <CategoryPageContent categoryId="vacuums" />;
}
