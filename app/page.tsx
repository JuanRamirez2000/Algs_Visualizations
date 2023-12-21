"use client";
import Map, { Marker, NavigationControl } from "react-map-gl";
import Pin from "./_components/Pin";
import { useState, useCallback } from "react";

const NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN =
  process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;

export default function Home() {
  const [origin, setOrigin] = useState({
    latitude: 33.7455,
    longitude: -117.8677,
  });

  const [destination, setDestination] = useState({
    latitude: 34.0488,
    longitude: -118.2518,
  });

  return (
    <main className="w-screen h-screen ">
      <Map
        mapLib={import("mapbox-gl")}
        initialViewState={{
          longitude: -118.2518,
          latitude: 34.0488,
          zoom: 10,
        }}
        style={{ width: "100%", height: "100%" }}
        mapStyle="mapbox://styles/mapbox/dark-v11"
        mapboxAccessToken={NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN}
      >
        <Marker
          longitude={origin.longitude}
          latitude={origin.latitude}
          anchor="center"
          color="red"
        >
          <Pin size={20} />
        </Marker>
        <Marker
          longitude={destination.longitude}
          latitude={destination.latitude}
          anchor="center"
          color="red"
        >
          <Pin size={20} />
        </Marker>
      </Map>
    </main>
  );
}
