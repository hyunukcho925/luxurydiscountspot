import React from "react";
import BottomNavigation from "@/components/navigation/BottomNavigation";
import SearchHeader from "@/components/header/SearchHeader";

export default function SearchPage() {
  return (
    <>
      <SearchHeader />
      <div className="p-4 min-h-[calc(100vh-120px)]">
        <div className="mb-4">

        </div>
        <div>
          <p className="text-gray-600">최근 검색어가 여기에 표시됩니다.</p>
        </div>
      </div>
      <BottomNavigation />
    </>
  );
}
