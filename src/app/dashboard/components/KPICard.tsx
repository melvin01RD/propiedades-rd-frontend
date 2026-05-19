interface KPICardProps {
  label: string;
  value: number;
  description?: string;
}

export default function KPICard({ label, value, description }: KPICardProps) {
  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-5">
      <p className="text-xs font-semibold text-text-secondary uppercase tracking-wide mb-2">
        {label}
      </p>
      <p className="font-serif text-4xl text-primary leading-none">{value}</p>
      {description && (
        <p className="text-xs text-text-secondary mt-2">{description}</p>
      )}
    </div>
  );
}
