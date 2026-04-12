type MetricPillProps = {
  label: string;
  value: string;
};

export function MetricPill({ label, value }: MetricPillProps) {
  return (
    <div className="surface-panel-soft p-4">
      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-foreground/45">{label}</p>
      <p className="mt-2 text-2xl font-bold tracking-tight text-foreground">{value}</p>
    </div>
  );
}
