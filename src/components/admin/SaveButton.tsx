"use client";

import { useState } from "react";
import { Save, Check, AlertCircle, Loader2 } from "lucide-react";

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
    <div className="sticky bottom-0 -mx-8 px-8 py-4 bg-white/95 backdrop-blur-sm border-t border-[#eee] mt-8 -mb-8 z-10">
      <button
        onClick={handleClick}
        disabled={state === "saving"}
        className={`flex items-center gap-2 px-6 py-2.5 text-xs font-semibold tracking-wide uppercase rounded-lg transition-all duration-200 ${
          state === "saved"
            ? "bg-green-600 text-white"
            : state === "error"
            ? "bg-red-600 text-white"
            : "bg-[#222] text-white hover:bg-black"
        } disabled:opacity-60`}
      >
        {state === "saving" ? (
          <>
            <Loader2 size={14} className="animate-spin" />
            Saving...
          </>
        ) : state === "saved" ? (
          <>
            <Check size={14} />
            Saved
          </>
        ) : state === "error" ? (
          <>
            <AlertCircle size={14} />
            Error
          </>
        ) : (
          <>
            <Save size={14} />
            Save Changes
          </>
        )}
      </button>
    </div>
  );
}
