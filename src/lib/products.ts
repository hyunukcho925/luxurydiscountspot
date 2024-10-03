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
  id: string;
  name_en: string;
  name_ko: string;
  description: string;
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
  product_number: string;
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
  lowest_price: number | null;
}

function roundToThousand(price: number): number {
  return Math.round(price / 1000) * 1000;
}

export async function getProduct(
  nameEnWithNumber: string
): Promise<ProductWithPrices | null> {
  const [nameEn, productNumber] = nameEnWithNumber.split("-");
  const decodedNameEn = decodeURIComponent(nameEn);
  console.log(
    "Fetching product with name_en:",
    decodedNameEn,
    "and product_number:",
    productNumber
  );

  const { data, error } = await supabase
    .from("products")
    .select(
      `
      *,
      brands (name_en, name_ko, description),
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
    `
    )
    .eq("name_en", decodedNameEn)
    .eq("product_number", productNumber)
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
      .filter((target) => target.price_crawls.length > 0)
      .map((target) => {
        const latestPriceCrawl = target.price_crawls.reduce((latest, current) =>
          new Date(current.crawled_at) > new Date(latest.crawled_at)
            ? current
            : latest
        );

        return {
          site: target.site,
          price: roundToThousand(latestPriceCrawl.price),
          url: target.encoded_product_url,
          crawled_at: latestPriceCrawl.crawled_at,
        };
      })
      .sort((a, b) => a.price - b.price);

    const lowestPrice = sortedPrices.length > 0 ? sortedPrices[0].price : null;

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

export async function getOtherProductsByBrand(brandId: string, currentProductId: string, limit: number = 4): Promise<ProductWithPrices[]> {
  const { data, error } = await supabase
    .from('products')
    .select(`
      *,
      brands!inner (id, name_en, name_ko),
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
    .eq('brands.id', brandId)
    .neq('id', currentProductId)
    .limit(limit);

  if (error) {
    console.error("Error fetching other products by brand:", error);
    return [];
  }

  return (data as ProductFromDB[]).map((product) => {
    const sortedPrices = product.crawl_targets
      .filter((target) => target.price_crawls.length > 0)
      .map((target) => {
        const latestPriceCrawl = target.price_crawls.reduce((latest, current) =>
          new Date(current.crawled_at) > new Date(latest.crawled_at)
            ? current
            : latest
        );

        return {
          site: target.site,
          price: roundToThousand(latestPriceCrawl.price),
          url: target.encoded_product_url,
          crawled_at: latestPriceCrawl.crawled_at,
        };
      })
      .sort((a, b) => a.price - b.price);

    const lowestPrice = sortedPrices.length > 0 ? sortedPrices[0].price : null;

    return {
      ...product,
      brand_name_ko: product.brands.name_ko,
      brand_name_en: product.brands.name_en,
      product_name: product.name,
      product_name_en: product.name_en,
      sorted_prices: sortedPrices,
      lowest_price: lowestPrice,
    } as ProductWithPrices;
  });
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

interface ProductFromDB extends Omit<Product, 'brands' | 'crawl_targets'> {
  brands: Brand;
  crawl_targets: Array<CrawlTarget & { site: Site }>;
}
