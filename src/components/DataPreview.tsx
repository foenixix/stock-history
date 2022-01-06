import "./DataPreview.css";

interface Props {
  data: any[];
}

export const DataPreview = ({ data }: Props) => {
  if (data.length === 0) {
    return null;
  }

  const keys = Object.keys(data[0]).filter((key) =>
    data[0].hasOwnProperty(key)
  );

  return (
    <div className="data-preview">
      <table>
        <thead>
          <tr>
            {keys.map((key) => (
              <th key={key}>{key}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.length > 10 ? (
            <>
              <DataPreviewSlice data={data.slice(0, 5)} keys={keys} />
              <tr>
                <td colSpan={keys.length}>{`${data.length - 10} more... `}</td>
              </tr>
              <DataPreviewSlice
                data={data.slice(data.length - 6, data.length)}
                keys={keys}
              />
            </>
          ) : (
            <DataPreviewSlice data={data} keys={keys} />
          )}
        </tbody>
      </table>
    </div>
  );
};

const DataPreviewSlice = ({ data, keys }: { data: any[]; keys: string[] }) => {
  return (
    <>
      {data.map((row) => (
        <tr key={JSON.stringify(row)}>
          {keys.map((key) => (
            <td key={key}>{row[key]}</td>
          ))}
        </tr>
      ))}
    </>
  );
};
