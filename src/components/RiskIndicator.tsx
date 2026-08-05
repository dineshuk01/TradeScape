import type { RiskMetrics } from '../types';
import { formatCurrency, getRiskUsage } from '../utils/metrics';

type RiskIndicatorProps = {
  risk: RiskMetrics;
  maximumDrawdown: number;
  dailyLossLimit: number;
};

const statusCopy = {
  Safe: {
    className: 'risk-indicator--safe',
    title: 'Safe',
    description: 'Current exposure is comfortably within account limits.',
  },
  'Approaching Limit': {
    className: 'risk-indicator--warning',
    title: 'Approaching Limit',
    description: 'Loss exposure is getting close to account thresholds.',
  },
  'At Risk': {
    className: 'risk-indicator--danger',
    title: 'At Risk',
    description: 'One or more limits are near or beyond the allowed threshold.',
  },
} as const;

export function RiskIndicator({ risk, maximumDrawdown, dailyLossLimit }: RiskIndicatorProps) {
  const copy = statusCopy[risk.status];
  const drawdownUsage = getRiskUsage(risk.currentDrawdown, maximumDrawdown);
  const dailyUsage = getRiskUsage(risk.currentDayLoss, dailyLossLimit);

  return (
    <section className={`risk-indicator ${copy.className}`}>
      <div className="risk-indicator__header">
        <div>
          <p className="eyebrow">Risk Indicator</p>
          <h3>{copy.title}</h3>
        </div>
        <span className="risk-indicator__badge">{copy.title}</span>
      </div>
      <p className="risk-indicator__description">{copy.description}</p>

      <div className="risk-metric-grid">
        <div className="risk-metric">
          <div className="risk-metric__row">
            <span>Current drawdown</span>
            <strong>{formatCurrency(risk.currentDrawdown)}</strong>
          </div>
          <div className="progress">
            <span style={{ width: `${drawdownUsage * 100}%` }} />
          </div>
          <div className="risk-metric__subrow">
            <span>Remaining drawdown</span>
            <strong>{formatCurrency(risk.remainingDrawdown)}</strong>
          </div>
        </div>

        <div className="risk-metric">
          <div className="risk-metric__row">
            <span>Current day loss</span>
            <strong>{formatCurrency(risk.currentDayLoss)}</strong>
          </div>
          <div className="progress">
            <span style={{ width: `${dailyUsage * 100}%` }} />
          </div>
          <div className="risk-metric__subrow">
            <span>Remaining daily loss limit</span>
            <strong>{formatCurrency(risk.remainingDailyLoss)}</strong>
          </div>
        </div>
      </div>
    </section>
  );
}
