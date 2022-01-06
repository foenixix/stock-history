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

interface Props {
  history: StockDay[];
  onClose: () => void;
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
  const [timeLine, setTimeLine] = useState<StockDaySimulation[]>(
    calculateTimeLine(history, startTime, endTime)
  );
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
  }, []);

  function updateTimeLine() {
    setTimeLine(calculateTimeLine(history, startTime, endTime));
  }

  return (
    <>
      <div className="yahoo-history-modal-backdrop" onClick={onClose} />
      <div className="yahoo-history-modal-content">
        <div className="yahoo-history-chart" ref={chartDivRef} />
        <div>
          <div className="yahoo-history-config">
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
            <button
              onClick={updateTimeLine}
              style={{ width: "fit-content" }}
              disabled={endTime.getTime() <= startTime.getTime()}
            >
              Apply
            </button>
          </div>
          <div className="yahoo-history-separation-line" />
          <div className="yahoo-history-data"></div>
        </div>
      </div>
    </>
  );
};
