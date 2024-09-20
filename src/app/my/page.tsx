import React from "react";
import BottomNavigation from "@/components/navigation/BottomNavigation";
import MyPageHeader from "@/components/header/MyPageHeader";

export default function MyPage() {
  return (
    <>
    <MyPageHeader />
    <div className="p-4">
      <div className="space-y-4">
        <div className="p-4 bg-gray-100 rounded">
          <h2 className="text-lg font-semibold mb-2">프로필</h2>
          <p>사용자 이름: 홍길동</p>
          <p>이메일: user@example.com</p>
        </div>
        <div className="p-4 bg-gray-100 rounded">
          <h2 className="text-lg font-semibold mb-2">주문 내역</h2>
          <p>최근 주문이 없습니다.</p>
        </div>
        <div className="p-4 bg-gray-100 rounded">
          <h2 className="text-lg font-semibold mb-2">설정</h2>
          <ul className="space-y-2">
            <li>알림 설정</li>
            <li>개인정보 관리</li>
            <li>로그아웃</li>
          </ul>
        </div>
      </div>
      <BottomNavigation />
    </div>
    </>
  );
}
