import React from "react";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import ProductHeader from "@/components/header/ProductHeader";
import Image from "next/image";
import RightIcon from "@/components/icon/RightIcon";
import { getProduct, ProductWithPrices } from "../../../lib/products";

export async function generateMetadata({
  params,
}: {
  params: { name_en_with_number: string };
}): Promise<Metadata> {
  const product = await getProduct(params.name_en_with_number);

  if (!product) {
    return {
      title: "상품을 찾을 수 없습니다",
    };
  }

  const productUrl = `https://luxurydispot.com/products/${encodeURIComponent(
    params.name_en_with_number
  )}`;

  return {
    title: `${product.brands.name_ko} ${product.name} | 럭셔리 디스팟`,
    description: `${product.brands.name_ko} ${product.name}의 상세 정보와 최저가 정보를 확인하세요. 럭셔리 디스팟에서 최저가로 구매하세요.`,
    openGraph: {
      title: `${product.brands.name_ko} ${product.name} | 럭셔리 디스팟`,
      description: `${product.brands.name_ko} ${product.name}의 상세 정보와 최저가 정보를 확인하세요. 럭셔리 디스팟에서 최저가로 구매하세요.`,
      url: productUrl,
      siteName: "럭셔리 디스팟",
      images: [
        {
          url: product.image_url,
          width: 800,
          height: 800,
          alt: `${product.brands.name_ko} ${product.name} 이미지`,
        },
      ],
      locale: "ko_KR",
      type: "website",
    },
    alternates: {
      canonical: productUrl,
    },
    robots: {
      index: true,
      follow: true,
    },
    twitter: {
      card: "summary_large_image",
      title: `${product.brands.name_ko} ${product.name} | 럭셔리 디스팟`,
      description: `${product.brands.name_ko} ${product.name}의 상세 정보와 최저가 정보를 확인하세요. 럭셔리 디스팟에서 최저가로 구매하세요.`,
      images: [product.image_url],
    },
    other: {
      price: `${product.lowest_price?.toLocaleString()}원`,
      brand: product.brands.name_ko,
    },
  };
}

export default async function ProductDetailPage({
  params,
}: {
  params: { name_en_with_number: string };
}) {
  const product = (await getProduct(
    params.name_en_with_number
  )) as ProductWithPrices | null;
  console.log("Params:", params);
  console.log("Product:", product);

  if (!product) {
    console.log("Product not found, returning 404");
    notFound();
  }

  return (
    <div className="pb-4">
      <ProductHeader />
      <div>
        <div className="bg-gray-100 py-6">
          <div className="relative w-[60%] pt-[60%] mx-auto">
            <Image
              src={product.image_url}
              alt={product.name}
              fill
              style={{ objectFit: "contain" }}
            />
          </div>
        </div>

        <div className="px-4 py-6">
          <p className="text-lg font-bold text-gray-800 mb-2">
            {product.brands.name_en}
          </p>
          <h1 className="text-2xl font-medium mb-4 text-gray-800">
            {product.brands.name_ko} {""} {product.name}
          </h1>
          <div className="flex items-center gap-2">
            <h2 className="text-sm bg-[#EDFEEE] text-primary font-bold p-1 rounded-md">
              최저가
            </h2>
            <p className="text-xl text-primary font-bold">
              {product.lowest_price?.toLocaleString()}원
            </p>
          </div>
        </div>

        <div className="w-full h-[8px] bg-gray-100" />

        <div className="px-4 py-6">
          <h2 className="text-xl font-semibold mb-4">현재 최저가</h2>
          <div>
            {product.sorted_prices.map(({ site, price, url }, index) => (
              <a
                key={`${site.id}-${index}`}
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex justify-between items-center border-b border-gray-100 py-5"
              >
                <div className="flex items-center">
                  <div className="w-8 h-8 mr-3 relative">
                    <Image
                      src={site.image_url}
                      alt={site.name}
                      fill
                      style={{ objectFit: "contain" }}
                      className="rounded-full border border-gray-100"
                    />
                  </div>
                  <span className="text-gray-800 font-bold">{site.name}</span>
                </div>
                <div className="flex items-center">
                  <span
                    className={`font-bold ${
                      price === product.lowest_price
                        ? "text-primary"
                        : "text-gray-900"
                    }`}
                  >
                    {price.toLocaleString()}원
                  </span>
                  <RightIcon className="w-5 h-5 text-gray-400 ml-2" />
                </div>
              </a>
            ))}
          </div>
          {product.sorted_prices.length > 0 && (
            <a
              href={product.sorted_prices[0].url}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full bg-[#EDFEEE] text-primary font-bold py-3 px-4 rounded-lg mt-4 block text-center"
            >
              최저가 사러 가기
            </a>
          )}
        </div>

        <div className="w-full h-[8px] bg-gray-100" />

        <div className="px-4 py-6">
          <h2 className="text-xl font-semibold mb-4">상품 정보</h2>

          <div>
            <div className="flex justify-between border-b border-gray-100 py-4">
              <h3 className="text-gray-800">브랜드</h3>
              <p className="text-gray-800 font-semibold">
                {product.brands.name_ko} ({product.brands.name_en})
              </p>
            </div>
            <div className="flex justify-between border-b border-gray-100 py-4">
              <h3 className="text-gray-800">상품명</h3>
              <p className="text-gray-800 font-semibold">{product.name}</p>
            </div>
            <div className="flex justify-between border-b border-gray-100 py-4">
              <h3 className="text-gray-800">컬러명</h3>
              <p className="text-gray-800 font-semibold">
                {product.designer_color}
              </p>
            </div>
            <div className="flex justify-between border-b border-gray-100 py-4">
              <h3 className="text-gray-800">소재</h3>
              <p className="text-gray-800 font-semibold">{product.material}</p>
            </div>
            <div className="flex justify-between border-b border-gray-100 py-4">
              <h3 className="text-gray-800">안감</h3>
              <p className="text-gray-800 font-semibold">{product.lining}</p>
            </div>
            <div className="flex justify-between border-b border-gray-100 py-4">
              <h3 className="text-gray-800">제조국</h3>
              <p className="text-gray-800 font-semibold">
                {product.country_of_origin}
              </p>
            </div>
            <div className="flex justify-between border-b border-gray-100 py-4">
              <h3 className="text-gray-800">관리방법</h3>
              <p className="text-gray-800 font-semibold">
                {product.care_instructions}
              </p>
            </div>
          </div>
        </div>

        <div className="w-full h-[8px] bg-gray-100" />

        <div className="px-4 py-6">
          <h2 className="text-xl font-semibold mb-4">브랜드 정보</h2>

          <div>
            <div className="justify-between py-4">
              <h3 className="text-gray-800 font-semibold pb-4">
                💬 {product.brands.name_ko}({product.brands.name_en})란?
              </h3>
              <p className="text-gray-800">
                {product.brands.description}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 px-4 py-2 bg-white max-w-[500px] mx-auto">
        {product.sorted_prices.length > 0 && (
          <a
            href={product.sorted_prices[0].url}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full bg-primary text-white font-bold py-3 px-2 rounded-lg block text-center"
          >
            구매하러 가기
          </a>
        )}
      </div>
    </div>
  );
}
