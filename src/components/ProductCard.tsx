import React from "react";
import Image from "next/image";
import Link from "next/link";
import { StaticImageData } from "next/image";

export type ProductCardProps = {
  id: string;
  brand: string;
  name: string;
  name_en: string;
  image: StaticImageData | string;
  material?: string;
  careInstructions?: string;
  countryOfOrigin?: string;
  designerColor?: string;
  lining?: string;
  productNumber?: string;
};

export default function ProductCard({
  brand,
  name,
  name_en,
  image,
}: ProductCardProps) {
  return (
    <Link href={`/products/${name_en}`} className="block mb-4">
      <div className="rounded-lg overflow-hidden flex items-center">
        <div className="border rounded-lg relative w-40 h-40 flex-shrink-0 bg-gray-100 size-20">
          <Image
            src={image}
            alt={name}
            fill
            style={{ objectFit: "cover" }}
          />
        </div>
        <div className="p-4 flex-grow">
          <h3 className="text-base font-semibold text-gray-600 mb-1">{brand}</h3>
          <h2 className="text-base font-medium mb-1">{name}</h2>
        </div>
      </div>
    </Link>
  );
}
