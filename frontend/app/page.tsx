import NetworkGraph from "../components/NetworkGraph";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center p-8 bg-zinc-50 dark:bg-zinc-900">
      <h1 className="text-3xl font-bold mb-8 text-zinc-900 dark:text-white">
        NCRB Tactical Dashboard
      </h1>
      <div className="w-full max-w-6xl h-[600px] border border-gray-200 dark:border-gray-800 rounded-xl shadow-lg bg-white overflow-hidden">
        <NetworkGraph />
      </div>
    </main>
  );
}