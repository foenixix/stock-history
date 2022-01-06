import { PropsWithChildren, ReactNode } from "react";
import "./StockColumn.css";

interface Props {
  title?: string;
}

export const StockColumn = ({ title, children }: PropsWithChildren<Props>) => {
  return <div className="stock-column">
    <div className="stock-column-title">
      {title}
    </div>
    <div className="stock-column-content">
      {children}
    </div>
  </div>
}