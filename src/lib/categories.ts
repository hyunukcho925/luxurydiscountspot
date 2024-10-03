import { supabase } from "./supabaseClient";

interface Brand {
  name_en: string;
  name_ko: string;
}

interface PriceCrawl {
  price: number;
}

interface CrawlTarget {
  price_crawls: PriceCrawl[];
}

interface ProductFromDB {
  id: string;
  name: string;
  name_en: string;
  image_url: string;
  product_number: string;
  brands: Brand;
  crawl_targets: CrawlTarget[];
}

function roundToThousand(price: number): number {
  return Math.round(price / 1000) * 1000;
}

export async function getMainCategories() {
  const { data, error } = await supabase.from("main_categories").select("*");

  if (error) {
    console.error("Error fetching main categories:", error);
    return [];
  }

  return data;
}

export async function getSubCategories(mainCategoryId: string) {
  const { data, error } = await supabase
    .from("sub_categories")
    .select("*")
    .eq("main_category_id", mainCategoryId);

  if (error) {
    console.error("Error fetching sub categories:", error);
    return [];
  }

  return data;
}

export async function getProductsByCategory(subCategoryId: string) {
  const { data, error } = await supabase
    .from("products")
    .select(
      `
      *,
      brands (name_en, name_ko),
      product_categories!inner (
        sub_categories!inner (
          id, name, main_category_id, created_at,
          main_categories!inner (id, name, created_at)
        )
      ),
      crawl_targets (
        price_crawls (price)
      )
    `
    )
    .eq("product_categories.sub_categories.id", subCategoryId);

  if (error) {
    console.error("Error fetching products by category:", error);
    return [];
  }

  return (data as ProductFromDB[]).map((product) => {
    const prices = product.crawl_targets
      ?.flatMap((target) => target.price_crawls.map((crawl) => crawl.price))
      .filter((price): price is number => price !== null && price !== undefined);
    
    const lowestPrice = prices.length > 0 ? Math.min(...prices) : undefined;

    return {
      id: product.id,
      brand_name_ko: product.brands?.name_ko,
      brand_name_en: product.brands?.name_en,
      product_name: product.name,
      product_name_en: product.name_en,
      image_url: product.image_url,
      product_number: product.product_number,
      lowest_price: lowestPrice !== undefined ? roundToThousand(lowestPrice) : undefined,
      sub_category_id: subCategoryId,
    };
  });
}
