export default function EventForm() {
  return (
    <div className="rounded-xl bg-amber-950 p-8 shadow-md">
      <h2 className="mb-6 text-2xl font-bold">
        Create Calendar Event
      </h2>

      <form className="space-y-5">

        <div>
          <label className="mb-2 block font-medium">
            Summary
          </label>

          <input
            type="text"
            placeholder="Meeting with Client"
            className="w-full rounded-lg border p-3 outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="mb-2 block font-medium">
            Description
          </label>

          <textarea
            rows={4}
            placeholder="Write event description..."
            className="w-full rounded-lg border p-3 outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="mb-2 block font-medium">
            Location
          </label>

          <input
            type="text"
            placeholder="Google Meet"
            className="w-full rounded-lg border p-3 outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="mb-2 block font-medium">
            Start Date & Time
          </label>

          <input
            type="datetime-local"
            className="w-full rounded-lg border p-3 outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="mb-2 block font-medium">
            End Date & Time
          </label>

          <input
            type="datetime-local"
            className="w-full rounded-lg border p-3 outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <button
          className="
            w-full
            rounded-lg
            bg-blue-600
            py-3
            font-semibold
            text-white
            transition
            hover:bg-blue-700
          "
        >
          Create Event
        </button>

      </form>
    </div>
  );
}