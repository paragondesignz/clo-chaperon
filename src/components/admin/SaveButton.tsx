"use client";

import { useState } from "react";

interface SaveButtonProps {
  onClick: () => Promise<void>;
}

export default function SaveButton({ onClick }: SaveButtonProps) {
  const [state, setState] = useState<"idle" | "saving" | "saved" | "error">("idle");

  const handleClick = async () => {
    setState("saving");
    try {
      await onClick();
      setState("saved");
      setTimeout(() => setState("idle"), 2000);
    } catch {
      setState("error");
      setTimeout(() => setState("idle"), 3000);
    }
  };

  return (
    <button
      onClick={handleClick}
      disabled={state === "saving"}
      className={`px-6 py-2.5 text-sm tracking-wide uppercase transition-all duration-200 rounded ${
        state === "saved"
          ? "bg-green-600 text-white"
          : state === "error"
          ? "bg-red-600 text-white"
          : "bg-black text-white hover:opacity-80"
      } disabled:opacity-50`}
    >
      {state === "saving"
        ? "Saving..."
        : state === "saved"
        ? "Saved"
        : state === "error"
        ? "Error"
        : "Save changes"}
    </button>
  );
}
