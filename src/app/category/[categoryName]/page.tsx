"use client";

import React, { useState, useEffect } from "react";
import ProductListHeader from "@/components/header/ProductListHeader";
import {
  getMainCategories,
  getSubCategories,
  getProductsByCategory,
} from "@/lib/categories";
import { TabGroup } from "@/components/TabGroup";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
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
  brand_name_ko: string;
  brand_name_en: string;
  product_name: string;
  product_name_en: string | null;
  image_url: string | StaticImageData;
  product_number: string;
  sub_category_id: string;
  lowest_price: number | null;
}

function CategoryProductListPage({
  params,
}: {
  params: { categoryName: string };
}) {
  const [mainCategory, setMainCategory] = useState<MainCategory | null>(null);
  const [subCategories, setSubCategories] = useState<SubCategory[]>([]);
  const [selectedSubCategory, setSelectedSubCategory] =
    useState<SubCategory | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [error, setError] = useState<string | null>(null);

  const supabase = createClientComponentClient();

  useEffect(() => {
    fetchData();

    const mainCategoryChannel = supabase
      .channel("main_categories")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "main_categories" },
        () => fetchData()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(mainCategoryChannel);
    };
  }, [supabase, params.categoryName]);

  const fetchData = async () => {
    try {
      const mainCategories: MainCategory[] = await getMainCategories();
      const selectedMainCategory = mainCategories.find(
        (cat) => cat.name === decodeURIComponent(params.categoryName)
      );

      if (!selectedMainCategory) {
        throw new Error("Main category not found");
      }

      setMainCategory(selectedMainCategory);

      const subCats: SubCategory[] = await getSubCategories(
        selectedMainCategory.id
      );

      if (subCats.length === 0) {
        throw new Error(
          "No subcategories found for the selected main category"
        );
      }

      setSubCategories(subCats);
      setSelectedSubCategory(subCats[0]);

      const productsData = await getProductsByCategory(subCats[0].id);
      const products: Product[] = productsData.map((product) => ({
        ...product,
        lowest_price:
          product.lowest_price !== undefined
            ? Number(product.lowest_price)
            : null,
        product_name_en: product.product_name_en || null,
        image_url: product.image_url || "/placeholder.jpg", // Provide a default image URL
      }));
      setProducts(products);
    } catch (err) {
      console.error("Error in fetchData:", err);
      setError("Error loading product list. Please try again later.");
    }
  };

  if (error) {
    return <div>{error}</div>;
  }

  if (!mainCategory || !selectedSubCategory) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <ProductListHeader categoryName={mainCategory.name} />
      <TabGroup
        initialSubCategories={subCategories}
        initialSelectedSubCategory={selectedSubCategory}
        initialProducts={products}
      />
    </div>
  );
}

export default CategoryProductListPage;
