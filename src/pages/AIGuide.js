import { useState } from "react";
import { supabase } from "../supabaseClient";

export default function AIGuide() {
  const [city, setCity] = useState("Bukhara");
  const [days, setDays] = useState(1);
  const [loading, setLoading] = useState(false);
  const [itinerary, setItinerary] = useState(null);

  const generate = async () => {
    setLoading(true);
    const { data, error } = await supabase.functions.invoke("generate-itinerary", {
      body: { city, days, interests: "" },
    });
    if (!error) setItinerary(data);
    setLoading(false);
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">AI Personal Guide</h1>
      <div className="flex gap-3 mb-6">
        <input value={city} onChange={e => setCity(e.target.value)}
          className="border rounded px-3 py-2 flex-1" placeholder="City" />
        <input type="number" min="1" max="5" value={days}
          onChange={e => setDays(e.target.value)}
          className="border rounded px-3 py-2 w-20" />
        <button onClick={generate} disabled={loading}
          className="bg-[#D9731A] text-white px-5 py-2 rounded font-medium">
          {loading ? "Planning..." : "Generate"}
        </button>
      </div>

      {itinerary?.days?.map(day => (
        <div key={day.day} className="mb-6">
          <h2 className="font-semibold text-lg mb-2">Day {day.day}</h2>
          {day.stops.map((stop, i) => (
            <div key={i} className="flex gap-4 py-2 border-b">
              <span className="text-[#D9731A] font-medium w-16">{stop.time}</span>
              <div>
                <p className="font-medium">{stop.title}</p>
                <p className="text-sm text-gray-500">{stop.description}</p>
                {stop.listing_id && (
                  <a href={`/listing/${stop.listing_id}`}
                    className="text-sm text-[#D9731A] underline">
                    Book on budgetravel →
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}