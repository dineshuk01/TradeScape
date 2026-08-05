import type { Trade } from '../types';
import { formatCurrency } from '../utils/metrics';

type TradeTableProps = {
  trades: Trade[];
};

export function TradeTable({ trades }: TradeTableProps) {
  if (trades.length === 0) {
    return <p className="empty-state">No trades available.</p>;
  }

  return (
    <div className="table-wrap">
      <table className="trade-table">
        <thead>
          <tr>
            <th>Trade</th>
            <th>Side</th>
            <th>P&amp;L</th>
          </tr>
        </thead>
        <tbody>
          {trades.map((trade) => (
            <tr key={`${trade.symbol}-${trade.side}-${trade.pnl}`}>
              <td>
                <strong>{trade.symbol}</strong>
              </td>
              <td>{trade.side}</td>
              <td className={trade.pnl >= 0 ? 'positive' : 'negative'}>{formatCurrency(trade.pnl)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
