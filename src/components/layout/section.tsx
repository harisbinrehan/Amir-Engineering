import { cn } from "@/lib/utils";

type SectionProps = React.ComponentProps<"section"> & {
  variant?: "default" | "dark" | "muted";
  containerClassName?: string;
};

export function Section({
  className,
  containerClassName,
  variant = "default",
  children,
  ...props
}: SectionProps) {
  return (
    <section
      className={cn(
        "py-16 md:py-24",
        variant === "dark" && "bg-primary text-primary-foreground",
        variant === "muted" && "bg-secondary/50",
        className,
      )}
      {...props}
    >
      <div className={cn("mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8", containerClassName)}>
        {children}
      </div>
    </section>
  );
}
