"use client";

import React from "react";
import { useRouter } from "next/navigation";
import SearchIcon from "@/components/icon/SearchIcon";

const CategoryHeader: React.FC = () => {
  const router = useRouter();

  return (
    <header className="sticky top-0 left-0 right-0 bg-white h-14 z-10 border-b border-gray-200">
      <div className="max-w-[500px] mx-auto px-4 h-full flex justify-between items-center">
        <h1 className="text-xl font-bold">카테고리</h1>
        <button onClick={() => router.push("/search")} className="p-0">
          <SearchIcon
            className="w-6 h-6 text-gray-900"
            aria-label="검색"
          />
        </button>
      </div>
    </header>
  );
};

export default CategoryHeader;
