import { supabase } from "./supabaseClient";

export async function getProduct(nameEn: string) {
  const { data, error } = await supabase
    .from('products')
    .select(`
      *,
      brands (name_en, name_ko),
      product_categories (
        sub_categories (
          name,
          main_categories (name)
        )
      )
    `)
    .eq('name_en', nameEn)
    .single()

  if (error) {
    console.error('Error fetching product:', error)
    return null
  }

  return data
}
