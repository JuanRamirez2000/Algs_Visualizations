"use client";
import Map, {
  ScaleControl,
  NavigationControl,
  FullscreenControl,
  GeolocateControl,
} from "react-map-gl";
import { MapRef } from "react-map-gl";
import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { locations } from "../_data/locations";
import { MapboxOverlay, MapboxOverlayProps } from "@deck.gl/mapbox/typed";
import { useControl } from "react-map-gl";
import data from "../_data/test.json";
import { Node } from "../helpers/parseOsm";
import { ScatterplotLayer } from "@deck.gl/layers/typed";

const initialNodeIDs = [122804252, 1925338334];

const NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN =
  process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;

export default function MapContainer() {
  const mapRef = useRef<MapRef>(null);
  const searchParams = useSearchParams();
  const locationName = searchParams.get("location");
  const locationData = locations.find(
    (location) => location.name === locationName
  );

  const [graph, _] = useState<Node[]>(
    //@ts-ignore
    Object.keys(data).map((key) => data[key])
  );

  const [displayedNodeIDs, setDisplayNodeIDs] =
    useState<number[]>(initialNodeIDs);

  useEffect(() => {
    if (!locationData) return;
    if (!mapRef.current) return;
    mapRef.current.flyTo({
      center: [locationData.center.long, locationData.center.lat],
      duration: 2000,
    });
  }, [searchParams, locationData]);

  const nodesLayer = new ScatterplotLayer({
    id: "originalNodes",
    data: graph,
    filled: true,
    getPosition: (d) => {
      return [d.lon, d.lat];
    },
    getRadius: 2,
    getFillColor: [255, 255, 255],
    pickable: true,
  });

  const displayedNodes = graph.filter((node) =>
    displayedNodeIDs.includes(node.id)
  );

  const displayLayer = new ScatterplotLayer({
    id: "displayingNodes",
    data: displayedNodes,
    filled: true,
    getPosition: (d) => {
      return [d.lon, d.lat];
    },
    getRadius: 3,
    getFillColor: [139, 92, 246],
  });

  return (
    <section className="w-full h-full">
      <Map
        ref={mapRef}
        mapLib={import("mapbox-gl")}
        mapStyle="mapbox://styles/mapbox/dark-v11"
        style={{ width: "width: 100%", height: "100%" }}
        mapboxAccessToken={NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN}
        terrain={{ source: "mapbox-dem", exaggeration: 1.5 }}
        initialViewState={{
          longitude: locationData ? locationData.center.long : -117.8667,
          latitude: locationData ? locationData.center.lat : 33.7477,
          zoom: 10,
        }}
      >
        <DeckGLOverlay layers={[nodesLayer, displayLayer]} />
        <NavigationControl />
        <ScaleControl />
        <FullscreenControl />
        <GeolocateControl />
      </Map>
    </section>
  );
}

function DeckGLOverlay(
  props: MapboxOverlayProps & {
    interleaved?: boolean;
  }
) {
  const overlay = useControl<MapboxOverlay>(() => new MapboxOverlay(props));
  overlay.setProps(props);
  return null;
}
