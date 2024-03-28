# Earthquake USGS

The Earthquakes USGS Dashboard is a web application bootstrapped with [Create React App](https://github.com/facebook/create-react-app), allowing users to view earthquake data provided by the [USGS (United States Geological Survey)](https://www.usgs.gov/programs/earthquake-hazards). Users can filter earthquakes based on magnitude (ranging from 0 to 8) and time period (from the latest hour to 10 years ago), with data automatically updating every 5 minutes.

## Tools Used

The project utilizes the API provided by the USGS to fetch earthquake data. Additionally, the map used to display the earthquakes is provided by OpenStreetMap.

## How to Use It

This project was created for educational purposes and is intended for personal use only. To use it, follow these steps:

1. Clone the repository to your computer.
2. Make sure you have Node.js and npm installed on your system.
3. Navigate to the project directory via the terminal.
4. Run the command `npm install` to install the dependencies.
5. Start the application by running the command `npm start`.
6. Access the application in your browser at [http://localhost:3000](http://localhost:3000).

Once the application is running, you can choose the earthquake parameters you want to view using the dropdown menu. After selecting the magnitude and time period, click "Search" to display the corresponding earthquakes. The data will automatically update every 5 minutes.
