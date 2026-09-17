import type { Metadata } from "next";
import {
  CategoryPageContent,
  getCategoryMetadata,
} from "@/lib/category-page";

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<{ sub?: string }>;
}): Promise<Metadata> {
  const { sub } = await searchParams;
  return getCategoryMetadata("wristbands", sub);
}

export default async function WristbandsPage({
  searchParams,
}: {
  searchParams: Promise<{ sub?: string }>;
}) {
  const { sub } = await searchParams;
  return <CategoryPageContent categoryId="wristbands" subcategory={sub} />;
}
