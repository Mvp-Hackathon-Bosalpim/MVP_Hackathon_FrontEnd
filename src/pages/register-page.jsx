import { useState } from "react";
import { useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import DownloadIcon from "@/assets/icons/download-icon.svg?react";
import UploadIcon from "@/assets/icons/upload-icon.svg?react";
import { PenLine } from "lucide-react";
import { cn } from "@/lib/utils";
import FileUploadSection from "@/components/ui/file-upload-section";
import ManualEntrySection from "@/components/ui/manual-entry-section";

function RegisterPage() {
  const { t } = useTranslation();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState(location.state?.defaultTab ?? "upload");

  const TABS = [
    { key: "upload", label: t("reg.tab.upload"), icon: UploadIcon },
    { key: "manual", label: t("reg.tab.manual"), icon: PenLine },
  ];

  return (
    <div className="max-w-[1400px] mx-auto px-6 py-6 space-y-6">
      <section className="h-full w-full px-15 py-3">
        <header className="mb-3 flex items-center gap-3">
          <DownloadIcon />

          <div>
            <h2 className="text-3xl font-extrabold text-gray-700">{t("reg.title")}</h2>
            <p className="text-1xl text-gray-500">{t("reg.desc")}</p>
          </div>
        </header>

        <div className="mb-8 flex gap-4">
          {TABS.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.key;

            return (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={cn(
                  "flex items-center gap-2 rounded-sm border-2 px-5 py-3 text-[19px] font-semibold transition-colors",
                  isActive
                    ? "border-primary-gold text-gray-700"
                    : "border-gray-100 text-gray-500",
                )}
              >
                <Icon className="size-4" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {activeTab === "upload" && (
          <FileUploadSection onGoToManualEntry={() => setActiveTab("manual")}
            initialFile={location.state?.uploadFile} />
        )}
        {activeTab === "manual" && <ManualEntrySection />}
      </section>
    </div>
  );
}

export default RegisterPage;
