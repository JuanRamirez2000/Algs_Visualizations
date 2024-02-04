"use client";

import { ScatterplotLayer } from "@deck.gl/layers/typed";
import MapContainer from "./components/MapContainer";
import data from "./data/test.json";

const SANTA_ANA_CENTER = {
  long: -117.8667,
  lat: 33.7477,
};

export default function ExampleMap() {
  const graph =
    //@ts-ignore
    Object.keys(data).map((key) => data[key]);
  const nodesLayer = new ScatterplotLayer({
    id: "originalNodes",
    data: graph,
    filled: true,
    getPosition: (d) => {
      return [d.lon, d.lat];
    },
    getRadius: 2.5,
    getFillColor: [255, 255, 255],
    pickable: true,
    onClick: (info) => console.log(info),
  });

  return (
    <MapContainer
      layers={[nodesLayer]}
      disableControls={true}
      initialViewState={{
        longitude: SANTA_ANA_CENTER.long,
        latitude: SANTA_ANA_CENTER.lat,
        zoom: 16,
        bearing: 45,
        pitch: 60,
      }}
    />
  );
}
