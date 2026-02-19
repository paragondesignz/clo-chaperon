interface FormFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: "text" | "url" | "email";
  multiline?: boolean;
  rows?: number;
  placeholder?: string;
}

export default function FormField({
  label,
  value,
  onChange,
  type = "text",
  multiline = false,
  rows = 4,
  placeholder,
}: FormFieldProps) {
  const inputClasses =
    "w-full border border-[#ddd] rounded px-3 py-2 text-sm text-[#222] focus:outline-none focus:border-[#222] transition-colors";

  return (
    <div>
      <label className="block text-xs font-medium text-[#888] uppercase tracking-wide mb-1.5">
        {label}
      </label>
      {multiline ? (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          rows={rows}
          className={`${inputClasses} resize-y`}
          placeholder={placeholder}
        />
      ) : (
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={inputClasses}
          placeholder={placeholder}
        />
      )}
    </div>
  );
}
