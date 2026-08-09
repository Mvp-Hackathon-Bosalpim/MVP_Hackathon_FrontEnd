import { NavLink } from "react-router-dom";
import { Bell, ChevronDown } from "lucide-react";
import { useTranslation } from "react-i18next";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const NAV_KEYS = [
  { key: "nav.dashboard", to: "/" },
  { key: "nav.registration", to: "/register" },
  { key: "nav.inbox", to: "/inbox" },
];

const LANGUAGES = [
  { code: "ko", labelKey: "lang.ko" },
  { code: "en", labelKey: "lang.en" },
];

export default function Header() {
  const { t, i18n } = useTranslation();

  const handleLangChange = (code) => {
    i18n.changeLanguage(code);
  };

  return (
    <header className="bg-surface-100 border-border h-16 border-b px-6">
      <div className="flex h-full items-center justify-between">
        {/* 왼쪽: 로고 + 네비게이션 */}
        <div className="flex h-full items-center gap-8">
          <span className="text-primary-navy text-xl font-bold">
            {t("common.brand_name")}
          </span>

          <nav className="flex h-full items-center gap-6">
            {NAV_KEYS.map((item) => (
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
                {t(item.key)}
              </NavLink>
            ))}
          </nav>
        </div>

        {/* 오른쪽: 언어 선택 + 알림 + 프로필 */}
        <div className="flex h-full items-center gap-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="border-border text-primary-navy flex items-center gap-1.5 rounded-md border bg-white px-3 py-1.5 text-sm font-medium hover:bg-gray-50">
                Lang
                <ChevronDown size={14} />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="min-w-36">
              {LANGUAGES.map((lang) => (
                <DropdownMenuItem
                  key={lang.code}
                  onClick={() => handleLangChange(lang.code)}
                  className={
                    i18n.language === lang.code ? "font-semibold" : ""
                  }
                >
                  {t(lang.labelKey)}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

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
