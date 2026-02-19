export interface MediaItem {
  id: string;
  url: string;
  filename: string;
  type: "image" | "video";
  width?: number;
  height?: number;
  size?: number;
  uploadedAt: string;
}

export interface MediaLibrary {
  items: MediaItem[];
}
