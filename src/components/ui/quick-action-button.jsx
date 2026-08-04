export default function QuickActionButton({ icon: Icon, label, onClick }) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-3 bg-gray-100 hover:bg-gray-200 border-4 border-dashed border-gray-700 rounded-lg py-8 px-15 transition-colors"
    >
      <Icon className="text-primary-navy" size={45} />
      <span className="text-xl text-gray-500">{label}</span>
    </button>
  );
}