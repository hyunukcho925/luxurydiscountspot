"use client";

import React from "react";
import { useRouter } from "next/navigation";
import SearchIcon from "@/components/icon/SearchIcon";
import BackIcon from "@/components/icon/BackIcon";

interface ProductListHeaderProps {
  categoryName: string;
}

const ProductListHeader: React.FC<ProductListHeaderProps> = ({ categoryName }) => {
  const router = useRouter();

  return (
    <header className="sticky top-0 left-0 right-0 bg-white h-14 z-10">
      <div className="max-w-[500px] mx-auto px-4 h-full flex justify-between items-center">
        <button
          onClick={() => router.back()}
          className="p-0"
          aria-label="뒤로 가기"
        >
          <BackIcon className="w-6 h-6 text-gray-900" />
        </button>
        <h1 className="text-xl font-bold">{categoryName}</h1>
        <button
          onClick={() => router.push("/search")}
          className="p-0"
          aria-label="검색"
        >
          <SearchIcon className="w-6 h-6 text-gray-900" />
        </button>
      </div>
    </header>
  );
};

export default ProductListHeader;
