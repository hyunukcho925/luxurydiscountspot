import { supabase } from "./supabaseClient";

export async function getProduct(nameEn: string) {
  const { data, error } = await supabase
    .from("products")
    .select(
      `
      *,
      brands (name_en, name_ko),
      product_categories (
        sub_categories (
          name,
          main_categories (name)
        )
      )
    `
    )
    .eq("name_en", nameEn)
    .single();

  if (error) {
    console.error("Error fetching product:", error);
    return null;
  }

  if (data) {
    return {
      ...data,
      brand_name_ko: data.brands?.name_ko,
      brand_name_en: data.brands?.name_en,
      product_name: data.name,
      product_name_en: data.name_en,
      image_url: data.image_url,
    };
  }

  return null;
}
