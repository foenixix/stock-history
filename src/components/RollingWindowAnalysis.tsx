import { useEffect, useState } from "react";
import {
  analyseTimeLine,
  SpecialAnalysis,
  StockAnalysis,
  StockDaySimulation,
} from "../StockHistoryUtil";
import "./RollingWindowAnalysis.css";

interface Props {
  timeLine: StockDaySimulation[];
}

function formatDate(date: Date): string {
  if (!date) {
    debugger;
  }

  var mm = date.getMonth() + 1; // getMonth() is zero-based
  var dd = date.getDate();

  return [
    (dd > 9 ? "" : "0") + dd,
    (mm > 9 ? "" : "0") + mm,
    date.getFullYear(),
  ].join("/");
}

export const RollingWindowAnalysis = ({ timeLine }: Props) => {
  const [windowSize, setWindowSize] = useState<number>(1095);
  const [analysis, setAnalysis] = useState<StockAnalysis[]>();

  function analyse() {
    setAnalysis(analyseTimeLine(timeLine, windowSize));
  }

  function sortAnalysis(predicate: (value: StockAnalysis) => number){
    if(analysis){
      setAnalysis([...analysis].sort((a,b) => predicate(b) - predicate(a)))
    }
  }

  return (
    <>
      <div className="rolling-window-analysis-line">
        <div>Window size (days): </div>
        <input
          type="number"
          value={windowSize}
          onChange={(e) => setWindowSize(e.target.value as any as number)}
        />
      </div>
      <button onClick={analyse} style={{ width: "fit-content" }}>
        Analyse
      </button>

      <div className="rolling-window-analysis-list-container">
        {analysis && (
          <table className="rolling-window-analysis-list">
            <thead>
              <tr>
                <th>Period</th>
                <th onClick={() => sortAnalysis((a) => a.normalGain) }>Norm. Gain</th>
                <th onClick={() => sortAnalysis((a) => a.leveragedGain)}>Lev. Gain</th>
                <th onClick={() => sortAnalysis((a) => a.gainComparison)}>Gain Comp</th>
              </tr>
            </thead>
            <tbody>
              {analysis.map((a) => (
                <AnalysisLine key={a.startDay.toString()} analysis={a} />
              ))}
            </tbody>
          </table>
        )}
      </div>
    </>
  );
};

interface AnalysisLineProps {
  label?: string;
  analysis: StockAnalysis;
}

const AnalysisLine = ({ label, analysis }: AnalysisLineProps) => {
  return (
    <tr>
      <td>{`${label ? label + ": " : ""} ${formatDate(
        analysis?.startDay
      )} - ${formatDate(analysis?.endDay)}`}</td>
      <td>{analysis.normalGain.toFixed(2)}</td>
      <td>{analysis.leveragedGain.toFixed(2)}</td>
      <td>{analysis.gainComparison.toFixed(2)}</td>
    </tr>
  );
};
