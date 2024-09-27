import { MetadataRoute } from "next";
import { supabase } from "@/lib/supabaseClient";
import { getMainCategories, getSubCategories } from "@/lib/categories";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://luxurydispot.com";

  // 정적 페이지
  const staticPages = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "daily" as const,
      priority: 1,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.8,
    },
  ];

  // 제품 페이지
  const { data: products } = await supabase
    .from("products")
    .select("name_en, updated_at");

  const productPages =
    products?.map((product) => ({
      url: `${baseUrl}/products/${encodeURIComponent(product.name_en)}`,
      lastModified: new Date(product.updated_at),
      changeFrequency: "daily" as const,
      priority: 0.7,
    })) || [];

  // 메인 카테고리 페이지
  const mainCategories = await getMainCategories();
  const mainCategoryPages = mainCategories.map((category) => ({
    url: `${baseUrl}/category/${category.id}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.6,
  }));

  // 서브 카테고리 페이지
  const subCategoryPages = await Promise.all(
    mainCategories.map(async (mainCategory) => {
      const subCategories = await getSubCategories(mainCategory.id);
      return subCategories.map((subCategory) => ({
        url: `${baseUrl}/category/${mainCategory.id}/${subCategory.id}`,
        lastModified: new Date(),
        changeFrequency: "weekly" as const,
        priority: 0.5,
      }));
    })
  ).then((nestedArrays) => nestedArrays.flat());

  return [
    ...staticPages,
    ...productPages,
    ...mainCategoryPages,
    ...subCategoryPages,
  ];
}
