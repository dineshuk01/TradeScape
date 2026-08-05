import './styles.css';
import { accountRules, trades } from './data';
import { EquityCurve } from './components/EquityCurve';
import { RiskIndicator } from './components/RiskIndicator';
import { SectionHeader } from './components/SectionHeader';
import { StatCard } from './components/StatCard';
import { TradeTable } from './components/TradeTable';
import { formatCurrency, formatPercent, getEquityCurve, getRiskMetrics, getTradeMetrics } from './utils/metrics';

const tradeMetrics = getTradeMetrics(trades, accountRules.startingBalance);
const riskMetrics = getRiskMetrics(accountRules, tradeMetrics, trades);
const equityCurve = getEquityCurve(trades, accountRules.startingBalance);

const averageTradeComparison = (() => {
  const avgWin = tradeMetrics.averageWinningTrade;
  const avgLoss = tradeMetrics.averageLosingTrade;

  if (avgWin === null && avgLoss === null) {
    return 'No winning or losing trades yet';
  }

  if (avgWin === null) {
    return `No winning trades yet - Avg loss ${formatCurrency(Math.abs(avgLoss ?? 0))}`;
  }

  if (avgLoss === null) {
    return `No losing trades yet - Avg win ${formatCurrency(avgWin)}`;
  }

  return `Avg win ${formatCurrency(avgWin)} vs avg loss ${formatCurrency(Math.abs(avgLoss))}`;
})();

function App() {
  return (
    <main className="page-shell">
      <div className="background-glow background-glow--left" />
      <div className="background-glow background-glow--right" />

      <section className="hero">
        <div>
          <p className="eyebrow">Tradescape</p>
          <h1>Trader Risk Dashboard</h1>
          <p className="hero__copy">
            A quick read on account health, performance, and whether the trader is safely inside risk limits.
          </p>
        </div>
        <div className={`status-pill status-pill--${riskMetrics.status.toLowerCase().replace(' ', '-')}`}>
          {riskMetrics.status}
        </div>
      </section>

      <section className="card-grid">
        <StatCard
          label="Current balance"
          value={formatCurrency(tradeMetrics.currentBalance)}
          helpText={`Starting balance ${formatCurrency(accountRules.startingBalance)}`}
          tone="positive"
        />
        <StatCard
          label="Total P&L"
          value={formatCurrency(tradeMetrics.totalPnl)}
          helpText="Derived from supplied trade data"
          tone={tradeMetrics.totalPnl >= 0 ? 'positive' : 'negative'}
        />
        <StatCard label="Winning trades" value={String(tradeMetrics.winningTrades)} tone="positive" />
        <StatCard label="Losing trades" value={String(tradeMetrics.losingTrades)} tone="negative" />
        <StatCard label="Win rate" value={formatPercent(tradeMetrics.winRate)} tone="warning" />
        <StatCard
          label="Largest winning trade"
          value={tradeMetrics.largestWinningTrade === null ? '-' : formatCurrency(tradeMetrics.largestWinningTrade)}
          tone="positive"
        />
        <StatCard
          label="Largest losing trade"
          value={tradeMetrics.largestLosingTrade === null ? '-' : formatCurrency(tradeMetrics.largestLosingTrade)}
          tone="negative"
        />
        
      </section>

      <section className="panel-stack">
        <div className="panel">
          <SectionHeader title="Equity curve" description="How the balance changed trade by trade." />
          <EquityCurve points={equityCurve} />
        </div>

        <div className="panel">
          <SectionHeader
            title="Risk status"
            description="How close the account is to violating drawdown or daily loss rules."
          />
          <RiskIndicator
            risk={riskMetrics}
            maximumDrawdown={accountRules.maximumDrawdown}
            dailyLossLimit={accountRules.dailyLossLimit}
          />
        </div>

        <div className="panel">
          <SectionHeader title="Trading performance" description="The trade set used to derive the metrics below." />
          <TradeTable trades={trades} />
        </div>
      </section>
    </main>
  );
}

export default App;
