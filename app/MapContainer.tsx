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
import type { MapRef, SkyLayer } from "react-map-gl";
import { useEffect, useRef, useState } from "react";
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

type Location = {
  name: string;
  center: Coordinate;
  origin?: Coordinate;
  destination?: Coordinate;
};

const locations: Location[] = [
  {
    name: "los_angeles",
    center: {
      long: -118.2518,
      lat: 34.0488,
    },
  },
  {
    name: "san_francisco",
    center: {
      long: -122.3965,
      lat: 37.7937,
    },
  },
  {
    name: "new_york",
    center: {
      long: -74.0007,
      lat: 40.7209,
    },
  },
];

export default function MapContainer() {
  const mapRef = useRef<MapRef>(null);
  const searchParams = useSearchParams();

  const locationName = searchParams.get("location");
  const locationData = locations.find(
    (location) => location.name === locationName
  );

  useEffect(() => {
    if (!locationData) return;
    if (!mapRef.current) return;
    mapRef.current.flyTo({
      center: [locationData.center.long, locationData.center.lat],
      duration: 2000,
    });
  }, [searchParams, locationData]);

  return (
    <section className="w-full h-full">
      <Map
        ref={mapRef}
        mapLib={import("mapbox-gl")}
        initialViewState={{
          longitude: locationData ? locationData.center.long : -118.2518,
          latitude: locationData ? locationData.center.lat : -118.2518,
          zoom: 10,
        }}
        style={{ width: "width: 100%", height: "100%" }}
        mapStyle="mapbox://styles/mapbox/dark-v11"
        mapboxAccessToken={NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN}
        terrain={{ source: "mapbox-dem", exaggeration: 1.5 }}
      >
        {/* 
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

        */}
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
