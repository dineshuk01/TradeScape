import type { AccountRules, EquityPoint, RiskMetrics, Trade, TradeMetrics } from '../types';

const safeDivide = (numerator: number, denominator: number): number => {
  if (denominator === 0) return 0;
  return numerator / denominator;
};

export const formatCurrency = (value: number): string =>
  new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(value);

export const formatPercent = (value: number): string => `${value.toFixed(1)}%`;

export const getTradeMetrics = (trades: Trade[], startingBalance: number): TradeMetrics => {
  const totalPnl = trades.reduce((sum, trade) => sum + trade.pnl, 0);
  const winningTrades = trades.filter((trade) => trade.pnl > 0).length;
  const losingTrades = trades.filter((trade) => trade.pnl < 0).length;
  const winningPnls = trades.filter((trade) => trade.pnl > 0).map((trade) => trade.pnl);
  const losingPnls = trades.filter((trade) => trade.pnl < 0).map((trade) => trade.pnl);

  const largestWinningTrade = winningPnls.length ? Math.max(...winningPnls) : null;
  const largestLosingTrade = losingPnls.length ? Math.min(...losingPnls) : null;
  const averageWinningTrade =
    winningPnls.length > 0 ? winningPnls.reduce((sum, pnl) => sum + pnl, 0) / winningPnls.length : null;
  const averageLosingTrade =
    losingPnls.length > 0 ? losingPnls.reduce((sum, pnl) => sum + pnl, 0) / losingPnls.length : null;

  return {
    totalPnl,
    currentBalance: startingBalance + totalPnl,
    winningTrades,
    losingTrades,
    winRate: safeDivide(winningTrades * 100, trades.length),
    largestWinningTrade,
    largestLosingTrade,
    averageWinningTrade,
    averageLosingTrade,
  };
};

export const getRiskMetrics = (
  account: AccountRules,
  tradeMetrics: TradeMetrics,
  trades: Trade[]
): RiskMetrics => {
  const currentDrawdown = Math.max(0, account.startingBalance - tradeMetrics.currentBalance);
  const remainingDrawdown = Math.max(0, account.maximumDrawdown - currentDrawdown);
  const currentDayLoss = trades.reduce((sum, trade) => sum + Math.max(0, -trade.pnl), 0);
  const remainingDailyLoss = Math.max(0, account.dailyLossLimit - currentDayLoss);

  const drawdownUsage = safeDivide(currentDrawdown, account.maximumDrawdown);
  const dailyLossUsage = safeDivide(currentDayLoss, account.dailyLossLimit);
  const worstUsage = Math.max(drawdownUsage, dailyLossUsage);

  let status: RiskMetrics['status'] = 'Safe';
  if (worstUsage >= 1) {
    status = 'At Risk';
  } else if (worstUsage >= 0.6) {
    status = 'Approaching Limit';
  }

  return {
    currentDrawdown,
    remainingDrawdown,
    currentDayLoss,
    remainingDailyLoss,
    status,
  };
};

export const getRiskUsage = (current: number, limit: number): number => {
  if (limit <= 0) return 0;
  return Math.min(1, current / limit);
};

export const getEquityCurve = (trades: Trade[], startingBalance: number): EquityPoint[] => {
  const points: EquityPoint[] = [{ label: 'Start', balance: startingBalance, index: 0 }];
  let runningBalance = startingBalance;

  trades.forEach((trade, index) => {
    runningBalance += trade.pnl;
    points.push({
      label: `${trade.symbol} ${trade.side}`,
      balance: runningBalance,
      index: index + 1,
    });
  });

  return points;
};
