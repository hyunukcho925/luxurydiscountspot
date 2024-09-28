import { supabase } from "./supabaseClient";

interface Site {
  id: string;
  name: string;
  image_url: string;
}

interface PriceCrawl {
  price: number;
  currency: string;
  crawled_at: string;
}

interface CrawlTarget {
  id: string;
  encoded_product_url: string;
  site: Site;
  price_crawls: PriceCrawl[];
}

interface Brand {
  name_en: string;
  name_ko: string;
}

interface Product {
  id: string;
  name: string;
  name_en: string;
  image_url: string;
  brands: Brand;
  crawl_targets: CrawlTarget[];
  material: string;
  care_instructions: string;
  country_of_origin: string;
  designer_color: string;
  lining: string;
}

export interface ProductWithPrices extends Product {
  brand_name_ko: string;
  brand_name_en: string;
  product_name: string;
  product_name_en: string;
  sorted_prices: {
    site: Site;
    price: number;
    url: string;
    crawled_at: string;
  }[];
  lowest_price: number | undefined;
}

export async function getProduct(nameEn: string): Promise<ProductWithPrices | null> {
  const decodedNameEn = decodeURIComponent(nameEn);
  console.log("Fetching product with name_en:", decodedNameEn);
  
  const { data, error } = await supabase
    .from("products")
    .select(`
      *,
      brands (name_en, name_ko),
      product_categories (
        sub_categories (
          name,
          main_categories (name)
        )
      ),
      crawl_targets (
        id,
        encoded_product_url,
        site:sites (
          id,
          name,
          image_url
        ),
        price_crawls (
          price,
          currency,
          crawled_at
        )
      )
    `)
    .eq("name_en", decodedNameEn)
    .single();

  console.log("Fetched data:", data);
  console.log("Error:", error);

  if (error) {
    console.error("Error fetching product:", error);
    return null;
  }

  if (data) {
    const product = data as unknown as Product;
    const sortedPrices = product.crawl_targets
      .filter(target => target.price_crawls.length > 0)
      .map(target => ({
        site: target.site,
        price: target.price_crawls[0].price,
        url: target.encoded_product_url,
        crawled_at: target.price_crawls[0].crawled_at,
      }))
      .sort((a, b) => a.price - b.price);

    const lowestPrice = sortedPrices[0]?.price;

    return {
      ...product,
      brand_name_ko: product.brands?.name_ko,
      brand_name_en: product.brands?.name_en,
      product_name: product.name,
      product_name_en: product.name_en,
      sorted_prices: sortedPrices,
      lowest_price: lowestPrice,
    };
  }

  return null;
}

export interface PriceInfo {
  site: {
    id: string;
    name: string;
    image_url: string;
  };
  price: number;
  url: string;
  crawled_at: string;
}
