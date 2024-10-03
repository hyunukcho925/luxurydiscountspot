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
  lowest_price?: number | null;
  product_number: string;
}

const ProductCardVertical: React.FC<ProductCardProps> = ({
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
      className="block mb-4 w-full max-w-[250px]"
    >
      <div className="rounded-lg overflow-hidden flex flex-col">
        <div className="rounded-lg relative bg-gray-100 w-full aspect-square flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0 bg-gray-100" />
          <Image
            src={image_url}
            alt={product_name}
            fill
            sizes="(max-width: 250px) 100vw, 250px"
            className="object-contain p-2"
          />
        </div>
        <div className="p-4">
          <h3 className="text-sm font-bold text-gray-800 mb-1 truncate">
            {brand_name_en}
          </h3>
          <h2 className="text-sm font-medium text-gray-800 mb-1 truncate">
            {product_name}
          </h2>
          {lowest_price !== undefined && lowest_price !== null && (
            <p className="text-sm font-bold text-primary">
              {lowest_price.toLocaleString()}
            </p>
          )}
        </div>
      </div>
    </Link>
  );
};

export default ProductCardVertical;
