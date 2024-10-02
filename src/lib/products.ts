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
  product_number: string; // 추가된 부분
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

export async function getProduct(
  nameEnWithNumber: string
): Promise<ProductWithPrices | null> {
  // URL에서 제품 이름과 번호를 분리합니다.
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
    `
    )
    .eq("name_en", decodedNameEn)
    .eq("product_number", productNumber) // 제품 번호로 추가 필터링
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
          price: latestPriceCrawl.price,
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
