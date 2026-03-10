/** Utility để gộp class names (có thể cài thêm clsx + tailwind-merge sau) */
export function cn(...classes: (string | undefined | false)[]): string {
  return classes.filter(Boolean).join(" ");
}
