"use client";

import React from "react";
import { useRouter } from "next/navigation";
import BackIcon from "@/components/icon/BackIcon";
import HomeIcon from "@/components/icon/HomeIcon";
import SearchIcon from "@/components/icon/SearchIcon";
import ShareIcon from "@/components/icon/ShareIcon";

const ProductHeader: React.FC = () => {
  const router = useRouter();

  const handleShare = async () => {
    const currentUrl = window.location.href;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: document.title,
          url: currentUrl
        });
        console.log("공유 성공");
      } catch (error) {
        console.log("공유 실패:", error);
      }
    } else {
      try {
        await navigator.clipboard.writeText(currentUrl);
        alert("URL이 클립보드에 복사되었습니다.");
      } catch (error) {
        console.log("클립보드 복사 실패:", error);
        alert("URL 복사에 실패했습니다. 수동으로 주소를 복사해주세요.");
      }
    }
  };

  return (
    <header className="sticky top-0 left-0 right-0 bg-white h-14 z-10">
      <div className="max-w-[500px] mx-auto px-4 h-full flex justify-between items-center">
        <div className="flex items-center">
          <button 
            onClick={() => router.back()} 
            className="mr-4"
            aria-label="뒤로 가기"
          >
            <BackIcon className="w-6 h-6 text-gray-900" />
          </button>
          <button 
            onClick={() => router.push("/")} 
            className="mr-4"
            aria-label="홈"
          >
            <HomeIcon className="w-6 h-6 text-gray-900" />
          </button>
        </div>
        <div className="flex items-center">
          <button 
            onClick={() => router.push("/search")} 
            className="mr-4"
            aria-label="검색"
          >
            <SearchIcon className="w-6 h-6 text-gray-900" />
          </button>
          <button 
            onClick={handleShare}
            aria-label="공유"
          >
            <ShareIcon className="w-6 h-6 text-gray-900" />
          </button>
        </div>
      </div>
    </header>
  );
};

export default ProductHeader;
