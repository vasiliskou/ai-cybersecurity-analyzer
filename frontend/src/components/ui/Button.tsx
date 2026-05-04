import React from "react";

type Variant = "primary" | "secondary" | "ghost" | "danger";
type Size = "sm" | "md";

export function Button({
  children,
  className = "",
  variant = "primary",
  size = "md",
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant; size?: Size }) {
  const base =
    "inline-flex items-center justify-center gap-2 rounded-xl font-medium transition " +
    "focus:outline-none focus:ring-2 focus:ring-[var(--ring)] disabled:opacity-50 disabled:cursor-not-allowed " +
    "motion-safe:hover:-translate-y-0.5";

  const sizes: Record<Size, string> = {
    sm: "h-9 px-3 text-sm",
    md: "h-10 px-4 text-sm",
  };

  const variants: Record<Variant, string> = {
    primary: "bg-primary text-white shadow-sm hover:bg-primary-2",
    secondary: "bg-card text-foreground border border-border shadow-sm hover:bg-card-2",
    ghost: "bg-transparent text-foreground hover:bg-card",
    danger: "bg-danger text-white shadow-sm hover:brightness-95",
  };

  return (
    <button className={[base, sizes[size], variants[variant], className].join(" ")} {...props}>
      {children}
    </button>
  );
}

