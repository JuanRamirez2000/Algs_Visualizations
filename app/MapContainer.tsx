"use client";
import Map, {
  ScaleControl,
  NavigationControl,
  FullscreenControl,
  GeolocateControl,
} from "react-map-gl";
import type { MapRef } from "react-map-gl";
import { useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";
import { locations } from "./_data/locations";

const NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN =
  process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;

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
          longitude: locationData ? locationData.center.long : -117.8667,
          latitude: locationData ? locationData.center.lat : 33.7477,
          zoom: 10,
        }}
        style={{ width: "width: 100%", height: "100%" }}
        mapStyle="mapbox://styles/mapbox/dark-v11"
        mapboxAccessToken={NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN}
        terrain={{ source: "mapbox-dem", exaggeration: 1.5 }}
      >
        <NavigationControl />
        <ScaleControl />
        <FullscreenControl />
        <GeolocateControl />
      </Map>
    </section>
  );
}
