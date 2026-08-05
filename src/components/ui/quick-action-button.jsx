import { useRef } from "react";

export default function QuickActionButton({ icon: Icon, label, onClick, accept, onFileSelect }) {
  const fileInputRef = useRef(null);

  const handleClick = () => {
    if (onFileSelect) {
      fileInputRef.current?.click();
    } else if (onClick) {
      onClick();
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file && onFileSelect) {
      onFileSelect(file);
    }
    e.target.value = "";
  };

  return (
    <>
      <button
        onClick={handleClick}
        className="flex items-center gap-3 bg-gray-100 hover:bg-gray-200 border-4 border-dashed border-gray-700 rounded-lg py-4 px-6 transition-colors"
      >
        <Icon className="text-primary-navy w-5 h-5 shrink-0" size={20} />
        <span className="text-sm text-gray-500 whitespace-nowrap">{label}</span>
      </button>
      {onFileSelect && (
        <input
          ref={fileInputRef}
          type="file"
          accept={accept}
          onChange={handleFileChange}
          className="hidden"
        />
      )}
    </>
  );
}