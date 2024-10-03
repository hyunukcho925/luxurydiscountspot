import React from "react";
import Image from "next/image";
import Link from "next/link";
import { StaticImageData } from "next/image";
import { formatPrice } from "@/utils/numberFormat";

export interface ProductCardProps {
  id: string;
  brand_name_en: string;
  brand_name_ko?: string;
  product_name: string;
  product_name_en: string;
  image_url: StaticImageData | string;
  lowest_price: number | null;
  product_number: string;
}

const ProductCardHorizontal: React.FC<ProductCardProps> = ({
  brand_name_en,
  product_name,
  product_name_en,
  image_url,
  lowest_price,
  product_number,
}) => {
  return (
    <Link
      href={`/products/${encodeURIComponent(
        product_name_en
      )}-${product_number}`}
      className="block mb-4"
    >
      <div className="rounded-lg overflow-hidden flex items-center">
        <div className="rounded-lg relative flex-shrink-0 bg-gray-100 size-32 flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0 bg-gray-100" />
          <Image
            src={image_url}
            alt={product_name}
            fill
            sizes="128px"
            className="object-contain p-2"
          />
        </div>
        <div className="p-4 flex-grow">
          <h3 className="text-base font-bold text-gray-800 mb-1">
            {brand_name_en}
          </h3>
          <h2 className="text-base font-medium text-gray-800 mb-1">
            {product_name}
          </h2>
          {lowest_price !== undefined && lowest_price !== null && (
            <p className="text-primary font-bold">{formatPrice(lowest_price, true)}</p>
          )}
        </div>
      </div>
    </Link>
  );
};

export default ProductCardHorizontal;
