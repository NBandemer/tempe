import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";

const root = ReactDOM.createRoot(document.getElementById("root"));

//Api Key
let apikey = localStorage.getItem("apikey");
if (apikey == null) {
  apikey = "AIzaSyB8YBp0lU8THiLSlZczDMI0VJ1kNNNF6EM"
  localStorage.setItem("apikey", apikey);
}

//Coordinates
let location = localStorage.getItem("location");
if (location == null) {
  location = "33.4255,-111.94";
  localStorage.setItem("location", "33.4255,-111.94");
}

const coordinates = location.split(',');
const lat = parseFloat(coordinates[0]);
const lng = parseFloat(coordinates[1]);

root.render(<App apikey={apikey} lat={lat} lng={lng} />);
