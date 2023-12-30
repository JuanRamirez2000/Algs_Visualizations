import AlgorithmSelection from "./AlgorithmSelection";
import Controls from "./Controls";
import LocationSelection from "./LocationSelection";

export default function Home() {
  return (
    <section className="w-full h-full bg-zinc-800 flex flex-col items-center text-zinc-100 py-20 gap-10">
      <LocationSelection />
      <AlgorithmSelection />
      <Controls />
    </section>
  );
}
