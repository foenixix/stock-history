interface StockConfigOptions {
  normalCosts: number;
  leverage: number;
  leveragedCosts: number;
}

const STOCK_CONFIG_STORAGE_KEY = "StockConfig";
const DEFAULT_STOCK_CONFIG_OPTIONS = { normalCosts: 0.0022, leverage: 3, leveragedCosts: 0.0075 };

export class StockConfig {
  public readonly normalCosts: number;
  public readonly leverage: number;
  public readonly leveragedCosts: number;

  constructor(options: StockConfigOptions) {
    this.normalCosts = options.normalCosts;
    this.leverage = options.leverage;
    this.leveragedCosts = options.leveragedCosts;
  }

  copyAndSet(options: Partial<StockConfigOptions>): StockConfig {
    return new StockConfig({
      normalCosts: options?.normalCosts ?? this.normalCosts,
      leverage: options?.leverage ?? this.leverage,
      leveragedCosts: options?.leveragedCosts ?? this.leveragedCosts,
    });
  }
}

export function getDefaultConfig(): StockConfig {
  const config = localStorage.getItem(STOCK_CONFIG_STORAGE_KEY);
  if (config) {
    return JSON.parse(config);
  } else {
    return new StockConfig(DEFAULT_STOCK_CONFIG_OPTIONS);
  }
}

export function persistConfig(config: StockConfig) {
  localStorage.setItem(STOCK_CONFIG_STORAGE_KEY, JSON.stringify(config));
}
