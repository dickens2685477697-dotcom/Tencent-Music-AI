interface Option<T extends string> { value: T; label: string }

export function ChipSelector<T extends string>({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: T;
  options: Option<T>[];
  onChange: (value: T) => void;
}) {
  return (
    <fieldset className="selector">
      <legend>{label}</legend>
      <div className="chip-row">
        {options.map((option) => (
          <button
            type="button"
            className={`chip ${value === option.value ? 'chip--active' : ''}`}
            aria-pressed={value === option.value}
            onClick={() => onChange(option.value)}
            key={option.value}
          >
            {option.label}
          </button>
        ))}
      </div>
    </fieldset>
  );
}
