import React from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabaseClient";
import BottomNavigation from "@/components/navigation/BottomNavigation";
import MainHeader from "@/components/header/MainHeader";
import SearchIcon from "@/components/icon/SearchIcon";
import ProductCard from "@/components/ProductCard";

interface Product {
  id: number;
  name: string;
  name_en: string;
  price: number;
  image_url: string;
  brands: {
    name_en: string;
    name_ko: string;
  };
  product_categories: {
    sub_categories: {
      name: string;
      main_categories: {
        name: string;
      };
    };
  }[];
}

async function getHotProducts() {
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
    .limit(3); // Adjust this number as needed

  if (error) {
    console.error("Error fetching hot products:", error);
    return [];
  }

  return data as Product[];
}

export default async function Page() {
  const hotProducts = await getHotProducts();

  return (
    <div className="flex flex-col min-h-screen">
      <MainHeader />
      <main className="flex-grow p-4">
        <h1 className="text-2xl font-extrabold mb-4 text-center leading-normal">
          <span className="text-black-500">원하는 명품 직구, </span>
          <br />
          <span className="text-primary">어디에서 가장 저렴할까요?</span>
        </h1>
        <div className="relative mb-4">
          <Link href="/search" className="block">
            <input
              type="text"
              placeholder="상품을 검색해 보세요"
              className="w-full py-3 px-4 pr-12 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary"
              readOnly
            />
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 bg-primary rounded-full p-2">
              <SearchIcon className="h-5 w-5 text-white" />
            </div>
          </Link>
        </div>

        <div className="flex space-x-2 mb-6 overflow-x-auto">
          {["초코", "공딩백딩", "대파", "드립커피", "피"].map((tag) => (
            <span
              key={tag}
              className="px-3 py-2 bg-gray-100 rounded-full text-sm whitespace-nowrap"
            >
              {tag}
            </span>
          ))}
        </div>

        <div>
          <h2 className="text-xl font-bold mb-4 flex items-center">
            <span className="mr-1">⚡</span> 지금 가장 HOT한 상품
          </h2>

          <div>
            {hotProducts.map((product) => (
              <ProductCard
                key={product.id}
                id={product.id.toString()}
                brand={product.brands.name_ko}
                name={product.name}
                name_en={product.name_en}
                image={product.image_url}
              />
            ))}
          </div>
        </div>
      </main>
      <BottomNavigation />
    </div>
  );
}
