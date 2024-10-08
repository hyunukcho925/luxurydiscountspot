import React from "react";
import Link from "next/link";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import BottomNavigation from "@/components/navigation/BottomNavigation";
import MainHeader from "@/components/header/MainHeader";
import SearchIcon from "@/components/icon/SearchIcon";
import RealtimeHotProducts from "@/components/RealtimeHotProducts";

interface Product {
  id: string;
  brand_name_ko: string;
  brand_name_en: string;
  product_name: string;
  product_name_en: string;
  image_url: string;
  product_number: string;
  lowest_price: number | null;
}

interface Brand {
  name_en: string;
  name_ko: string;
}

interface PriceCrawl {
  price: number | null;
}

interface CrawlTarget {
  price_crawls: PriceCrawl[];
}

interface SupabaseProduct {
  id: string;
  name: string;
  name_en: string;
  image_url: string;
  product_number: string;
  brands: Brand;
  crawl_targets: CrawlTarget[];
}

async function getHotProducts(): Promise<Product[]> {
  const supabase = createServerComponentClient({ cookies });
  const { data, error } = await supabase
    .from("products")
    .select(
      `
      *,
      brands (name_en, name_ko),
      crawl_targets (
        price_crawls (
          price
        )
      )
    `
    )
    .limit(8);

  if (error) {
    console.error("Error fetching hot products:", error);
    return [];
  }

  return (data as SupabaseProduct[]).map((product) => {
    const prices = product.crawl_targets
      .flatMap((target) => target.price_crawls.map((crawl) => crawl.price))
      .filter((price): price is number => price !== null);

    const lowest_price = prices.length > 0 ? Math.min(...prices) : null;

    return {
      id: product.id,
      brand_name_ko: product.brands.name_ko,
      brand_name_en: product.brands.name_en,
      product_name: product.name,
      product_name_en: product.name_en,
      image_url: product.image_url,
      product_number: product.product_number,
      lowest_price,
    };
  });
}

export default async function Page() {
  const hotProducts = await getHotProducts();

  return (
    <div className="flex flex-col min-h-screen-56">
      <MainHeader />
      <main className="flex-grow px-4 py-6">
        <h1 className="text-2xl font-extrabold mb-6 text-center leading-normal">
          <span className="text-black-500">원하는 명품 직구, </span>
          <br />
          <span className="text-primary">어디에서 가장 저렴할까요?</span>
        </h1>
        <div className="relative mb-12">
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

          <RealtimeHotProducts initialProducts={hotProducts} />
        </div>
      </main>
      <BottomNavigation />
    </div>
  );
}
