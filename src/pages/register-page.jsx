import { useState } from "react";
import DownloadIcon from "@/assets/icons/download-icon.svg?react";
import UploadIcon from "@/assets/icons/upload-icon.svg?react";
import { PenLine } from "lucide-react";
import { cn } from "@/lib/utils";
import FileUploadSection from "@/components/ui/file-upload-section";
import ManualEntrySection from "@/components/ui/manual-entry-section";

const TABS = [
  { key: "upload", label: "파일 업로드", icon: UploadIcon },
  { key: "manual", label: "수기 등록", icon: PenLine },
];

function RegisterPage() {
  const [activeTab, setActiveTab] = useState("upload");

  return (
    <section className="h-full w-full px-20 py-10">
      <header className="mb-4 flex items-center gap-4">
        <DownloadIcon />

        <div>
          <h2 className="text-4xl font-bold text-gray-700">증빙 데이터 등록</h2>
          <p className="text-2xl text-gray-500">
            파일 업로드 또는 수기 입력을 통해 증빙 데이터를 등록하세요.
          </p>
        </div>
      </header>

      <div className="mb-6 flex gap-3">
        {TABS.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.key;

          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={cn(
                "flex items-center gap-2 rounded-sm border-2 px-5 py-3 text-[20px] font-semibold transition-colors",
                isActive
                  ? "border-primary-gold text-gray-700"
                  : "border-gray-100 text-gray-500",
              )}
            >
              <Icon className="size-5" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {activeTab === "upload" && (
        <FileUploadSection onGoToManualEntry={() => setActiveTab("manual")} />
      )}
      {activeTab === "manual" && <ManualEntrySection />}
    </section>
  );
}

export default RegisterPage;