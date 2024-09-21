import { supabase } from "./supabaseClient";

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
      )
    `
    )
    .eq("product_categories.sub_categories.id", subCategoryId);

  if (error) {
    console.error("Error fetching products by category:", error);
    return [];
  }

  return data.map((product) => ({
    ...product,
    brand_name_ko: product.brands?.name_ko,
    brand_name_en: product.brands?.name_en,
    product_name: product.name,
    product_name_en: product.name_en,
    image_url: product.image_url,
  }));
}
