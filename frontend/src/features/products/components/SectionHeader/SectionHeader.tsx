interface SectionHeaderProps {
  title: string;
  actionLabel?: string;
  onAction?: () => void;
}

export function SectionHeader({ title, actionLabel, onAction }: SectionHeaderProps) {
  return (
    <div className="flex items-center justify-between mb-5">
      <h2 className="text-lg font-bold text-gray-900">{title}</h2>
      {actionLabel && onAction && (
        <button
          onClick={onAction}
          className="text-sm font-medium text-gray-900 hover:text-gray-600 transition-colors cursor-pointer"
        >
          {actionLabel} &gt;
        </button>
      )}
    </div>
  );
}
