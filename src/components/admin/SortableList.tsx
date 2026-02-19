"use client";

interface SortableListProps<T> {
  items: T[];
  onChange: (items: T[]) => void;
  renderItem: (item: T, index: number) => React.ReactNode;
  onAdd?: () => void;
  addLabel?: string;
}

export default function SortableList<T>({
  items,
  onChange,
  renderItem,
  onAdd,
  addLabel = "Add item",
}: SortableListProps<T>) {
  const moveUp = (index: number) => {
    if (index === 0) return;
    const next = [...items];
    [next[index - 1], next[index]] = [next[index], next[index - 1]];
    onChange(next);
  };

  const moveDown = (index: number) => {
    if (index === items.length - 1) return;
    const next = [...items];
    [next[index], next[index + 1]] = [next[index + 1], next[index]];
    onChange(next);
  };

  const remove = (index: number) => {
    onChange(items.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-3">
      {items.map((item, i) => (
        <div key={i} className="flex gap-2 items-start">
          <div className="flex flex-col gap-0.5 pt-1">
            <button
              type="button"
              onClick={() => moveUp(i)}
              disabled={i === 0}
              className="text-xs text-[#888] hover:text-[#222] disabled:opacity-30 leading-none"
              title="Move up"
            >
              &#9650;
            </button>
            <button
              type="button"
              onClick={() => moveDown(i)}
              disabled={i === items.length - 1}
              className="text-xs text-[#888] hover:text-[#222] disabled:opacity-30 leading-none"
              title="Move down"
            >
              &#9660;
            </button>
          </div>
          <div className="flex-1">{renderItem(item, i)}</div>
          <button
            type="button"
            onClick={() => remove(i)}
            className="text-xs text-red-400 hover:text-red-600 pt-1"
            title="Remove"
          >
            &times;
          </button>
        </div>
      ))}
      {onAdd && (
        <button
          type="button"
          onClick={onAdd}
          className="text-sm text-[#888] hover:text-[#222] transition-colors"
        >
          + {addLabel}
        </button>
      )}
    </div>
  );
}
