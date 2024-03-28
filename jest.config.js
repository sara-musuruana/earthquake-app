module.exports = {
  // Specifica i percorsi in cui Jest deve cercare i file di test
  testMatch: ["<rootDir>/src/test/**/*.test.js"],

  // Specifica i moduli che Jest dovrebbe gestire
  moduleFileExtensions: ["js", "jsx", "json", "node"],

  // Specifica i trasformatori da utilizzare per i diversi tipi di file
  transform: {
    "^.+\\.jsx?$": "babel-jest",
  },

  moduleNameMapper: {
    "^axios$": "<rootDir>/src/__mocks__/axios.js",
    // Mappa i moduli CSS/SCSS a un modulo vuoto
    "\\.(css|scss)$": "identity-obj-proxy",
    // Mappa i moduli non JavaScript, come react-leaflet, a un modulo fittizio
    "react-leaflet": "<rootDir>/src/__mocks__/react-leaflet.js", // Percorso del modulo fittizio che creeremo
  },
};
