import React from "react";
import Image from "next/image";
import Link from "next/link";
import { StaticImageData } from "next/image";

export type ProductCardProps = {
  id: string;
  brand: string;
  name: string;
  name_en: string;
  price: number;
  image: StaticImageData | string;
  store: string;
  material?: string;
  careInstructions?: string;
  countryOfOrigin?: string;
  designerColor?: string;
  lining?: string;
  productNumber?: string;
  lowestPrice?: number;
};

export default function ProductCard({
  brand,
  name,
  name_en,
  price,
  image,
}: ProductCardProps) {
  return (
    <Link href={`/products/${name_en}`} className="block">
      <div className="border rounded-lg overflow-hidden shadow-sm">
        <div className="relative h-48">
          <Image
            src={image}
            alt={name}
            fill
            style={{ objectFit: "cover" }}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>
        <div className="p-4">
          <h3 className="text-sm font-semibold text-gray-600 mb-1">{brand}</h3>
          <h2 className="text-base font-medium mb-1">{name}</h2>
          {price !== undefined && (
            <p className="text-primary text-lg font-bold mb-1">
              {price.toLocaleString()}원
            </p>
          )}
        </div>
      </div>
    </Link>
  );
}
