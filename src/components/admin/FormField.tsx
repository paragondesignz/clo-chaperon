"use client";

import { useState } from "react";

interface FormFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: "text" | "url" | "email";
  multiline?: boolean;
  rows?: number;
  placeholder?: string;
  hint?: string;
  maxLength?: number;
}

export default function FormField({
  label,
  value,
  onChange,
  type = "text",
  multiline = false,
  rows = 4,
  placeholder,
  hint,
  maxLength,
}: FormFieldProps) {
  const [focused, setFocused] = useState(false);

  const showCount = multiline && maxLength;

  return (
    <div>
      <div className="flex items-baseline justify-between mb-2">
        <label className="block text-[11px] font-semibold text-[#999] uppercase tracking-wider">
          {label}
        </label>
        {showCount && (
          <span
            className={`text-[10px] tabular-nums ${
              maxLength && value.length > maxLength
                ? "text-red-400"
                : "text-[#ccc]"
            }`}
          >
            {value.length}
            {maxLength ? ` / ${maxLength}` : ""}
          </span>
        )}
      </div>
      {hint && (
        <p className="text-[11px] text-[#bbb] mb-2 leading-relaxed">{hint}</p>
      )}
      <div
        className={`relative rounded-lg border transition-all duration-200 ${
          focused ? "border-[#222] ring-[3px] ring-[#222]/5" : "border-[#e0e0e0]"
        }`}
      >
        {multiline ? (
          <textarea
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            rows={rows}
            className="w-full bg-transparent px-4 py-3 text-sm text-[#222] leading-relaxed focus:outline-none resize-y rounded-lg placeholder:text-[#ccc]"
            placeholder={placeholder}
          />
        ) : (
          <input
            type={type}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            className="w-full bg-transparent px-4 py-2.5 text-sm text-[#222] focus:outline-none rounded-lg placeholder:text-[#ccc]"
            placeholder={placeholder}
          />
        )}
      </div>
    </div>
  );
}
