# Trader Risk Dashboard

A responsive dashboard for quickly evaluating a trader's performance against their account rules.

## What it shows

- Current balance
- Total P&L
- Winning and losing trades
- Win rate
- Largest winning and losing trade
- Risk status based on drawdown and daily loss limits
- Trade list with per-trade P&L

## Extra feature

I added an **equity curve**.

Why:

- It gives the trader an instant visual of account progression over time
- It makes it easier to see whether performance is stable, choppy, or deteriorating
- It pairs well with the risk dashboard because it shows when the account crosses above or below starting cash

## Product questions

### 1. What is drawdown in trading?

Drawdown is the drop from a trader's peak equity or reference balance to a lower point. It shows how much capital has been lost from the highest point reached.

### 2. Why would a trader care about remaining drawdown rather than just current P&L?

Current P&L shows profit or loss, but remaining drawdown shows how much room is left before violating account rules. A trader can still be profitable and dangerously close to a limit.

### 3. If you had another day to work on this dashboard, what would you improve?

I would add time-based performance analysis, such as best/worst day, asset-level filtering, and hover tooltips on the equity curve, so the trader can understand performance patterns more deeply.

## How to run

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

## Notes

- Calculations are derived from the trade data.
- The dashboard handles basic empty-data cases and avoids divide-by-zero errors.
