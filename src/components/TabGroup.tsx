"use client";

import React from "react";
import { Tab } from "@headlessui/react";
import ProductCard from "./ProductCard";
import { StaticImageData } from "next/image";

type SubCategory = {
  id: string;
  name: string;
};

type Product = {
  id: string;
  brand: string;
  name: string;
  name_en: string;
  price: number;
  image: StaticImageData;
  store: string;
  material?: string;
  careInstructions?: string;
  countryOfOrigin?: string;
  designerColor?: string;
  lining?: string;
  productNumber?: string;
  lowestPrice?: number;
};

type TabGroupProps = {
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
                  ? "text-primary border-b-2 border-primary"
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
                  brand={product.brand}
                  name={product.name}
                  name_en={product.name_en}
                  price={product.price}
                  image={product.image}
                  store={product.store}
                  material={product.material}
                  careInstructions={product.careInstructions}
                  countryOfOrigin={product.countryOfOrigin}
                  designerColor={product.designerColor}
                  lining={product.lining}
                  productNumber={product.productNumber}
                  lowestPrice={product.lowestPrice}
                />
              ))}
            </div>
          </Tab.Panel>
        ))}
      </Tab.Panels>
    </Tab.Group>
  );
}
