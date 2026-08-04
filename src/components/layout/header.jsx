import { NavLink } from "react-router-dom";
import { Bell } from "lucide-react";

const NAV_ITEMS = [
  { label: "대시보드", to: "/" },
  { label: "등록", to: "/register" },
  { label: "인박스", to: "/inbox" },
];

export default function Header() {
  return (
    <header className="flex items-center justify-between h-16 px-6 bg-surface-0 border-b border-border">
      {/* 왼쪽: 로고 + 네비게이션 */}
      <div className="flex items-center gap-8">
        <span className="text-lg font-bold text-foreground">ComfoziAI</span>

        <nav className="flex items-center gap-6">
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `text-sm pb-1 border-b-2 transition-colors ${
                  isActive
                    ? "text-foreground border-primary-navy font-medium"
                    : "text-muted-foreground border-transparent hover:text-foreground"
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
      </div>

      {/* 오른쪽: 알림 + 프로필 */}
      <div className="flex items-center gap-4">
        <button className="text-muted-foreground hover:text-foreground">
          <Bell size={20} />
        </button>

        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-muted" />
          <span className="text-sm text-foreground">관리자</span>
        </div>
      </div>
    </header>
  );
}