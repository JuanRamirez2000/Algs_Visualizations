"use client";

import { TripsLayer } from "@deck.gl/geo-layers/typed";
import MapContainer from "./components/MapContainer";
import { useState, useEffect } from "react";

const loopLength = 1000;
const animationSpeed = 1;
const trailLength = 180;

const tripsData =
  "https://raw.githubusercontent.com/visgl/deck.gl-data/master/examples/trips/trips-v7.json";

export default function HeroMap() {
  const [time, setTime] = useState(0);
  const [animation] = useState({});

  const animate = () => {
    setTime((t) => (t + animationSpeed) % loopLength);
    //@ts-ignore
    animation.id = window.requestAnimationFrame(animate);
  };

  useEffect(() => {
    //@ts-ignore
    animation.id = window.requestAnimationFrame(animate);
    //@ts-ignore
    return () => window.cancelAnimationFrame(animation.id);
  }, [animation]);

  const tripsLayer = new TripsLayer({
    id: "tripsLayer",
    data: tripsData,
    getPath: (d) => d.path,
    getTimestamps: (d) => d.timestamps,
    getColor: [244, 63, 94],
    opacity: 0.3,
    widthMinPixels: 2,
    rounded: true,
    trailLength,
    currentTime: time,
    shadowEnabled: false,
  });

  return (
    <MapContainer
      layers={[tripsLayer]}
      disableControls={true}
      rounded={true}
      initialViewState={{
        longitude: -74,
        latitude: 40.72,
        zoom: 12,
      }}
    />
  );
}
