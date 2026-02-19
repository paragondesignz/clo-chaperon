interface SectionCardProps {
  title: string;
  description?: string;
  children: React.ReactNode;
}

export default function SectionCard({
  title,
  description,
  children,
}: SectionCardProps) {
  return (
    <section className="rounded-xl border border-[#e8e8e8] bg-white overflow-hidden">
      <div className="px-5 py-4 border-b border-[#f0f0f0] bg-[#fafafa]">
        <h3 className="text-[13px] font-semibold text-[#333]">{title}</h3>
        {description && (
          <p className="text-[11px] text-[#aaa] mt-0.5 leading-relaxed">
            {description}
          </p>
        )}
      </div>
      <div className="px-5 py-5 space-y-5">{children}</div>
    </section>
  );
}
