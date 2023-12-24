"use client";
import Map, {
  Marker,
  ScaleControl,
  NavigationControl,
  FullscreenControl,
  GeolocateControl,
  Popup,
  Source,
  Layer,
} from "react-map-gl";
import type { SkyLayer } from "react-map-gl";
import { useState } from "react";
import { MapPinIcon } from "@heroicons/react/24/solid";
import { useSearchParams } from "next/navigation";

const NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN =
  process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;

const skyLayer: SkyLayer = {
  id: "sky",
  type: "sky",
  paint: {
    "sky-type": "atmosphere",
    "sky-atmosphere-sun": [0.0, 0.0],
    "sky-atmosphere-sun-intensity": 15,
  },
};

type Coordinate = {
  long: number;
  lat: number;
};

type Locations = {
  name: string;
  centerLocation: Coordinate;
  origin: Coordinate;
  destination: Coordinate;
};

const locations: Locations[] = [
  {
    name: "Los Angeles",
    centerLocation: {
      long: -118.2518,
      lat: 34.0488,
    },
    origin: {
      long: -117.8677,
      lat: 33.7455,
    },
    destination: {
      long: -118.2518,
      lat: 34.0488,
    },
  },
];

export default function MapContainer() {
  const [showLocations, setShowLocations] = useState<boolean>(false);
  const searchParams = useSearchParams();

  const [originCoordinates, setOriginCoordinates] = useState({
    latitude: 33.7455,
    longitude: -117.8677,
  });

  const [destinationCoordinates, setDestinationCoordinates] = useState({
    latitude: 34.0488,
    longitude: -118.2518,
  });

  return (
    <section className="w-full h-full">
      <Map
        mapLib={import("mapbox-gl")}
        initialViewState={{
          longitude: -118.2518,
          latitude: 34.0488,
          zoom: 10,
        }}
        style={{ width: "width: 100%", height: "100%" }}
        mapStyle="mapbox://styles/mapbox/dark-v11"
        mapboxAccessToken={NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN}
        terrain={{ source: "mapbox-dem", exaggeration: 1.5 }}
      >
        <Marker
          longitude={originCoordinates.longitude}
          latitude={originCoordinates.latitude}
          anchor="center"
        >
          <MapPinIcon className="h-8 w-8 text-pink-400" />
        </Marker>
        <Marker
          longitude={destinationCoordinates.longitude}
          latitude={destinationCoordinates.latitude}
          anchor="center"
        >
          <MapPinIcon className="h-8 w-8 text-pink-400" />
        </Marker>
        {showLocations && (
          <>
            <Popup
              longitude={originCoordinates.longitude}
              latitude={originCoordinates.latitude}
              anchor="bottom"
              className="text-lg p-2"
              onClose={() => setShowLocations(false)}
            >
              Origin
            </Popup>
            <Popup
              longitude={destinationCoordinates.longitude}
              latitude={destinationCoordinates.latitude}
              anchor="bottom"
              className="text-lg p-2"
              onClose={() => setShowLocations(false)}
            >
              Destination
            </Popup>
          </>
        )}

        <Source
          id="mapbox-dem"
          type="raster-dem"
          url="mapbox://mapbox.mapbox-terrain-dem-v1"
          tileSize={512}
          maxzoom={14}
        />
        <Layer {...skyLayer} />
        <NavigationControl />
        <ScaleControl />
        <FullscreenControl />
        <GeolocateControl />
      </Map>
    </section>
  );
}
