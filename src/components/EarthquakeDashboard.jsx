import React, { useState, useEffect } from "react";
import axios from "axios";
import ReactPaginate from "react-paginate";
import "../css/EarthquakeDashboard.css";
import EarthquakeFilterMenu from "./EarthquakeFilterMenu";
import EarthquakeMap from "./EarthquakeMap";

function EarthquakeDashboard() {
  const [earthquakeData, setEarthquakeData] = useState([]);
  const [minMagnitude, setMinMagnitude] = useState("--");
  const [timePeriod, setTimePeriod] = useState(null);
  const [searchClicked, setSearchClicked] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(Date.now());
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [hasEarthquakes, setHasEarthquakes] = useState(true);
  const [pageNumberInput, setPageNumberInput] = useState("");

  const earthquakesPerPage = 5; // Numero di terremoti da visualizzare per pagina

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true); // Imposta lo stato di caricamento su true
      try {
        const data = await fetchEarthquakeData(minMagnitude, timePeriod);
        setEarthquakeData(data);
        setHasEarthquakes(data.length > 0); // Imposta lo stato in base alla presenza o all'assenza di terremoti
      } catch (error) {
        console.error("Errore durante il recupero dei dati:", error);
      } finally {
        setIsLoading(false); // Imposta lo stato di caricamento su false una volta completato il recupero dei dati
      }
    };

    if (searchClicked) {
      fetchData();
      setSearchClicked(false);
    }

    const interval = setInterval(() => {
      fetchData();
      setLastUpdated(Date.now()); // Aggiorna il timestamp dell'ultimo aggiornamento
    }, 5 * 60 * 1000); // 5 minuti in millisecondi

    // Pulisci l'intervallo quando il componente si smonta
    return () => clearInterval(interval);
  }, [minMagnitude, timePeriod, searchClicked, lastUpdated]);

  const fetchEarthquakeData = async (minMagnitude, timePeriod) => {
    const endDate = new Date(); // Data di fine: data corrente
    const startDate = new Date(); // Data di inizio

    // Calcolo della data di inizio basata sul periodo temporale scelto
    switch (timePeriod) {
      case "hour":
        startDate.setHours(startDate.getHours() - 1);
        break;
      case "day":
        startDate.setDate(startDate.getDate() - 1);
        break;
      case "week":
        startDate.setDate(startDate.getDate() - 7);
        break;
      case "month":
        startDate.setMonth(startDate.getMonth() - 1);
        break;
      case "year":
        startDate.setFullYear(startDate.getFullYear() - 1);
        break;
      case "decade":
        startDate.setFullYear(startDate.getFullYear() - 10);
        break;
      default:
        break;
    }

    const formattedStartDate = startDate.toISOString();
    const formattedEndDate = endDate.toISOString();

    try {
      const response = await axios.get(
        `https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson&starttime=${formattedStartDate}&endtime=${formattedEndDate}&minmagnitude=${minMagnitude}`
      );

      if (response.data.features.length === 0) {
        // Nessun terremoto trovato, mostra un avviso
        console.warn(
          "Nessun terremoto trovato. Per favore cambia i parametri per visualizzare un gruppo più contenuto."
        );
        return [];
      }

      const filteredData = response.data.features.filter(
        (quake) => quake.properties.mag >= minMagnitude
      );
      return filteredData;
    } catch (error) {
      // Gestione degli errori della richiesta GET
      console.error("Errore durante la richiesta GET:", error);
      window.alert(
        "I risultati forniti da USGS sono limitati a 20.000 terremoti. \nAvendo selezionato un ampio arco temporale, si consiglia di aumentare il valore minimo della magnitudine per visualizzare almeno i terremoti più significativi del periodo selezionato."
      );
      return [];
    }
  };

  const handleMagnitudeChange = (event) => {
    const selectedMagnitude = parseInt(event.target.value);
    if (!isNaN(selectedMagnitude)) {
      setMinMagnitude(selectedMagnitude);
    } else {
      setMinMagnitude(null);
    }
  };

  const handleTimePeriodChange = (event) => {
    setTimePeriod(event.target.value === "--" ? null : event.target.value);
  };

  const handleSearch = () => {
    if (minMagnitude !== null && timePeriod !== null) {
      setSearchClicked(true);
    } else {
      alert(
        "Seleziona una magnitudine e un periodo di tempo prima di effettuare la ricerca."
      );
    }
  };

  const handlePageChange = ({ selected }) => {
    setCurrentPage(selected);
  };

  const handlePageInput = (event) => {
    setPageNumberInput(event.target.value);
  };

  const handlePageInputSubmit = (event) => {
    event.preventDefault();
    const pageNumber = parseInt(pageNumberInput);
    if (!isNaN(pageNumber) && pageNumber >= 1 && pageNumber <= pageCount) {
      setCurrentPage(pageNumber - 1); // Modifica qui
      setPageNumberInput("");
    } else {
      alert(`Inserisci un numero di pagina valido (da 1 a ${pageCount}).`);
    }
  };

  const pageCount = Math.ceil(earthquakeData.length / earthquakesPerPage);
  const offset = currentPage * earthquakesPerPage;
  const currentPageData = earthquakeData.slice(
    offset,
    offset + earthquakesPerPage
  );

  return (
    <div className="container">
      <h1>Terremoti USGS</h1>
      <p>
        Scegli i parametri dei terremoti che vuoi visualizzare. I dati vengono
        aggiornati automaticamente ogni 5 minuti.
      </p>
      <EarthquakeFilterMenu
        minMagnitude={minMagnitude}
        timePeriod={timePeriod}
        onMagnitudeChange={handleMagnitudeChange}
        onTimePeriodChange={handleTimePeriodChange}
        onSearch={handleSearch}
      />
      {isLoading ? (
        <p className="loading-dots">Caricamento in corso</p>
      ) : (
        <>
          {!hasEarthquakes && (
            <p className="warning">
              Nessun terremoto trovato. Per favore cambia i parametri
              selezionati.
            </p>
          )}
        </>
      )}

      <ul className="earthquake-list">
        {currentPageData.map((quake) => (
          <Earthquake key={quake.id} data={quake.properties} />
        ))}
      </ul>

      {(searchClicked || earthquakeData.length > 0) && (
        <div className="pagination-container">
          <ReactPaginate
            previousLabel={
              <button
                className={
                  pageCount === 1
                    ? "pagination-button-single-page custom-previous-button"
                    : "custom-previous-button"
                }
              >
                ← Previous
              </button>
            }
            nextLabel={
              <button
                className={
                  pageCount === 1
                    ? "pagination-button-single-page custom-next-button"
                    : "custom-next-button"
                }
              >
                Next →
              </button>
            }
            breakLabel={"..."}
            breakClassName={"break-me"}
            pageCount={pageCount}
            marginPagesDisplayed={2}
            pageRangeDisplayed={5}
            onPageChange={handlePageChange}
            containerClassName={"pagination"}
            pageClassName={"page-item"}
            activeClassName={"active"}
            forcePage={currentPage < pageCount ? currentPage : pageCount - 1}
            disableInitialCallback={true} // Per evitare il render iniziale dei pulsanti
            previousClassName={pageCount === 1 ? "hidden" : ""} // Nasconde il pulsante Previous se c'è una sola pagina
            nextClassName={pageCount === 1 ? "hidden" : ""} // Nasconde il pulsante Next se c'è una sola pagina
          />
          {pageCount > 1 && (
            <form className="page-input-form" onSubmit={handlePageInputSubmit}>
              <input
                type="text"
                value={pageNumberInput}
                onChange={handlePageInput}
                placeholder={`Inserisci il numero di pagina (1 - ${pageCount})`}
                className="page-input"
              />
              <button type="submit" className="page-input-button">
                Vai
              </button>
            </form>
          )}
        </div>
      )}

      <EarthquakeMap
        searchClicked={searchClicked}
        earthquakeData={earthquakeData}
      />
    </div>
  );
}

function Earthquake({ data }) {
  return (
    <li className="earthquake-item">
      <span className="earthquake-location">
        <strong>Località:</strong> {data.place}
      </span>{" "}
      <span className="earthquake-magnitude">
        - <strong>Magnitudo:</strong> {data.mag} -
      </span>{" "}
      <span className="earthquake-time">
        <strong>Data:</strong> {new Date(data.time).toLocaleString()}
      </span>
    </li>
  );
}

export default EarthquakeDashboard;
