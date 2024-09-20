import React from "react";
import BottomNavigation from "@/components/navigation/BottomNavigation";
import MainHeader from "@/components/header/MainHeader";


export default function Page() {
  return (
    <>
      <MainHeader />
      <div className="container">
        <h1 className="text-3xl font-bold text-blue-600">
          안녕하세요, Next.js 13+ 와 Tailwind CSS!
        </h1>
      </div>
      <BottomNavigation />
    </>
  );
}
