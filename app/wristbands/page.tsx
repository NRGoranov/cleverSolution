import type { Metadata } from "next";
import {
  CategoryPageContent,
  getCategoryMetadata,
} from "@/lib/category-page";

export const metadata: Metadata = getCategoryMetadata("wristbands");

export default function WristbandsPage() {
  return <CategoryPageContent categoryId="wristbands" />;
}
