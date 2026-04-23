import type { ReactNode } from 'react';

type ActionBannerProps = {
  title: string;
  description: string;
  action: ReactNode;
};

export function ActionBanner({ title, description, action }: ActionBannerProps) {
  return (
    <div className="surface-panel relative overflow-hidden p-8 md:p-10">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(59,118,246,0.18),transparent_28%),radial-gradient(circle_at_bottom_left,rgba(26,183,117,0.18),transparent_34%)]" />
      <div className="relative z-10 flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
        <div className="max-w-2xl">
          <h3 className="font-heading text-3xl font-bold tracking-tight text-foreground">
            {title}
          </h3>
          <p className="mt-3 text-base leading-7 text-foreground/70">{description}</p>
        </div>
        <div className="shrink-0">{action}</div>
      </div>
    </div>
  );
}
