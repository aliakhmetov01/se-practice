type Props = {
  attendees: string;
  onAttendeesChange: (value: string) => void;
  options: string[];
  selected: string[];
  onToggle: (item: string) => void;
};

/** The filter form: number of attendees (F1) and required equipment (F2). Holds no rule. */
export function RoomFilter({ attendees, onAttendeesChange, options, selected, onToggle }: Props) {
  return (
    <fieldset className="filter">
      <legend>What do you need?</legend>
      <label>
        Attendees
        <input
          type="number"
          min={1}
          value={attendees}
          onChange={e => onAttendeesChange(e.target.value)}
        />
      </label>
      <div className="equipment" role="group" aria-label="Required equipment">
        {options.map(item => (
          <label key={item} className="inline">
            <input type="checkbox" checked={selected.includes(item)} onChange={() => onToggle(item)} />
            {item}
          </label>
        ))}
      </div>
    </fieldset>
  );
}
