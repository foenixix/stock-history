import "./IntervalInput.css";

export enum Interval {
  DAY,
  WEEK,
  MONTH,
  YEAR,
}

interface Props {
  value: Interval;
  onChange: (value: Interval) => void;
}

export const IntervalInput = ({ value, onChange }: Props) => {
  return (
    <div className="interval-input">
      <div>Interval: </div>
      <div>
        <input
          type="radio"
          value={Interval.DAY}
          checked={value === Interval.DAY}
          onChange={(event) => {
            onChange(Number.parseInt((event.target as any).value));
          }}
        />
        Day
        <input
          type="radio"
          value={Interval.WEEK}
          checked={value === Interval.WEEK}
          onChange={(event) => {
            onChange(Number.parseInt((event.target as any).value));
          }}
        />
        Week
        <input
          type="radio"
          value={Interval.MONTH}
          checked={value === Interval.MONTH}
          onChange={(event) => {
            onChange(Number.parseInt((event.target as any).value));
          }}
        />
        Month
        <input
          type="radio"
          value={Interval.YEAR}
          checked={value === Interval.YEAR}
          onChange={(event) => {
            onChange(Number.parseInt((event.target as any).value));
          }}
        />
        Year
      </div>
    </div>
  );
};
