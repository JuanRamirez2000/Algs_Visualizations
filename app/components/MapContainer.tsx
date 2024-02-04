"use client";
import Map, {
  ScaleControl,
  NavigationControl,
  FullscreenControl,
  GeolocateControl,
  ViewState,
} from "react-map-gl";
import { MapRef } from "react-map-gl";
import { useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";
import { locations } from "../data/locations";
import { MapboxOverlay, MapboxOverlayProps } from "@deck.gl/mapbox/typed";
import { useControl } from "react-map-gl";
import type { LayersList } from "deck.gl/typed";

const NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN =
  process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;

const SANTA_ANA_CENTER = {
  long: -117.8667,
  lat: 33.7477,
};

export default function MapContainer({
  layers,
  initialViewState,
  disableControls = false,
}: {
  layers: LayersList;
  initialViewState?: Partial<ViewState>;
  disableControls?: boolean;
}) {
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
        mapStyle="mapbox://styles/mapbox/dark-v11"
        style={{ width: "width: 100%", height: "100%" }}
        mapboxAccessToken={NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN}
        initialViewState={
          initialViewState
            ? initialViewState
            : {
                longitude: locationData
                  ? locationData.center.long
                  : SANTA_ANA_CENTER.long,
                latitude: locationData
                  ? locationData.center.lat
                  : SANTA_ANA_CENTER.lat,
                zoom: 12,
              }
        }
        boxZoom={!disableControls}
        doubleClickZoom={!disableControls}
        dragRotate={!disableControls}
        dragPan={!disableControls}
        scrollZoom={!disableControls}
        touchPitch={!disableControls}
        touchZoomRotate={!disableControls}
      >
        <DeckGLOverlay layers={layers} />
        {!disableControls ? (
          <>
            <NavigationControl />
            <ScaleControl />
            <FullscreenControl />
            <GeolocateControl />
          </>
        ) : null}
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
