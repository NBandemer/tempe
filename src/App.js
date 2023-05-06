import "./index.css";
import TempeMap from "./TempeMap";
import React, { useState } from "react";

const App = (props) => {
  const { lat, lng, apikey } = props;
  const radius = 8000;
  const [markers, setMarkers] = useState(null);
  const [auto, setAuto] = useState(true);
  const [type, setType] = useState("bank");
  const [search, setSearch] = useState(null);
  const [center, setCenter] = useState({lat: lat, lng: lng});
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
        origin: "",
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    });
    const json = await response.json();

    //Auto complete randomly selects one of the predictions so the same result is not always returned
    let randomSelect = Math.round(Math.random() * 4);
    while (!json.predictions[randomSelect]) 
    {
      randomSelect--;
    }
      
    const result =
      json.predictions[randomSelect].structured_formatting.main_text;
    document.getElementById("searchBox").value = result;
    setSearch(result);
  };

  //Enable or Disable autocomplete
  const setAutoComplete = () => {
    setAuto(!auto);
  };

  const handleClear = () => {
    setSearch(null);
    document.getElementById("searchBox").value = null;
  };

  const handleTypeSelect = (e) => {
    const typeValue = e.target.value;
    setType(typeValue);
    setMarkers(null);
  };

  const handleMarkerClick = (e) => {
    const lat = e.latLng.lat();
    const lng = e.latLng.lng();
    let markersCopy = markers;
    for (let i = 0; i < markersCopy.length; i++) {
      if (markersCopy[i].lat === lat && markersCopy[i].lng === lng) {
        markersCopy[i].closed = !markersCopy[i].closed;
      }
    }
    setMarkers(markersCopy);
    setCenter({lat: lat, lng: lng});
  };

  //Handle search places
  const handleSearch = async () => {
    const proxy = "http://localhost:8080/";
    //need to update this
    let url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?key=${apikey}&location=${lat},${lng}&radius=${radius}&type=${type}`;
    if (search) url += '&keyword=' + search;
    const response = await fetch(proxy + url, {
      headers: {
        origin: "",
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    });
    const json = await response.json();
    const jsonFiltered = json.results.filter(result => result.rating > 0 && result.business_status === 'OPERATIONAL')
    const markersData = jsonFiltered.map((result) => {
      const lat = result.geometry.location.lat;
      const lng = result.geometry.location.lng;
      const rating = result.rating;
      const name = result.name;
      const dollar = '$';
      let open = result.opening_hours ? result.opening_hours.open_now : null;
      let price = result.price_level ? dollar.repeat(result.price_level) : "N/A";

      return {
        lat: lat,
        lng: lng,
        price: price,
        rating: rating,
        name: name,
        open: open,
        closed: true,
      };
    });
    setMarkers(markersData);
  };

  //render
  return (
    <>
      <div className="search">
        <h1>Welcome to Tempe Explorer!</h1>
        <p>
          Markers will be placed on the map corresponding to locations matching
          your search. If no markers appear, no results were found for your
          search. 
        </p>

        <p>Enable or Disable Auto-Complete to get generated search queries.</p>
        <p>Press Search with an empty search text to see all places that match the Place Type.</p>
        <input
          id="searchBox"
          placeholder="Enter a place..."
          onChange={(e) => handleAutoComplete(e)}
        ></input>
        <button onClick={handleSearch}>Search</button>
        <button onClick={setAutoComplete}>
          {auto ? "Disable Auto Complete" : "Enable Auto Complete"}{" "}
        </button>
        <button onClick={handleClear}>Clear</button>
        <div className="place">
          <p>Place Type</p>
          <select onChange={handleTypeSelect}>
            <option value="bank">Bank</option>
            <option value="bowling_alley">Bowling</option>
            <option value="cafe">Cafe</option>
            <option value="car_wash">Car Wash</option>
            <option value="clothing_store">Clothing</option>
            <option value="convenience_store">Convenience Shop</option>
            <option value="department_store">Department Store</option>
            <option value="hospital">Hospital</option>
            <option value="gas_station">Gas</option>
            <option value="store">General Store</option>
            <option value="gym">Gym</option>
            <option value="light_rail_station">Light Rail</option>
            <option value="lodging">Lodging</option>
            <option value="movie_theater">Movie Theater</option>
            <option value="park">Park</option>
            <option value="restaurant">Restaurant</option>
            <option value="tourist_attraction">Tourist Attraction</option>
            <option value="university">University</option>
          </select>
        </div>
      </div>
      <TempeMap
        lat={props.lat}
        lng={props.lng}
        apikey={props.apikey}
        markers={markers}
        handleMarkerClick={(e) => handleMarkerClick(e)}
        center={center}
      />
    </>
  );
};

export default App;
