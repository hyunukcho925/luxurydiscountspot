import React from "react";
import Link from "next/link";
import BottomNavigation from "@/components/navigation/BottomNavigation";
import CategoryHeader from "@/components/header/CategoryHeader";

const categories = [
  { id: "clothing", name: "의류" },
  { id: "electronics", name: "전자기기" },
  { id: "furniture", name: "가구" },
  { id: "books", name: "도서" },
];

export default function CategoryPage() {
  return (
    <>
      <CategoryHeader />
      <div className="p-4">
      <ul className="space-y-2">
        {categories.map((category) => (
          <li key={category.id}>
            <Link
              href={`/products?category=${category.id}`}
              className="block p-2 bg-gray-100 rounded hover:bg-gray-200 transition-colors"
            >
              {category.name}
            </Link>
          </li>
        ))}
      </ul>
      </div>
      <BottomNavigation />
    </>
  );
}
