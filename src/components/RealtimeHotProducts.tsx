"use client";

import React, { useEffect, useState } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import ProductCardHorizontal from "./ProductCardHorizontal";

interface Product {
  id: string;
  brand_name_ko: string;
  brand_name_en: string;
  product_name: string;
  product_name_en: string;
  image_url: string;
  product_number: string;
  lowest_price: number | null; // Changed from 'number | null | undefined' to 'number | null'
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

function roundToThousand(price: number): number {
  return Math.round(price / 1000) * 1000;
}

export default function RealtimeHotProducts({
  initialProducts,
}: {
  initialProducts: Product[];
}) {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const supabase = createClientComponentClient();

  useEffect(() => {
    const channel = supabase
      .channel("hot-products")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "products",
        },
        (payload) => {
          if (payload.new && "id" in payload.new) {
            getUpdatedProduct(payload.new.id).then((updatedProduct) => {
              if (updatedProduct) {
                setProducts((currentProducts) => {
                  const index = currentProducts.findIndex(
                    (p) => p.id === updatedProduct.id
                  );
                  if (index !== -1) {
                    const newProducts = [...currentProducts];
                    newProducts[index] = updatedProduct;
                    return newProducts;
                  } else {
                    return [...currentProducts, updatedProduct];
                  }
                });
              }
            });
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase]);

  useEffect(() => {
    setProducts(
      initialProducts.map((product) => ({
        ...product,
        lowest_price:
          product.lowest_price != null
            ? roundToThousand(product.lowest_price)
            : null,
      }))
    );
  }, [initialProducts]);

  async function getUpdatedProduct(id: string): Promise<Product | null> {
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
      .eq("id", id)
      .single();

    if (error || !data) {
      console.error("Error fetching updated product:", error);
      return null;
    }

    const supabaseProduct = data as SupabaseProduct;

    const prices = supabaseProduct.crawl_targets
      .flatMap((target: CrawlTarget) =>
        target.price_crawls.map((crawl: PriceCrawl) => crawl.price)
      )
      .filter((price): price is number => price !== null);

    const lowest_price =
      prices.length > 0 ? roundToThousand(Math.min(...prices)) : null;

    return {
      id: supabaseProduct.id,
      brand_name_ko: supabaseProduct.brands.name_ko,
      brand_name_en: supabaseProduct.brands.name_en,
      product_name: supabaseProduct.name,
      product_name_en: supabaseProduct.name_en,
      image_url: supabaseProduct.image_url,
      product_number: supabaseProduct.product_number,
      lowest_price,
    };
  }

  return (
    <div>
      {products.map((product) => (
        <ProductCardHorizontal
          key={product.id}
          id={product.id}
          brand_name_en={product.brand_name_en}
          brand_name_ko={product.brand_name_ko}
          product_name={product.product_name}
          product_name_en={product.product_name_en}
          image_url={product.image_url}
          lowest_price={product.lowest_price}
          product_number={product.product_number}
        />
      ))}
    </div>
  );
}
