import type { AccountRules, Trade } from './types';

export const accountRules: AccountRules = {
  startingBalance: 100000,
  currentBalance: 103250,
  maximumDrawdown: 10000,
  dailyLossLimit: 5000,
};

export const trades: Trade[] = [
  { symbol: 'BTC', side: 'Long', pnl: 1200 },
  { symbol: 'ETH', side: 'Short', pnl: -450 },
  { symbol: 'BTC', side: 'Short', pnl: 800 },
  { symbol: 'SOL', side: 'Long', pnl: -300 },
  { symbol: 'ETH', side: 'Long', pnl: 2000 },
];
