import { StockConfig } from "./StockConfig";

export interface StockDay {
  date: Date;
  normalGains: number;
  leveragedGains: number;
}

export interface StockDaySimulation {
  normalStopValue: number;
  normalGain: number;
  leveragedStopValue: number;
  leveragedGain: number;
  date: Date;
}

function calculateGains(
  previousEnd: number,
  currentEnd: number,
  leverage: number,
  yearlyCosts: number
) {
  const brutoGains = ((currentEnd - previousEnd) / previousEnd) * leverage;
  const costs = ((1 + brutoGains) * yearlyCosts) / 365;
  return brutoGains - costs;
}

export function yahooDataToStockDays(
  data: any[],
  { leverage, leveragedCosts, normalCosts }: StockConfig
): StockDay[] {
  const result = [] as StockDay[];

  const firstDay = data[0];
  result.push({
    date: new Date(firstDay.Date),
    normalGains: 1,
    leveragedGains: 1,
  });

  for (let i = 1; i < data.length; i++) {
    const previousDay = data[i - 1];
    const currentDay = data[i];
    result.push({
      date: new Date(currentDay.Date),
      normalGains: calculateGains(
        previousDay.Close,
        currentDay.Close,
        1,
        normalCosts
      ),
      leveragedGains: calculateGains(
        previousDay.Close,
        currentDay.Close,
        leverage,
        leveragedCosts
      ),
    });
  }
  return result;
}

function getClosestDayIndex(history: StockDay[], day: Date) {
  let smallestStartDiff = Number.MAX_SAFE_INTEGER;
  let startIndex = 0;

  for (let i = 0; i < history.length; i++) {
    const diff = Math.abs(history[i].date.getTime() - day.getTime());
    if (diff < smallestStartDiff) {
      startIndex = i;
      smallestStartDiff = diff;
    }
  }
  return startIndex;
}

/**
 * Calculates the timeLine from the given history, assuming that each stockDay is one business day apart.
 */
export function calculateTimeLine(
  history: StockDay[],
  startDay: Date,
  endDay: Date
): StockDaySimulation[] {
  history.sort((a, b) => a.date.getTime() - b.date.getTime());

  const startIndex = getClosestDayIndex(history, startDay);
  const endIndex = getClosestDayIndex(history, endDay);

  const result = [
    {
      normalStopValue: 100,
      normalGain: 0,
      leveragedStopValue: 100,
      leveragedGain: 0,
      date: history[startIndex].date,
    },
  ] as StockDaySimulation[];
  for (let i = 1; i < endIndex - startIndex; i++) {
    const { date, normalGains, leveragedGains } = history[i + startIndex];
    const normalStopValue = result[i - 1].normalStopValue * (1 + normalGains);
    const leveragedStopValue =
      result[i - 1].leveragedStopValue * (1 + leveragedGains);

    result.push({
      normalStopValue,
      normalGain: normalStopValue - 100,
      leveragedStopValue,
      leveragedGain: leveragedStopValue - 100,
      date,
    });
  }
  return result;
}
