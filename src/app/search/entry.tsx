"use client";

import React, { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import SearchHeader from "@/components/header/SearchHeader";
import ProductCardHorizontal from "@/components/ProductCardHorizontal";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { Suspense } from "react";
import { roundToThousand } from '@/utils/numberFormat';

interface Product {
  id: string;
  brand_name_en: string;
  brand_name_ko: string;
  product_name: string;
  product_name_en: string | null;
  image_url: string | null;
  lowest_price: number | null;
  product_number: string;
}

interface SearchResult {
  id: string;
  brand_name_en: string;
  brand_name_ko: string;
  product_name: string;
  product_name_en: string | null;
  image_url: string | null;
  lowest_price: number | null;
  product_number: string;
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
  const supabase = createClientComponentClient();

  useEffect(() => {
    async function fetchSearchResults() {
      setIsLoading(true);
      setError(null);

      try {
        if (query) {
          console.log("Searching for:", query);
          const { data, error } = await supabase.rpc("search_products", {
            in_search_query: query.toLowerCase(),
            result_limit: 50,
          });

          if (error) {
            console.error("Supabase RPC error:", error);
            throw error;
          }

          console.log("Search results:", data);

          const formattedData = (data as SearchResult[])?.map((item) => ({
            ...item,
            lowest_price: item.lowest_price !== null ? roundToThousand(Number(item.lowest_price)) : null,
          })) || [];

          setSearchResults(formattedData);
          await saveSearchTerm(query);  // query는 여기서 항상 string입니다
        }
      } catch (err) {
        console.error("검색 결과 가져오기 오류:", err);
        if (err instanceof Error) {
          setError(`검색 중 오류가 발생했습니다: ${err.message}`);
        } else {
          setError("알 수 없는 오류가 발생했습니다. 잠시 후 다시 시도해주세요.");
        }
      } finally {
        setIsLoading(false);
      }
    }

    fetchSearchResults();

    // 실시간 업데이트를 위한 구독 설정
    const channel = supabase
      .channel('products_changes')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'products' },
        () => {
          fetchSearchResults();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [query, supabase]);

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
              <ProductCardHorizontal
                key={product.id}
                id={product.id}
                brand_name_en={product.brand_name_en}
                brand_name_ko={product.brand_name_ko}
                product_name={product.product_name}
                product_name_en={product.product_name_en || ""}
                image_url={product.image_url || ""}
                lowest_price={product.lowest_price}
                product_number={product.product_number}
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
