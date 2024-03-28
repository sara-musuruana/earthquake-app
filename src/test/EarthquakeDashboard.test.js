import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import axios from "axios";
import EarthquakeDashboard from "../components/EarthquakeDashboard.jsx";

jest.mock("axios");

const mockData = {
  data: {
    features: [
      {
        id: "1",
        properties: {
          place: "Test Place",
          mag: 5.0,
          time: new Date().toISOString(),
        },
      },
    ],
  },
};

describe("EarthquakeDashboard", () => {
  beforeEach(() => {
    axios.get.mockResolvedValue(mockData);
  });

  test("displays earthquake data on successful API response", async () => {
    const mockData = {
      data: {
        features: [
          {
            id: "1",
            properties: {
              place: "Test Place 1",
              mag: 5.0,
              time: new Date().toISOString(),
            },
          },
          {
            id: "2",
            properties: {
              place: "Test Place 2",
              mag: 6.0,
              time: new Date().toISOString(),
            },
          },
        ],
      },
    };
    axios.get.mockResolvedValueOnce(mockData);

    render(<EarthquakeDashboard />);

    await waitFor(() => {
      expect(screen.getByText("Test Place 1")).toBeInTheDocument();
      expect(screen.getByText("Test Place 2")).toBeInTheDocument();
    });
  });

  test("displays error message on API request failure", async () => {
    axios.get.mockRejectedValueOnce(new Error("Failed to fetch data"));

    render(<EarthquakeDashboard />);

    await waitFor(() => {
      expect(
        screen.getByText("Errore durante il recupero dei dati:")
      ).toBeInTheDocument();
    });
  });

  test("filters earthquakes by magnitude", async () => {
    render(<EarthquakeDashboard />);
    await waitFor(() => {
      expect(screen.getByText("Test Place")).toBeInTheDocument();
    });
    const magnitudeInput = screen.getByLabelText("Magnitudo:");
    userEvent.clear(magnitudeInput);
    userEvent.type(magnitudeInput, "6");
    const searchButton = screen.getByText("Cerca");
    userEvent.click(searchButton);
    await waitFor(() => {
      expect(screen.getByText("Test Place")).toBeInTheDocument();
    });
    expect(axios.get).toHaveBeenCalledWith(
      expect.stringContaining("minmagnitude=6")
    );
  });

  test("filters earthquakes by time period", async () => {
    render(<EarthquakeDashboard />);

    // Attendere il caricamento dei dati dei terremoti
    await waitFor(() => {
      expect(axios.get).toHaveBeenCalled(); // Verifica che l'API sia stata chiamata almeno una volta
    });

    const timePeriodSelect = screen.getByLabelText("Periodo temporale:");
    userEvent.selectOptions(timePeriodSelect, "week");

    const searchButton = screen.getByText("Cerca");
    userEvent.click(searchButton);

    // Attendere il nuovo caricamento dei dati dei terremoti dopo il cambio del periodo di tempo
    await waitFor(() => {
      expect(axios.get).toHaveBeenCalledWith(
        expect.stringContaining("starttime=")
      );
      expect(axios.get).toHaveBeenCalledWith(
        expect.stringContaining("endtime=")
      );
    });
  });

  test("displays list of earthquakes", async () => {
    const mockData = {
      data: {
        features: [
          {
            id: "1",
            properties: {
              place: "Test Place 1",
              mag: 5.0,
              time: new Date().toISOString(),
            },
          },
          {
            id: "2",
            properties: {
              place: "Test Place 2",
              mag: 6.0,
              time: new Date().toISOString(),
            },
          },
        ],
      },
    };
    axios.get.mockResolvedValueOnce(mockData);

    render(<EarthquakeDashboard />);

    await waitFor(() => {
      expect(screen.getByText("Test Place 1")).toBeInTheDocument();
      expect(screen.getByText("Test Place 2")).toBeInTheDocument();
    });
  });

  test("displays map", async () => {
    const mockData = {
      data: {
        features: [
          {
            id: "1",
            properties: {
              place: "Test Place 1",
              mag: 5.0,
              time: new Date().toISOString(),
            },
          },
          {
            id: "2",
            properties: {
              place: "Test Place 2",
              mag: 6.0,
              time: new Date().toISOString(),
            },
          },
        ],
      },
    };
    axios.get.mockResolvedValueOnce(mockData);

    render(<EarthquakeDashboard />);

    await waitFor(() => {
      expect(screen.getByTestId("earthquake-map")).toBeInTheDocument();
    });
  });

  test("paginates earthquake data", async () => {
    render(<EarthquakeDashboard />);
    await waitFor(() => {
      expect(screen.getByText("Test Place 1")).toBeInTheDocument();
      expect(screen.getByText("Test Place 2")).toBeInTheDocument();
    });

    // Click next page button
    const nextPageButton = screen.getByText("Next →");
    userEvent.click(nextPageButton);
    await waitFor(() => {
      expect(screen.getByText("Test Place 1")).not.toBeInTheDocument();
      expect(screen.getByText("Test Place 2")).not.toBeInTheDocument();
      expect(screen.getByText("Test Place 3")).toBeInTheDocument();
    });

    // Click previous page button
    const previousPageButton = screen.getByText("← Previous");
    userEvent.click(previousPageButton);
    await waitFor(() => {
      expect(screen.getByText("Test Place 1")).toBeInTheDocument();
      expect(screen.getByText("Test Place 2")).toBeInTheDocument();
      expect(screen.queryByText("Test Place 3")).not.toBeInTheDocument();
    });
  });

  test("displays error message on API request failure", async () => {
    axios.get.mockRejectedValueOnce(new Error("Failed to fetch data"));

    render(<EarthquakeDashboard />);

    await waitFor(() => {
      expect(
        screen.getByText("Errore durante il recupero dei dati:")
      ).toBeInTheDocument();
    });
  });

  test("displays message for no earthquakes available", async () => {
    const mockData = { data: { features: [] } };
    axios.get.mockResolvedValueOnce(mockData);

    render(<EarthquakeDashboard />);

    await waitFor(() => {
      expect(
        screen.getByText(
          "Nessun terremoto trovato. Per favore cambia i parametri selezionati."
        )
      ).toBeInTheDocument();
    });
  });
});
