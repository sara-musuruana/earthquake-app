import React from "react";
import { render } from "@testing-library/react";
import EarthquakeMap from "../components/EarthquakeMap.jsx";

describe("EarthquakeMap Component", () => {
  test("renders map container initially hidden", () => {
    const { container } = render(<EarthquakeMap />);
    const mapContainer = container.querySelector(".map-container");
    expect(mapContainer).toHaveClass("hidden");
  });

  test("renders map container visible when searchClicked is true", () => {
    const { container, rerender } = render(
      <EarthquakeMap searchClicked={false} />
    );
    let mapContainer = container.querySelector(".map-container");
    expect(mapContainer).toHaveClass("hidden");

    rerender(<EarthquakeMap searchClicked={true} />);
    mapContainer = container.querySelector(".map-container");
    expect(mapContainer).toHaveClass("visible");
  });

  test("renders markers when earthquakeData is provided", () => {
    const earthquakeData = [
      {
        id: "ci40700072",
        geometry: {
          coordinates: [-116.3251667, 33.3703333, 11.71],
        },
        properties: {
          place: "14 km NNE of Borrego Springs, CA",
          mag: 0.77,
          time: 1711543468690,
        },
      },
    ];
    const { container } = render(
      <EarthquakeMap searchClicked={true} earthquakeData={earthquakeData} />
    );
    const markers = container.querySelectorAll(".leaflet-marker-icon");
    expect(markers.length).toBe(1);
  });
});
