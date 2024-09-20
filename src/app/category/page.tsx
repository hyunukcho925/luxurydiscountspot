import React from "react";
import Link from "next/link";
import BottomNavigation from "@/components/navigation/BottomNavigation";
import CategoryHeader from "@/components/header/CategoryHeader";
import { getMainCategories } from "@/lib/categories";

export default async function CategoryPage() {
  const mainCategories = await getMainCategories();

  return (
    <>
      <CategoryHeader />
      <div>
        <ul>
          {mainCategories.map((category) => (
            <li key={category.name}>
              <Link
                href={`/products/${category.name}`}
                className="block p-4 border-b border-gray-200"
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
