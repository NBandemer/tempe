import "./index.css";
import TempeMap from "./TempeMap";
import React, { useState } from "react";

const App = (props) => {
  const { lat, lng, apikey } = props;
  const radius = 8000;
  const [markers, setMarkers] = useState(null);
  const [auto, setAuto] = useState(true);
  const [type, setType] = useState('restaurant');
  const [search, setSearch] = useState(null);
  //Auto complete on provided text
  const handleAutoComplete = async (e) => {
    const search = e.target.value;
    setSearch(search);

    if (!auto) return;
    if (!search) return;

    const proxy = "http://localhost:8080/";
    const url = `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${search}&radius=${radius}&location=${lat},${lng}&key=${apikey}&types=${type}`;
    const response = await fetch(proxy + url, {
      headers: {
        'origin': '',
        Accept: "application/json",
        'Content-Type': "application/json",
      },
    });
    const json = await response.json();

    //Auto complete randomly selects one of the predictions so the same result is not always returned
    const randomSelect = Math.round(Math.random() * 4);
    const result = json.predictions[randomSelect].structured_formatting.main_text;
    document.getElementById("searchBox").value = result;
    setSearch(result);
  };
  
  //Enable or Disable autocomplete
  const setAutoComplete = () => {
    setAuto(!auto);
  };

  const handleClear = () => {
    setSearch(null);
    document.getElementById("searchBox").value = search;
  }

  const handleTypeSelect = (e) => {
    const typeValue = e.target.value;
    setType(typeValue);
  }
  
  //Handle search places
  const handleSearch = async () => {
    if (!search) return;
    const proxy = "http://localhost:8080/";
    //need to update this
    const url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?key=${apikey}&location=${lat},${lng}&radius=${radius}&type=${type}&keyword=${search}`
    const response = await fetch(proxy + url, {
      headers: {
        'origin': '',
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    });
    const json = await response.json();
    const markersData = json.results.map(result => {
      const lat = result.geometry.location.lat;
      const lng = result.geometry.location.lng;
      const rating = result.rating;
      const name = result.name;

      let open = null;
      let price = null;

      if (type === 'restaurant')
      {
        open = result.opening_hours.open_now;
        price = result.price_level ? result.price_level : 'N/A';  
      }

      return {lat: lat, lng: lng, price: price, rating: rating, name: name, open: open}
    });
    setMarkers(markersData);
    console.log(markersData);
  };

  //render
  return (
    <>
      <div className="search">
        <h1>Welcome to Tempe Explorer!</h1>
        <p>Search</p>
        <input
          id="searchBox"
          placeholder="Enter a place..."
          onChange={(e) => handleAutoComplete(e)}
        ></input>
        <button onClick={handleSearch}>Search</button>
        <button onClick={setAutoComplete}>
          {auto
            ? "Disable Auto Complete"
            : "Enable Auto Complete"}{" "}
        </button>
        <button onClick={handleClear}>Clear</button>
        <p>Place Type</p>
        <select onChange={handleTypeSelect}>
          <option value='restaurant'>Restaurant</option>
          <option value='airport'>Airport</option>
          <option value='amusement_park'>Amusement Park</option>
          <option value='park'>Park</option>
          <option value='gas_station'>Gas</option>
          <option value='convenience_store'>Convenience Shops</option>
          <option value='department_store'>Department Stores</option>
        </select>
      </div>
      <TempeMap
        lat={props.lat}
        lng={props.lng}
        apikey={props.apikey}
        markers={markers}
      />

      <h2>Tempe</h2>
    </>
  );
};

export default App;