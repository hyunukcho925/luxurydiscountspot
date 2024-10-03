"use client";

import React, { useState, useEffect } from "react";
import { Tab } from "@headlessui/react";
import ProductCardHorizontal from "./ProductCardHorizontal";
import { StaticImageData } from "next/image";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { getSubCategories, getProductsByCategory } from "@/lib/categories";
import { roundToThousand } from '@/utils/numberFormat';

interface SubCategory {
  id: string;
  name: string;
  main_category_id: string;
}

interface Product {
  id: string;
  brand_name_en: string;
  brand_name_ko: string;
  product_name: string;
  product_name_en: string | null;
  image_url: StaticImageData | string;
  product_number: string;
  lowest_price: number | null;
  sub_category_id: string;
}

interface TabGroupProps {
  initialSubCategories: SubCategory[];
  initialSelectedSubCategory: SubCategory;
  initialProducts: Product[];
}

export function TabGroup({
  initialSubCategories,
  initialSelectedSubCategory,
  initialProducts,
}: TabGroupProps) {
  const [subCategories, setSubCategories] = useState(initialSubCategories);
  const [selectedSubCategory, setSelectedSubCategory] = useState(initialSelectedSubCategory);
  const [products, setProducts] = useState(initialProducts);
  const [isLoading, setIsLoading] = useState(false);
  const supabase = createClientComponentClient();

  useEffect(() => {
    fetchProducts(selectedSubCategory.id);

    const subCategoryChannel = supabase
      .channel('sub_categories')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'sub_categories' },
        () => {
          fetchSubCategories();
        }
      )
      .subscribe();

    const productsChannel = supabase
      .channel('products')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'products' },
        () => {
          fetchProducts(selectedSubCategory.id);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(subCategoryChannel);
      supabase.removeChannel(productsChannel);
    };
  }, [supabase, selectedSubCategory.id]);

  const fetchSubCategories = async () => {
    try {
      const updatedSubCategories = await getSubCategories(selectedSubCategory.main_category_id);
      setSubCategories(updatedSubCategories);
      
      const stillExists = updatedSubCategories.some(cat => cat.id === selectedSubCategory.id);
      if (!stillExists && updatedSubCategories.length > 0) {
        setSelectedSubCategory(updatedSubCategories[0]);
        fetchProducts(updatedSubCategories[0].id);
      }
    } catch (error) {
      console.error("Error fetching sub categories:", error);
    }
  };

  const fetchProducts = async (subCategoryId: string) => {
    setIsLoading(true);
    try {
      const updatedProducts = await getProductsByCategory(subCategoryId);
      console.log("Fetched products:", updatedProducts);
      const formattedProducts = updatedProducts.map(product => ({
        ...product,
        lowest_price: product.lowest_price !== undefined ? roundToThousand(Number(product.lowest_price)) : null
      }));
      setProducts(formattedProducts);
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleTabChange = (index: number) => {
    const newSelectedSubCategory = subCategories[index];
    setSelectedSubCategory(newSelectedSubCategory);
    fetchProducts(newSelectedSubCategory.id);
  };

  console.log("Current products:", products);
  console.log("Selected sub category:", selectedSubCategory);

  return (
    <Tab.Group
      defaultIndex={subCategories.findIndex(
        (cat) => cat.id === selectedSubCategory.id
      )}
      onChange={handleTabChange}
    >
      <Tab.List className="flex overflow-x-auto whitespace-nowrap">
        {subCategories.map((category: SubCategory) => (
          <Tab
            key={category.id}
            className={({ selected }: { selected: boolean }) =>
              `px-4 py-2 focus:outline-none ${
                selected
                  ? "text-primary font-bold border-b-2 border-primary"
                  : "text-gray-500"
              }`
            }
          >
            {category.name}
          </Tab>
        ))}
      </Tab.List>
      <Tab.Panels className="m-4">
        {subCategories.map((category: SubCategory) => (
          <Tab.Panel key={category.id}>
            {isLoading ? (
              <div>로딩 중...</div>
            ) : (
              <div>
                {products
                  .filter((product) => product.sub_category_id === category.id)
                  .map((product: Product) => (
                    <ProductCardHorizontal
                      key={product.id}
                      id={product.id}
                      brand_name_en={product.brand_name_en}
                      brand_name_ko={product.brand_name_ko}
                      product_name={product.product_name}
                      product_name_en={product.product_name_en || ""}
                      image_url={product.image_url || ""}
                      lowest_price={product.lowest_price}  // 이 부분을 수정
                      product_number={product.product_number}
                    />
                  ))}
              </div>
            )}
            {!isLoading &&
              products.filter(
                (product) => product.sub_category_id === category.id
              ).length === 0 && <div>이 카테고리에 상품이 없습니다.</div>}
          </Tab.Panel>
        ))}
      </Tab.Panels>
    </Tab.Group>
  );
}
