import Navbar from "@/app/components/Navbar";

export default function RealEstatePage() {
  return (
    <>
      <Navbar />
      <main className="bg-anthracite text-cream min-h-screen flex items-center justify-center px-6">
        <h1
          className="text-5xl md:text-7xl font-bold text-cream text-center"
          style={{ fontFamily: "var(--font-heading)" }}
        >
          Real Estate &amp; Construction
        </h1>
      </main>
    </>
  );
}
