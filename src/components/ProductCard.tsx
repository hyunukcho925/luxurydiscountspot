import React from "react";
import Image from "next/image";
import Link from "next/link";
import { StaticImageData } from "next/image";

type ProductCardProps = {
  id: number;
  brand: string;
  name: string;
  price: number;
  image: StaticImageData;
  store: string;
};

const ProductCard: React.FC<ProductCardProps> = ({
  id,
  brand,
  name,
  price,
  image,
}) => {
  return (
    <Link href={`/products/${id}`} className="block">
      <div className="flex mb-4 h-32">
        <div className="w-32 h-32 relative mr-2 bg-gray-100 rounded-md overflow-hidden">
          <Image
            src={image}
            alt={name}
            fill
            style={{ objectFit: "cover" }}
            className="rounded-md"
          />
        </div>
        <div className="flex-1 flex flex-col justify-center">
          <h3 className="text-sm font-semibold text-gray-600 mb-1">{brand}</h3>
          <h2 className="text-base font-medium mb-1">{name}</h2>
          <p className="text-primary text-lg font-bold mb-1">{price.toLocaleString()}원</p>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
