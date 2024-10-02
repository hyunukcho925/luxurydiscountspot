'use client'

import React, { useEffect, useState } from "react";
import Link from "next/link";
import BottomNavigation from "@/components/navigation/BottomNavigation";
import CategoryHeader from "@/components/header/CategoryHeader";
import { getMainCategories } from "@/lib/categories";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

interface Category {
  id: string;
  name: string;
}

export default function CategoryPage() {
  const [mainCategories, setMainCategories] = useState<Category[]>([]);
  const supabase = createClientComponentClient();

  useEffect(() => {
    // 초기 카테고리 데이터 로드
    const loadCategories = async () => {
      const categories = await getMainCategories();
      setMainCategories(categories);
    };

    loadCategories();

    // Realtime 구독 설정
    const channel = supabase
      .channel('main_categories')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'main_categories' },
        (payload) => {
          console.log('Change received!', payload);
          loadCategories(); // 변경사항이 있을 때마다 카테고리 다시 로드
        }
      )
      .subscribe();

    // 컴포넌트 언마운트 시 구독 해제
    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase]);

  return (
    <>
      <CategoryHeader />
      <div>
        <ul>
          {mainCategories.map((category) => (
            <li key={category.id}>
              <Link
                href={`/category/${encodeURIComponent(category.name)}`}
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
