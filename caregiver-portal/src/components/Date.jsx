import { useMemo, useState } from "react";
import PropTypes from 'prop-types';

function formatYmd(d) {
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

function date19YearsAgo(today = new Date()) {
  const d = new Date(today);
  d.setFullYear(d.getFullYear() - 19);
  return d;
}

function isAtLeast19(isoDate, today = new Date()) {
  if (!isoDate) return false;
  const b = new Date(isoDate + "T00:00:00");
  let age = today.getFullYear() - b.getFullYear();
  const m = today.getMonth() - b.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < b.getDate())) age--;
  return age >= 19;
}

const DateField = ({variant = 'past', children, ...props }) => {
  const [error, setError] = useState(null);

  const {min, max} = useMemo(() => {
    switch(variant) {
        case 'adult':
            return { max: formatYmd(date19YearsAgo())};
        case 'past':
            return { max: formatYmd(new Date())};
        case 'future':
            return { min: formatYmd(new Date(0))};
        default:
            return {} // No limit for past dates
    }
  }, [variant]);

  return (
    <div className="flex flex-col gap-1">
      <input
        {...props}
        type="date"
        required
        max={max}
        min={min}
        aria-invalid={!!error}
        aria-describedby={error ? "birthdate-error" : undefined}
        className="form-control-date"
      />
      {error && (
        <p id="birthdate-error" className="text-sm text-red-600">
          {error}
        </p>
      )}
    </div>
  );
}

DateField.propTypes = {
  variant: PropTypes.oneOf(['adult', 'future', 'past']),
  children: PropTypes.node.isRequired,
};

export default DateField;