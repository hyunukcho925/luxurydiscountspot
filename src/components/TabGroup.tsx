"use client";

import React from "react";
import { Tab } from "@headlessui/react";
import ProductCard from "./ProductCard";
import { StaticImageData } from "next/image";

interface SubCategory {
  id: string;
  name: string;
};

interface Product {
  id: string;
  brand_name_ko: string;
  product_name: string;
  product_name_en: string;
  image_url: StaticImageData | string;
  productNumber?: string;
};

interface TabGroupProps {
  subCategories: SubCategory[];
  selectedSubCategory: SubCategory;
  products: Product[];
};

export function TabGroup({
  subCategories,
  selectedSubCategory,
  products,
}: TabGroupProps) {
  return (
    <Tab.Group
      defaultIndex={subCategories.findIndex(
        (cat) => cat.id === selectedSubCategory.id
      )}
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
            <div>
              {products.map((product: Product) => (
                <ProductCard
                  key={product.id}
                  id={product.id}
                  brand_name_ko={product.brand_name_ko}
                  product_name={product.product_name}
                  product_name_en={product.product_name_en}
                  image_url={product.image_url}
                />
              ))}
            </div>
          </Tab.Panel>
        ))}
      </Tab.Panels>
    </Tab.Group>
  );
}
