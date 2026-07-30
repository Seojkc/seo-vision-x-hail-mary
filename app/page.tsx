import Welcome from './Components/welcome'

export default function Home() {
  return (
    <div>
      <Welcome />
      <section id="about" className="min-h-screen bg-zinc-950 px-6 py-24 text-white">
        <div className="mx-auto max-w-3xl">
          <h2 className="text-3xl font-bold">About</h2>
          <p className="mt-4 text-white/70">Scroll down to see the navbar transition from transparent to solid black.</p>
        </div>
      </section>
    </div>
  );
}
