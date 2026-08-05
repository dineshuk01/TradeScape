import type { EquityPoint } from '../types';
import { formatCurrency } from '../utils/metrics';

type EquityCurveProps = {
  points: EquityPoint[];
};

const viewBoxWidth = 760;
const viewBoxHeight = 300;
const paddingX = 52;
const paddingY = 28;
type ChartPoint = {
  x: number;
  y: number;
  label: string;
  balance: number;
};

const clampPoint = (points: ChartPoint[], index: number): ChartPoint => {
  if (index < 0) return points[0];
  if (index >= points.length) return points[points.length - 1];
  return points[index];
};

const segmentPath = (points: ChartPoint[], index: number): string => {
  const current = points[index];
  const next = points[index + 1];
  return `M ${current.x} ${current.y} L ${next.x} ${next.y}`;
};

export function EquityCurve({ points }: EquityCurveProps) {
  if (points.length < 2) {
    return <p className="empty-state">Not enough trade data to draw an equity curve.</p>;
  }

  const balances = points.map((point) => point.balance);
  const minBalance = Math.min(...balances, points[0].balance);
  const maxBalance = Math.max(...balances, points[0].balance);
  const balanceRange = maxBalance - minBalance || 1;
  const xStep = (viewBoxWidth - paddingX * 2) / (points.length - 1);

  const toX = (index: number) => paddingX + index * xStep;
  const toY = (balance: number) =>
    paddingY + (1 - (balance - minBalance) / balanceRange) * (viewBoxHeight - paddingY * 2 - 18);

  const chartPoints: ChartPoint[] = points.map((point, index) => ({
    x: toX(index),
    y: toY(point.balance),
    label: point.label,
    balance: point.balance,
  }));

  const baselineBalance = points[0].balance;
  const baselineY = toY(baselineBalance);
  const lastPoint = points[points.length - 1];
  return (
    <div className="equity-curve">
      <div className="equity-curve__summary">
        <div>
          <p className="equity-curve__label">Equity curve</p>
          <h3>{formatCurrency(lastPoint.balance)}</h3>
        </div>
        <p className="equity-curve__note"></p>
      </div>

      <div className="equity-curve__chart" aria-label="Equity curve chart" role="img">
        <svg viewBox={`0 0 ${viewBoxWidth} ${viewBoxHeight}`} preserveAspectRatio="none">
          <defs>
            <linearGradient id="equityGainGradient" x1="0" x2="1" y1="0" y2="0">
              <stop offset="0%" stopColor="#19ff4b" />
              <stop offset="100%" stopColor="#00d84a" />
            </linearGradient>
            <linearGradient id="equityLossGradient" x1="0" x2="1" y1="0" y2="0">
              <stop offset="0%" stopColor="#ff4f62" />
              <stop offset="100%" stopColor="#ff7a84" />
            </linearGradient>
            <linearGradient id="equityGainFill" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor="rgba(25, 255, 75, 0.28)" />
              <stop offset="100%" stopColor="rgba(25, 255, 75, 0.03)" />
            </linearGradient>
            <linearGradient id="equityLossFill" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor="rgba(255, 79, 98, 0.26)" />
              <stop offset="100%" stopColor="rgba(255, 79, 98, 0.03)" />
            </linearGradient>
          </defs>

          <line
            x1={paddingX}
            y1={baselineY}
            x2={viewBoxWidth - paddingX}
            y2={baselineY}
            className="equity-curve__axis"
          />

          {chartPoints.slice(0, -1).map((_, index) => {
            const nextPoint = chartPoints[index + 1];
            const startAbove = chartPoints[index].balance >= baselineBalance;
            const endAbove = nextPoint.balance >= baselineBalance;
            const isLoss = !(startAbove && endAbove);
            const colorClass = isLoss ? 'equity-curve__loss' : 'equity-curve__gain';

            return (
              <path
                key={`line-${index}`}
                d={segmentPath(chartPoints, index)}
                className={`equity-curve__line ${colorClass}`}
              />
            );
          })}

          {chartPoints.map((point, index) => (
            <g key={`${point.label}-${index}`}>
              <circle cx={point.x} cy={point.y} r="5.5" className="equity-curve__point" />
              <title>{`${point.label}: ${formatCurrency(point.balance)}`}</title>
            </g>
          ))}
        </svg>
      </div>

      <div className="equity-curve__legend">
        <span>
          Highest: <strong>{formatCurrency(maxBalance)}</strong>
        </span>
        <span>
          Lowest: <strong>{formatCurrency(minBalance)}</strong>
        </span>
      </div>
    </div>
  );
}
