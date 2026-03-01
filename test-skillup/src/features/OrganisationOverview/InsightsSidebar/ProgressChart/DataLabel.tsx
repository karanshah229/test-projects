export function DataLabel({ name = '', lastVal = '' }: { name: string; lastVal: string }) {
  return (
    <div className="hr-flex hr-col">
      <div className="hr-m-b-0.5">{name}</div>
      <div className="hr-body-02">{lastVal}</div>
    </div>
  );
}
