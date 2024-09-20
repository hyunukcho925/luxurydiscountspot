
import React from "react";
import { notFound } from "next/navigation";
import ProductHeader from "@/components/header/ProductHeader";
import Image from "next/image";
import ProductImage from "@/assets/Product.png";
import { StaticImageData } from "next/image";
import RightIcon from "@/components/icon/RightIcon";
import dynamic from 'next/dynamic';

const PriceHistoryChart = dynamic(
  () => import("@/containers/PriceHistoryChart"),
  { ssr: false }
);


type Product = {
  id: number;
  brand: string;
  name: string;
  price: number;
  image: StaticImageData;
  material: string;
  careInstructions: string;
  madeIn: string;
  designerColor: string;
  composition: string;
};

const allProducts: Product[] = [
  {
    id: 1,
    brand: "Burberry",
    name: "Phoebe 드로스트링 파우치",
    price: 878000,
    image: ProductImage,
    material: "100% 비스코스",
    careInstructions: "드라이클리닝",
    madeIn: "이탈리아",
    designerColor: "AW24-Black",
    composition: "84% 폴리아미드, 16% 엘라스테인",
  },
  // 다른 상품들도 이와 같은 형식으로 추가해주세요.
];

async function getProduct(id: string): Promise<Product | undefined> {
  // 실제 환경에서는 여기서 데이터베이스나 API를 호출합니다.
  return allProducts.find((p) => p.id === parseInt(id));
}

export default async function ProductDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const product = await getProduct(params.id);

  if (!product) {
    notFound();
  }

  return (
    <div className="pb-4">
      <ProductHeader />
      <div>
        <div className="bg-gray-100">
          <div className="relative w-[60%] pt-[60%] mx-auto">
            <Image
              src={product.image}
              alt={product.name}
              fill
              style={{ objectFit: "contain" }}
            />
          </div>
        </div>

        <div className="px-4 py-6">
          <h2 className="text-base text-gray-600 mb-1">{product.brand}</h2>
          <h1 className="text-2xl font-bold mb-2">{product.name}</h1>
          <div className="flex items-center gap-2">
            <p className="text-sm bg-[#EDFEEE] text-primary font-bold p-1 rounded-lg">
              최저가
            </p>
            <p className="text-lg font-bold">
              {product.price.toLocaleString()}원
            </p>
          </div>
        </div>

        <div className="w-full h-[8px] bg-gray-100" />

        <div className="px-4 py-6">
          <div className="mb-6">
            <h3 className="text-xl font-semibold mb-2">상품 정보</h3>
          </div>

          <div className="space-y-3">
            <div className="flex justify-between border-b border-gray-100 pb-4">
              <span className="text-gray-800">소재</span>
              <span>{product.material}</span>
            </div>
            <div className="flex justify-between border-b border-gray-100 pb-4">
              <span className="text-gray-800">관리방법</span>
              <span>{product.careInstructions}</span>
            </div>
            <div className="flex justify-between border-b border-gray-100 pb-4">
              <span className="text-gray-800">제조국</span>
              <span>{product.madeIn}</span>
            </div>
            <div className="flex justify-between border-b border-gray-100 pb-4">
              <span className="text-gray-800">디자이너 컬러명</span>
              <span>{product.designerColor}</span>
            </div>
            <div className="flex justify-between border-b border-gray-100 pb-4">
              <span className="text-gray-800">안감</span>
              <span>{product.composition}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="w-full h-[8px] bg-gray-100" />

      <div className="px-4 py-6">
        <h3 className="text-xl font-semibold mb-4">현재 최저가</h3>
        <div className="space-y-3">
          {[
            { store: "파페치", price: 3288000 },
            { store: "매치스패션", price: 4266769 },
            { store: "마이테레사", price: 6271600 },
          ].map(({ store, price }) => (
            <div
              key={store}
              className="flex justify-between items-center border-b border-gray-100 pb-3"
            >
              <span className="text-gray-800">{store}</span>
              <div className="flex items-center">
                <span
                  className={`font-bold ${
                    store === "파페치" ? "text-green-500" : "text-gray-900"
                  }`}
                >
                  {price.toLocaleString()}원
                </span>
                <RightIcon className="w-5 h-5 text-gray-400 ml-2" />
              </div>
            </div>
          ))}
        </div>
        <button className="w-full bg-[#EDFEEE] text-primary font-bold py-3 px-4 rounded-lg mt-4">
          최저가 사러 가기
        </button>
      </div>

      <div className="w-full h-[8px] bg-gray-100" />

      <div className="px-4 py-6">
        <h3 className="text-xl font-semibold mb-4">최저가 히스토리</h3>
        <PriceHistoryChart />
        <div className="mt-4 space-y-2 border border-gray-200 p-4 rounded-lg">
          <div className="flex justify-between border-b border-gray-100 pb-3">
            <span className="text-gray-600">역대 최저가</span>
            <span className="font-bold text-primary">3,124,000원</span>
          </div>
          <div className="flex justify-between border-b border-gray-100 pb-3">
            <span className="text-gray-600">평균가</span>
            <span className="font-bold">4,288,000원</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600 ">역대 최고가</span>
            <span className="font-bold text-secondary">8,288,000원</span>
          </div>
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 p-2 bg-white">
        <button className="w-full bg-green-500 text-white font-bold py-3 px-2 rounded-lg">
          구매하러 가기
        </button>
      </div>
    </div>
  );
}