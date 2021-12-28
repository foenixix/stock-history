import { ChangeEvent, useState } from "react";
import "./App.css";
import { DataPreview } from "./DataPreview";
import { StockColumn } from "./StockColumn";
import { parse } from "@fast-csv/parse";

export const App = () => {
  const [data, setData] = useState<null | string>(null);

  function handleFileUpload(event: ChangeEvent<HTMLInputElement>) {
    const file = event?.target?.files?.[0];

    if (!file) {
      setData(null);
      return;
    }

    const q = parse({ headers: true })
      .on("error", (error) => {
        console.error(error);
        setData(null);
      })
      .on("data", (row) => console.log(row))
      .on("end", (rowCount: number) => console.log(`Parsed ${rowCount} rows`));

    const reader = new FileReader();
    reader.onload = (event) => {
      if (typeof event.target?.result === "string") {
        q.write(event.target.result);
      }
    };
    reader.readAsText(file);
  }

  return (
    <div className="app">
      <StockColumn title="CONFIG">Here comes the config</StockColumn>
      <StockColumn title="DATA">
        <div className="data-content">
          <input
            type="file"
            name="file"
            id="file"
            onChange={handleFileUpload}
          />
        </div>
        {data && <DataPreview data={data} />}
      </StockColumn>
    </div>
  );
};
