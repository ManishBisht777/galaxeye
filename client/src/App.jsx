import { useEffect, useRef, useState } from "react";
import { FeatureGroup, MapContainer, TileLayer, GeoJSON } from "react-leaflet";
import { EditControl } from "react-leaflet-draw";

function App() {
  const noTilesToDisplay = {
    type: "FeatureCollection",
    features: [],
  };

  const geoDataRefLayer = useRef(null);
  const featureGroupRef = useRef(null);
  const [intersectingTiles, setintersectingTiles] = useState(noTilesToDisplay);

  const updateMap = async (AOIGeoJSONObject) => {
    var intersectingTilesArray = [];
    var response;

    try {
      const AOIgeometry = { AOIGeoJSONObject };
      response = await fetch("http://localhost:3000/intersect", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(AOIgeometry),
      });
      const data = await response.json();
      intersectingTilesArray.push(data);
    } catch (e) {
      console.error(e.message);
    }
    setintersectingTiles(intersectingTilesArray);
  };

  const onCreated = async (e) => {
    updateMap(e.layer.toGeoJSON());
  };

  const onEdited = (e) => {
    updateMap(e.layers.toGeoJSON().features[0]);
  };

  const onDeleted = () => {
    setintersectingTiles(noTilesToDisplay);
  };

  useEffect(() => {
    if (geoDataRefLayer.current) {
      geoDataRefLayer.current.clearLayers().addData(intersectingTiles);
    }
  }, [intersectingTiles]);

  console.log(intersectingTiles);

  return (
    <main className="w-screen h-screen flex justify-center items-center">
      <MapContainer
        center={[12.972442, 77.580643]}
        zoom={7}
        style={{ width: "80vw", height: "80vh" }}
      >
        <FeatureGroup ref={featureGroupRef}>
          <EditControl
            position="topright"
            onCreated={onCreated}
            onEdited={onEdited}
            onDeleted={onDeleted}
            draw={{
              rectangle: false,
              circle: false,
              circlemarker: false,
              polyline: false,
              marker: false,
              polygon: {
                shapeOptions: {
                  color: "blue",
                  fillColor: "red",
                },
                drawError: {
                  color: "#e1e100",
                  message: "<strong>Oh snap!<strong> you can't draw that!",
                },
              },
            }}
          />
        </FeatureGroup>

        <TileLayer
          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          url="http://{s}.tile.osm.org/{z}/{x}/{y}.png"
        />
        <GeoJSON ref={geoDataRefLayer} data={intersectingTiles} />
      </MapContainer>
    </main>
  );
}

export default App;
