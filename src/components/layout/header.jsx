import { NavLink } from "react-router-dom";
import { Bell } from "lucide-react";

const NAV_ITEMS = [
  { label: "대시보드", to: "/" },
  { label: "등록", to: "/register" },
  { label: "인박스", to: "/inbox" },
];

export default function Header() {
  return (
    <header className="bg-surface-100 border-border h-16 border-b px-6">
      <div className="flex h-full items-center justify-between">
        {/* 왼쪽: 로고 + 네비게이션 */}
        <div className="flex h-full items-center gap-8">
          <span className="text-primary-navy text-xl font-bold">ComfoziAI</span>

          <nav className="flex h-full items-center gap-6">
            {NAV_ITEMS.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `flex h-full items-center border-b-2 px-1 text-lg transition-colors ${
                    isActive
                      ? "text-primary-navy border-primary-gold font-bold"
                      : "border-transparent text-gray-300 hover:text-gray-500"
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>
        </div>

        {/* 오른쪽: 알림 + 프로필 */}
        <div className="flex h-full items-center gap-4">
          <button className="hover:text-primary-navy text-gray-300">
            <Bell size={20} />
          </button>

          <div className="flex items-center gap-2">
            <div className="bg-muted h-8 w-8 rounded-full" />
            <span className="text-primary-navy text-base">관리자</span>
          </div>
        </div>
      </div>
    </header>
  );
}
