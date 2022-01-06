import "./StockConfigurator.css";
import { StockConfig } from "../StockConfig";

interface Props {
  config: StockConfig;
  onChange: (value: StockConfig) => void;
}

export const StockConfigurator = ({ config, onChange }: Props) => {
  
  function handleFloatChange(key: keyof StockConfig, newValue: string) {
    const value = parseFloat(newValue);
    if (!isNaN(value)) {
      onChange(config.copyAndSet({ [key]: value }));
    }
  }

  return (
    <div className="stock-configurator">
      <div className="config-row">
        <div>Normal costs</div>
        <input
          type="number"
          value={config.normalCosts}
          onChange={(event) => handleFloatChange("normalCosts",event.target.value)}
          step="0.01"
        />
      </div>
      <div className="config-row">
        <div>Leverage</div>
        <input
          type="number"
          value={config.leverage}
          onChange={(event) => handleFloatChange("leverage",event.target.value)}
          step="0.01"
        />
      </div>
      <div className="config-row">
        <div>Leveraged costs</div>
        <input
          type="number"
          value={config.leveragedCosts}
          onChange={(event) => handleFloatChange("leveragedCosts",event.target.value)}
          step="0.01"
        />
      </div>
    </div>
  );
};
