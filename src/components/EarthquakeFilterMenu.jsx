// Nuovo componente EarthquakeFilterMenu
import React from "react";
import "../css/EarthquakeFilterMenu.css";

function EarthquakeFilterMenu({
  minMagnitude,
  timePeriod,
  onMagnitudeChange,
  onTimePeriodChange,
  onSearch,
}) {
  const magnitudes = ["--", ...Array.from({ length: 9 }, (_, i) => i)]; // Crea un array da 0 a 8

  return (
    <div className="filters">
      <label htmlFor="magnitude">Magnitudine minima:</label>
      <select
        id="magnitude"
        value={minMagnitude !== null ? minMagnitude : "--"}
        onChange={onMagnitudeChange}
      >
        {magnitudes.map((magnitude) => (
          <option key={magnitude} value={magnitude}>
            {magnitude}
          </option>
        ))}
      </select>

      <label htmlFor="time-period">Periodo temporale:</label>
      <select
        id="time-period"
        value={timePeriod !== null ? timePeriod : "--"}
        onChange={onTimePeriodChange}
      >
        <option value="--">Seleziona un periodo</option>
        <option value="hour">1 ora</option>
        <option value="day">1 giorno</option>
        <option value="week">1 settimana</option>
        <option value="month">1 mese</option>
        <option value="year">1 anno</option>
        <option value="decade">10 anni</option>
      </select>

      <button onClick={() => onSearch(timePeriod)}>Cerca</button>
    </div>
  );
}

export default EarthquakeFilterMenu;
