import React from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabaseClient";
import BottomNavigation from "@/components/navigation/BottomNavigation";
import MainHeader from "@/components/header/MainHeader";
import SearchIcon from "@/components/icon/SearchIcon";
import ProductCard from "@/components/ProductCard";

interface Product {
  id: string;
  brand_name_ko: string;
  product_name: string;
  product_name_en: string;
  image_url: string;
  productNumber?: string;
}

async function getHotProducts(): Promise<Product[]> {
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
    .limit(8);

  if (error) {
    console.error("Error fetching hot products:", error);
    return [];
  }

  return data.map((product) => ({
    id: product.id,
    brand_name_ko: product.brands?.name_ko || "",
    product_name: product.name,
    product_name_en: product.name_en,
    image_url: product.image_url,
    productNumber: product.product_number,
  }));
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
        <div className="relative mb-6">
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

        <div>
          <h2 className="text-xl font-bold mb-4 flex items-center">
            <span className="mr-1">⚡</span> 지금 가장 HOT한 상품
          </h2>

          <div>
            {hotProducts.map((product) => (
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
        </div>
      </main>
      <BottomNavigation />
    </div>
  );
}
