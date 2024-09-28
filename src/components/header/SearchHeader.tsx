"use client";

import React, { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import BackIcon from "@/components/icon/BackIcon";

const SearchHeader: React.FC = () => {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchTerm.trim())}`);
    }
  };

  return (
    <header className="sticky top-0 left-0 right-0 bg-white h-14 z-10">
      <div className="max-w-[500px] mx-auto px-4 h-full flex items-center">
        <button onClick={() => router.back()} className="mr-4" aria-label="뒤로 가기">
          <BackIcon className="w-6 h-6 text-gray-900" />
        </button>
        <form onSubmit={handleSearch} className="flex-1">
          <input
            ref={inputRef}
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
