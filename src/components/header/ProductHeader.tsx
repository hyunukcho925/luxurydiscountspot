"use client";

import React from "react";
import { useRouter } from "next/navigation";
import BackIcon from "@/components/icon/BackIcon";
import HomeIcon from "@/components/icon/HomeIcon";
import SearchIcon from "@/components/icon/SearchIcon";
import ShareIcon from "@/components/icon/ShareIcon";

const ProductHeader: React.FC = () => {
  const router = useRouter();

  return (
    <header className="sticky top-0 left-0 right-0 bg-white h-14">
      <div className="max-w-[500px] mx-auto px-4 h-full flex justify-between items-center">
        <div className="flex items-center">
          <button onClick={() => router.back()} className="mr-4">
            <BackIcon className="w-6 h-6 text-gray-600" />
          </button>
          <button onClick={() => router.push("/")} className="mr-4">
            <HomeIcon className="w-6 h-6 text-gray-600" />
          </button>
        </div>
        <div className="flex items-center">
          <button onClick={() => router.push("/search")} className="mr-4">
            <SearchIcon className="w-6 h-6 text-gray-600" />
          </button>
          <button onClick={() => console.log("Share functionality")}>
            <ShareIcon className="w-6 h-6 text-gray-600" />
          </button>
        </div>
      </div>
    </header>
  );
};

export default ProductHeader;
