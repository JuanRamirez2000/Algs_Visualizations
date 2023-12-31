import MapContainer from "../MapContainer";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <main className="flex flex-row h-screen w-screen">
      <section className="w-1/3 h-full">{children}</section>
      <section className="w-2/3 h-full">
        <MapContainer />
      </section>
    </main>
  );
}
