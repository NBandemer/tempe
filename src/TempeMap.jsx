import React from "react";
import {
  GoogleMap,
  Marker,
  OverlayView,
  useJsApiLoader,
} from "@react-google-maps/api";
import "./index.css";

const TempeMap = (props) => {
  const { apikey, markers, handleMarkerClick, center } = props;

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: apikey,
  });

  const getPixelPositionOffset = (width, height) => ({
    x: -(width / 2),
    y: -(height / 2),
  });

  return (
    <div className="App">
      {!isLoaded ? (
        <h2>Loading</h2>
      ) : (
        <GoogleMap
          mapContainerClassName="map-container"
          center={center}
          zoom={13}
        >
          {!markers ? (
            <h3>No locations found</h3>
          ) : (
                markers.map((marker) => {
              
              return (
                <React.Fragment key={marker.lat + marker.lng}>
                  <Marker
                    id={marker.lat + "," + marker.lng}
                    onClick={(e) => handleMarkerClick(e)}
                    key={marker.lat + marker.lng}
                    position={{ lat: marker.lat, lng: marker.lng }}
                    closed={marker.closed}
                    icon={
                      "http://maps.google.com/mapfiles/ms/icons/red-dot.png"
                    }
                  />
                  {marker.closed ? null : (
                    <OverlayView
                      position={{ lat: marker.lat, lng: marker.lng }}
                      mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
                      getPixelPositionOffset={{ getPixelPositionOffset }}
                    >
                      <div
                        key={"ovd" + marker.lat + marker.lng}
                        style={{
                          background: `white`,
                          border: `1px solid #ccc`,
                          padding: 15,
                        }}
                      >
                        <h3 key={"h2" + marker.lat + marker.lng}>
                          {marker.name}
                        </h3>
                        {marker.price && marker.open ? (
                          <>
                            <p>Open Now: {marker.open.toString()}</p>
                            <p>Price: {marker.price}</p>
                          </>
                        ) : null}
                        {marker.rating ? <p>Rating: {marker.rating}</p> : null}
                      </div>
                    </OverlayView>
                  )}
                </React.Fragment>
              );
            })
          )}
        </GoogleMap>
      )}
    </div>
  );
};

export default TempeMap;
