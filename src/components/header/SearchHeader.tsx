"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import BackIcon from "@/components/icon/BackIcon";

const SearchHeader: React.FC = () => {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // 여기에 검색 로직을 구현합니다.
    console.log("Searching for:", searchTerm);
    // 예: router.push(`/search-results?q=${searchTerm}`);
  };

  return (
    <header className="sticky top-0 left-0 right-0 bg-white h-14 z-10">
      <div className="max-w-[500px] mx-auto px-4 h-full flex items-center">
        <button onClick={() => router.back()} className="mr-4">
          <BackIcon className="w-6 h-6 text-gray-600" />
        </button>
        <form onSubmit={handleSearch} className="flex-1">
          <input
            type="text"
            placeholder="검색어를 입력하세요"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full h-10 p-4 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          />
        </form>
      </div>
    </header>
  );
};

export default SearchHeader;
