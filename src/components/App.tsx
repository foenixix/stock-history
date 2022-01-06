import { ChangeEvent, useState } from "react";
import "./App.css";
import { DataPreview } from "./DataPreview";
import { StockColumn } from "./StockColumn";
import { parse } from "@fast-csv/parse";
import { getDefaultConfig, StockConfig } from "../StockConfig";
import { StockConfigurator } from "./StockConfigurator";
import { StockDay, yahooDataToStockDays } from "../StockHistoryUtil";
import { YahooHistoryModal } from "./YahooHistoryModal";

export const App = () => {
  const [data, setData] = useState<null | any[]>(null);
  const [yahooHistory, setYahooHistory] = useState<null | StockDay[]>(null);
  const [showYahooModal, setShowYahooModal] = useState<boolean>(true);
  const [parsing, setParsing] = useState<boolean>(false);
  const [config, setConfig] = useState<StockConfig>(getDefaultConfig());

  function handleFileUpload(event: ChangeEvent<HTMLInputElement>) {
    setParsing(true);
    const file = event?.target?.files?.[0];

    if (!file) {
      setData(null);
      setParsing(false);
      return;
    }

    const result = [] as any[];

    const stream = parse({ headers: true, maxRows: 99999999 })
      .on("error", (error) => {
        console.error(error);
        setData(null);
        setParsing(false);
      })
      .on("data", (row) => result.push(row))
      .on("end", () => {
        setData(result);
        setParsing(false);
      });

    const reader = new FileReader();
    reader.onload = (event) => {
      if (typeof event.target?.result === "string") {
        stream.write(event.target.result);
        stream.end();
      }
    };
    reader.readAsText(file);
  }

  function generateYahooHistory() {
    if (data) {
      setYahooHistory(yahooDataToStockDays(data, config));
      setShowYahooModal(true);
    }
  }

  return (
    <>
      <div className="app">
        <StockColumn title="CONFIG">
          <StockConfigurator config={config} onChange={setConfig} />
        </StockColumn>
        <StockColumn title="DATA">
          <div className="data-content">
            <input
              type="file"
              name="file"
              id="file"
              disabled={parsing}
              onChange={handleFileUpload}
            />
          </div>
          {data && (
            <div>
              <button onClick={generateYahooHistory}>
                Generate from Yahoo
              </button>
              <button
                onClick={() => setShowYahooModal(true)}
                disabled={!yahooHistory}
              >
                Show Yahoo history
              </button>
            </div>
          )}
          {data && <DataPreview data={data} />}
        </StockColumn>
      </div>
      {yahooHistory && showYahooModal && (
        <YahooHistoryModal
          history={yahooHistory}
          onClose={() => setShowYahooModal(false)}
        />
      )}
    </>
  );
};
