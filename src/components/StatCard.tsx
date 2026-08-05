type StatCardProps = {
  label: string;
  value: string;
  helpText?: string;
  tone?: 'neutral' | 'positive' | 'negative' | 'warning';
};

export function StatCard({ label, value, helpText, tone = 'neutral' }: StatCardProps) {
  return (
    <article className={`stat-card stat-card--${tone}`}>
      <p className="stat-card__label">{label}</p>
      <p className="stat-card__value">{value}</p>
      {helpText ? <p className="stat-card__help">{helpText}</p> : null}
    </article>
  );
}
