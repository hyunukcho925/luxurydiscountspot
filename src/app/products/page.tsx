import React from "react";
import ProductListHeader from "@/components/header/ProductListHeader";
import {
  getMainCategories,
  getSubCategories,
  getProductsByCategory,
} from "@/lib/categories";
import { TabGroup } from "@/components/TabGroup";
import { StaticImageData } from "next/image";

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
  name: string;
  brand: string;
  name_en: string;
  price: number;
  image: StaticImageData;
  store: string;
}

function validateAndTransformImageUrl(
  url: string | StaticImageData
): StaticImageData {
  if (typeof url !== "string") {
    return url;
  }

  const allowedDomains = ["gvzpgksrsvrwzawlqdzz.supabase.co"];
  try {
    const imageUrl = new URL(url);
    if (allowedDomains.includes(imageUrl.hostname)) {
      return { src: url, height: 300, width: 300 };
    } else {
      return { src: "/path/to/placeholder-image.jpg", height: 300, width: 300 };
    }
  } catch {
    return { src: "/path/to/placeholder-image.jpg", height: 300, width: 300 };
  }
}

async function fetchData(categoryId: string): Promise<{
  mainCategory: MainCategory;
  subCategories: SubCategory[];
  selectedSubCategory: SubCategory;
  products: Product[];
}> {
  const mainCategories: MainCategory[] = await getMainCategories();
  const selectedMainCategory =
    mainCategories.find((cat) => cat.id === categoryId) || mainCategories[0];

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
  const rawProducts: Product[] = await getProductsByCategory(
    selectedSubCategory.id
  );

  const products = rawProducts.map((product) => ({
    ...product,
    image: validateAndTransformImageUrl(product.image),
  }));

  return {
    mainCategory: selectedMainCategory,
    subCategories,
    selectedSubCategory,
    products,
  };
}

export default async function ProductListPage({
  params,
}: {
  params: { categoryId: string };
}) {
  const { mainCategory, subCategories, selectedSubCategory, products } =
    await fetchData(params.categoryId);

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
}
