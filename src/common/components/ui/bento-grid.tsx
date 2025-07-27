import { ArrowRight } from "lucide-react";
import { type ComponentPropsWithoutRef, type ReactNode } from "react";

import { Button } from "@/common/components/ui/button";
import { cn } from "@/lib/utils";

interface BentoGridProps extends ComponentPropsWithoutRef<"div"> {
  children: ReactNode;
  className?: string;
}

interface BentoCardProps extends ComponentPropsWithoutRef<"div"> {
  name: string;
  className: string;
  background: ReactNode;
  Icon?: React.ElementType;
  description: string;
  href: string;
  cta: string;
}

const BentoGrid = ({ children, className, ...props }: BentoGridProps) => {
  return (
    <div
      className={cn(
        "grid w-full auto-rows-[22rem] grid-cols-1 sm:grid-cols-2 gap-4",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

const BentoCard = ({
  name,
  className,
  background,
  Icon,
  description,
  href,
  cta,
  ...props
}: BentoCardProps) => (
  <div
    key={name}
    className={cn(
      "group relative flex flex-col justify-between overflow-hidden rounded-xl",
      // light styles
      "bg-background [box-shadow:0_0_0_1px_rgba(0,0,0,.03),0_2px_4px_rgba(0,0,0,.05),0_12px_24px_rgba(0,0,0,.05)]",
      // dark styles
      "transform-gpu dark:bg-background dark:[border:1px_solid_rgba(255,255,255,.1)] dark:[box-shadow:0_-20px_80px_-20px_#ffffff1f_inset]",
      className
    )}
    {...props}
  >
    <div>{background}</div>
    <div
      className="absolute left-0 right-0 bottom-0 h-1/3 z-10 pointer-events-none"
      style={{
        background:
          "linear-gradient(to top, rgba(0,0,0,0.38) 60%, rgba(0,0,0,0.0) 100%)",
      }}
    />
    <div className="pointer-events-none z-20 flex transform-gpu flex-col gap-1 p-6 transition-all duration-300 group-hover:-translate-y-10">
      {Icon && (
        <Icon className="h-12 w-12 origin-left transform-gpu text-white transition-all duration-300 ease-in-out group-hover:scale-75" />
      )}
      <h3 className="text-xl font-semibold text-white">{name}</h3>
      <p className="max-w-lg text-gray-100">{description}</p>
    </div>

    <div
      className={cn(
        "pointer-events-none absolute bottom-0 flex w-full justify-end translate-y-10 transform-gpu flex-row items-center p-4 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100"
      )}
    >
      <Button
        variant="ghost"
        asChild
        size="sm"
        className="pointer-events-auto bg-black/70 text-white border border-white/90 transition-colors duration-200 hover:bg-black/90 hover:text-white hover:border-white"
      >
        <a
          href={href}
          target="_blank"
          className="flex items-center text-white transition-colors duration-200"
        >
          {cta}
          <ArrowRight className="ms-2 h-4 w-4 rtl:rotate-180 text-white transition-colors duration-200" />
        </a>
      </Button>
    </div>
    <div className="pointer-events-none absolute inset-0 transform-gpu transition-all duration-300 group-hover:bg-black/[.03] group-hover:dark:bg-neutral-800/10" />
  </div>
);

export { BentoCard, BentoGrid };
