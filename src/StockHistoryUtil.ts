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

export interface StockAnalysis {
  startDay: Date;
  endDay: Date;
  normalGain: number;
  leveragedGain: number;
  gainComparison: number;
}

export interface SpecialAnalysis {
  best: StockAnalysis;
  worst: StockAnalysis;
  median: StockAnalysis;
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

function getMaxElementIndex<T>(array: T[], predicate: (element: T) => number): number{
  let biggestValue = 0;
  let index = 0;

  for (let i = 0; i < array.length; i++) {
    const value = predicate(array[i]);
    if (biggestValue < value) {
      index = i;
      biggestValue = value;
    }
  }
  return index;

}

function getMaxElement<T>(array: T[], predicate: (element: T) => number): T{
  return array[getMaxElementIndex(array, predicate)];
}


function getClosestDayIndex(history: { date: Date }[], day: Date) {
  return getMaxElementIndex(history, ({date}) => Number.MAX_SAFE_INTEGER - Math.abs(date.getTime() - day.getTime()) );
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

export function analyseTimeLine(
  timeLine: StockDaySimulation[],
  windowSizeInDays: number
): StockAnalysis[] {
  const windowSizeInMillis = windowSizeInDays * 24 * 60 * 60 * 1000;
  const result = [] as StockAnalysis[];

  let startDayIndex = 0;
  let startDay = timeLine[0].date;

  while (true) {
    const startDay = timeLine[startDayIndex];
    const endDayIndex = getClosestDayIndex(
      timeLine,
      new Date(startDay.date.getTime() + windowSizeInMillis)
    );
    const endDay = timeLine[endDayIndex];
    if (
      endDay.date.getTime() - startDay.date.getTime() <
        windowSizeInMillis * 0.9 ||
      (endDayIndex === timeLine.length &&
        result[result.length - 1].endDay.getTime === endDay.date.getTime)
    ) {
      break;
    }

    const normalGain = (endDay.normalStopValue - startDay.normalStopValue) /(startDay.normalStopValue);
    const leveragedGain = (endDay.leveragedStopValue - startDay.leveragedStopValue) /(startDay.leveragedStopValue);
    result.push({
      startDay: startDay.date,
      endDay: endDay.date,
      normalGain,
      leveragedGain,
      gainComparison: leveragedGain/normalGain,
    });

    startDayIndex++;
  }

  return result;
}
