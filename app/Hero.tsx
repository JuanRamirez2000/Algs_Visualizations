import HeroMap from "./HeroMap";

export default function Hero() {
  return (
    <section className="h-screen w-full flex flex-row items-center justify-center">
      <div className="bg-base-800 h-full w-1/2"></div>
      <div className="h-full w-1/2 flex flex-col items-center justify-center">
        <div className="h-3/4 w-3/4">
          <HeroMap />
        </div>
      </div>
    </section>
  );
}
