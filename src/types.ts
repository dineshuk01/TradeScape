export type TradeSide = 'Long' | 'Short';

export interface Trade {
  symbol: string;
  side: TradeSide;
  pnl: number;
}

export interface AccountRules {
  startingBalance: number;
  currentBalance: number;
  maximumDrawdown: number;
  dailyLossLimit: number;
}

export interface TradeMetrics {
  totalPnl: number;
  currentBalance: number;
  winningTrades: number;
  losingTrades: number;
  winRate: number;
  largestWinningTrade: number | null;
  largestLosingTrade: number | null;
  averageWinningTrade: number | null;
  averageLosingTrade: number | null;
}

export interface EquityPoint {
  label: string;
  balance: number;
  index: number;
}

export interface RiskMetrics {
  currentDrawdown: number;
  remainingDrawdown: number;
  currentDayLoss: number;
  remainingDailyLoss: number;
  status: 'Safe' | 'Approaching Limit' | 'At Risk';
}
