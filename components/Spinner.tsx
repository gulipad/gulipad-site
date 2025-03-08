"use client";
export default function Spinner() {
  return (
    <div
      className="w-8 h-8 border-3 border-t-transparent border-white rounded-full animate-spin"
      style={{ animationDuration: "0.35s" }}
    />
  );
}
