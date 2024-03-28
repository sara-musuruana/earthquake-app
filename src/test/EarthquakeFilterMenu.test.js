import React from "react";
import { render, fireEvent } from "@testing-library/react";
import EarthquakeFilterMenu from "../components/EarthquakeFilterMenu.jsx";

describe("EarthquakeFilterMenu", () => {
  test("renders with initial values", () => {
    const onMagnitudeChange = jest.fn();
    const onTimePeriodChange = jest.fn();
    const onSearch = jest.fn();

    const { getByLabelText, getByText } = render(
      <EarthquakeFilterMenu
        minMagnitude={null}
        timePeriod={null}
        onMagnitudeChange={onMagnitudeChange}
        onTimePeriodChange={onTimePeriodChange}
        onSearch={onSearch}
      />
    );

    const magnitudeLabel = getByLabelText("Magnitudine minima:");
    const timePeriodLabel = getByLabelText("Periodo temporale:");
    const searchButton = getByText("Cerca");

    expect(magnitudeLabel).toBeInTheDocument();
    expect(timePeriodLabel).toBeInTheDocument();
    expect(searchButton).toBeInTheDocument();
  });

  test("calls onMagnitudeChange when magnitude is changed", () => {
    const onMagnitudeChange = jest.fn();
    const onTimePeriodChange = jest.fn();
    const onSearch = jest.fn();

    const { getByLabelText } = render(
      <EarthquakeFilterMenu
        minMagnitude={null}
        timePeriod={null}
        onMagnitudeChange={onMagnitudeChange}
        onTimePeriodChange={onTimePeriodChange}
        onSearch={onSearch}
      />
    );

    const magnitudeSelect = getByLabelText("Magnitudine minima:");
    fireEvent.change(magnitudeSelect, { target: { value: "5" } });

    expect(onMagnitudeChange).toHaveBeenCalledWith("5");
  });

  test("calls onTimePeriodChange when time period is changed", () => {
    const onMagnitudeChange = jest.fn();
    const onTimePeriodChange = jest.fn();
    const onSearch = jest.fn();

    const { getByLabelText } = render(
      <EarthquakeFilterMenu
        minMagnitude={null}
        timePeriod={null}
        onMagnitudeChange={onMagnitudeChange}
        onTimePeriodChange={onTimePeriodChange}
        onSearch={onSearch}
      />
    );

    const timePeriodSelect = getByLabelText("Periodo temporale:");
    fireEvent.change(timePeriodSelect, { target: { value: "hour" } });

    expect(onTimePeriodChange).toHaveBeenCalledWith("hour");
  });

  test("calls onSearch when search button is clicked", () => {
    const onMagnitudeChange = jest.fn();
    const onTimePeriodChange = jest.fn();
    const onSearch = jest.fn();

    const { getByText } = render(
      <EarthquakeFilterMenu
        minMagnitude={null}
        timePeriod={null}
        onMagnitudeChange={onMagnitudeChange}
        onTimePeriodChange={onTimePeriodChange}
        onSearch={onSearch}
      />
    );

    const searchButton = getByText("Cerca");
    fireEvent.click(searchButton);

    expect(onSearch).toHaveBeenCalled();
  });
});
