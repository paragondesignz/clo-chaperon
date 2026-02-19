/* eslint-disable @next/next/no-img-element */

interface ImagePreviewProps {
  src: string;
  alt?: string;
}

export default function ImagePreview({ src, alt = "Preview" }: ImagePreviewProps) {
  if (!src) return null;

  return (
    <div className="mt-2 rounded overflow-hidden border border-[#eee] inline-block">
      <img
        src={src}
        alt={alt}
        className="h-24 w-auto object-cover"
        onError={(e) => {
          (e.target as HTMLImageElement).style.display = "none";
        }}
      />
    </div>
  );
}
