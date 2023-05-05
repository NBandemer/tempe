import React from "react";
import {
  GoogleMap,
  Marker,
  OverlayView,
  useJsApiLoader,
} from "@react-google-maps/api";
import "./index.css";

const TempeMap = (props) => {
  const { lat, lng, markers, apikey } = props;
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: apikey,
  });

  const getPixelPositionOffset = (width, height) => ({
    x: -(width / 2),
    y: -(height / 2),
  })
  return (
    <div className="App">
      {!isLoaded ? (
        <h2>Loading</h2>
      ) : (
        <GoogleMap
          mapContainerClassName="map-container"
          center={{ lat: lat, lng: lng }}
          zoom={15}
        >
          {!markers
            ? <h3>No locations found</h3>
            : markers.map((marker) => {
                return (
                  <>
                    <Marker
                      key={marker.lat + marker.lng}
                      position={{ lat: marker.lat, lng: marker.lng }}
                      icon={
                        "http://maps.google.com/mapfiles/ms/icons/green-dot.png"
                      }
                    />
                    <OverlayView
                      key={"ov" + marker.lat + marker.lng}
                      position={{ lat: marker.lat, lng: marker.lng }}
                      mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
                      getPixelPositionOffset={{getPixelPositionOffset}}
                    >
                      <div key={"ovd" + marker.lat + marker.lng}
                        style={{
                          background: `white`,
                          border: `1px solid #ccc`,
                          padding: 15,
                        }}
                      >
                        <h1 key={"h1" + marker.lat + marker.lng}>{marker.name}</h1>
                        {marker.price ? <><p>Open Now: {marker.open.toString()}</p><p>Price: {marker.price}</p></> : null}
                        <p>Rating: {marker.rating}</p>
                      </div>
                    </OverlayView>
                  </>
                );
              })}
        </GoogleMap>
      )}
    </div>
  );
};

export default TempeMap;
