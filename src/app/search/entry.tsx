"use client";

import React, { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import SearchHeader from "@/components/header/SearchHeader";
import ProductCard from "@/components/ProductCard";
import { supabase } from "@/lib/supabaseClient";
import { Suspense } from "react";

interface Product {
  id: string;
  brand_name_en: string;
  brand_name_ko: string;
  product_name: string;
  product_name_en: string | null;
  image_url: string | null;
  lowest_price: number;
  product_number: string; // 추가: product_number 필드
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SearchContent />
    </Suspense>
  );
}

function SearchContent() {
  const searchParams = useSearchParams();
  const query = searchParams.get("q");
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchSearchResults() {
      setIsLoading(true);
      setError(null);

      try {
        if (query) {
          const { data, error } = await supabase.rpc("search_products", {
            in_search_query: query.toLowerCase(),
            result_limit: 50,
          });

          if (error) throw error;

          setSearchResults(data || []);
          await saveSearchTerm(query);
        }
      } catch (err) {
        console.error("검색 결과 가져오기 오류:", err);
        setError("검색 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.");
      } finally {
        setIsLoading(false);
      }
    }

    fetchSearchResults();
  }, [query]);

  async function saveSearchTerm(term: string) {
    try {
      const { error } = await supabase.rpc("save_and_increment_search", {
        search_term_param: term,
      });
      if (error) throw error;
    } catch (error) {
      console.error("검색어 저장 오류:", error);
    }
  }

  return (
    <div className="flex flex-col min-h-screen">
      <SearchHeader />
      <main className="flex-grow p-4">
        <h1 className="text-2xl font-bold mb-4">상품</h1>
        {isLoading ? (
          <p>검색 중...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : searchResults.length > 0 ? (
          <div className="space-y-4">
            {searchResults.map((product) => (
              <ProductCard
                key={product.id}
                id={product.id}
                brand_name_en={product.brand_name_en}
                brand_name_ko={product.brand_name_ko}
                product_name={product.product_name}
                product_name_en={product.product_name_en || ""}
                image_url={product.image_url || ""}
                lowest_price={product.lowest_price}
                product_number={product.product_number} // 추가: product_number 전달
              />
            ))}
          </div>
        ) : (
          <p>검색 결과가 없습니다.</p>
        )}
      </main>
    </div>
  );
}
