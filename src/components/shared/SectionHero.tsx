import type { ReactNode } from 'react';

type SectionHeroProps = {
  eyebrow?: string;
  title: ReactNode;
  subtitle?: ReactNode;
  align?: 'left' | 'center';
  actions?: ReactNode;
  aside?: ReactNode;
  compact?: boolean;
};

export function SectionHero({
  eyebrow,
  title,
  subtitle,
  align = 'left',
  actions,
  aside,
  compact = false,
}: SectionHeroProps) {
  const centered = align === 'center';

  return (
    <section
      className={`${compact ? 'section-shell-tight' : 'section-shell'} relative overflow-hidden border-b border-zinc-200/80 dark:border-white/5`}
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(26,183,117,0.12),transparent_34%),radial-gradient(circle_at_bottom_right,rgba(59,118,246,0.12),transparent_32%)]" />
      <div className="absolute inset-0 bg-[url('/images/grid-pattern.svg')] opacity-[0.035] pointer-events-none" />
      <div
        className={`section-inner relative z-10 ${aside ? 'grid gap-10 lg:grid-cols-[1.3fr_0.9fr] lg:items-center' : ''}`}
      >
        <div className={centered ? 'mx-auto max-w-4xl text-center' : 'max-w-4xl'}>
          {eyebrow ? <div className={`eyebrow ${centered ? 'mx-auto' : ''}`}>{eyebrow}</div> : null}
          <h1 className={`hero-title mt-5 text-foreground ${centered ? 'mx-auto' : ''}`}>
            {title}
          </h1>
          {subtitle ? (
            <p className={`section-copy mt-5 max-w-2xl ${centered ? 'mx-auto' : ''}`}>{subtitle}</p>
          ) : null}
          {actions ? (
            <div
              className={`mt-8 flex flex-col gap-3 sm:flex-row ${centered ? 'justify-center' : ''}`}
            >
              {actions}
            </div>
          ) : null}
        </div>
        {aside ? <div>{aside}</div> : null}
      </div>
    </section>
  );
}
