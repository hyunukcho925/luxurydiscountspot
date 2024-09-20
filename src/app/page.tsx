import React from "react";
import BottomNavigation from "@/components/navigation/BottomNavigation";
import MainHeader from "@/components/header/MainHeader";
import SearchIcon from "@/components/icon/SearchIcon";
import ProductCard from "@/components/ProductCard";
import { StaticImageData } from "next/image";

import BurberryPouch from "@/assets/Product.png";
import BottegaShoulder from "@/assets/Product.png";
import LoeweBasket from "@/assets/Product.png";

type Product = {
  id: number;
  brand: string;
  name: string;
  price: number;
  image: StaticImageData;
  store: string;
};

const products: Product[] = [
  {
    id: 1,
    brand: "Burberry",
    name: "Phoebe 드로스트링 파우치",
    price: 878000,
    image: BurberryPouch,
    store: "MYTHERESA",
  },
  {
    id: 2,
    brand: "Bottega Veneta",
    name: "Cassette 레더 숄더 백",
    price: 4354000,
    image: BottegaShoulder,
    store: "MYTHERESA",
  },
  {
    id: 3,
    brand: "Loewe",
    name: "Paula's Ibiza Anagram 스몰바스켓백",
    price: 1203000,
    image: LoeweBasket,
    store: "MYTHERESA",
  },
];

export default function Page() {
  return (
    <div className="flex flex-col min-h-screen">
      <MainHeader />
      <main className="flex-grow p-4">
        <h1 className="text-2xl font-extrabold mb-4 text-center leading-normal">
          <span className="text-black-500">원하는 명품 직구, </span>
          <br />
          <span className="text-primary">어디에서 가장 저렴할까요?</span>
        </h1>
        <div className="relative mb-4">
          <input
            type="text"
            placeholder="상품을 검색해 보세요"
            className="w-full py-3 px-4 pr-12 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <button className="absolute right-3 top-1/2 transform -translate-y-1/2 bg-primary rounded-full p-2">
            <SearchIcon className="h-5 w-5 text-white" />
          </button>
        </div>

        <div className="flex space-x-2 mb-6 overflow-x-auto">
          {["초코", "공딩백딩", "대파", "드립커피", "피"].map((tag) => (
            <span
              key={tag}
              className="px-3 py-2 bg-gray-100 rounded-full text-sm whitespace-nowrap"
            >
              {tag}
            </span>
          ))}
        </div>

        <div>
          <h2 className="text-xl font-bold mb-4 flex items-center">
            <span className="mr-2">⚡</span> 지금 가장 HOT한 상품
          </h2>

          <div>
            {products.map((product) => (
              <ProductCard key={product.id} {...product} />
            ))}
          </div>
        </div>
      </main>
      <BottomNavigation />
    </div>
  );
}
