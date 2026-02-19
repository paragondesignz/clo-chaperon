"use client";

import { ChevronUp, ChevronDown, Trash2, Plus } from "lucide-react";

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
    <div className="space-y-2.5">
      {items.map((item, i) => (
        <div key={i} className="flex gap-2.5 items-start group/item">
          {/* Controls */}
          <div className="flex flex-col items-center gap-0.5 pt-1 opacity-40 group-hover/item:opacity-100 transition-opacity">
            <span className="text-[9px] font-semibold text-[#bbb] tabular-nums w-5 text-center mb-0.5">
              {i + 1}
            </span>
            <button
              type="button"
              onClick={() => moveUp(i)}
              disabled={i === 0}
              className="w-5 h-5 flex items-center justify-center rounded text-[#aaa] hover:text-[#222] hover:bg-[#f0f0f0] disabled:opacity-20 disabled:hover:bg-transparent disabled:hover:text-[#aaa] transition-all"
              title="Move up"
            >
              <ChevronUp size={13} />
            </button>
            <button
              type="button"
              onClick={() => moveDown(i)}
              disabled={i === items.length - 1}
              className="w-5 h-5 flex items-center justify-center rounded text-[#aaa] hover:text-[#222] hover:bg-[#f0f0f0] disabled:opacity-20 disabled:hover:bg-transparent disabled:hover:text-[#aaa] transition-all"
              title="Move down"
            >
              <ChevronDown size={13} />
            </button>
            <button
              type="button"
              onClick={() => remove(i)}
              className="w-5 h-5 flex items-center justify-center rounded text-[#ccc] hover:text-red-400 hover:bg-red-50 transition-all mt-0.5"
              title="Remove"
            >
              <Trash2 size={11} />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">{renderItem(item, i)}</div>
        </div>
      ))}

      {onAdd && (
        <button
          type="button"
          onClick={onAdd}
          className="flex items-center gap-1.5 text-xs font-medium text-[#aaa] hover:text-[#222] transition-colors py-2"
        >
          <Plus size={14} />
          {addLabel}
        </button>
      )}
    </div>
  );
}
