export default function StatCard({ icon: Icon, label, value, unit, iconColor = "text-primary-navy" }) {
  return (
    <div className="flex items-center gap-4 bg-surface-0 border border-gray-100 rounded-lg px-4 py-4">
      <Icon className={iconColor} size={60} strokeWidth={1.8} />
      <div>
        <p className="text-sm text-gray-500">{label}</p>
        <p className="text-3xl font-bold text-gray-700">
          {value ?? "-"} <span className="text-base font-normal text-gray-500">{unit}</span>
        </p>
      </div>
    </div>
  );
}