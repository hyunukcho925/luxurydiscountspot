import React from "react";
import Link from "next/link";
import Image from "next/image";
import LogoImage from "@/assets/Logo.jpg";

const Header: React.FC = () => {
  return (
    <header className="sticky top-0 left-0 right-0 bg-white h-14 z-10 border-b border-gray-200">
      <div className="max-w-[500px] mx-auto px-4 h-full flex justify-between items-center">
        <Link href="/" className="flex items-center">
          <Image src={LogoImage} alt="로고" width={70} />
        </Link>
      </div>
    </header>
  );
};

export default Header;
