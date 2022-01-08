import { useEffect, useMemo, useRef, useState } from "react";
import {
  calculateTimeLine,
  StockDay,
  StockDaySimulation,
} from "../StockHistoryUtil";
import c3 from "c3";
import "c3/c3.css";
import "./YahooHistoryModal.css";
import { DateInput } from "./DateInput";
import { Interval, IntervalInput } from "./IntervalInput";
import { RollingWindowAnalysis } from "./RollingWindowAnalysis";

const DAYS_TO_MILLIS = 24 * 60 * 60 * 1000;

interface Props {
  history: StockDay[];
  onClose: () => void;
}

function simplifyTimeline(timeline: StockDaySimulation[], interval: Interval) {
  if (interval === Interval.DAY) {
    return timeline;
  } else {
    let intervalInMillis: number;
    if (interval === Interval.WEEK) {
      intervalInMillis = 7 * DAYS_TO_MILLIS;
    } else if (interval === Interval.MONTH) {
      intervalInMillis = 30 * DAYS_TO_MILLIS;
    } else if (interval === Interval.YEAR) {
      intervalInMillis = 365 * DAYS_TO_MILLIS;
    }
    let lastMoment = 0;
    return timeline.filter(({ date }) => {
      if (date.getTime() - lastMoment > intervalInMillis) {
        lastMoment = date.getTime();
        return true;
      } else {
        return false;
      }
    });
  }
}

function toData(timeLine: StockDaySimulation[]) {
  return {
    json: timeLine as Record<string, any>[],
    keys: {
      x: "date",
      value: ["normalGain", "leveragedGain"],
    },
  };
}

export const YahooHistoryModal = ({ history, onClose }: Props) => {
  const [startTime, setStartTime] = useState<Date>(history[0].date);
  const [endTime, setEndTime] = useState<Date>(
    history[history.length - 1].date
  );
  const [interval, setInterval] = useState<Interval>(Interval.WEEK);
  const [timeLine, setTimeLine] = useState<StockDaySimulation[]>([]);
  const chartDivRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<c3.ChartAPI>();

  useEffect(() => {
    if (chartRef.current) {
      chartRef.current.load(toData(timeLine));
    }
  }, [timeLine]);

  useEffect(() => {
    chartRef.current = c3.generate({
      bindto: chartDivRef.current,
      data: toData(timeLine),
      axis: {
        x: {
          type: "timeseries",
          tick: {
            format: "%d-%m-%Y",
          },
        },
      },
      padding: {
        left: 30,
        right: 30,
      },
    });

    setTimeLine(
      simplifyTimeline(calculateTimeLine(history, startTime, endTime), interval)
    );
  }, []);

  function updateTimeLine() {
    setTimeLine(
      simplifyTimeline(calculateTimeLine(history, startTime, endTime), interval)
    );
  }

  return (
    <>
      <div className="yahoo-history-modal-backdrop" onClick={onClose} />
      <div className="yahoo-history-modal-content">
        <div className="yahoo-history-chart" ref={chartDivRef} />
        <div className="yahoo-history-sub-chart">
          <div className="yahoo-history-column">
            <div className="yahoo-history-title">Config</div>
            <DateInput
              label="Begin:"
              value={startTime}
              onChange={setStartTime}
              minDate={history[0].date}
              maxDate={history[history.length - 1].date}
            />
            <DateInput
              label="End:&nbsp;&nbsp;&nbsp;"
              value={endTime}
              onChange={setEndTime}
              minDate={history[0].date}
              maxDate={history[history.length - 1].date}
            />
            <IntervalInput value={interval} onChange={setInterval} />
            <button
              onClick={updateTimeLine}
              style={{ width: "fit-content" }}
              disabled={endTime.getTime() <= startTime.getTime()}
            >
              Apply
            </button>
          </div>
          <div className="yahoo-history-column">
            <div className="yahoo-history-title">Analysis</div>
            <RollingWindowAnalysis timeLine={timeLine} />
          </div>
        </div>
      </div>
    </>
  );
};
