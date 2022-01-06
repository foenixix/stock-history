import "react-datepicker/dist/react-datepicker.css";
import "./DateInput.css";
import DatePicker from "react-datepicker";

interface Props {
  label: string;
  value: Date;
  onChange: (value: Date) => void;
  minDate?: Date;
  maxDate?: Date;
}

export const DateInput = ({
  label,
  value,
  onChange,
  minDate,
  maxDate,
}: Props) => {
  return (
    <div className="date-input">
      <div>{label}</div>
      <DatePicker
        className="date-picker"
        selected={value}
        onChange={onChange}
        minDate={minDate}
        maxDate={maxDate}
        dateFormat="dd/MM/yyyy"
      />
    </div>
  );
};
