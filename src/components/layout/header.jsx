import { NavLink } from "react-router-dom";
import { Bell } from "lucide-react";

const NAV_ITEMS = [
  { label: "대시보드", to: "/" },
  { label: "등록", to: "/register" },
  { label: "인박스", to: "/inbox" },
];

export default function Header() {
  return (
    <header className="h-16 px-6 bg-surface-100 border-b border-border">
      <div className="h-full flex items-center justify-between">
        {/* 왼쪽: 로고 + 네비게이션 */}
        <div className="h-full flex items-center gap-8">
          <span className="text-xl font-bold text-primary-navy">ComfoziAI</span>

          <nav className="h-full flex items-center gap-6">
            {NAV_ITEMS.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `h-full flex items-center px-1 text-lg border-b-2 transition-colors ${
                    isActive
                      ? "text-primary-navy border-primary-gold font-bold"
                      : "text-gray-300 border-transparent hover:text-gray-500"
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>
        </div>

        {/* 오른쪽: 알림 + 프로필 */}
        <div className="h-full flex items-center gap-4">
          <button className="text-gray-300 hover:text-primary-navy">
            <Bell size={20} />
          </button>

          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-muted" />
            <span className="text-base text-primary-navy">관리자</span>
          </div>
        </div>
      </div>
    </header>
  );
}