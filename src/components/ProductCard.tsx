import React from "react";
import Image from "next/image";
import Link from "next/link";
import { StaticImageData } from "next/image";

export interface ProductCardProps {
  id: string;
  brand_name_en: string;
  brand_name_ko?: string;
  product_name: string;
  product_name_en: string;
  image_url: StaticImageData | string;
  lowest_price?: number | null;  // null을 허용하도록 변경
  material?: string;
  care_instructions?: string;
  country_of_origin?: string;
  designer_color?: string;
  lining?: string;
  product_number?: string;
}

const ProductCard: React.FC<ProductCardProps> = ({
  brand_name_en,
  product_name,
  product_name_en,
  image_url,
  lowest_price,
}) => {
  return (
    <Link
      href={`/products/${encodeURIComponent(product_name_en)}`}
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
            <p className="text-base font-bold text-primary">
              {lowest_price.toLocaleString()}원
            </p>
          )}
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
