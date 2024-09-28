import React from "react";
import ProductListHeader from "@/components/header/ProductListHeader";
import {
  getMainCategories,
  getSubCategories,
  getProductsByCategory,
} from "@/lib/categories";
import { TabGroup } from "@/components/TabGroup";

interface MainCategory {
  id: string;
  name: string;
  created_at: string;
}

interface SubCategory {
  id: string;
  main_category_id: string;
  name: string;
  created_at: string;
}

interface Product {
  id: string;
  brand_name_ko: string;
  brand_name_en: string;  // 이 줄을 추가
  product_name: string;
  product_name_en: string;
  image_url: string;
  productNumber?: string;
  lowest_price?: number;  // 가격 정보도 추가
}

async function fetchData(categoryName: string): Promise<{
  mainCategory: MainCategory;
  subCategories: SubCategory[];
  selectedSubCategory: SubCategory;
  products: Product[];
}> {
  const mainCategories: MainCategory[] = await getMainCategories();
  const selectedMainCategory =
    mainCategories.find((cat) => cat.name === decodeURIComponent(categoryName));

  if (!selectedMainCategory) {
    throw new Error("Main category not found");
  }

  const subCategories: SubCategory[] = await getSubCategories(
    selectedMainCategory.id
  );

  if (subCategories.length === 0) {
    throw new Error("No subcategories found for the selected main category");
  }

  const selectedSubCategory = subCategories[0];
  const products: Product[] = await getProductsByCategory(
    selectedSubCategory.id
  );

  return {
    mainCategory: selectedMainCategory,
    subCategories,
    selectedSubCategory,
    products,
  };
}

export default async function CategoryProductListPage({
  params,
}: {
  params: { categoryName: string };
}) {
  try {
    const { mainCategory, subCategories, selectedSubCategory, products } =
      await fetchData(params.categoryName);

    return (
      <div>
        <ProductListHeader categoryName={mainCategory.name} />
        <TabGroup
          subCategories={subCategories}
          selectedSubCategory={selectedSubCategory}
          products={products}
        />
      </div>
    );
  } catch (error) {
    console.error("Error in CategoryProductListPage:", error);
    return <div>Error loading product list. Please try again later.</div>;
  }
}
