"use client";

import React from 'react';
import ProductCard from '@/components/ProductCard';
import ProductListHeader from '@/components/header/ProductListHeader';
import { StaticImageData } from "next/image";
import { Tab } from '@headlessui/react';

// 이미지 import
import BurberryPouch from "@/assets/Product.png";
import BottegaShoulder from "@/assets/Product.png";
import LoeweBasket from "@/assets/Product.png";

const categories = ["전체", "클러치", "숄더백", "크로스백", "토트백", "트래블"];

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

export default function ProductListPage() {
  const categoryName = "가방";

  return (
    <div>
      <ProductListHeader categoryName={categoryName} />
      <div>
        <Tab.Group>
          <Tab.List className="flex overflow-x-auto whitespace-nowrap mb-4">
            {categories.map((category) => (
              <Tab
                key={category}
                className={({ selected }) =>
                  `px-4 py-2 focus:outline-none ${
                    selected
                      ? "text-primary border-b-2 border-primary"
                      : "text-gray-500"
                  }`
                }
              >
                {category}
              </Tab>
            ))}
          </Tab.List>
          <Tab.Panels className="m-4">
            {categories.map((category) => (
              <Tab.Panel key={category}>
                <div>
                  {products.map((product) => (
                    <ProductCard key={product.id} {...product} />
                  ))}
                </div>
              </Tab.Panel>
            ))}
          </Tab.Panels>
        </Tab.Group>
      </div>
    </div>
  );
}
