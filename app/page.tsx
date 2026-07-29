import Navbar from "@/components/Navbar";
import LoginButton from "@/components/LoginButton";
import EventForm from "@/components/EventForm";

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-100">
      <Navbar />

      <section className="mx-auto max-w-3xl p-8">
        <LoginButton />

        <EventForm />
      </section>
    </main>
  );
}