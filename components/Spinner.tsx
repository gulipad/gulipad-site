"use client";

interface SpinnerProps {
  variant?: "light" | "dark";
}

export default function Spinner({ variant = "light" }: SpinnerProps) {
  const color = variant === "light" ? "border-white" : "border-gray-800";
  return (
    <div
      className={`w-8 h-8 border-3 border-t-transparent ${color} rounded-full animate-spin`}
      style={{ animationDuration: "0.35s" }}
    />
  );
}
