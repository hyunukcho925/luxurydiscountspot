import React from "react";
import Image from "next/image";
import Link from "next/link";
import { StaticImageData } from "next/image";

export type ProductCardProps = {
  id: string;
  brand_name_ko: string;
  product_name: string;
  product_name_en: string;
  image_url: StaticImageData | string;
  material?: string;
  careInstructions?: string;
  countryOfOrigin?: string;
  designerColor?: string;
  lining?: string;
  productNumber?: string;
};

export default function ProductCard({
  brand_name_ko,
  product_name,
  product_name_en,
  image_url,
}: ProductCardProps) {
  return (
    <Link href={`/products/${product_name_en}`} className="block mb-4">
      <div className="rounded-lg overflow-hidden flex items-center">
        <div className="border rounded-lg relative flex-shrink-0 bg-gray-100 size-32">
          <Image
            src={image_url}
            alt={product_name}
            fill
            style={{ objectFit: "cover" }}
          />
        </div>
        <div className="p-4 flex-grow">
          <h3 className="text-base font-semibold text-gray-600 mb-1">
            {brand_name_ko}
          </h3>
          <h2 className="text-base font-medium mb-1">{product_name}</h2>
        </div>
      </div>
    </Link>
  );
}
